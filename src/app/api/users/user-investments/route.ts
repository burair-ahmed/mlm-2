import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Investment from "../../../../../models/Investment";
import ShortTermPackage from "../../../../../models/ShortTermPackage";
import LongTermPackage from "../../../../../models/LongTermPackage";
import TradingPackage from "../../../../../models/TradingPackage";
import { authenticate } from "../../../../../middleware/auth"; // Ensure auth middleware is correctly used
import User from '../../../../../models/User';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {

     const auth = await authenticate(req);
 
    if (auth instanceof NextResponse) return auth;

   

      const user = await User.findById(auth._id)
            if (!user) {
              throw new Error('User not found');
            }
    const userId = req.headers.get("user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("Fetching investments for user:", userId);

    // Fetch user investments
    const investments = await Investment.find({ userId });

    if (!investments.length) {
      return NextResponse.json({ message: "No investments found" }, { status: 404 });
    }

    // Fetch package details for each investment
    const investmentDetails = await Promise.allSettled(
      investments.map(async (inv) => {
        let packageData = null;

        try {
          if (inv.packageType === "short-term") {
            packageData = await ShortTermPackage.findById(inv.packageId);
          } else if (inv.packageType === "long-term") {
            packageData = await LongTermPackage.findById(inv.packageId);
          } else if (inv.packageType === "trading") {
            packageData = await TradingPackage.findById(inv.packageId);
          }
        } catch (err) {
          console.error(`Error fetching package (${inv.packageType}):`, err);
        }

        return {
          packageName: packageData?.name || "Unknown Package",
          equityUnits: inv.equityUnits,
          expectedReturn: inv.expectedReturn,
          purchaseDate: inv.purchaseDate,
        };
      })
    );

    // Filter out failed results
    const validInvestments = investmentDetails
      .filter((result) => result.status === "fulfilled")
      .map((result: any) => result.value);

    return NextResponse.json(validInvestments);
  } catch (error) {
    console.error("Error fetching user investments:", error);
    return NextResponse.json({ error: "Server error, please try again" }, { status: 500 });
  }
}
