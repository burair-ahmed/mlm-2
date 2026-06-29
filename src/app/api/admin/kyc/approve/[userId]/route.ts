import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import User from '../../../../../../../models/User';
import { authenticate } from '../../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../../lib/auth/permissionUtils';
import { createNotification } from '../../../../../../../lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'approve_kyc');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await dbConnect();

  try {


    const { userId } = await params;
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.kyc || user.kyc.status !== 'pending') {
      return NextResponse.json({ error: 'No pending KYC to approve' }, { status: 400 });
    }

    user.kyc.status = 'approved';
    user.kyc.approvedAt = new Date();

    await user.save();

    // Trigger notification
    await createNotification(user._id, {
      title: 'KYC Verification Approved',
      message: 'Your KYC documents have been reviewed and approved successfully. You can now purchase packages.',
      type: 'kyc',
      link: '/user?tab=KYC'
    });

    return NextResponse.json({ message: 'KYC approved successfully' }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to approve KYC', details: err.message }, { status: 500 });
  }
}
