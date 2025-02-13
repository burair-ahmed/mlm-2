import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import { generateReferralCode } from '../../../../../utils/referral';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password, referralCode } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      referralCode: generateReferralCode()
    });

    // Handle referral
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
    console.error(error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}