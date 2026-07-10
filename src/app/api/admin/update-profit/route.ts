import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../../lib/dbConnect";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import User from "../../../../../models/User";
import Transaction from "../../../../../models/Transaction";
import { authenticate } from "../../../../../middleware/auth";
import { hasPermission } from "../../../../../lib/auth/permissionUtils";
import { createNotification } from "../../../../../lib/notifications";
import { logAdminAction } from "../../../../../lib/db/auditLog";
import { getEquityUnitPrice } from "../../../../../lib/settings";

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'profit_update');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const price = await getEquityUnitPrice();
    const { payoutType, mode, value, purchasedPackageId, originalPackageId } = await req.json();

    if (!payoutType || !['bulk', 'individual'].includes(payoutType)) {
      return NextResponse.json({ success: false, message: "Invalid payout type" }, { status: 400 });
    }

    if (!mode || !['fixed', 'percentage'].includes(mode)) {
      return NextResponse.json({ success: false, message: "Invalid calculation mode" }, { status: 400 });
    }

    if (value === undefined || typeof value !== 'number' || value <= 0) {
      return NextResponse.json({ success: false, message: "Value must be a positive number" }, { status: 400 });
    }

    await dbConnect();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (payoutType === 'individual') {
        if (!purchasedPackageId) {
          throw new Error("Missing purchasedPackageId for individual payout");
        }

        const purchased = await PurchasedPackage.findById(purchasedPackageId).session(session);
        if (!purchased) {
          throw new Error("Purchased package not found");
        }

        if (purchased.status !== 'active') {
          throw new Error("Cannot pay profit to a package that is not active");
        }

        const ownerUser = await User.findById(purchased.userId).session(session);
        if (!ownerUser) {
          throw new Error("Owner user not found");
        }

        // Calculate payout amount
        const payoutAmount = mode === 'fixed' 
          ? value 
          : (purchased.equityUnits * value) / 100;

        // Update package and user records
        purchased.profitAmount += payoutAmount;
        purchased.lastProfitDate = new Date();
        await purchased.save({ session });

        const packageName = purchased.name || "Investment Package";

        // Record transaction log
        const profitTx = new Transaction({
          userId: ownerUser._id,
          amount: payoutAmount,
          type: "profit",
          description: `Individual yield payout of $${(payoutAmount * price).toFixed(2)} (${value}${mode === 'percentage' ? '%' : ''}) for package: ${packageName} (Distributed by Admin: ${auth.userName || auth.email})`,
        });
        await profitTx.save({ session });

        // Record audit log
        await logAdminAction({
          adminId: auth._id,
          action: 'distribute_profit_individual',
          targetId: purchased._id,
          targetModel: 'PurchasedPackage',
          details: `Distributed individual profit of $${(payoutAmount * price).toFixed(2)} (${value}${mode === 'percentage' ? '%' : ''}) to purchased package ${purchased._id}`,
          session
        });

        await session.commitTransaction();
        session.endSession();

        // Send client notification
        await createNotification(ownerUser._id, {
          title: 'Profit Payout Distributed',
          message: `Yield payout of $${(payoutAmount * price).toFixed(2)} received for package "${packageName}".`,
          type: 'profit',
          link: '/user?tab=Dashboard'
        });

        return NextResponse.json({ 
          success: true, 
          message: `Successfully paid $${(payoutAmount * price).toFixed(2)} to ${ownerUser.email || ownerUser.userName}` 
        });

      } else {
        // Bulk payout to all active package buyers
        if (!originalPackageId) {
          throw new Error("Missing originalPackageId for bulk payout");
        }

        const activePurchasedList = await PurchasedPackage.find({
          packageId: originalPackageId,
          status: 'active'
        }).session(session);

        if (activePurchasedList.length === 0) {
          throw new Error("No active portfolios found for this package");
        }

        let totalDistributed = 0;

        for (const purchased of activePurchasedList) {
          const ownerUser = await User.findById(purchased.userId).session(session);
          if (!ownerUser) continue;

          // Calculate payout amount
          const payoutAmount = mode === 'fixed' 
            ? value 
            : (purchased.equityUnits * value) / 100;

          purchased.profitAmount += payoutAmount;
          purchased.lastProfitDate = new Date();
          await purchased.save({ session });

          const packageName = purchased.name || "Investment Package";

          const profitTx = new Transaction({
            userId: ownerUser._id,
            amount: payoutAmount,
            type: "profit",
            description: `Bulk yield payout of $${(payoutAmount * price).toFixed(2)} (${value}${mode === 'percentage' ? '%' : ''}) for package: ${packageName} (Distributed by Admin: ${auth.userName || auth.email})`,
          });
          await profitTx.save({ session });

          totalDistributed += payoutAmount;
        }

        // Record bulk distribution audit log
        await logAdminAction({
          adminId: auth._id,
          action: 'distribute_profit_bulk',
          targetId: new mongoose.Types.ObjectId(originalPackageId),
          targetModel: 'PurchasedPackage',
          details: `Bulk distributed profits using ${mode} mode (value: ${value}) to ${activePurchasedList.length} portfolios. Total paid: $${(totalDistributed * price).toFixed(2)}`,
          session
        });

        await session.commitTransaction();
        session.endSession();

        // Notify users
        for (const purchased of activePurchasedList) {
          const payoutAmount = mode === 'fixed' 
            ? value 
            : (purchased.equityUnits * value) / 100;
          const packageName = purchased.name || "Investment Package";
          
          createNotification(purchased.userId, {
            title: 'Profit Payout Distributed',
            message: `Yield payout of $${(payoutAmount * price).toFixed(2)} received for package "${packageName}".`,
            type: 'profit',
            link: '/user?tab=Dashboard'
          }).catch(err => console.error("Notification trigger error:", err));
        }

        return NextResponse.json({ 
          success: true, 
          message: `Successfully distributed $${(totalDistributed * price).toFixed(2)} to ${activePurchasedList.length} active portfolio holders.` 
        });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

  } catch (err) {
    console.error("Error distributing profit:", err);
    return NextResponse.json({ success: false, message: err instanceof Error ? err.message : "Failed to distribute profit" }, { status: 500 });
  }
}
