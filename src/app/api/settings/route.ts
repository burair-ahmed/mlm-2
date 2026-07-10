import { NextResponse } from "next/server";
import { getEquityUnitPrice } from "../../../../lib/settings";

export async function GET() {
  try {
    const price = await getEquityUnitPrice();
    return NextResponse.json({ success: true, equityUnitPrice: price });
  } catch (err) {
    console.error("Error in GET /api/settings:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch settings", equityUnitPrice: 10 }, { status: 500 });
  }
}
