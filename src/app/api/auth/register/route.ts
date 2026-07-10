import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import Role from '../../../../../models/Role';
import Permission from '../../../../../models/Permission';
import { generateReferralCode } from '../../../../../utils/referral';
import { getClientIp, isRateLimited } from '../../../../../lib/auth/rateLimiter';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitResult = isRateLimited(`register_${ip}`, 10, 60 * 1000); // 10 req/min
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { message: 'User created successfully (Mock Mode)', userId: 'mock-new-user-id' },
      { status: 201 }
    );
  }

  await dbConnect();

  try {
    const { email, password, userName, fullName, referralCode } = await request.json();

    // Password validation
    if (!password || password.length < 12 || 
        !/[A-Z]/.test(password) || 
        !/[a-z]/.test(password) || 
        !/[0-9]/.test(password) || 
        !/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 12 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' },
        { status: 400 }
      );
    }

    // Check if user already exists (prevent duplicate email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }]
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Registration failed. Username or email already in use.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Find default role: "User"
    let defaultRole = await Role.findOne({ name: 'User' }).populate('permissions');
    if (!defaultRole) {
      // Auto-seed default permissions and the "User" role if it doesn't exist
      const defaultPermissionData = [
        { slug: "view_investments", label: "View Investments" },
        { slug: "view_account", label: "View Account" },
        { slug: "request_withdrawal", label: "Request Withdrawal" },
        { slug: "view_referrals", label: "View Referrals" }
      ];

      const permissionIds = [];
      for (const p of defaultPermissionData) {
        let perm = await Permission.findOne({ slug: p.slug });
        if (!perm) {
          perm = await Permission.create(p);
        }
        permissionIds.push(perm._id);
      }

      defaultRole = await Role.create({
        name: 'User',
        permissions: permissionIds
      });

      // Populate permissions to match the expected return
      defaultRole = await defaultRole.populate('permissions');
    }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rolePermissionSlugs = defaultRole.permissions.map((p: any) => p.slug);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      userName,
      fullName,
      referralCode: generateReferralCode(),
      role: 'user',
      customRoleId: defaultRole._id,
      customPermissions: rolePermissionSlugs,
    });

    // Handle referral logic
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
        referrer.referrals.push(newUser._id);
        await referrer.save();
      }
    }

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
