import { NextRequest, NextResponse } from 'next/server';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../../lib/dbConnect';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    // Ensure we're using the correct field name (userId)
    const transactions = await Transaction.find({ userId: auth._id })
      .sort({ createdAt: -1 })
      .lean();

    // Always return an array even if empty
    return NextResponse.json(transactions || []);

  } catch (error) {
    console.error(error);
    // Return empty array on error
    return NextResponse.json([], { status: 500 });
  }
}