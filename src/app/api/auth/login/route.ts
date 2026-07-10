import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../../utils/auth';
import { getClientIp, isRateLimited } from '../../../../../lib/auth/rateLimiter';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitResult = isRateLimited(`login_${ip}`, 10, 60 * 1000); // 10 req/min
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
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

    const response = NextResponse.json(
      { ...userData },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}