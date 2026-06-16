import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import Role from '../../../../../models/Role';
import Permission from '../../../../../models/Permission';
import { generateReferralCode } from '../../../../../utils/referral';

export async function POST(request: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { message: 'User created successfully (Mock Mode)', userId: 'mock-new-user-id' },
      { status: 201 }
    );
  }

  await dbConnect();

  try {
    const { email, password, userName, fullName, referralCode } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email, userName });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
