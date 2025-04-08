"use client";

import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";  // Assume card component exists

const AdminProfitUpdate = () => {
  const [purchasedPackages, setPurchasedPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [profitAmount, setProfitAmount] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch all purchased packages from the API
  const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      // setLoading(false);
      return;
    }
  useEffect(() => {
    const fetchPurchasedPackages = async () => {
      const response = await fetch("/api/admin/get-all-purchased-packages");
      if (!response.ok) {
        setError("Failed to fetch packages");
        return;
      }
      const data = await response.json();
      setPurchasedPackages(data.data);
    };

    fetchPurchasedPackages();
  }, []);

  // Handle the form submission to update the profit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        body: JSON.stringify({ packageId: selectedPackage._id, profitAmount }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to update profit");
      } else {
        setSuccessMessage("Profit updated successfully!");
        setError(null);
        setProfitAmount(""); // Reset profit amount
      }
    } catch (err) {
      setError("Something went wrong while updating profit.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Package Profit</h1>

      {error && (
        <Alert className="max-w-lg mx-auto">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert className="max-w-lg mx-auto">
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {purchasedPackages.map((pkg) => (
          <Card
            key={pkg._id}
            className="cursor-pointer"
            onClick={() => setSelectedPackage(pkg)}
          >
            <CardHeader>
              <h3>{pkg.name}</h3>
              <p>{pkg.category}</p>
            </CardHeader>
            <CardContent>
              <p>Click to view details and update profit</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPackage && (
        <Dialog open={!!selectedPackage} onOpenChange={(open) => open || setSelectedPackage(null)}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profit for {selectedPackage.name}</DialogTitle>
            </DialogHeader>

            {/* Displaying selected package details */}
            <div className="mb-4">
              <Label>Name:</Label>
              <p>{selectedPackage.name}</p>
            </div>
            <div className="mb-4">
              <Label>Category:</Label>
              <p>{selectedPackage.category}</p>
            </div>
            <div className="mb-4">
              <Label>Profit Amount:</Label>
              <Input
                id="profitAmount"
                type="number"
                value={profitAmount}
                onChange={(e) => setProfitAmount(Number(e.target.value))}
                className="w-full mt-1"
                min="0"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
              Update Profit
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProfitUpdate;
