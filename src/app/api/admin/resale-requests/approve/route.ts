import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../../../lib/dbConnect";
import { createNotification } from "../../../../../../lib/notifications";
import PurchasedPackage from "../../../../../../models/PurchasedPackage";
import User from "../../../../../../models/User";
import Transaction from "../../../../../../models/Transaction";
import LongTermRental from "../../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../../models/TradingPackage";

import { authenticate } from "../../../../../../middleware/auth";
import { hasPermission } from "../../../../../../lib/auth/permissionUtils";
import type { Model } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    const allowed = (auth.isAdmin || auth.role === 'admin' || auth.role === 'Super Admin') ||
      (await hasPermission(auth, "manage_purchased_packages")) ||
      (await hasPermission(auth, "handle_resales"));
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { purchasedPackageId } = await req.json();
    if (!purchasedPackageId) {
      return NextResponse.json({ success: false, message: "Purchased Package ID is required" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        message: "Resale request approved successfully (Mock Mode)",
      });
    }

    await dbConnect();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch Purchased Package
      const purchasedPackage = await PurchasedPackage.findById(purchasedPackageId).session(session);
      if (!purchasedPackage) {
        throw new Error("Purchased package not found");
      }

      if (purchasedPackage.status !== "sell-requested") {
        throw new Error(`Package is not in 'sell-requested' status. Current status: ${purchasedPackage.status || "active"}`);
      }

      // 2. Fetch User and Refund Equity Units
      const user = await User.findById(purchasedPackage.userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      user.equityUnits = (user.equityUnits || 0) + purchasedPackage.equityUnits;

      // 3. Update User's Purchased Packages list
      const userPkgIndex = user.purchasedPackages.findIndex(
        (pkg: { packageId: mongoose.Types.ObjectId; totalUnits: number }) =>
          pkg.packageId.toString() === purchasedPackage.packageId.toString()
      );

      if (userPkgIndex !== -1) {
        user.purchasedPackages[userPkgIndex].totalUnits -= purchasedPackage.quantity;
        if (user.purchasedPackages[userPkgIndex].totalUnits <= 0) {
          user.purchasedPackages.splice(userPkgIndex, 1);
        }
      }

      await user.save({ session });

      // 4. Update Original Package Stock (restore available units)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const packageModels: Record<string, Model<any>> = {
        "long-term-rental": LongTermRental,
        "long-term-industry": LongTermIndustry,
        "trading": TradingPackage,
      };

      const PackageModel = packageModels[purchasedPackage.packageType];
      if (PackageModel) {
        const originalPackage = await PackageModel.findById(purchasedPackage.packageId).session(session);
        if (originalPackage) {
          originalPackage.availableUnits = (originalPackage.availableUnits || 0) + purchasedPackage.quantity;
          await originalPackage.save({ session });
        }
      }

      // 5. Update Purchased Package status to sold
      purchasedPackage.status = "sold";
      await purchasedPackage.save({ session });

      // 6. Create Resale Transaction Record
      const resaleTx = new Transaction({
        userId: purchasedPackage.userId,
        packageId: purchasedPackage.packageId,
        packageType: purchasedPackage.packageType,
        quantity: purchasedPackage.quantity,
        equityUnits: purchasedPackage.equityUnits,
        amount: 0,
        type: "resale",
        description: `Refunded resale of ${purchasedPackage.quantity} units (${purchasedPackage.equityUnits} equity units)`,
        status: "completed",
        createdAt: new Date(),
      });

      await resaleTx.save({ session });

      // Commit
      await session.commitTransaction();
      session.endSession();

      // Trigger notification
      await createNotification(purchasedPackage.userId, {
        title: 'Resale Request Approved',
        message: `Your request to resell ${purchasedPackage.quantity} unit(s) of package has been approved. Refunded ${purchasedPackage.equityUnits} equity units.`,
        type: 'resale',
        link: '/user?tab=Active+Packages'
      });

      return NextResponse.json({ success: true, message: "Resale approved and equity units refunded successfully" });
    } catch (innerError) {
      await session.abortTransaction();
      session.endSession();
      throw innerError;
    }
  } catch (error) {
    console.error("Error approving resale:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
