import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import User from '../../../../../../../models/User';
import { authenticate } from '../../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../../lib/auth/permissionUtils';

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
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.kyc || user.kyc.status !== 'pending') {
      return NextResponse.json({ error: 'No pending KYC to reject' }, { status: 400 });
    }

    user.kyc.status = 'rejected';
    // Remove approvedAt since it is rejected, or keep track of metadata if needed.
    await user.save();

    return NextResponse.json({ message: 'KYC rejected successfully', user }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to reject KYC', details: errorMessage }, { status: 500 });
  }
}
