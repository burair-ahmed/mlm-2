import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';
import { hasPermission } from '../../../../../lib/auth/permissionUtils';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'view_users');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.MONGODB_URI) {
    const mockUsers = [
      {
        _id: "60d0fe4f5311236168a109ca",
        email: "admin@example.com",
        fullName: "Admin User",
        role: "super-admin",
        kyc: { status: "approved" },
        balance: 10000,
        commissionEarned: 500,
        isAdmin: true,
        createdAt: new Date()
      },
      {
        _id: "mock-user-2",
        email: "user2@example.com",
        fullName: "John Doe",
        role: "user",
        kyc: { status: "approved" },
        balance: 500,
        commissionEarned: 50,
        isAdmin: false,
        createdAt: new Date()
      },
      {
        _id: "mock-user-3",
        email: "user3@example.com",
        fullName: "Jane Smith",
        role: "user",
        kyc: { status: "pending" },
        balance: 1200,
        commissionEarned: 120,
        isAdmin: false,
        createdAt: new Date()
      }
    ];
    return NextResponse.json(mockUsers);
  }

  await dbConnect();

  try {
    const users = await User.find({}, 'email balance commissionEarned isAdmin createdAt kyc fullName role')
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
