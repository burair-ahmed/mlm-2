import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import User from '../../../../../../models/User';
import { authenticate } from '../../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();


  try {
    const kycRequests = await User.find({ 'kyc.status': 'pending' }).select(
      '_id userName email kyc'
    );

    return NextResponse.json({ kycRequests }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch KYC requests', details: err.message }, { status: 500 });
  }
}
