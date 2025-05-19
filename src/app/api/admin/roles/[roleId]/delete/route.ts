// src/app/api/admin/roles/[roleId]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import Role from '../../../../../../../models/Role';
import { authenticate } from '../../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../../lib/auth/permissionUtils';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
  // 1) Authenticate
  const auth = await authenticate(req);
  if (!auth || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) Permission check
  const allowed = await hasPermission(auth.user, 'manage_roles');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3) DB connect
  await dbConnect();

  // 4) Delete
  try {
    await Role.findByIdAndDelete(params.roleId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
