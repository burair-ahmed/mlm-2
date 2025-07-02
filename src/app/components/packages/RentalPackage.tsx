"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import Tilt from "react-parallax-tilt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Package {
  _id: string;
  name: string;
  category: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  returnPercentage: number;
  minHoldingPeriod: number;
  minHoldingPeriodUnit: string;
  duration: { value: number; unit: "months" | "years" };
  resaleAllowed: boolean;
  image: string;
}

const RentalPackage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [kycStatus, setKycStatus] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const kycRes = await fetch("/api/users/kyc/kyc-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const kycData = await kycRes.json();
        setKycStatus(kycData.kycStatus);
      }

      const pkgRes = await fetch("/api/admin/long-term-rental");
      const pkgData = await pkgRes.json();
      setPackages(pkgData);
      setIsFetching(false);
    };

    fetchData();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage || !token) return;
    if (kycStatus !== "approved") {
      toast.warning("Please complete your KYC first.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/transactions/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        packageId: selectedPackage._id,
        quantity,
        packageType: "long-term-rental",
      }),
    });

    const data = await response.json();
    if (!response.ok) toast.error(data.error || "Purchase failed");
    else {
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

    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-[#93785b]">
      {isFetching
        ? [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-60 rounded-xl" />
          ))
        : packages.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Tilt glareEnable glareMaxOpacity={0.3} scale={1.02}>
                <div
                  className="bg-white/20 backdrop-blur-lg border border-[#ac896840] shadow-2xl rounded-2xl overflow-hidden transition duration-300 hover:scale-[1.02] hover:shadow-[#ac896890]"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={pkg.image}
                      fill
                      alt={pkg.name}
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 space-y-2 text-[#3e362e]">
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-sm text-[#a69080]">
                      {pkg.category} · {pkg.availableUnits} units left
                    </p>
                    <p className="text-md font-medium">
                      Equity: {pkg.equityUnits} | Return:{" "}
                      <span className="text-[#865d36] font-semibold">
                        {pkg.returnPercentage}%
                      </span>
                    </p>
                    <Button
                      className="w-full mt-2 bg-gradient-to-r from-[#865d36] to-[#ac8968] text-white hover:from-[#3e362e] hover:to-[#865d36] rounded-full shadow"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      Invest Now
                    </Button>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}

      {selectedPackage && (
        <Dialog open onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="bg-white/90 backdrop-blur-md text-[#3e362e] rounded-xl max-w-md shadow-xl border border-[#ac896840]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#865d36] font-bold">
                {selectedPackage.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Image
                src={selectedPackage.image}
                alt="image"
                width={600}
                height={300}
                className="rounded-md w-full h-48 object-cover"
              />
              <p>
                <strong>Category:</strong> {selectedPackage.category}
              </p>
              <p>
                <strong>Return:</strong> {selectedPackage.returnPercentage}%
              </p>
              <p>
                <strong>Equity:</strong> {selectedPackage.equityUnits}
              </p>
              <p>
                <strong>Holding:</strong> {selectedPackage.minHoldingPeriod}{" "}
                {selectedPackage.minHoldingPeriodUnit}
              </p>
              <p>
                <strong>Duration:</strong> {selectedPackage.duration.value}{" "}
                {selectedPackage.duration.unit}
              </p>
              <p>
                <strong>Available Units:</strong>{" "}
                {selectedPackage.availableUnits}
              </p>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={selectedPackage.availableUnits}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedPackage(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={loading}
                className="bg-gradient-to-r from-[#865d36] to-[#3e362e] text-white hover:scale-105"
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

export default RentalPackage;
