import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import Role from '../../../../../models/Role';
// import Permission from '../../../../../models/Permission';
import { generateReferralCode } from '../../../../../utils/referral';

export async function POST(request: NextRequest) {
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
    const defaultRole = await Role.findOne({ name: 'User' }).populate('permissions');
    if (!defaultRole) {
      return NextResponse.json({ error: 'Default role not found' }, { status: 500 });
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
