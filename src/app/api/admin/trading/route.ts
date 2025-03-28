import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import TradingPackage from "../../../../../models/TradingPackage";

// Connect to DB before handling requests
dbConnect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // console.log("Recieved Body:", body)
    if (
      !body.name || !body.totalUnits || !body.availableUnits || !body.equityUnits || !body.returnPercentage 
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const packageData = await TradingPackage.create(body);
    return NextResponse.json(packageData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating package" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const packages = await TradingPackage.find({});
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
  }
}
