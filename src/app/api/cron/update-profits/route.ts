// src/app/api/cron/update-profits/route.ts
import { NextRequest, NextResponse } from "next/server";
import updateRentalProfits from "../../../../../cron/updateRentalProfits";

export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret');
  if (!process.env.CRON_SECRET || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await updateRentalProfits();
    return NextResponse.json({ message: "Profits updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
