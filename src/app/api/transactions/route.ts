import { NextRequest, NextResponse } from 'next/server';
import Transaction from '../../../../models/Transaction';
import dbConnect from '../../../../lib/dbConnect';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const type = url.searchParams.get('type');

    const query: any = { userId: auth._id };
    if (type) query.type = type;

    // Count for all transactions (unfiltered)
    const allCount = await Transaction.countDocuments({ userId: auth._id });

    // Count per type
    const typeCountsArray = await Transaction.aggregate([
      { $match: { userId: auth._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const counts: Record<string, number> = { all: allCount };
    typeCountsArray.forEach((item) => {
      counts[item._id] = item.count;
    });

    // Paginated transactions (optionally filtered)
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalFiltered = type ? counts[type] || 0 : allCount;
    const totalPages = Math.ceil(totalFiltered / limit);

    return NextResponse.json({
      transactions,
      counts,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { transactions: [], counts: { all: 0 }, totalPages: 1 },
      { status: 500 }
    );
  }
}
