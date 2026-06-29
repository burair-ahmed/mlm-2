// /api/admin/withdrawals/update/[id].ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../../models/WithdrawalRequest';
import User from '../../../../../../../models/User';
import Transaction from '../../../../../../../models/Transaction';
import { authenticate } from '../../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../../lib/auth/permissionUtils';
import { createNotification } from '../../../../../../../lib/notifications';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'handle_withdrawals');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();
  const { status } = await req.json();

  if (!status || !['Pending', 'In Process', 'Completed', 'Cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const { id } = await params;
    const request = await WithdrawalRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    // Prevent modifying already completed or cancelled requests
    if (request.status === 'Completed' || request.status === 'Cancelled') {
      return NextResponse.json(
        { error: `Cannot modify request in '${request.status}' state` },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const oldStatus = request.status;
      request.status = status;
      request.updatedAt = new Date();
      await request.save({ session });

      // If status transitions from (Pending or In Process) to Cancelled, refund user balance
      if (status === 'Cancelled' && (oldStatus === 'Pending' || oldStatus === 'In Process')) {
        const user = await User.findById(request.userId).session(session);
        if (!user) {
          throw new Error('User not found');
        }

        user.balance += request.amount;
        await user.save({ session });

        // Record a transaction log for the refund
        const refundTx = new Transaction({
          userId: request.userId,
          type: 'deposit',
          amount: request.amount,
          equityUnits: 0,
          description: `Refund for cancelled withdrawal request of $${request.amount.toFixed(2)}`
        });
        await refundTx.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      // Trigger notification for status changes
      let statusDesc = status.toLowerCase();
      if (status === 'Completed') statusDesc = 'completed and processed';
      else if (status === 'Cancelled') statusDesc = 'cancelled and refunded to your balance';
      else if (status === 'In Process') statusDesc = 'marked as in process';

      await createNotification(request.userId, {
        title: `Withdrawal Request ${status}`,
        message: `Your withdrawal request of $${request.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} has been ${statusDesc}.`,
        type: 'withdrawal',
        link: '/user?tab=Request+Withdrawal'
      });

      return NextResponse.json({ success: true, request });

    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

  } catch (error) {
    console.error('[UPDATE WITHDRAWAL STATUS ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal request status' },
      { status: 500 }
    );
  }
}
