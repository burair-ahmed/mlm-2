import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../../../models/User';
import Transaction from '../../../../../models/Transaction';
import EquityPackage from '../../../../../models/EquityPackage';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // Authenticate User
    const auth = await authenticate(req);
    if (!auth || !auth._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { packageId, units } = await req.json();
    const numericUnits = Number(units);

    // Validate input
    if (isNaN(numericUnits) || numericUnits <= 0) {
      return NextResponse.json({ error: "Invalid units" }, { status: 400 });
    }

    // Connect to DB
    await dbConnect();

    // Start Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Fetch Equity Package
      const equityPackage = await EquityPackage.findById(packageId).session(session);
      if (!equityPackage) {
        throw new Error('Equity package not found');
      }

      console.log(`Before Purchase: Available Units = ${equityPackage.availableUnits}`);

      if (equityPackage.availableUnits < numericUnits) {
        throw new Error('Insufficient equity units available in the package');
      }

      // Fetch User
      const user = await User.findById(auth._id).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Get cost per unit
      const costPerUnit = equityPackage.equityUnits; // This is the price per equity unit

      // Calculate total cost
      const totalCost = numericUnits * costPerUnit;

      // Ensure user has enough equity units
      if (user.equityUnits < totalCost) {
        throw new Error(`Insufficient equity units. Required: ${totalCost}, Available: ${user.equityUnits}`);
      }

      // Deduct the correct amount from user's equity balance
      user.equityUnits -= totalCost;

      // Deduct units from package
      equityPackage.availableUnits -= numericUnits;
      await equityPackage.save({ session });

      console.log(`After Purchase: Available Units = ${equityPackage.availableUnits}`);

      // Check if user already owns equity in this package
      const existingEquity = user.equityOwnership.find((ownership: { packageId: mongoose.Types.ObjectId; units: number; purchaseDate: Date }) => 
        ownership.packageId.toString() === packageId
      );
      

      if (existingEquity) {
        existingEquity.units += numericUnits;
      } else {
        user.equityOwnership.push({
          packageId: equityPackage._id,
          units: numericUnits,
          purchaseDate: new Date(),
        });
      }

      await user.save({ session });

      // Create equity transaction (recording equity purchase)
      const transaction = new Transaction({
        userId: user._id,
        type: 'equity_purchase',
        equityUnits: numericUnits,
        amount: -totalCost, // Deducted equity units
        description: `Purchased ${numericUnits} equity units from ${equityPackage.name} (Cost per unit: ${costPerUnit})`,
      });
      await transaction.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: `Successfully purchased ${numericUnits} equity units`,
        newEquityBalance: user.equityUnits,
        newEquityOwnership: user.equityOwnership,
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Purchase failed' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


