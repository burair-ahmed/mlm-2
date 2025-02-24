import { NextRequest, NextResponse } from 'next/server';
import EquityPackage from '../../../../../models/EquityPackage';
import dbConnect from '../../../../../lib/dbConnect';
import { authenticate } from '../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // Read request body first
    const body = await req.json();
    console.log("Parsed request data:", body);

    // Authenticate without wrapping req
    const auth = await authenticate(req);
    if (!auth || !auth.isAdmin) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    console.log("Connected to database");

    // Create equity package
    const equityPackage = await EquityPackage.create({
      name: body.name,
      totalUnits: body.totalUnits,
      availableUnits: body.totalUnits,
      equityUnits: body.equityUnits,
    });

    console.log("Created equity package:", equityPackage);
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
    return NextResponse.json({ error: 'Failed to fetch packages', details: error }, { status: 500 });
  }
}
