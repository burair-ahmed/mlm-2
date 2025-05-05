"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [kycStatus, setKycStatus] = useState<string>("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
      // Always fetch packages
      fetch("/api/admin/long-term-industry")
        .then((res) => res.json())
        .then((data) => setPackages(data))
        .catch((error) => console.error("Error fetching packages:", error))
        .finally(() => setIsFetching(false));
    
      // Only fetch KYC if logged in
      if (token) {
        const fetchKycStatus = async () => {
          try {
            const response = await fetch("/api/users/kyc/kyc-status", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            if (response.ok) {
              setKycStatus(data.kycStatus);
            } else {
              console.error("Error fetching KYC status:", data.error);
            }
          } catch (error) {
            console.error("Error fetching KYC status:", error);
          }
        };
    
        fetchKycStatus();
      }
    }, [token]);
    
    
    const handlePurchase = async () => {
      if (!token) {
        toast.warning("Please log in to make a purchase.");
        return;
      }
    
      if (!selectedPackage) return;
    
      if (kycStatus !== "approved") {
        toast.warning("Your KYC is not approved. Please complete your KYC to make a purchase.");
        return;
      }
    
      setLoading(true);
    
      try {
        const response = await fetch("/api/transactions/purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            packageId: selectedPackage._id,
            quantity,
            packageType: "long-term-industry",
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
          setQuantity(1);
        }
      } catch (error) {
        console.error("Purchase error:", error);
        toast.error("Error purchasing package");
      } finally {
        setLoading(false);
      }
    };
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 sm:p-6">
      {isFetching
        ? [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-60 rounded-lg" />
          ))
        : packages.map((pkg) => (
            <Card
              key={pkg._id}
              className="transition rounded-md overflow-hidden flex flex-col"
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={pkg.image}
                    fill
                    alt={pkg.name}
                    className="cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                    onClick={() => setSelectedPackage(pkg)}
                  />
                </div>
                <div className="px-4 py-2">
                  <CardTitle
                    className="text-lg font-bold cursor-pointer hover:text-[#00ab82] transition-all duration-300"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {pkg.name}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-600 text-sm">Equity Units</div>
                      <div className="font-bold text-black text-[16px]">
                        {pkg.equityUnits}{" "}
                        <span className="text-xs">Per unit</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      Invest Now
                    </Button>
                  </div>

                  <hr />

                  <div className="flex justify-between items-center text-sm">
                    <p className="font-bold text-[#ff3342]">
                      {pkg.availableUnits} Units Available
                    </p>
                    <p className="font-semibold">
                      Min Holding: {pkg.minHoldingPeriod}{" "}
                      {pkg.minHoldingPeriodUnit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

      {/* Dialog for Package Details */}
      {selectedPackage && (
        <Dialog
          open={!!selectedPackage}
          onOpenChange={() => setSelectedPackage(null)}
        >
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                {selectedPackage.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="w-full h-48 relative overflow-hidden rounded-md">
                <Image
                  src={selectedPackage.image}
                  fill
                  alt={selectedPackage.name}
                  className="object-cover"
                />
              </div>

              <div className="text-sm space-y-1">
                <p><strong>Category:</strong> {selectedPackage.category}</p>
                <p><strong>Equity Units:</strong> {selectedPackage.equityUnits}</p>
                <p><strong>Estimated Return:</strong> {selectedPackage.estimatedReturn}%</p>
                <p><strong>Available Units:</strong> {selectedPackage.availableUnits}</p>
                <p><strong>Min Holding:</strong> {selectedPackage.minHoldingPeriod} {selectedPackage.minHoldingPeriodUnit}</p>
                <p><strong>Buyback:</strong> {selectedPackage.buybackOption ? "Yes" : "No"}</p>
                <p><strong>Resale Allowed:</strong> {selectedPackage.resaleAllowed ? "Yes" : "No"}</p>
              </div>

              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min={1}
                max={selectedPackage.availableUnits}
                className="my-2"
              />
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedPackage(null)}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={loading}
                className="w-1/2"
              >
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
