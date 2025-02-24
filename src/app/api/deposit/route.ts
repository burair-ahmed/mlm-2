import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../../models/User';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../../lib/dbConnect';
import { authenticate } from '../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const { amount } = await req.json();
    const numericAmount = parseFloat(amount);

    // Validate amount
    if (isNaN(numericAmount)) {
      return NextResponse.json(
        { error: "Invalid amount format" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user balance
      const user = await User.findByIdAndUpdate(
        auth._id,
        { $inc: { balance: numericAmount } },
        { new: true, session }
      );

      if (!user) {
        throw new Error('User not found');
      }
      
      const equityUnits = numericAmount / 10;
      // Create deposit transaction
      const depositTx = new Transaction({
        userId: auth._id,
        type: 'deposit',
        amount: numericAmount,
        equityUnits: equityUnits,
        description: `Dummy deposit of $${numericAmount.toFixed(2)}`
      });
      await depositTx.save({ session });

      await session.commitTransaction();
      return NextResponse.json({
        success: true,
        newBalance: user.balance
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Deposit failed:', error);
      return NextResponse.json(
        { error: 'Deposit processing failed' },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}