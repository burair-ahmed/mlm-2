import { NextRequest, NextResponse } from 'next/server';
import Transaction from '../../../../../models/Transaction';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const commissions = await Transaction.find({
      userId: auth._id,
      type: 'commission'
    }).sort({ createdAt: -1 });

    return NextResponse.json(commissions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching commissions' },
      { status: 500 }
    );
  }
}