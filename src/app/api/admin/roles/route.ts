// src/app/api/admin/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';
import { hasPermission } from '../../../../../lib/auth/permissionUtils';
import Role from '../../../../../models/Role';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'manage_roles');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.MONGODB_URI) {
    const mockPermissions = [
      { _id: "perm-1", slug: "access_admin_dashboard", label: "Access Admin Dashboard" },
      { _id: "perm-2", slug: "view_commissions", label: "View Commissions" },
      { _id: "perm-3", slug: "view_referrals", label: "View Referrals" },
      { _id: "perm-4", slug: "view_kyc", label: "View KYC" },
      { _id: "perm-5", slug: "view_investments", label: "View Investments" },
      { _id: "perm-6", slug: "convert_units", label: "Convert Units" },
      { _id: "perm-7", slug: "assign_roles", label: "Assign Roles" },
      { _id: "perm-8", slug: "create_package", label: "Create Package" },
      { _id: "perm-9", slug: "approve_kyc", label: "Approve KYC" },
      { _id: "perm-10", slug: "handle_withdrawals", label: "Handle Withdrawals" },
      { _id: "perm-11", slug: "manage_roles", label: "Manage Roles" },
      { _id: "perm-12", slug: "create_permission", label: "Create Permission" },
      { _id: "perm-13", slug: "profit_update", label: "Profit Update" },
      { _id: "perm-14", slug: "view_account", label: "View Account" },
      { _id: "perm-15", slug: "manage_settings", label: "Manage Settings" },
      { _id: "perm-16", slug: "request_withdrawal", label: "Request Withdrawal" }
    ];
    const mockRoles = [
      {
        _id: "role-1",
        name: "super-admin",
        permissions: mockPermissions
      },
      {
        _id: "role-2",
        name: "admin",
        permissions: mockPermissions.slice(0, 10)
      },
      {
        _id: "role-3",
        name: "user",
        permissions: mockPermissions.filter(p => ["view_investments", "view_account", "request_withdrawal"].includes(p.slug))
      }
    ];
    return NextResponse.json(mockRoles);
  }

  await dbConnect();
  try {
    // ← populate permissions with the fields your front-end needs
    const roles = await Role.find({}, 'name permissions')
      .populate('permissions', '_id slug label')
      .lean()
      .exec();

    return NextResponse.json(roles || []);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Error fetching roles' }, { status: 500 });
  }
}
