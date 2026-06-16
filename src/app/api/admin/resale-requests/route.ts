import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import LongTermRental from "../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../models/TradingPackage";

import { authenticate } from "../../../../../middleware/auth";
import { hasPermission } from "../../../../../lib/auth/permissionUtils";

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = (auth.isAdmin || auth.role === 'admin' || auth.role === 'Super Admin') ||
    (await hasPermission(auth, "manage_purchased_packages")) ||
    (await hasPermission(auth, "handle_resales"));
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.MONGODB_URI) {
    const mockResaleRequests = [
      {
        _id: "mock-purchased-1",
        type: "trading",
        name: "Poultry Standard Yield",
        category: "poultry",
        quantity: 2,
        equityUnits: 10,
        purchaseDate: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        status: "sell-requested",
        user: {
          _id: "60d0fe4f5311236168a109ca",
          name: "Mock User",
          email: "user@example.com",
        },
      }
    ];
    return NextResponse.json({
      success: true,
      data: mockResaleRequests,
    });
  }

  try {
    await dbConnect();

    // Fetch all purchased packages with populated user fields
    const purchasedPackages = await PurchasedPackage.find({ status: "sell-requested" }).populate({
      path: "userId",
      select: "email fullName userName",
    });

    const longTermRentalPackages = [];
    const longTermIndustryPackages = [];
    const tradingPackages = [];

    for (const pkg of purchasedPackages) {
      let details = null;

      const commonFields = {
        _id: pkg._id,
        quantity: pkg.quantity,
        equityUnits: pkg.equityUnits,
        purchaseDate: pkg.purchaseDate,
        profitAmount: pkg.profitAmount || 0,
        lastProfitDate: pkg.lastProfitDate || null,
        status: pkg.status,
        user: {
          _id: pkg.userId?._id,
          name: pkg.userId?.fullName || pkg.userId?.userName || "User",
          email: pkg.userId?.email,
        },
      };

      switch (pkg.packageType) {
        case "long-term-rental": {
          details = await LongTermRental.findById(pkg.packageId).lean();
          if (details) {
            longTermRentalPackages.push({
              ...commonFields,
              name: details.name,
              category: details.category,
              returnPercentage: details.returnPercentage,
              minHoldingPeriod: details.minHoldingPeriod,
              minHoldingPeriodUnit: details.minHoldingPeriodUnit,
              resaleAllowed: details.resaleAllowed,
              image: details.image,
            });
          }
          break;
        }

        case "long-term-industry": {
          details = await LongTermIndustry.findById(pkg.packageId).lean();
          if (details) {
            longTermIndustryPackages.push({
              ...commonFields,
              name: details.name,
              category: details.category,
              estimatedReturn: details.estimatedReturn,
              minHoldingPeriod: details.minHoldingPeriod,
              minHoldingPeriodUnit: details.minHoldingPeriodUnit,
              buybackOption: details.buybackOption,
              resaleAllowed: details.resaleAllowed,
              image: details.image,
            });
          }
          break;
        }

        case "trading": {
          details = await TradingPackage.findById(pkg.packageId).lean();
          if (details) {
            tradingPackages.push({
              ...commonFields,
              name: details.name,
              category: details.category,
              returnPercentage: details.returnPercentage,
              minHoldingPeriod: details.minHoldingPeriod,
              minHoldingPeriodUnit: details.minHoldingPeriodUnit,
              profitEstimation: details.profitEstimation,
              dailyInsights: details.dailyInsights,
              image: details.image,
            });
          }
          break;
        }
      }
    }

    const allPackages = [
      ...longTermRentalPackages.map(pkg => ({ ...pkg, type: "long-term-rental" })),
      ...longTermIndustryPackages.map(pkg => ({ ...pkg, type: "long-term-industry" })),
      ...tradingPackages.map(pkg => ({ ...pkg, type: "trading" })),
    ];

    return NextResponse.json({
      success: true,
      data: allPackages,
    });

  } catch (error) {
    console.error("Error fetching resale requests:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
