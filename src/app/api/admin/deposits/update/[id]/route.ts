import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../../../lib/dbConnect';
import DepositRequest from '../../../../../../../models/DepositRequest';
import User from '../../../../../../../models/User';
import Transaction from '../../../../../../../models/Transaction';
import { authenticate } from '../../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../../lib/auth/permissionUtils';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'handle_deposits');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();

  const { id } = await params;
  const { status } = await req.json();

  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const depositRequest = await DepositRequest.findById(id);

    if (!depositRequest) {
      return NextResponse.json({ error: 'Deposit request not found' }, { status: 404 });
    }

    if (depositRequest.status !== 'Pending') {
      return NextResponse.json(
        { error: `Request already processed as ${depositRequest.status}` },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      depositRequest.status = status;
      depositRequest.updatedAt = new Date();
      await depositRequest.save({ session });

      if (status === 'Approved') {
        const user = await User.findById(depositRequest.userId).session(session);
        if (!user) {
          throw new Error('User not found');
        }

        user.balance += depositRequest.amount;
        await user.save({ session });

        const equityUnits = depositRequest.amount / 10;
        const depositTx = new Transaction({
          userId: depositRequest.userId,
          type: 'deposit',
          amount: depositRequest.amount,
          equityUnits: equityUnits,
          description: `Deposit of $${depositRequest.amount.toFixed(2)} approved`
        });
        await depositTx.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({ success: true, request: depositRequest });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error('[UPDATE DEPOSIT STATUS ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to update deposit request status' },
      { status: 500 }
    );
  }
}
