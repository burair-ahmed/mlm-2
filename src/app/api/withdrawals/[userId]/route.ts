import { NextRequest, NextResponse } from 'next/server';
import Withdrawal from '../../../../../models/Withdrawal';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const { userId } = await params;
    const withdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 });
      
    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}