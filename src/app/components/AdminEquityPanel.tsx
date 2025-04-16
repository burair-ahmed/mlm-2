"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Owner {
  email: string;
  unitsHeld: number;
  holdingPercentage: string;
  valueOfHolding: string;
}

interface EquityPackage {
  packageId: string;
  name: string;
  category: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  owners: Owner[];
}

export default function AdminEquityPanel() {
  const [packages, setPackages] = useState<EquityPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    async function fetchPackages() {
      try {
        const response = await fetch("/api/admin/equity-packages", {
          method: "GET",
          credentials: "include", // Ensures session cookies/tokens are sent
          headers: { Authorization: `Bearer ${token}` },

        });


        if (!response.ok) throw new Error("Failed to fetch equity packages");

        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Equity Packages</h1>
      {packages.length === 0 ? (
        <p>No equity packages available.</p>
      ) : (
        packages.map((pkg) => (
          <Card key={pkg.packageId} className="mb-6">
            <CardContent>
              <h2 className="text-xl font-semibold">{pkg.name} ({pkg.category})</h2>
              <p>Total Units: {pkg.totalUnits}</p>
              <p>Available Units: {pkg.availableUnits}</p>
              <p>Equity Value per Unit: ${pkg.equityUnits}</p>

              <h3 className="mt-4 font-semibold">Owners:</h3>
              {pkg.owners.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Units Held</TableHead>
                      <TableHead>Holding %</TableHead>
                      <TableHead>Value ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pkg.owners.map((owner, index) => (
                      <TableRow key={index}>
                        <TableCell>{owner.email}</TableCell>
                        <TableCell>{owner.unitsHeld}</TableCell>
                        <TableCell>{owner.holdingPercentage}</TableCell>
                        <TableCell>{owner.valueOfHolding}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No owners yet.</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
