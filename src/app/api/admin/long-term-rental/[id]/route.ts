// import { NextResponse } from "next/server";
// import dbConnect from "../../../../../../lib/dbConnect";
// import LongTermRental from "../../../../../../models/LongTermRental";

// // GET Request (Fetch a single Long-Term Rental Package)
// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const { id } = params;

//   try {
//     const packageData = await LongTermRental.findById(id);
//     if (!packageData) return NextResponse.json({ error: "Package not found" }, { status: 404 });
//     return NextResponse.json(packageData);
//   } catch {
//     return NextResponse.json({ error: "Error fetching package" }, { status: 500 });
//   }
// }

// // PUT Request (Update a Long-Term Rental Package)
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const { id } = params;
//   const data = await req.json();

//   try {
//     const updatedPackage = await LongTermRental.findByIdAndUpdate(id, data, { new: true });
//     return NextResponse.json(updatedPackage);
//   } catch {
//     return NextResponse.json({ error: "Error updating package" }, { status: 400 });
//   }
// }

// // DELETE Request (Delete a Long-Term Rental Package)
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const { id } = params;

//   try {
//     await LongTermRental.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Package deleted" });
//   } catch {
//     return NextResponse.json({ error: "Error deleting package" }, { status: 500 });
//   }
// }
export {};