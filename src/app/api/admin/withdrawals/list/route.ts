// /app/api/admin/withdrawals/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../models/WithdrawalRequest';
import User from '../../../../../../models/User';

import { authenticate } from '../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../lib/auth/permissionUtils';

{/*  eslint-disable-next-line @typescript-eslint/no-unused-vars */}
export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'view_withdrawals');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    const requests = await WithdrawalRequest.find()
      .populate({
        path: 'userId',
        model: User,
        select: 'fullName email',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('[GET WITHDRAWALS ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch withdrawal requests' },
      { status: 500 }
    );
  }
}
