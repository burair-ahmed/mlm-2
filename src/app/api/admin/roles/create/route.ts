import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Role from '../../../../../../models/Role';
import { authenticate } from '../../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  const { name, permissionIds } = body;
  if (!name || !Array.isArray(permissionIds)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const role = await Role.create({
      name,
      permissions: permissionIds,
    });

    return NextResponse.json(role);
  } catch {
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}
