"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Discriminated union type for proper field display based on package type
type CommonFields = {
  _id: string;
  type: "long-term-rental" | "long-term-industry" | "trading";
  name: string;
  category: string;
  quantity: number;
  equityUnits: number;
  minHoldingPeriod?: number;
  minHoldingPeriodUnit?: string;
  purchaseDate: string;
};

type LongTermRentalPackage = CommonFields & {
  type: "long-term-rental";
  returnPercentage: number;
  resaleAllowed: boolean;
};

type LongTermIndustryPackage = CommonFields & {
  type: "long-term-industry";
  estimatedReturn: number;
  buybackOption: boolean;
  resaleAllowed: boolean;
  profitAmount: number;
};

type TradingPackage = CommonFields & {
  type: "trading";
  returnPercentage: number;
  profitEstimation: string;
  dailyInsights: string;
  profitAmount: number;
};

type PurchasedPackage =
  | LongTermRentalPackage
  | LongTermIndustryPackage
  | TradingPackage;

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

const formatTimeLeft = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const MyInvestments = () => {
  const [purchasedPackages, setPurchasedPackages] = useState<
    PurchasedPackage[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const fetchPurchasedPackages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/transactions/my-investments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.data)) {
          setPurchasedPackages(data.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedPackages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Alert className="max-w-lg mx-auto">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      ) : purchasedPackages.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No investments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchasedPackages.map((pkg) => {
            const purchaseTime = new Date(pkg.purchaseDate).getTime();
            const holdingMs = getHoldingPeriodInMs(
              pkg.minHoldingPeriod || 0,
              pkg.minHoldingPeriodUnit || "day"
            );
            const timeElapsed = currentTime - purchaseTime;
            const isEligibleToSell = timeElapsed >= holdingMs;
            const remainingTime = holdingMs - timeElapsed;
let profitAmount = 0
            return (
              <Card key={pkg._id}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <p className="text-sm text-gray-500">{pkg.category}</p>
                </CardHeader>
                <CardContent>
                  <p>Quantity: {pkg.quantity}</p>
                  <p>Equity Units: {pkg.equityUnits}</p>

                  {pkg.minHoldingPeriod && (
                    <p>
                      Min Holding: {pkg.minHoldingPeriod}{" "}
                      {pkg.minHoldingPeriodUnit}
                    </p>
                  )}

                  {pkg.type === "long-term-rental" && (
                    <>
                      <p>Return %: {pkg.returnPercentage}</p>
                      <p>Resale Allowed: {pkg.resaleAllowed ? "Yes" : "No"}</p>
                    </>
                  )}

                  {pkg.type === "long-term-industry" && (
                    <>
                      <p>Estimated Return: {pkg.estimatedReturn}%</p>
                      <p>Buyback: {pkg.buybackOption ? "Yes" : "No"}</p>
                      <p>Resale Allowed: {pkg.resaleAllowed ? "Yes" : "No"}</p>
                      <p>Profit: {pkg.profitAmount || 0} Equity Units</p>
                    </>
                  )}

                  {pkg.type === "trading" && (
                    <>
                      <p>Return %: {pkg.returnPercentage}</p>
                      <p>Profit Estimation: {pkg.profitEstimation}</p>
                      <p>Daily Insights: {pkg.dailyInsights}</p>
                      <p>Profit: {pkg.profitAmount || 0} Equity Units</p>
                    </>
                  )}
            <div className="grid grid-cols-12 gap-2 mt-4">
  <div className="col-span-6 flex items-center">
    {pkg.type === "long-term-industry" || pkg.type === "trading" ? (
      <Button
        disabled={!pkg.profitAmount}
        className={`w-full ${
          pkg.profitAmount
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Withdraw Profit
      </Button>
    ) : (
      <Button disabled className="w-full bg-gray-400 cursor-not-allowed">
        Withdraw Profit
      </Button>
    )}
  </div>
  <div className="col-span-6">
    <Button
      disabled={!isEligibleToSell}
      className={`px-4 py-2 rounded text-white w-full ${
        isEligibleToSell
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {isEligibleToSell
        ? "Request to Sell"
        : `Locked (${formatTimeLeft(remainingTime)})`}
    </Button>
  </div>
</div>


                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInvestments;
