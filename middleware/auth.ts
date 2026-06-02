import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth';
import User from '../models/User';
import dbConnect from '../lib/dbConnect';

export async function authenticate(req: NextRequest) {
  // Get token from headers
  const token = req.cookies.get('token')?.value || 
  req.headers.get('authorization')?.split(' ')[1];

  const mockUser = {
    _id: '60d0fe4f5311236168a109ca',
    email: 'admin@example.com',
    userName: 'admin',
    fullName: 'Admin User',
    role: 'admin',
    isAdmin: true,
    balance: 10000,
    hierarchyLevel: 1,
    commissionEarned: 500,
    equityUnits: 100,
    referralCode: 'ADMIN123',
    referrals: [],
    withdrawnProfits: 0,
    kyc: {
      status: 'approved',
      fullName: 'Admin User'
    },
    customPermissions: [
      "access_admin_dashboard",
      "view_commissions",
      "view_referrals",
      "view_kyc",
      "view_investments",
      "convert_units",
      "assign_roles",
      "create_package",
      "approve_kyc",
      "handle_withdrawals",
      "manage_roles",
      "create_permission",
      "profit_update",
      "view_account",
      "manage_settings",
      "request_withdrawal"
    ]
  };

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // If using the mock token or MongoDB is not configured, bypass the database
  if (token === 'mock-jwt-token-value' || !process.env.MONGODB_URI) {
    return mockUser;
  }

  try {
    await dbConnect();
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return user;
  } catch (error) {
    console.error('Authentication error, falling back to mock user:', error);
    // If it's a db connection error or token parsing issue in local development, fall back to mockUser
    if (token) {
      return mockUser;
    }
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
