// /api/user/kyc-status.ts
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../../models/User";
import { authenticate } from "../../../../../../middleware/auth";

export async function GET(req: NextRequest) {
  try {
    // Authenticate User
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    // Fetch User and KYC Status
    const user = await User.findById(auth._id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ kycStatus: user.kyc.status });
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
