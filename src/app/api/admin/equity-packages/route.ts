import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import EquityPackage from '../../../../../models/EquityPackage';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Fetch all equity packages
    const equityPackages = await EquityPackage.find().lean();

    // Fetch users and populate their equity ownership
    const users = await User.find({}, 'email equityOwnership')
      .populate('equityOwnership.packageId', 'name equityUnits')
      .lean();

    // Format packages with their owners
    const formattedPackages = equityPackages.map((pkg) => {
      // Get all owners for this package
      const owners = users
        .filter((user) =>
          Array.isArray(user.equityOwnership) &&
          user.equityOwnership.some(
            (ownership) => ownership.packageId?._id?.toString() === pkg._id.toString()
          )
        )
        .map((user) => {
          const userOwnership = user.equityOwnership.find(
            (ownership) => ownership.packageId?._id?.toString() === pkg._id.toString()
          );

          if (!userOwnership || !userOwnership.units) return null;

          return {
            email: user.email,
            unitsHeld: userOwnership.units,
            holdingPercentage: `${((userOwnership.units / pkg.totalUnits) * 100).toFixed(2)}%`,
            valueOfHolding: `$${(userOwnership.units * pkg.equityUnits).toFixed(2)}`,
          };
        })
        .filter(Boolean); // Remove null values

      return {
        packageId: pkg._id.toString(),
        name: pkg.name,
        totalUnits: pkg.totalUnits,
        availableUnits: pkg.availableUnits,
        equityUnits: pkg.equityUnits,
        owners,
      };
    });

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error('Error fetching equity packages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
