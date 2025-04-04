import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../../../../../middleware/auth";
import dbConnect from "../../../../../lib/dbConnect";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import LongTermRental from "../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../models/TradingPackage";
// import User from "../../../../../models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 🔒 Authenticate user
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Fetch purchased packages
    const purchasedPackages = await PurchasedPackage.find({ userId: user._id });

    if (!purchasedPackages.length) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch package details based on packageType
    const populatedPackages = await Promise.all(
      purchasedPackages.map(async (pkg) => {
        let packageDetails = null;

        switch (pkg.packageType) {
          case "long-term-rental":
            packageDetails = await LongTermRental.findById(pkg.packageId).lean();
            break;
          case "long-term-industry":
            packageDetails = await LongTermIndustry.findById(pkg.packageId).lean();
            break;
          case "trading":
            packageDetails = await TradingPackage.findById(pkg.packageId).lean();
            break;
          default:
            return null;
        }

        if (!packageDetails) return null;

        return {
          _id: pkg._id,
          name: packageDetails.name,
          category: packageDetails.category,
          quantity: pkg.quantity,
          equityUnits: pkg.equityUnits,

          // 🛠️ Optional fields with type checking
          estimatedReturn: "estimatedReturn" in packageDetails ? packageDetails.estimatedReturn : null,
          minHoldingPeriod: "minHoldingPeriod" in packageDetails ? packageDetails.minHoldingPeriod : null,
          minHoldingPeriodUnit: "minHoldingPeriodUnit" in packageDetails ? packageDetails.minHoldingPeriodUnit : "months",
          buybackOption: "buybackOption" in packageDetails ? packageDetails.buybackOption : false,
          resaleAllowed: "resaleAllowed" in packageDetails ? packageDetails.resaleAllowed : false,
        };
      })
    );

    // Remove null values from failed lookups
    const validPackages = populatedPackages.filter(Boolean);

    return NextResponse.json({ success: true, data: validPackages });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
