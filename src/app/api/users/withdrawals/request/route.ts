import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../models/WithdrawalRequest';
import User from '../../../../../../models/User'; // Make sure this is imported
import { authenticate } from '../../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  const { method, amount, details } = await req.json();

  if (!method || !amount || !details) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Double-check if user still has enough balance
  const user = await User.findById(auth._id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (amount > user.balance) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  // Deduct amount from user's balance
  user.balance -= amount;
  await user.save();

  const newRequest = await WithdrawalRequest.create({
    userId: user._id,
    method,
    amount,
    details,
  });

  return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
}
