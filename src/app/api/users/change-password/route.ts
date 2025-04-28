// app/api/users/change-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import { authenticate } from '../../../../../middleware/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await dbConnect();

  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth; // if not authenticated, return immediately

//   const { userId } = auth; // make sure your authenticate returns { userId } or similar
  const { oldPassword, newPassword } = await req.json();

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

    const user = await User.findById(auth._id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
}
