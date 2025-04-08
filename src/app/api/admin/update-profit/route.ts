import { NextRequest, NextResponse } from "next/server";
import PurchasedPackage from "../../../../../models/PurchasedPackage";
import { authenticate } from "../../../../../middleware/auth";

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { packageId, profitAmount } = await req.json();

  if (!packageId || profitAmount === undefined) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const purchased = await PurchasedPackage.findById(packageId);

  if (!purchased) {
    return NextResponse.json({ success: false, message: "Purchased package not found" }, { status: 404 });
  }

  if (purchased.packageType === "long-term-rental") {
    return NextResponse.json({
      success: false,
      message: "Profit for rental packages is fixed and cannot be manually updated.",
    }, { status: 403 });
  }

  purchased.profitAmount = profitAmount;
  await purchased.save();

  return NextResponse.json({ success: true, data: purchased });
}
