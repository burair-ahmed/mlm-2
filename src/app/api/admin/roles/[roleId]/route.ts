import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Role from '../../../../../../models/Role';
import { authenticate } from '../../../../../../middleware/auth';

export async function PUT(req: NextRequest, { params }: { params: { roleId: string } }) {
  const auth = await authenticate(req);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { permissionIds } = body;

  try {
    const updatedRole = await Role.findByIdAndUpdate(
      params.roleId,
      { permissions: permissionIds },
      { new: true }
    );
    return NextResponse.json(updatedRole);
  } catch {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
