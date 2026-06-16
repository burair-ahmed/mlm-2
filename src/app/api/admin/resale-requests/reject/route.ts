import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/dbConnect";
import PurchasedPackage from "../../../../../../models/PurchasedPackage";

import { authenticate } from "../../../../../../middleware/auth";
import { hasPermission } from "../../../../../../lib/auth/permissionUtils";

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    const allowed = (auth.isAdmin || auth.role === 'admin' || auth.role === 'Super Admin') ||
      (await hasPermission(auth, "manage_purchased_packages")) ||
      (await hasPermission(auth, "handle_resales"));
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { purchasedPackageId } = await req.json();
    if (!purchasedPackageId) {
      return NextResponse.json({ success: false, message: "Purchased Package ID is required" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        message: "Resale request rejected successfully (Mock Mode)",
      });
    }

    await dbConnect();

    const purchasedPackage = await PurchasedPackage.findById(purchasedPackageId);
    if (!purchasedPackage) {
      return NextResponse.json({ success: false, message: "Purchased package not found" }, { status: 404 });
    }

    if (purchasedPackage.status !== "sell-requested") {
      return NextResponse.json({ success: false, message: `Package is not in 'sell-requested' status. Current status: ${purchasedPackage.status || "active"}` }, { status: 400 });
    }

    // Revert status to active
    purchasedPackage.status = "active";
    await purchasedPackage.save();

    return NextResponse.json({ success: true, message: "Resale request rejected. Package is active again." });
  } catch (error) {
    console.error("Error rejecting resale request:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
