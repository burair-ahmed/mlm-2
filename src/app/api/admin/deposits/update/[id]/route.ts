import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../../../lib/dbConnect';
import DepositRequest from '../../../../../../../models/DepositRequest';
import User from '../../../../../../../models/User';
import Transaction from '../../../../../../../models/Transaction';
import { authenticate } from '../../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../../lib/auth/permissionUtils';
import { createNotification } from '../../../../../../../lib/notifications';
import { logAdminAction } from '../../../../../../../lib/db/auditLog';
import { getEquityUnitPrice } from '../../../../../../../lib/settings';

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
  const { status, reason } = await req.json();

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
      if (status === 'Rejected' && reason) {
        depositRequest.rejectionReason = reason;
      }
      await depositRequest.save({ session });

      if (status === 'Approved') {
        const user = await User.findById(depositRequest.userId).session(session);
        if (!user) {
          throw new Error('User not found');
        }

        user.depositedBalance += depositRequest.amount;
        await user.save({ session });

        const price = await getEquityUnitPrice();
        const equityUnits = depositRequest.amount / price;
        const depositTx = new Transaction({
          userId: depositRequest.userId,
          type: 'deposit',
          amount: depositRequest.amount,
          equityUnits: equityUnits,
          description: `Deposit of $${depositRequest.amount.toFixed(2)} approved`
        });
        await depositTx.save({ session });
      }

      // Record administrative audit log
      await logAdminAction({
        adminId: auth._id,
        action: status === 'Approved' ? 'approve_deposit' : 'reject_deposit',
        targetId: depositRequest._id,
        targetModel: 'DepositRequest',
        details: `Deposit request of $${depositRequest.amount} was ${status.toLowerCase()}${reason ? `. Reason: ${reason}` : ''}`,
        session
      });

      await session.commitTransaction();
      session.endSession();

      // Trigger notification to the user after successful commit
      await createNotification(depositRequest.userId, {
        title: status === 'Approved' ? 'Deposit Approved' : 'Deposit Rejected',
        message: status === 'Approved'
          ? `Your deposit request of $${depositRequest.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} has been approved. Balance credited.`
          : `Your deposit request of $${depositRequest.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
        type: 'deposit',
        link: '/user?tab=Deposit+History'
      });

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
