import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const users = await User.find({}, 'email balance commissionEarned isAdmin createdAt')
      .lean()
      .exec();

    return NextResponse.json(users || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
}
