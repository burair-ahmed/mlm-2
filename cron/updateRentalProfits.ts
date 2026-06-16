import mongoose from "mongoose";
import dbConnect from "../lib/dbConnect";
import PurchasedPackage from "../models/PurchasedPackage";
import LongTermRental from "../models/LongTermRental";
import User from "../models/User";
import Transaction from "../models/Transaction";
import { differenceInMilliseconds } from "date-fns";

const getHoldingPeriodInMs = (value: number, unit: string) => {
  const unitMap: Record<string, number> = {
    second: 1000,
    seconds: 1000,
    minute: 60 * 1000,
    minutes: 60 * 1000,
    hour: 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
  };
  return value * (unitMap[unit.toLowerCase()] || 0);
};

export default async function handler() {
  await dbConnect();

  const packages = await PurchasedPackage.find({
    packageType: "long-term-rental",
  });

  for (const pkg of packages) {
    const rentalPackage = await LongTermRental.findById(pkg.packageId);
    if (!rentalPackage) {
      console.warn(`❌ Original LongTermRental package not found for ${pkg._id}`);
      continue;
    }

    const { value, unit } = rentalPackage.duration;
    const holdingPeriodMs = getHoldingPeriodInMs(value, unit);

    const lastProfitDate = pkg.lastProfitDate || pkg.purchaseDate;
    const now = new Date();
    const elapsedMs = differenceInMilliseconds(now, lastProfitDate);

    if (elapsedMs >= holdingPeriodMs) {
      const profitToAdd = (pkg.equityUnits * rentalPackage.returnPercentage) / 100;

      // Update package profit amount and date
      pkg.profitAmount += profitToAdd;
      pkg.lastProfitDate = now;

      // Credit the owner user's balance
      const ownerUser = await User.findById(pkg.userId);
      if (ownerUser) {
        ownerUser.balance += profitToAdd;
        await ownerUser.save();

        // Create transaction
        const profitTx = new Transaction({
          userId: ownerUser._id,
          amount: profitToAdd,
          type: "profit",
          description: `Automated rental payout of $${profitToAdd.toFixed(2)} for package: ${rentalPackage.name}`,
        });
        await profitTx.save();
        console.log(`✅ Profit balance and transaction credited to user ${ownerUser.email}`);
      }

      await pkg.save();
      console.log(`✅ Profit added to ${pkg._id}: ${profitToAdd}`);
    } else {
      console.log(`⏳ Not enough time for ${pkg._id}. Elapsed: ${elapsedMs}ms`);
    }
  }

  console.log("🚀 Cron job completed.");
}
