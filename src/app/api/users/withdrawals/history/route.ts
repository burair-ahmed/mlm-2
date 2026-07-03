import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../models/WithdrawalRequest';
import { authenticate } from '../../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const requests = await WithdrawalRequest.find({ userId: auth._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('[GET WITHDRAWALS HISTORY ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch withdrawal history' },
      { status: 500 }
    );
  }
}
