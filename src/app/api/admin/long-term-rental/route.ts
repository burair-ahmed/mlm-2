import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import LongTermRental from "../../../../../models/LongTermRental";
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
      return NextResponse.json({ message: "Rental Package created successfully! (Mock Mode)", data: { ...body, _id: "mock-" + Date.now() } }, { status: 201 });
    }

    await dbConnect();

    // Create a new industry package
    const packageData = new LongTermRental({
      name: body.name,
      category: body.category,
      totalUnits: body.totalUnits,
      availableUnits: body.availableUnits,
      equityUnits: body.equityUnits,
      returnPercentage: body.returnPercentage,
      estimatedReturn: body.estimatedReturn,
      duration: {
        value: body.duration?.value,
        unit: body.duration?.unit,
      },
      minHoldingPeriod: body.minHoldingPeriod,
      minHoldingPeriodUnit: body.minHoldingPeriodUnit,
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
  try {
    if (!process.env.MONGODB_URI) {
      const mockRentalPackages = [
        {
          _id: "mock-rental-pkg-1",
          name: "Warehouse Lease A",
          category: "industrial-materials",
          totalUnits: 100,
          availableUnits: 75,
          equityUnits: 100,
          returnPercentage: 12,
          minHoldingPeriod: 3,
          minHoldingPeriodUnit: "months",
          duration: {
            value: 12,
            unit: "months"
          },
          resaleAllowed: true,
          image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        },
        {
          _id: "mock-rental-pkg-2",
          name: "Commercial Storefront B",
          category: "general",
          totalUnits: 50,
          availableUnits: 42,
          equityUnits: 250,
          returnPercentage: 15,
          minHoldingPeriod: 6,
          minHoldingPeriodUnit: "months",
          duration: {
            value: 24,
            unit: "months"
          },
          resaleAllowed: false,
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        }
      ];
      return NextResponse.json(mockRentalPackages, { status: 200 });
    }

    await dbConnect();
    const packages = await LongTermRental.find({});
    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
  }
}
