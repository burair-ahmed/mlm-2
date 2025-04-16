// src/app/api/cron/update-profits/route.ts
import { NextRequest, NextResponse } from "next/server";
import updateRentalProfits from "../../../../../cron/updateRentalProfits";

export async function GET(_req: NextRequest) {
  try {
    await updateRentalProfits();
    return NextResponse.json({ message: "Profits updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
