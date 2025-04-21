import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../../../../../middleware/auth";
import dbConnect from "../../../../../lib/dbConnect";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import LongTermRental from "../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../models/TradingPackage";
import User from "../../../../../models/User"; // ✅ Import the User model

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch user details including withdrawnProfit
    const userDetails = await User.findById(user._id).lean();

    if (!userDetails) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const purchasedPackages = await PurchasedPackage.find({ userId: user._id });

    const longTermRentalPackages = [];
    const longTermIndustryPackages = [];
    const tradingPackages = [];

    for (const pkg of purchasedPackages) {
      let details = null;
      const commonFields = {
        _id: pkg._id,
        quantity: pkg.quantity,
        equityUnits: pkg.equityUnits,
      };

      switch (pkg.packageType) {
        case "long-term-rental":
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
              purchaseDate: pkg.purchaseDate,
              profitAmount: pkg.profitAmount,
            });
          }
          break;
        case "long-term-industry":
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
              purchaseDate: pkg.purchaseDate,
              profitAmount: pkg.profitAmount,
            });
          }
          break;
        case "trading":
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
              purchaseDate: pkg.purchaseDate,
              profitAmount: pkg.profitAmount,
            });
          }
          break;
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
      user: {
        // _id: userDetails._id,
        // name: userDetails.name,
        // email: userDetails.email,
        // withdrawnProfit: userDetails.withdrawnProfit ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
