import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../models/WithdrawalRequest';
import { authenticate } from '../../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  const { method, amount, details } = await req.json();

  if (!method || !amount || !details) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newRequest = await WithdrawalRequest.create({
    userId: auth._id,
    method,
    amount,
    details,
  });

  return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
}
