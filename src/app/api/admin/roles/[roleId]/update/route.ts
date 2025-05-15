// app/api/admin/roles/[id]/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import Role from '../../../../../../../models/Role';
import { authenticate } from '../../../../../../../middleware/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { name, permissionIds } = await req.json();

  if (!name || !Array.isArray(permissionIds)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const updated = await Role.findByIdAndUpdate(params.id, {
      name,
      permissions: permissionIds,
    }, { new: true }).populate('permissions');

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
