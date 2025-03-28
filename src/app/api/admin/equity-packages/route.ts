// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '../../../../../lib/dbConnect';
// import User from '../../../../../models/User';
// import EquityPackage from '../../../../../models/EquityPackage';
// import { authenticate } from '../../../../../middleware/auth';

// export async function GET(req: NextRequest) {
//   // Authenticate user
//   const auth = await authenticate(req);
//   if (auth instanceof NextResponse || !auth.isAdmin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   await dbConnect();
//   try {

//     // Fetch all equity packages
//     const equityPackages = await EquityPackage.find().lean();

//     // Fetch all users and their equity ownership
//     const users = await User.find({}, 'email equityOwnership')
//       .populate('equityOwnership.packageId', 'name equityUnits totalUnits')
//       .lean();

//     // Format packages with their owners
//     const formattedPackages = equityPackages.map((pkg) => {
//       // Get owners for this package
//       const owners = users
//         .filter((user) =>
//           Array.isArray(user.equityOwnership) &&
//           user.equityOwnership.some(
//             (ownership) => ownership.packageId?._id?.toString() === pkg._id.toString()
//           )
//         )
//         .map((user) => {
//           const userOwnership = user.equityOwnership.find(
//             (ownership) => ownership.packageId?._id?.toString() === pkg._id.toString()
//           );

//           if (!userOwnership || !userOwnership.units) return null;

//           return {
//             email: user.email,
//             unitsHeld: userOwnership.units,
//             holdingPercentage: `${((userOwnership.units / pkg.totalUnits) * 100).toFixed(2)}%`,
//             valueOfHolding: `$${(userOwnership.units * pkg.equityUnits).toFixed(2)}`,
//           };
//         })
//         .filter(Boolean); // Remove null values

//       return {
//         packageId: pkg._id.toString(),
//         name: pkg.name,
//         category: pkg.category,
//         totalUnits: pkg.totalUnits,
//         availableUnits: pkg.availableUnits,
//         equityUnits: pkg.equityUnits,
//         duration: pkg.category !== 'trading' ? pkg.duration : undefined,
//         returnType: pkg.category !== 'trading' ? pkg.returnType : undefined,
//         reinvestmentAllowed: pkg.category !== 'trading' ? pkg.reinvestmentAllowed : undefined,
//         exitPenalty: pkg.category !== 'trading' ? pkg.exitPenalty : undefined,
//         minHoldingPeriod: pkg.category === 'long-term' ? pkg.minHoldingPeriod : undefined,
//         resaleAllowed: pkg.resaleAllowed,
//         lifespan: pkg.category === 'trading' ? pkg.lifespan : undefined,
//         depreciationModel: pkg.category === 'trading' ? pkg.depreciationModel : undefined,
//         owners,
//       };
//     });

//     return NextResponse.json(formattedPackages);
//   } catch (error) {
//     console.error('Error fetching equity packages:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
