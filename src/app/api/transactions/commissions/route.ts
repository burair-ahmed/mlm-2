import { NextRequest, NextResponse } from 'next/server';
import Transaction from '../../../../../models/Transaction';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';
// import User from '../../../../../models/User'; // 👈 ensure you have this imported

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const commissions = await Transaction.find({
      userId: auth._id,
      type: 'commission',
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'sourceUser',
        select: 'email', // 👈 choose what you want to return
      });

    // Map for a cleaner frontend payload
    const responseData = commissions.map((tx) => ({
      _id: tx._id,
      amount: tx.amount,
      createdAt: tx.createdAt,
      description: tx.description || '',
      sourceUser: tx.sourceUser
        ? (tx.sourceUser.email || 'Unknown')
        : 'Unknown',
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching commissions' },
      { status: 500 }
    );
  }
}
