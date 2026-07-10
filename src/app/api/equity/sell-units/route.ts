import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../../../models/User';
import Transaction from '../../../../../models/Transaction';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';
import { createNotification } from '../../../../../lib/notifications';
import { getEquityUnitPrice } from '../../../../../lib/settings';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const { units } = await req.json();
    const numericUnits = Number(units);
    const PRICE_PER_UNIT = await getEquityUnitPrice();
    const totalRefund = numericUnits * PRICE_PER_UNIT;

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
      if (!user) {
        throw new Error('User not found');
      }

      if (user.equityUnits < numericUnits) {
        throw new Error(`Insufficient equity units. Available: ${user.equityUnits}, Requested: ${numericUnits}`);
      }

      // Deduct equity units & add cash balance
      user.equityUnits -= numericUnits;
      user.balance += totalRefund;
      await user.save({ session });

      // Record transaction
      const tx = new Transaction({
        userId: user._id,
        type: 'equity_to_cash',
        amount: totalRefund,
        equityUnits: -numericUnits,
        description: `Converted ${numericUnits} equity units back to wallet balance`
      });
      await tx.save({ session });

      await session.commitTransaction();

      // Trigger notification for the user
      await createNotification(user._id, {
        title: 'Equity Units Converted',
        message: `Successfully converted ${numericUnits} equity units back to $${totalRefund.toLocaleString(undefined, { minimumFractionDigits: 2 })} wallet balance.`,
        type: 'system',
        link: '/user?tab=Equity+Units+Converter'
      });

      return NextResponse.json({
        success: true,
        newBalance: user.balance,
        equityUnits: user.equityUnits
      });

    } catch (error) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Conversion failed' },
        { status: 400 }
      );
    } finally {
      session.endSession();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
