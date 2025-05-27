// app/api/admin/roles/[id]/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import Role from '../../../../../../../models/Role';
import { authenticate } from '../../../../../../../middleware/auth';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest, { params }: { params: { roleId: string } }) {

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
    const role = await Role.findById(params.roleId);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Convert string IDs to ObjectIds
    const permissionObjectIds = permissionIds.map((id: string) => new mongoose.Types.ObjectId(id));

    role.name = name;
    role.permissions = permissionObjectIds;
    await role.save();

    const updatedRole = await Role.findById(role._id).populate('permissions');

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
