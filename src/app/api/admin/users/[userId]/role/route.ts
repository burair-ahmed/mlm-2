import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import User from '../../../../../../../models/User';
import Role from '../../../../../../../models/Role';
import Permission from '../../../../../../../models/Permission';
import { authenticate } from '../../../../../../../middleware/auth';

export async function PUT(req: NextRequest, context: { params: { userId: string } }) {
  // Authenticate admin user
  const auth = await authenticate(req);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = context.params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
  }

  await dbConnect();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { roleId, permissions } = body;

  if (!roleId) {
    return NextResponse.json({ error: 'Role ID or "custom" must be provided' }, { status: 400 });
  }

  try {
    let updatedUser;

    if (roleId === 'custom') {
      // Handle custom permission assignment
      if (!Array.isArray(permissions) || permissions.length === 0) {
        return NextResponse.json({ error: 'At least one permission must be provided for custom roles' }, { status: 400 });
      }

      // Validate permissions
      const validPermissions = await Permission.find({ slug: { $in: permissions } }).lean();
      const validSlugs = validPermissions.map(p => p.slug);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            role: 'custom',
            customPermissions: validSlugs,
            customRoleName: null,
          },
        },
        { new: true }
      );
    } else {
      // Handle predefined role assignment
      const role = await Role.findById(roleId).lean<{ _id: string; name: string; permissions: string[] }>();

      if (!role) {
        return NextResponse.json({ error: 'Role not found' }, { status: 404 });
      }

      // Load permission slugs associated with the role
      const rolePermissions = await Permission.find({ _id: { $in: role.permissions } }).lean();
      const slugs = rolePermissions.map(p => p.slug);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            role: role.name,
            customPermissions: slugs,
            customRoleName: role.name,
          },
        },
        { new: true }
      );
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
