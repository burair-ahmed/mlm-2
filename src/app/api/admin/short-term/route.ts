// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "../../../../../lib/dbConnect";
// import ShortTermPackage from "../../../../../models/ShortTermPackage";

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     console.log("Received Data:", body);

//     if (!body.name || !body.totalUnits || !body.availableUnits || !body.equityUnits || !body.returnType || !body.duration.unit) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     body.totalUnits = Number(body.totalUnits);
//     body.availableUnits = Number(body.availableUnits);
//     body.equityUnits = Number(body.equityUnits);
//     body.returnPercentage = Number(body.returnPercentage);
//     body.exitPenalty = body.exitPenalty ? Number(body.exitPenalty) : undefined;
//     body.reinvestmentAllowed = Boolean(body.reinvestmentAllowed);

    
//     const packageData = await ShortTermPackage.create(body);
//     return NextResponse.json(packageData, { status: 201 });
//   } catch (error) {
//     console.error("Error creating package:", error);
//     return NextResponse.json({ error: "Error creating package" }, { status: 400 } );
    
//   }
// }

// export async function GET() {
//   await dbConnect();
//   try {
//     const packages = await ShortTermPackage.find({});
//     return NextResponse.json(packages, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Error fetching packages" }, { status: 500 });
//   }
// }
export {};