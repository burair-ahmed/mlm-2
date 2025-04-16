// import { NextRequest, NextResponse } from 'next/server';
// import User from '../../../../../models/User';
// import dbConnect from '../../../../../lib/dbConnect';
// import { authenticate } from '../../../../../middleware/auth';

// export async function GET(req: NextRequest) {
//   const auth = await authenticate(req);
//   if (auth instanceof NextResponse || !auth.isAdmin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   await dbConnect();

//   const url = new URL(req.url);
//   const packageId = url.searchParams.get('packageId'); // Get packageId if provided

//   try {
//     const query = packageId
//       ? { 'equityOwnership.packageId': packageId }
//       : {}; // If packageId is present, filter users

//     const users = await User.find(query, 'email equityOwnership')
//       .populate('equityOwnership.packageId', 'name equityUnits')
//       .lean();

//     return NextResponse.json(users);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Error fetching equity data' },
//       { status: 500 }
//     );
//   }
// }
export {};