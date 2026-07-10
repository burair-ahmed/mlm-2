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

    // Check if user is accessing their own data or is an admin
    if (auth._id.toString() !== userId && !auth.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view these withdrawals' },
        { status: 403 }
      );
    }

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