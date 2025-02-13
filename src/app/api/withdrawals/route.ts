import { NextRequest, NextResponse } from 'next/server';
import Withdrawal from '../../../../models/Withdrawal';
import User from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';
import { authenticate } from '../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const { amount, paymentMethod, paymentDetails } = await req.json();

    // Validate balance
    const user = await User.findById(auth._id);
    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create withdrawal
    const withdrawal = await Withdrawal.create({
      userId: auth._id,
      amount,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    });

    // Hold funds
    await User.findByIdAndUpdate(auth._id, {
      $inc: { balance: -amount, heldBalance: amount }
    });

    return NextResponse.json(withdrawal);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Withdrawal request failed' },
      { status: 500 }
    );
  }
}