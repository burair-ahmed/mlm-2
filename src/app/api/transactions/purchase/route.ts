import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../../../models/User';
import Transaction from '../../../../../models/Transaction';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';
import { COMMISSION_LEVELS } from '../../../../../config/commissions';

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    // 2. Database connection
    await dbConnect();

    // 3. Request validation
    const { amount } = await req.json();
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
      return NextResponse.json({ error: 'Invalid amount format' }, { status: 400 });
    }
    
    if (numericAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    // 4. Transaction setup
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 5. Check user balance (if needed)
      const user = await User.findById(auth._id).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // 6. Create purchase transaction
      const purchaseTx = new Transaction({
        userId: auth._id,
        amount: -numericAmount,
        type: 'purchase',
        equityUnits: numericAmount || 0,
        description: `Equity purchase of $${numericAmount.toFixed(2)}`,
        status: 'pending'
      });
      await purchaseTx.save({ session });

      // 7. Update user balance
      const updatedUser = await User.findByIdAndUpdate(
        auth._id,
        { $inc: { balance: -numericAmount } },
        { new: true, session }
      );

      if (!updatedUser) {
        throw new Error('User balance update failed');
      }

      // 8. Commission calculation
      let currentUser = auth;
      const commissionResults = [];

      for (const level of COMMISSION_LEVELS) {
        if (!currentUser.referredBy) break;

        const referrer = await User.findById(currentUser.referredBy).session(session);
        if (!referrer) break;

        const commission = numericAmount * level.rate;

        // Update referrer's balance
        await User.findByIdAndUpdate(
          referrer._id,
          { 
            $inc: { 
              balance: commission,
              totalCommissionEarned: commission
            }
          },
          { session }
        );

        // Create commission transaction
        const commissionTx = new Transaction({
          userId: referrer._id,
          amount: commission,
          type: 'commission',
          equityUnits: 0,
          level: level.level,
          sourceUser: auth._id,
          description: `Level ${level.level} commission (${level.rate * 100}%) from ${auth.email}`,
          status: 'completed'
        });
        await commissionTx.save({ session });

        commissionResults.push({
          level: level.level,
          userId: referrer._id,
          amount: commission
        });

        currentUser = referrer;
      }

      // 9. Finalize transaction
      await session.commitTransaction();
      
      return NextResponse.json({ 
        success: true,
        message: 'Purchase successful',
        amount: numericAmount,
        newBalance: updatedUser.balance,
        commissions: commissionResults,
        commissionLevelsApplied: commissionResults.length
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction failed:', error);
      return NextResponse.json(
        { 
          error: 'Transaction processing failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}