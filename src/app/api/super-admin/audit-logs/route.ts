import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import AuditLog from '../../../../../models/AuditLog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _User from '../../../../../models/User'; // Required to register User model for populate
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  // Restrict endpoint to Super Admin role only
  if (auth.role !== 'Super Admin') {
    return NextResponse.json({ error: 'Forbidden: Super Admins only' }, { status: 403 });
  }

  await dbConnect();

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const action = searchParams.get('action');
    const targetModel = searchParams.get('targetModel');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};

    if (action && action !== 'all') {
      filter.action = action;
    }
    
    if (targetModel && targetModel !== 'all') {
      filter.targetModel = targetModel;
    }

    if (search) {
      filter.$or = [
        { details: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { targetModel: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await AuditLog.countDocuments(filter);
    
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('adminId', 'userName email fullName');

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      logs,
      total,
      page,
      pages
    }, { status: 200 });

  } catch (error) {
    console.error('[AUDIT_LOGS_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
