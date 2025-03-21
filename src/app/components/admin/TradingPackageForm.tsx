import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TradingPackageFormData {
  name: string;
  category: "poultry" | "dairy" | "cattle" | "fruits-vegetables" | "automobiles" | "grocery" | "general";
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  duration: number;
  estimatedReturnPercentage: number;
  reinvestment: boolean;
  depreciationModel: "performance-based" | "company-buyback";
  depreciationPercentage: number;
  marketValuation: number;
  buybackOption: boolean;
  packageDurationValue: number;
  packageDurationUnit: "seconds" | "minutes" | "days";
  dailyInsights: boolean;
}

const TradingPackageForm = () => {
  const { register, handleSubmit, reset, control } = useForm<TradingPackageFormData>({
    defaultValues: {
      category: "poultry",
      dailyInsights: false,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TradingPackageFormData) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        totalUnits: Number(data.totalUnits),
        availableUnits: Number(data.availableUnits),
        equityUnits: Number(data.equityUnits),
        duration: Number(data.duration),
        estimatedReturnPercentage: Number(data.estimatedReturnPercentage),
        depreciationPercentage: Number(data.depreciationPercentage),
        marketValuation: Number(data.marketValuation),
        packageDuration: {
          value: Number(data.packageDurationValue),
          unit: data.packageDurationUnit || "days",
        },
      };

      const response = await fetch("/api/admin/trading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to save package");

      alert("Package created successfully!");
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error creating package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Package Name</Label>
          <Input {...register("name", { required: true })} placeholder="Enter Package Name" required />
        </div>

        <div>
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poultry">Poultry</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="cattle">Cattle</SelectItem>
                  <SelectItem value="fruits-vegetables">Fruits & Vegetables</SelectItem>
                  <SelectItem value="automobiles">Automobiles</SelectItem>
                  <SelectItem value="grocery">Grocery</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Total Units</Label>
            <Input type="number" {...register("totalUnits", { required: true })} required />
          </div>
          <div>
            <Label>Available Units</Label>
            <Input type="number" {...register("availableUnits", { required: true })} required />
          </div>
          <div>
            <Label>Equity Units</Label>
            <Input type="number" {...register("equityUnits", { required: true })} required />
          </div>
        </div>

        <div>
          <Label>Estimated Return (%)</Label>
          <Input type="number" {...register("estimatedReturnPercentage", { required: true })} placeholder="Enter estimated return %" required />
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="dailyInsights"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Daily Insights</Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Package"}
        </Button>
      </form>
    </div>
  );
};

export default TradingPackageForm;
