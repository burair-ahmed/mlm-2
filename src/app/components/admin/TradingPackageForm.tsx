import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TradingPackageFormData {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  lifespan: number;
  depreciationModel: "fixed" | "performance-based" | "company-buyback";
  returnType: "fixed" | "performance-based";
  returnPercentage: number;
  depreciationPercentage: number;
  packageDurationValue: number;
  packageDurationUnit: "seconds" | "minutes" | "days";
}

const TradingPackageForm = () => {
  const { register, handleSubmit, reset, control } = useForm<TradingPackageFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TradingPackageFormData) => {
    setLoading(true);
    try {
      const formattedData = {
        name: data.name,
        totalUnits: Number(data.totalUnits),
        availableUnits: Number(data.availableUnits),
        equityUnits: Number(data.equityUnits),
        lifespan: Number(data.lifespan),
        returnType: data.returnType,
        returnPercentage: Number(data.returnPercentage),
        depreciationModel: data.depreciationModel,
        depreciationPercentage: Number(data.depreciationPercentage),
        packageDuration: {
          value: Number(data.packageDurationValue),
          unit: data.packageDurationUnit || "days", // Ensuring unit is always included
        },
      };

      console.log("Sending data:", formattedData); // Debugging log

      const response = await fetch("/api/admin/trading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to save package");

      alert("Package created successfully!");
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert((error as Error).message || "Error creating package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">Package Name</Label>
          <Input id="name" {...register("name", { required: true })} placeholder="Enter Package Name" required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="totalUnits">Total Units</Label>
            <Input id="totalUnits" type="number" {...register("totalUnits", { required: true })} required />
          </div>
          <div>
            <Label htmlFor="availableUnits">Available Units</Label>
            <Input id="availableUnits" type="number" {...register("availableUnits", { required: true })} required />
          </div>
          <div>
            <Label htmlFor="equityUnits">Equity Units</Label>
            <Input id="equityUnits" type="number" {...register("equityUnits", { required: true })} required />
          </div>
        </div>

        <div>
          <Label htmlFor="lifespan">Lifespan (Years)</Label>
          <Input id="lifespan" type="number" {...register("lifespan", { required: true })} required />
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <Label htmlFor="returnType">Return Type</Label>
            <Controller
              control={control}
              name="returnType"
              defaultValue="fixed"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Return Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="performance-based">Performance-Based</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="col-span-8">
            <Label htmlFor="returnPercentage">Return Percentage</Label>
            <Input id="returnPercentage" type="number" step="0.01" {...register("returnPercentage", { required: true })} required />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <Label htmlFor="depreciationPercentage">Depreciation Percentage</Label>
            <Input id="depreciationPercentage" type="number" step="0.01" {...register("depreciationPercentage", { required: true })} required />
          </div>
          <div className="col-span-8">
            <Label htmlFor="depreciationModel">Depreciation Model</Label>
            <Controller
              control={control}
              name="depreciationModel"
              defaultValue="fixed"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="performance-based">Performance-Based</SelectItem>
                    <SelectItem value="company-buyback">Company Buyback</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div>
          <Label>Package Duration</Label>
          <div className="flex gap-2">
            <Input type="number" {...register("packageDurationValue", { required: true })} className="w-24" required />
            <Controller
              control={control}
              name="packageDurationUnit"
              defaultValue="days"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Package"}
        </Button>
      </form>
    </div>
  );
};

export default TradingPackageForm;
