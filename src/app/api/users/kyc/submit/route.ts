import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import User from '../../../../../../models/User';
import { authenticate } from '../../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const body = await req.json();
    const { fullName, dateOfBirth, address, idType, idNumber, documents } = body;

    const user = await User.findById(auth._id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.kyc = {
      status: 'pending',
      fullName,
      dateOfBirth,
      address,
      idType,
      idNumber,
      documents,
      submittedAt: new Date(),
    };

    await user.save();

    return NextResponse.json({ message: 'KYC submitted successfully' }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to submit KYC', details: err.message }, { status: 500 });
  }
}
