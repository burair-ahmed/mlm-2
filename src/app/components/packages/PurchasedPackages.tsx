"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface PurchasedPackage {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  equityUnits: number;
  estimatedReturn?: number;
  minHoldingPeriod?: number;
  minHoldingPeriodUnit?: string;
  buybackOption?: boolean;
  resaleAllowed?: boolean;
}

const MyInvestments = () => {
  const [purchasedPackages, setPurchasedPackages] = useState<PurchasedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          {purchasedPackages.map((pkg) => (
            <Card key={pkg._id}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <p className="text-sm text-gray-500">{pkg.category}</p>
              </CardHeader>
              <CardContent>
                <p>Quantity: {pkg.quantity}</p>
                <p>Equity Units: {pkg.equityUnits}</p>
                {pkg.estimatedReturn !== undefined && <p>Estimated Return: {pkg.estimatedReturn}%</p>}
                {pkg.minHoldingPeriod && (
                  <p>
                    Min Holding: {pkg.minHoldingPeriod} {pkg.minHoldingPeriodUnit}
                  </p>
                )}
                <p>Buyback: {pkg.buybackOption ? "Yes" : "No"}</p>
                <p>Resale Allowed: {pkg.resaleAllowed ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInvestments;
