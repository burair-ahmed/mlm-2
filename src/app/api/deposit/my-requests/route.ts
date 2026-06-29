import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import DepositRequest from '../../../../../models/DepositRequest';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const requests = await DepositRequest.find({ userId: auth._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('[GET USER DEPOSITS ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch deposit requests' },
      { status: 500 }
    );
  }
}
