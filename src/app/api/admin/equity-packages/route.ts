import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User, { IUser } from '../../../../../models/User';
import EquityPackage, { IEquityPackage } from '../../../../../models/EquityPackage';
import { authenticate } from '../../../../../middleware/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Fetch all equity packages
    const equityPackages: IEquityPackage[] = await EquityPackage.find().lean();

    // Fetch users and their equity ownership
    const users = (await User.find({}, 'email equityOwnership')
      .populate('equityOwnership.packageId', 'name equityUnits')
      .lean()) as unknown as IUser[];

    // Format packages with their owners
    const formattedPackages = equityPackages
      .map((pkg) => {
        if (!pkg._id || typeof pkg._id !== 'object') return null;

        // Convert `_id` safely
        const packageIdStr = pkg._id instanceof mongoose.Types.ObjectId
          ? pkg._id.toString()
          : String(pkg._id);

        // Get all owners for this package
        const owners = users
          .filter((user) =>
            Array.isArray(user.equityOwnership) &&
            user.equityOwnership.some(
              (ownership) =>
                ownership.packageId &&
                typeof ownership.packageId === 'object' &&
                (ownership.packageId instanceof mongoose.Types.ObjectId
                  ? ownership.packageId.toString()
                  : String(ownership.packageId)) === packageIdStr
            )
          )
          .map((user) => {
            const userOwnership = user.equityOwnership.find(
              (ownership) =>
                ownership.packageId &&
                typeof ownership.packageId === 'object' &&
                (ownership.packageId instanceof mongoose.Types.ObjectId
                  ? ownership.packageId.toString()
                  : String(ownership.packageId)) === packageIdStr
            );

            if (!userOwnership || !userOwnership.units) return null;

            const holdingPercentage = (
              (userOwnership.units / pkg.totalUnits) *
              100
            ).toFixed(2);

            return {
              email: user.email,
              unitsHeld: userOwnership.units,
              holdingPercentage: `${holdingPercentage}%`,
              valueOfHolding: `$${(userOwnership.units * pkg.equityUnits).toFixed(
                2
              )}`,
            };
          })
          .filter(Boolean);

        return {
          packageId: packageIdStr,
          name: pkg.name,
          totalUnits: pkg.totalUnits,
          availableUnits: pkg.availableUnits,
          equityUnits: pkg.equityUnits,
          owners,
        };
      })
      .filter(Boolean);

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error('Error fetching equity packages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
