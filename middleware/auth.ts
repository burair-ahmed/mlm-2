import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth';
import User from '../models/User';
import dbConnect from '../lib/dbConnect';

export async function authenticate(req: NextRequest) {
  await dbConnect();

  // Get token from headers
  const token = req.cookies.get('token')?.value || 
  req.headers.get('authorization')?.split(' ')[1];


  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
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
    console.error(error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
