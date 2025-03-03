import { NextRequest, NextResponse } from 'next/server';
import EquityPackage from '../../../../../models/EquityPackage';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // Read request body
    const body = await req.json();
    console.log("Received package data:", body);

    // Authenticate user
    const auth = await authenticate(req);
    if (!auth || !auth.isAdmin) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    console.log("Connected to database");

    // Extract required fields
    const {
      name,
      category,
      totalUnits,
      equityUnits,
      duration,
      returnType,
      reinvestmentAllowed,
      exitPenalty,
      minHoldingPeriod,
      resaleAllowed,
      lifespan,
      depreciationModel
    } = body;

    // Validate common fields
    if (!name || !category || !totalUnits || !equityUnits) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['short-term', 'long-term', 'trading'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Category-specific validations
    if (category === 'short-term' || category === 'long-term') {
      if (!duration || !duration.value || !duration.unit) {
        return NextResponse.json({ error: 'Duration is required for short/long-term packages' }, { status: 400 });
      }
      if (!returnType) {
        return NextResponse.json({ error: 'Return type is required for short/long-term packages' }, { status: 400 });
      }
    } else if (category === 'trading') {
      if (!lifespan) {
        return NextResponse.json({ error: 'Lifespan is required for trading packages' }, { status: 400 });
      }
      if (!depreciationModel) {
        return NextResponse.json({ error: 'Depreciation model is required for trading packages' }, { status: 400 });
      }
    }

    // Create equity package
    const equityPackage = await EquityPackage.create({
      name,
      category,
      totalUnits,
      availableUnits: totalUnits,
      equityUnits,
      duration: category !== 'trading' ? duration : undefined,
      returnType: category !== 'trading' ? returnType : undefined,
      reinvestmentAllowed: category !== 'trading' ? reinvestmentAllowed : undefined,
      exitPenalty: category !== 'trading' ? exitPenalty : undefined,
      minHoldingPeriod: category === 'long-term' ? minHoldingPeriod : undefined,
      resaleAllowed,
      lifespan: category === 'trading' ? lifespan : undefined,
      depreciationModel: category === 'trading' ? depreciationModel : undefined,
    });

    console.log("Equity package created:", equityPackage);
    return NextResponse.json(equityPackage);
  } catch (error) {
    console.error("Error creating equity package:", error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

// Fetch all equity packages
export async function GET() {
  try {
    await dbConnect();
    const packages = await EquityPackage.find();
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    console.error("Error fetching equity packages:", error);
    return NextResponse.json({ error: 'Failed to fetch packages', details: error }, { status: 500 });
  }
}
