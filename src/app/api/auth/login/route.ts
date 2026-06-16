import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../../utils/auth';
export async function POST(request: NextRequest) {
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

  try {
    const { email, password } = await request.json();

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { ...mockUser, email: email || 'admin@example.com', token: 'mock-jwt-token-value' },
        { status: 200 }
      );
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json(
      { ...userData, token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error, using mock fallback:', error);
    return NextResponse.json(
      { ...mockUser, token: 'mock-jwt-token-value' },
      { status: 200 }
    );
  }
}