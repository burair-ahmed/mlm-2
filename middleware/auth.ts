import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth';
import User from '../models/User';
import TokenBlocklist from '../models/TokenBlocklist';
import dbConnect from '../lib/dbConnect';

export async function authenticate(req: NextRequest) {
  let token = req.cookies.get('token')?.value;

  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const parts = authHeader.split(' ');
      if (parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined') {
        token = parts[1];
      }
    }
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Check if token is blocklisted (e.g. user logged out)
    const isRevoked = await TokenBlocklist.findOne({ token });
    if (isRevoked) {
      return NextResponse.json(
        { error: 'Session has expired or token has been revoked' },
        { status: 401 }
      );
    }

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
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
