import { NextRequest, NextResponse } from 'next/server';
import Withdrawal from '../../../../../models/Withdrawal';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function PUT(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { withdrawalId, status } = await req.json();
    const withdrawal = await Withdrawal.findById(withdrawalId);
    
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    if (status === 'approved') {
      // Release held balance
      await User.findByIdAndUpdate(withdrawal.userId, {
        $inc: { heldBalance: -withdrawal.amount }
      });
    } else {
      // Return funds to balance
      await User.findByIdAndUpdate(withdrawal.userId, {
        $inc: { 
          balance: withdrawal.amount,
          heldBalance: -withdrawal.amount 
        }
      });
    }

    withdrawal.status = status;
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    return NextResponse.json(withdrawal);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}