import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import User from '../../../../../../../models/User';
import { authenticate } from '../../../../../../../middleware/auth';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const adminUser = await User.findById(auth._id);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.kyc || user.kyc.status !== 'pending') {
      return NextResponse.json({ error: 'No pending KYC to approve' }, { status: 400 });
    }

    user.kyc.status = 'approved';
    user.kyc.approvedAt = new Date();

    await user.save();

    return NextResponse.json({ message: 'KYC approved successfully' }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to approve KYC', details: err.message }, { status: 500 });
  }
}
