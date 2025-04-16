"use client";

import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

// Define types for package data
interface Package {
  _id: string;
  name: string;
  category: string;
  user?: {
    email: string;
  };
}

const AdminProfitUpdate = () => {
  const [purchasedPackages, setPurchasedPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [profitAmount, setProfitAmount] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch packages
  useEffect(() => {
    const fetchPurchasedPackages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch("/api/admin/get-all-purchased-packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to fetch packages");
        return;
      }

      const data = await response.json();
      setPurchasedPackages(data.data);
      console.log(data.data);
    };

    fetchPurchasedPackages();
  }, []);

  // Handle profit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!selectedPackage || profitAmount === "") {
      setError("Please select a package and enter a profit amount.");
      return;
    }

    try {
      const response = await fetch("/api/admin/update-profit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          profitAmount,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to update profit");
      } else {
        setSuccessMessage("Profit updated successfully!");
        setError(null);
        setProfitAmount("");
      }
    } catch (error) {
      setError("Something went wrong while updating profit.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Package Profit</h1>

      {error && (
        <Alert className="max-w-lg mx-auto mb-4">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert className="max-w-lg mx-auto mb-4">
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {purchasedPackages.map((pkg) => (
          <Card
            key={pkg._id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedPackage(pkg)}
          >
            <CardHeader>
              <h3 className="font-semibold text-lg">{pkg.name}</h3>
              <p className="text-sm text-gray-500">{pkg.category}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Email:</strong> {pkg.user?.email || "N/A"}</p>
              <p className="text-blue-600 underline mt-2">Click to update profit</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPackage && (
        <Dialog
          open={!!selectedPackage}
          onOpenChange={(open) => {
            if (!open) setSelectedPackage(null);
          }}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Update Profit for {selectedPackage.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 text-sm mb-4">
              <div>
                <Label>Name:</Label>
                <p>{selectedPackage.name}</p>
              </div>
              <div>
                <Label>Category:</Label>
                <p>{selectedPackage.category}</p>
              </div>
              <div>
                <Label>Email:</Label>
                <p>{selectedPackage.user?.email || "N/A"}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="profitAmount">Profit Amount:</Label>
                <Input
                  id="profitAmount"
                  type="number"
                  value={profitAmount}
                  onChange={(e) =>
                    setProfitAmount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full mt-1"
                  min="0"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Update Profit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProfitUpdate;
