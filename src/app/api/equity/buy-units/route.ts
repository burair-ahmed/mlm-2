import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../../../models/User';
import Transaction from '../../../../../models/Transaction';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

const PRICE_PER_UNIT = 10; // $10 per equity unit

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const { units } = await req.json();
    const numericUnits = Number(units);
    const totalCost = numericUnits * PRICE_PER_UNIT;

    // Validation
    if (isNaN(numericUnits) || numericUnits <= 0) {
      return NextResponse.json(
        { error: "Invalid units" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(auth._id).session(session);
      if (!user || user.balance < totalCost) {
        throw new Error('Insufficient balance');
      }

      // Deduct cash & add equity units
      user.balance -= totalCost;
      user.equityUnits += numericUnits;
      await user.save({ session });

      // Record transaction
      const tx = new Transaction({
        userId: user._id,
        type: 'cash_to_equity',
        amount: -totalCost,
        equityUnits: numericUnits,
        description: `Purchased ${numericUnits} equity units`
      });
      await tx.save({ session });

      // Calculate cash commissions (3 levels)
      let currentUser = user;
      const CASH_COMMISSION_RATES = [0.05, 0.03, 0.02]; // 5%, 3%, 2%

      for (const rate of CASH_COMMISSION_RATES) {
        if (!currentUser.referredBy) break;
        const referrer = await User.findById(currentUser.referredBy).session(session);
        if (!referrer) break;

        const commission = totalCost * rate;
        referrer.balance += commission;
        referrer.commissionEarned += commission;
        await referrer.save({ session });

        await new Transaction({
          userId: referrer._id,
          type: 'commission',
          amount: commission,
          description: `Cash commission from ${user.email}`
        }).save({ session });

        currentUser = referrer;
      }

      await session.commitTransaction();
      return NextResponse.json({
        success: true,
        newBalance: user.balance,
        equityUnits: user.equityUnits
      });

    } catch (error) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Purchase failed' },
        { status: 400 }
      );
    } finally {
      session.endSession();
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}