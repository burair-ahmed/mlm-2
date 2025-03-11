import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../../../models/User';
import Transaction from '../../../../../models/Transaction';
import ShortTermPackage from '../../../../../models/ShortTermPackage';
import LongTermPackage from '../../../../../models/LongTermPackage';
import TradingPackage from '../../../../../models/TradingPackage';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const auth = await authenticate(req);
console.log("Auth Result:", auth);
if (auth instanceof NextResponse) return auth;


    // 2. Connect to database
    await dbConnect();

    // 3. Parse request data
    const { packageId, packageType, quantity } = await req.json();
    console.log("📩 Request Data:", { packageId, packageType, quantity });

    if (!packageId || !packageType || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // 4. Determine package model based on type
    const packageModels: { [key: string]: any } = {
      'short-term': ShortTermPackage,
      'long-term': LongTermPackage,
      'trading': TradingPackage,
    };

    const PackageModel = packageModels[packageType];
    if (!PackageModel) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    // 5. Start MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 6. Fetch package details
      const selectedPackage = await PackageModel.findById(packageId).session(session);
      if (!selectedPackage) {
        throw new Error('Package not found');
      }

      // 7. Calculate total equity units required
      const totalEquityUnits = selectedPackage.equityUnits * quantity;

      // 8. Fetch user details
      const user = await User.findById(auth._id).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // 9. Check if user has enough equity units
      if (user.equityUnits < totalEquityUnits) {
        return NextResponse.json({ error: 'Insufficient equity units' }, { status: 400 });
      }

      // 10. Check if enough units are available
      if (selectedPackage.availableUnits < quantity) {
        return NextResponse.json({ error: 'Not enough available units' }, { status: 400 });
      }

      // 11. Deduct equity units from user
      await User.findByIdAndUpdate(
        auth._id,
        { $inc: { equityUnits: -totalEquityUnits } },
        { session }
      );

      // 12. Reduce available units in the package
      await PackageModel.findByIdAndUpdate(
        packageId,
        { $inc: { availableUnits: -quantity } },
        { session }
      );

      // 13. Create transaction record
      const purchaseTx = new Transaction({
        userId: auth._id,
        packageId: packageId,
        packageType: packageType,
        quantity: quantity,
        equityUnits: totalEquityUnits,
        amount: 0, // No fiat currency, only equity units
        type: 'purchase',
        description: `Purchased ${quantity} units of ${selectedPackage.name}`,
        status: 'completed',
      });
      await purchaseTx.save({ session });

      // 14. Commit transaction
      await session.commitTransaction();
      return NextResponse.json({
        success: true,
        message: 'Purchase successful',
        quantity: quantity,
        newEquityUnits: user.equityUnits - totalEquityUnits,
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction failed:', error);
      return NextResponse.json(
        { error: 'Transaction failed', message: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
