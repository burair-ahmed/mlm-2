"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";

interface Package {
  _id: string;
  name: string;
  category: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  dailyInsights: boolean;
  profitEstimation: 'market-based';
  returnPercentage: number; 
  minHoldingPeriod: number; 
  minHoldingPeriodUnit: string;
  createdAt: Date;
  image: string; 
}

const TradingPackage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [kycStatus, setKycStatus] = useState<string>("");
  
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {

    const fetchKycStatus = async () => {
      try {
        const response = await fetch("/api/users/kyc/kyc-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setKycStatus(data.kycStatus); // Store the KYC status (e.g., 'approved', 'pending', etc.)
        } else {
          console.error("Error fetching KYC status:", data.error);
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    fetchKycStatus();

    fetch("/api/admin/trading")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((error) => console.error("Error fetching packages:", error))
      .finally(() => setIsFetching(false));
  }, [token]);

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    if (kycStatus !== "approved") {
      toast.warning("Your KYC is not approved. Please complete your KYC to make a purchase.");
    }

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
          packageType: "trading",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Purchase failed");
      } else {
        toast.success("Purchase successful!");
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
      toast.error("Error purchasing package");
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
            <Card
                          key={pkg._id}
                          className="transition rounded-t-md overflow-hidden"
                        >
                          <CardHeader className="flex flex-col bg-[] p-0">
                            {/* <div className="relative w-full h-0 pb-[100%]"> */}
                          <div className="relative w-full h-48 overflow-hidden">
                                          <Image
                                            src={pkg.image}
                                            fill
                                            alt={pkg.name}
                                            className="cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                                            onClick={() => setSelectedPackage(pkg)}
                                          />
                                        </div>
                            {/* </div> */}
                            <div className="bg-">
                              <CardTitle
                                className="text-lg font-bold cursor-pointer hover:text-[#00ab82] transition-all duration-300 px-6"
                                onClick={() => setSelectedPackage(pkg)}
                              >
                                {pkg.name}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                         <div className="space-y-4 mt-6">
                         <div className="grid grid-cols-12">
                              <div className="col-span-6">
                                <div className="grid row">Equity Units</div>
                                <div className="grid row">
                                  <div className="flex items-center gap-2">
                                    <p className="text-black font-bold text-[16px]">
                                      {pkg.equityUnits}{" "}
                                      <span className="text-[12px]">Per unit</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-6 flex items-center justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedPackage(pkg)}
                                >
                                  Invest Now
                                </Button>
                              </div>
                            </div>
            
                            <hr />
                            <div className="grid grid-cols-12">
                              <div className="col-span-6">
                                <p className="font-bold text-[#ff3342]">
                                  {pkg.availableUnits} Units Available
                                </p>
                              </div>
                              <div className="col-span-6 text-right">
                                <p className="font-semibold">
                                  Minimum Holding: {pkg.minHoldingPeriod}{" "}
                                  {pkg.minHoldingPeriodUnit}
                                </p>
                              </div>
                            </div>
                         </div>
            
                            {/* Content here */}
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
              <Image src={selectedPackage.image} width={250} height={150} alt="" className="rounded-md w-[100%]" />
              <p>Equity Units: {selectedPackage.category}</p>
              <p>Equity Units: {selectedPackage.equityUnits}</p>
              <p>Estimated Return: {selectedPackage.returnPercentage}%</p>
              <p>Total Units: {selectedPackage.totalUnits}</p>
              
              <p>Available Units: {selectedPackage.availableUnits}</p>
              <p>Min Holding: {selectedPackage.minHoldingPeriod} {selectedPackage.minHoldingPeriodUnit}</p>
              {/* <p>Buyback: {selectedPackage.buybackOption ? "Yes" : "No"}</p> */}
              {/* <p>Resale Allowed: {selectedPackage.resaleAllowed ? "Yes" : "No"}</p> */}
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

export default TradingPackage;