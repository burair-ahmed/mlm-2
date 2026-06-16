import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import { authenticate } from "../../../../../middleware/auth";
import { hasPermission } from "../../../../../lib/auth/permissionUtils";

// POST API - Create a New Long-Term Industry Package
export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'create_package');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    // console.log("Received Body:", body);

    // Validate input fields
    if (!body.name || !body.category || !body.totalUnits || !body.equityUnits || !body.minHoldingPeriod || !body.minHoldingPeriodUnit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ message: "Industry Package created successfully! (Mock Mode)", data: { ...body, _id: "mock-" + Date.now() } }, { status: 201 });
    }

    await dbConnect();

    // Create a new industry package
    const packageData = new LongTermIndustry({
      name: body.name,
      category: body.category,
      totalUnits: body.totalUnits,
      availableUnits: body.availableUnits,
      equityUnits: body.equityUnits,
      estimatedReturn: body.estimatedReturn,
      minHoldingPeriod: body.minHoldingPeriod, // Store only the value
      minHoldingPeriodUnit: body.minHoldingPeriodUnit, // Store unit separately
      buybackOption: body.buybackOption,
      resaleAllowed: body.resaleAllowed,
      image: body.image,
      createdAt: new Date(),
    });

    await packageData.save();

    return NextResponse.json({ message: "Industry Package created successfully!", data: packageData }, { status: 201 });

  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Error creating package" }, { status: 500 });
  }
}

// GET API - Fetch All Long-Term Industry Packages
export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      const mockIndustryPackages = [
        {
          _id: "mock-industry-pkg-1",
          name: "Solar Farm Infrastructure",
          category: "industrial-materials",
          totalUnits: 1500,
          availableUnits: 1200,
          equityUnits: 50,
          estimatedReturn: 18,
          minHoldingPeriod: 12,
          minHoldingPeriodUnit: "months",
          buybackOption: true,
          resaleAllowed: true,
          image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        },
        {
          _id: "mock-industry-pkg-2",
          name: "Automated Assembly Line",
          category: "automobiles",
          totalUnits: 800,
          availableUnits: 650,
          equityUnits: 120,
          estimatedReturn: 22,
          minHoldingPeriod: 18,
          minHoldingPeriodUnit: "months",
          buybackOption: false,
          resaleAllowed: true,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        }
      ];
      return NextResponse.json(mockIndustryPackages, { status: 200 });
    }

    await dbConnect();
    const packages = await LongTermIndustry.find({});
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
  }
}
