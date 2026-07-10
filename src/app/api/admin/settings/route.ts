import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "../../../../../lib/dbConnect";
import { authenticate } from "../../../../../middleware/auth";
import SystemSettings from "../../../../../models/SystemSettings";
import { logAdminAction } from "../../../../../lib/db/auditLog";

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    // Only Super Admin can modify system settings
    if (auth.role !== 'Super Admin') {
      return NextResponse.json({ error: 'Forbidden. Super Admin access required.' }, { status: 403 });
    }

    const { equityUnitPrice } = await req.json();

    if (typeof equityUnitPrice !== 'number' || equityUnitPrice <= 0) {
      return NextResponse.json({ error: 'Invalid equity unit price. Must be a positive number.' }, { status: 400 });
    }

    await dbConnect();

    // Update or insert setting
    const setting = await SystemSettings.findOneAndUpdate(
      { key: 'equityUnitPrice' },
      { value: equityUnitPrice, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    if (!setting) {
      throw new Error('Failed to update setting');
    }

    // Record audit log
    await logAdminAction({
      adminId: auth._id as string,
      action: 'update_system_settings',
      targetId: setting._id as Types.ObjectId,
      targetModel: 'SystemSettings',
      details: `Updated equityUnitPrice to $${equityUnitPrice.toFixed(2)}`
    });

    return NextResponse.json({ success: true, message: 'Settings updated successfully.', data: setting });

  } catch (err) {
    console.error("Error in POST /api/admin/settings:", err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to update settings" }, { status: 500 });
  }
}
