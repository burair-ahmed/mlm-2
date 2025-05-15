import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';
import Role from '../../../../../models/Role';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const roles = await Role.find({}, 'name permissions').lean().exec();
    return NextResponse.json(roles || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching roles' },
      { status: 500 }
    );
  }
}
