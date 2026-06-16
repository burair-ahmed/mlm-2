// src/app/api/admin/roles/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Role from '../../../../../../models/Role';
import { authenticate } from '../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../lib/auth/permissionUtils';

export async function POST(req: NextRequest) {
  // 1) Authenticate & Authorize
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'manage_roles');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3) Connect to DB
  await dbConnect();

  // 4) Parse and validate input
  const { name, permissionIds } = await req.json();
  if (typeof name !== 'string' || !Array.isArray(permissionIds)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // 5) Create new role
  try {
    const role = await Role.create({
      name,
      permissions: permissionIds,
    });
    return NextResponse.json(role);
  } catch (err) {
    console.error('Role creation error:', err);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}
