"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { 
  CustomDialog, 
  CustomDialogHeader, 
  CustomDialogTitle, 
  CustomDialogFooter 
} from "@/components/custom/CustomDialog";

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

export default function RentalPackage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [kycStatus, setKycStatus] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const kycRes = await fetch("/api/users/kyc/kyc-status", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const kycData = await kycRes.json();
          if (kycRes.ok) setKycStatus(kycData.kycStatus);
        } catch (error) {
          console.error("Error fetching KYC status:", error);
        }
      }

      try {
        const pkgRes = await fetch("/api/admin/long-term-rental");
        const pkgData = await pkgRes.json();
        if (Array.isArray(pkgData)) {
          setPackages(pkgData);
        } else {
          console.error("Error fetching rental packages: response is not an array:", pkgData);
          setPackages([]);
        }
      } catch (error) {
        console.error("Error fetching rental packages:", error);
        setPackages([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [token]);

  const handlePurchase = async () => {
    if (!selectedPackage || !token) return;

    if (kycStatus !== "approved") {
      toast.warning("Please complete and get your KYC approved first.");
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
          packageType: "long-term-rental",
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
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid of Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isFetching ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-96 rounded-3xl border border-white/5 bg-white/5 animate-pulse" />
          ))
        ) : packages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No active rental packages available at this time.
          </div>
        ) : (
          packages.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => {
                setSelectedPackage(pkg);
                setQuantity(1);
              }}
              className="group cursor-pointer rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/60 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-2xl relative"
            >
              {/* Image Banner */}
              <div className="relative w-full h-48 overflow-hidden bg-slate-950/20">
                <Image
                  src={pkg.image || "/default-package.jpg"}
                  fill
                  alt={pkg.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  Rental Yield
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider text-glow-gold">
                    {pkg.category}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors duration-300">
                    {pkg.name}
                  </h3>
                </div>

                {/* Return Details */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">Equity Cost</p>
                    <p className="text-base font-bold text-foreground">{pkg.equityUnits} Units</p>
                  </div>
                  <div className="space-y-0.5 pl-4 border-l border-white/5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">Monthly Yield</p>
                    <p className="text-base font-bold text-primary text-glow-emerald">+{pkg.returnPercentage}%</p>
                  
                                                          <p className="text-[7px] font-medium text-muted-foreground uppercase">Approx</p>
</div>
                </div>

                {/* Footer details */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Available: {pkg.availableUnits} / {pkg.totalUnits} Units</span>
                  <span>Duration: {pkg.duration?.value ?? 'N/A'} {pkg.duration?.unit ?? ''}</span>
                </div>

                {/* Invest Now trigger button */}
                <button
                  className="w-full py-3 bg-gradient-to-r from-primary to-emerald-600 text-white hover:opacity-90 font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-primary/10 group-hover:scale-[1.02]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackage(pkg);
                    setQuantity(1);
                  }}
                >
                  Invest Now
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Package Purchase dialog */}
      <CustomDialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        {selectedPackage && (
          <div className="space-y-6">
            <CustomDialogHeader>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">{selectedPackage.category}</span>
              <CustomDialogTitle className="text-2xl mt-1">{selectedPackage.name}</CustomDialogTitle>
            </CustomDialogHeader>

            {/* Content Details */}
            <div className="space-y-5">
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/5">
                <Image
                  src={selectedPackage.image || "/default-package.jpg"}
                  alt={selectedPackage.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Equity Cost</p>
                  <p className="text-sm font-bold text-foreground">{selectedPackage.equityUnits} Units / Qty</p>
                </div>
                <div className="space-y-1 border-l border-white/5 pl-4">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Estimated Return</p>
                  <p className="text-sm font-bold text-primary">+{selectedPackage.returnPercentage}% / Mo</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-white/5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Minimum Holding</p>
                  <p className="text-sm font-bold text-foreground">
                    {selectedPackage.minHoldingPeriod} {selectedPackage.minHoldingPeriodUnit}
                  </p>
                </div>
                <div className="space-y-1 pt-2 border-t border-white/5 border-l pl-4">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Lease Term</p>
                  <p className="text-sm font-bold text-foreground">
                    {selectedPackage.duration?.value ?? 'N/A'} {selectedPackage.duration?.unit ?? ''}
                  </p>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Select Quantity (Units to buy)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    min={1}
                    max={selectedPackage.availableUnits}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">
                    Total: {selectedPackage.equityUnits * quantity} Equity Units
                  </span>
                </div>
              </div>
            </div>

            <CustomDialogFooter>
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-full sm:w-auto px-5 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm Purchase"}
              </button>
            </CustomDialogFooter>
          </div>
        )}
      </CustomDialog>
    </div>
  );
}
