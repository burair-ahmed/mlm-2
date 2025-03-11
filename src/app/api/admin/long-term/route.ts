import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import LongTermPackage from "../../../../../models/LongTermPackage";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    console.log("Received Body:", body);
    const packageData = await LongTermPackage.create(body);
    return NextResponse.json(packageData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating package" }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const packages = await LongTermPackage.find({});
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
  }
}
