import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../models/WithdrawalRequest';
import User from '../../../../../../models/User';
import { authenticate } from '../../../../../../middleware/auth';
import { createNotification } from '../../../../../../lib/notifications';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  const { method, amount, details } = await req.json();

  if (!method || !amount || !details || amount <= 0) {
    return NextResponse.json({ error: 'Invalid or missing fields' }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find user and atomically decrement balance if they have enough funds
    const user = await User.findOneAndUpdate(
      { _id: auth._id, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true, session }
    );

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Insufficient balance or user not found' }, { status: 400 });
    }

    // Create the withdrawal request document
    const newRequestList = await WithdrawalRequest.create([{
      userId: user._id,
      method,
      amount,
      details,
    }], { session });

    const newRequest = newRequestList[0];

    await session.commitTransaction();
    session.endSession();

    // Create a notification for the user
    await createNotification(user._id, {
      title: 'Withdrawal Requested',
      message: `Your withdrawal request of $${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} via ${method} has been submitted and is pending review.`,
      type: 'withdrawal',
      link: '/user?tab=Request+Withdrawal'
    });

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Withdrawal transaction failed:', error);
    return NextResponse.json({ error: 'Failed to request withdrawal' }, { status: 500 });
  }
}
