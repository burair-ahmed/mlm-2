import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import LongTermRental from "../../../../../models/LongTermRental";

// POST API - Create a New Long-Term Industry Package
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    // console.log("Received Body:", body);

    // Validate input fields
    if (!body.name || !body.category || !body.totalUnits || !body.equityUnits || !body.minHoldingPeriod || !body.minHoldingPeriodUnit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a new industry package
    const packageData = new LongTermRental({
      name: body.name,
      category: body.category,
      totalUnits: body.totalUnits,
      availableUnits: body.availableUnits,
      equityUnits: body.equityUnits,
      returnPercentage: body.returnPercentage,
      estimatedReturn: body.estimatedReturn,
      minHoldingPeriod: body.minHoldingPeriod, // Store only the value
      minHoldingPeriodUnit: body.minHoldingPeriodUnit, // Store unit separately
      resaleAllowed: body.resaleAllowed,
      image: body.image,
      createdAt: new Date(),
    });

    await packageData.save();

    return NextResponse.json({ message: "Rental Package created successfully!", data: packageData }, { status: 201 });

  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Error creating package" }, { status: 500 });
  }
}

// GET API - Fetch All Long-Term Industry Packages
export async function GET() {
  await dbConnect();

  try {
    const packages = await LongTermRental.find({});
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
  }
}
