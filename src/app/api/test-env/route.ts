import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    MONGODB_URI: process.env.MONGODB_URI || "not_defined_at_all"
  });
}
