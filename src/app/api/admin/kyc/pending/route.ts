import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import User from '../../../../../../models/User';
import { authenticate } from '../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../lib/auth/permissionUtils';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'approve_kyc');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();


  try {
    const kycRequests = await User.find({ 'kyc.status': 'pending' }).select(
      '_id userName email kyc'
    );

    return NextResponse.json({ kycRequests }, { status: 200 });
  } catch (err: unknown) {
    console.error('Failed to fetch pending KYC:', err);
    return NextResponse.json({ error: 'Failed to fetch KYC requests' }, { status: 500 });
  }
}
