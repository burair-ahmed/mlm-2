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

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ ...body, _id: "mock-" + Date.now() }, { status: 201 });
    }

    const packageData = await TradingPackage.create(body);
    return NextResponse.json(packageData, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json({ error: "Error creating package" }, { status: 400 });
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      const mockTradingPackages = [
        {
          _id: "mock-trading-pkg-1",
          name: "Poultry Standard Yield",
          category: "poultry",
          totalUnits: 1000,
          availableUnits: 850,
          equityUnits: 10,
          dailyInsights: true,
          profitEstimation: "market-based",
          returnPercentage: 15,
          minHoldingPeriod: 5,
          minHoldingPeriodUnit: "minutes",
          image: "https://images.unsplash.com/photo-1548550022-cbf418b71155?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        },
        {
          _id: "mock-trading-pkg-2",
          name: "Dairy High Yield",
          category: "dairy",
          totalUnits: 500,
          availableUnits: 320,
          equityUnits: 25,
          dailyInsights: true,
          profitEstimation: "market-based",
          returnPercentage: 22,
          minHoldingPeriod: 3,
          minHoldingPeriodUnit: "months",
          image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        },
        {
          _id: "mock-trading-pkg-3",
          name: "Cattle Premium Yield",
          category: "cattle",
          totalUnits: 200,
          availableUnits: 120,
          equityUnits: 50,
          dailyInsights: true,
          profitEstimation: "market-based",
          returnPercentage: 30,
          minHoldingPeriod: 6,
          minHoldingPeriodUnit: "months",
          image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80",
          createdAt: new Date(),
        }
      ];
      return NextResponse.json(mockTradingPackages, { status: 200 });
    }

    const packages = await TradingPackage.find({});
    return NextResponse.json(packages, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
  }
}
