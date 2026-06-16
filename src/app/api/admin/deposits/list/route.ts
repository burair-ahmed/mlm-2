import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import DepositRequest from '../../../../../../models/DepositRequest';
import User from '../../../../../../models/User';
import { authenticate } from '../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../lib/auth/permissionUtils';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'handle_deposits');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();

  try {
    const requests = await DepositRequest.find()
      .populate({
        path: 'userId',
        model: User,
        select: 'fullName email userName',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('[GET ADMIN DEPOSITS ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch deposit requests' },
      { status: 500 }
    );
  }
}
