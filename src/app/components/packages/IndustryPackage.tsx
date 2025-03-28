"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Package {
  _id: string;
  name: string;
  category: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  estimatedReturn: number;
  minHoldingPeriod: number;
  minHoldingPeriodUnit: string;
  buybackOption: boolean;
  resaleAllowed: boolean;
  image: string;
}

const IndustryPackage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("/api/admin/long-term-industry")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((error) => console.error("Error fetching packages:", error))
      .finally(() => setIsFetching(false));
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setLoading(true);

    try {
      const response = await fetch("/api/transactions/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          quantity,
          packageType: "long-term-industry",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Purchase failed");
      } else {
        alert("Purchase successful!");
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg._id === selectedPackage._id
              ? { ...pkg, availableUnits: pkg.availableUnits - quantity }
              : pkg
          )
        );
        setSelectedPackage(null);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Error purchasing package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {isFetching
        ? [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-60 rounded-lg" />
          ))
        : packages.map((pkg) => (
            <Card key={pkg._id} className="cursor-pointer hover:shadow-xl transition rounded-t-md" onClick={() => setSelectedPackage(pkg)}>
              <CardHeader className="flex flex-col items-center p-0">
                <Image src={pkg.image} width={100} height={100} alt="" className="rounded-t-md w-[100%]" />
                <CardTitle className="text-center text-lg font-bold">{pkg.name}</CardTitle>
                {/* <p className="text-sm text-gray-500">{pkg.category}</p> */}
              </CardHeader>
              <CardContent>
                
              </CardContent>
            </Card>
            
          ))}

      {/* Dialog for Package Details */}
      {selectedPackage && (
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>{selectedPackage.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Image src={selectedPackage.image} width={250} height={150} alt="" className="rounded-md mx-auto" />
              <p>Equity Units: {selectedPackage.equityUnits}</p>
              <p>Estimated Return: {selectedPackage.estimatedReturn}%</p>
              <p>Available Units: {selectedPackage.availableUnits}</p>
              <p>Min Holding: {selectedPackage.minHoldingPeriod} {selectedPackage.minHoldingPeriodUnit}</p>
              <p>Buyback: {selectedPackage.buybackOption ? "Yes" : "No"}</p>
              <p>Resale Allowed: {selectedPackage.resaleAllowed ? "Yes" : "No"}</p>
            </div>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min={1}
              max={selectedPackage.availableUnits}
              className="my-2"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPackage(null)}>Cancel</Button>
              <Button onClick={handlePurchase} disabled={loading}>
                {loading ? "Processing..." : "Buy Now"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IndustryPackage;