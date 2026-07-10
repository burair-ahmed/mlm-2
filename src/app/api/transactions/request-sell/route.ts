import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../../../../../middleware/auth";
import dbConnect from "../../../../../lib/dbConnect";
import { createNotification } from "../../../../../lib/notifications";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import LongTermRental from "../../../../../models/LongTermRental";
import LongTermIndustry from "../../../../../models/LongTermIndustry";
import TradingPackage from "../../../../../models/TradingPackage";

const getHoldingPeriodInMs = (value: number, unit: string) => {
  const unitMap: Record<string, number> = {
    second: 1000,
    seconds: 1000,
    minute: 60 * 1000,
    minutes: 60 * 1000,
    hour: 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
  };
  return value * (unitMap[unit.toLowerCase()] || 0);
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (user instanceof NextResponse) return user;
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { purchasedPackageId } = await req.json();
    if (!purchasedPackageId) {
      return NextResponse.json({ success: false, message: "Purchased Package ID is required" }, { status: 400 });
    }

    const purchasedPackage = await PurchasedPackage.findById(purchasedPackageId);
    if (!purchasedPackage) {
      return NextResponse.json({ success: false, message: "Purchased package not found" }, { status: 404 });
    }

    if (purchasedPackage.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You do not own this package" }, { status: 403 });
    }

    if (purchasedPackage.status && purchasedPackage.status !== "active") {
      return NextResponse.json({ success: false, message: `Cannot sell a package that is currently ${purchasedPackage.status}` }, { status: 400 });
    }

    if (purchasedPackage.profitAmount > 0) {
      return NextResponse.json({ success: false, message: "Please withdraw your accrued yields/profits before requesting resale." }, { status: 400 });
    }

    // Determine holding period eligibility
    let minHoldingPeriod = 0;
    let minHoldingPeriodUnit = "days";

    switch (purchasedPackage.packageType) {
      case "long-term-rental":
        const rental = await LongTermRental.findById(purchasedPackage.packageId).lean();
        if (rental) {
          minHoldingPeriod = rental.minHoldingPeriod || 0;
          minHoldingPeriodUnit = rental.minHoldingPeriodUnit || "months";
        }
        break;
      case "long-term-industry":
        const industry = await LongTermIndustry.findById(purchasedPackage.packageId).lean();
        if (industry) {
          minHoldingPeriod = industry.minHoldingPeriod || 0;
          minHoldingPeriodUnit = industry.minHoldingPeriodUnit || "months";
        }
        break;
      case "trading":
        const trading = await TradingPackage.findById(purchasedPackage.packageId).lean();
        if (trading) {
          minHoldingPeriod = trading.minHoldingPeriod || 0;
          minHoldingPeriodUnit = trading.minHoldingPeriodUnit || "days";
        }
        break;
    }

    const purchaseTime = new Date(purchasedPackage.purchaseDate).getTime();
    const holdingMs = getHoldingPeriodInMs(minHoldingPeriod, minHoldingPeriodUnit);
    const timeElapsed = Date.now() - purchaseTime;

    if (timeElapsed < holdingMs) {
      return NextResponse.json({ success: false, message: "Minimum holding lock period has not expired yet" }, { status: 400 });
    }

    // Set status to sell-requested
    purchasedPackage.status = "sell-requested";
    await purchasedPackage.save();

    // Trigger notification to the user
    await createNotification(user._id, {
      title: 'Resale Request Submitted',
      message: `Your request to resell ${purchasedPackage.quantity} unit(s) of your package has been submitted and is pending review.`,
      type: 'resale',
      link: '/user?tab=Active+Packages'
    });

    return NextResponse.json({ success: true, message: "Resale request submitted successfully", data: purchasedPackage });
  } catch (error) {
    console.error("Error submitting resale request:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
