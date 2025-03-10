"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const AdminEquityPackageForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "short-term",
    totalUnits: 0,
    availableUnits: 0,
    equityUnits: 0,
    duration: { value: 0, unit: "minutes" },
    returnType: "fixed",
    returnPercentage: 0,
    reinvestmentAllowed: false,
    exitPenalty: 0,
    minHoldingPeriod: 0,
    resaleAllowed: false,
    lifespan: 0,
    depreciationModel: "fixed",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleCheckboxChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleDurationChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      duration: {
        ...prev.duration,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized: No token found.");
      return;
    }

    try {
      const response = await fetch("/api/admin/create-equity-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create package");

      toast.success("Equity package created successfully!");
      setFormData({
        name: "",
        category: "short-term",
        totalUnits: 0,
        availableUnits: 0,
        equityUnits: 0,
        duration: { value: 0, unit: "minutes" },
        returnType: "fixed",
        returnPercentage: 0,
        reinvestmentAllowed: false,
        exitPenalty: 0,
        minHoldingPeriod: 0,
        resaleAllowed: false,
        lifespan: 0,
        depreciationModel: "fixed",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-10 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Equity Package</h2>
      <Separator className="mb-4" />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter Package Name" required />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-term">Short-Term</SelectItem>
                <SelectItem value="long-term">Long-Term</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Total Units</Label>
              <Input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleNumberChange} required />
            </div>
            <div>
              <Label>Available Units</Label>
              <Input type="number" name="availableUnits" value={formData.availableUnits} onChange={handleNumberChange} required />
            </div>
            <div>
              <Label>Equity Units</Label>
              <Input type="number" name="equityUnits" value={formData.equityUnits} onChange={handleNumberChange} required />
            </div>
          </div>

          <div>
            <Label>Duration</Label>
            <div className="flex gap-2">
              <Input type="number" value={formData.duration.value} onChange={(e) => handleDurationChange("value", Number(e.target.value))} className="w-24" />
              <Select value={formData.duration.unit} onValueChange={(value) => handleDurationChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Return Type</Label>
            <Select value={formData.returnType} onValueChange={(value) => setFormData({ ...formData, returnType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Return Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="performance-based">Performance-Based</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>

            {(formData.returnType === "fixed" || formData.returnType === "both") && (
            <div>
              <Label>Return Percentage (%)</Label>
              <Input type="number" name="returnPercentage" value={formData.returnPercentage} onChange={handleNumberChange} />
            </div>
          )}
          </div>

          

          <div>
            <Label>Exit Penalty</Label>
            <Input type="number" name="exitPenalty" value={formData.exitPenalty} onChange={handleNumberChange} />
          </div>

          <div>
            <Label>Minimum Holding Period</Label>
            <Input type="number" name="minHoldingPeriod" value={formData.minHoldingPeriod} onChange={handleNumberChange} />
          </div>

          <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2 space-x-2 flex items-center">
            <Checkbox checked={formData.resaleAllowed} onCheckedChange={() => handleCheckboxChange("resaleAllowed")} />
            <Label>Resale Allowed</Label>
          </div>
            <div className="col-span-2 space-x-2 flex items-center">
            <Checkbox checked={formData.reinvestmentAllowed} onCheckedChange={() => handleCheckboxChange("reinvestmentAllowed")} />
            <Label>Reinvestment Allowed</Label>
          </div>
          </div>

          <div>
            <Label>Lifespan</Label>
            <Input type="number" name="lifespan" value={formData.lifespan} onChange={handleNumberChange} />
          </div>

          <div>
            <Label>Depreciation Model</Label>
            <Select value={formData.depreciationModel} onValueChange={(value) => setFormData({ ...formData, depreciationModel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Depreciation Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="performance-based">Performance-Based</SelectItem>
                <SelectItem value="company-buyback">Company Buyback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Create Package
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminEquityPackageForm;