import { NextResponse, NextRequest } from "next/server"
import { authenticate } from "../../../../../middleware/auth"
import dbConnect from "../../../../../lib/dbConnect"
import User from "../../../../../models/User"

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const user = await authenticate(req)
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const foundUser = await User.findById(user._id).select("referrals")
    const referralCount = foundUser?.referrals.length || 0

    return NextResponse.json({
      success: true,
      referralCount,
    })
  } catch (error) {
    console.error("Failed to fetch referral count:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
