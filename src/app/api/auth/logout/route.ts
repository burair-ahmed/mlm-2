import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import TokenBlocklist from '../../../../../models/TokenBlocklist';
import { verifyToken } from '../../../../../utils/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value || 
                req.headers.get('authorization')?.split(' ')[1];

  if (token && token !== 'null' && token !== 'undefined') {
    try {
      await dbConnect();
      const decoded = await verifyToken(token);
      // expiresAt should match token's expiration
      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await TokenBlocklist.create({
        token,
        expiresAt
      }).catch(err => {
        // Ignore duplicate key errors if already logged out
        if (err.code !== 11000) throw err;
      });
    } catch (e) {
      console.error('Failed to blocklist token on logout:', e);
    }
  }

  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear the token cookie by setting it to empty and expired
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  return response;
}
