import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../../utils/auth';
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

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
    console.error(error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}