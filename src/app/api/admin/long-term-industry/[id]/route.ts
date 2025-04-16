// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "../../../../../../lib/dbConnect";
// import LongTermIndustry from "../../../../../../models/LongTermIndustry";

// // GET Request (Fetch a single Long-Term Package)
// export async function GET(req: NextRequest) {
//   const { id } = req.nextUrl.pathname.split("/").pop() || ""; // Extract ID from the URL

//   await dbConnect();

//   try {
//     const packageData = await LongTermIndustry.findById(id);
//     if (!packageData) return NextResponse.json({ error: "Package not found" }, { status: 404 });
//     return NextResponse.json(packageData);
//   } catch {
//     return NextResponse.json({ error: "Error fetching package" }, { status: 500 });
//   }
// }

// // PUT Request (Update a Long-Term Package)
// export async function PUT(req: NextRequest) {
//   const { id } = req.nextUrl.pathname.split("/").pop() || ""; // Extract ID from the URL
//   const data = await req.json();

//   await dbConnect();

//   try {
//     const updatedPackage = await LongTermIndustry.findByIdAndUpdate(id, data, { new: true });
//     return NextResponse.json(updatedPackage);
//   } catch {
//     return NextResponse.json({ error: "Error updating package" }, { status: 400 });
//   }
// }

// // DELETE Request (Delete a Long-Term Package)
// export async function DELETE(req: NextRequest) {
//   const { id } = req.nextUrl.pathname.split("/").pop() || ""; // Extract ID from the URL

//   await dbConnect();

//   try {
//     await LongTermIndustry.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Package deleted" });
//   } catch {
//     return NextResponse.json({ error: "Error deleting package" }, { status: 500 });
//   }
// }
export {};