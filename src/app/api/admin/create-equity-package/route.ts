// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "../../../../../lib/dbConnect";
// import EquityPackage from "../../../../../models/EquityPackage";
// import { authenticate } from "../../../../../middleware/auth";

// export async function POST(req: NextRequest) {
//   await dbConnect();

//   try {
//     const body = await req.json();
//     console.log("Received Body:", body); 
//     // Authenticate admin user
//     const auth = await authenticate(req);
//     if (!auth || !auth.isAdmin) {
//       return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
//     }

//     const {
//       name,
//       category,
//       totalUnits,
//       availableUnits,
//       equityUnits,
//       duration,
//       returnType,
//       reinvestmentAllowed,
//       exitPenalty,
//       minHoldingPeriod,
//       resaleAllowed,
//       lifespan,
//       depreciationModel,
//     } = body;

//     // Validate required fields
//     if (!name || !category || !totalUnits || !availableUnits || !equityUnits) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     // Create new equity package
//     const newPackage = new EquityPackage({
//       name,
//       category,
//       totalUnits,
//       availableUnits,
//       equityUnits,
//       duration,
//       returnType,
//       reinvestmentAllowed,
//       exitPenalty,
//       minHoldingPeriod,
//       resaleAllowed,
//       lifespan,
//       depreciationModel,
//     });

//     await newPackage.save();
//     return NextResponse.json({ message: "Equity package created successfully", package: newPackage }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating equity package:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
