import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ITradingPackage {
    name: string;
    category: 'poultry' | 'dairy' | 'cattle' | 'fruits-vegetables' | 'automobiles' | 'grocery' | 'general' | 'industrial-materials' | 'catering' | 'restaurant-goods';
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

const TradingPackageForm = () => {
  const { register, handleSubmit, reset, control } = useForm<TradingPackageFormData>({
    defaultValues: {
      category: "poultry",
      dailyInsights: false,
    },
  });

  const [loading, setLoading] = useState(false);
const [minHoldingPeriodUnit, setMinHoldingPeriodUnit] = useState<TradingPackageFormData["minHoldingPeriodUnit"]>("days");
const [image, setImage] = useState<string>("");


const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }
};

  const onSubmit = async (data: TradingPackageFormData) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        totalUnits: Number(data.totalUnits),
        availableUnits: Number(data.availableUnits),
        equityUnits: Number(data.equityUnits),
        profitEstimation: "market-based", 
        returnPercentage: Number(data.returnPercentage),
        minHoldingPeriod: Number(data.minHoldingPeriod),
        minHoldingPeriodUnit, 
        image,
      };

      const response = await fetch("/api/admin/trading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to save package");

      alert("Package created successfully!");
      reset();
      setImage(""); 
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
       <Label>Upload Image</Label>
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={image} alt="Preview" className="w-32 h-32 mt-2 rounded-lg" />}
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
                  <SelectItem value="catering">catering</SelectItem>
                  <SelectItem value="restaurant-goods">restaurant-goods</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
  <Label>Min Holding Period</Label>
      <div className="grid grid-cols-2 gap-4">
        <Input type="number" {...register("minHoldingPeriod", { required: true })} required />
        <Select onValueChange={(value) => setMinHoldingPeriodUnit(value as TradingPackageFormData["minHoldingPeriodUnit"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="months">Months</SelectItem>
            <SelectItem value="years">Years</SelectItem>
          </SelectContent>
        </Select>
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
          <Input type="number" {...register("returnPercentage", { required: true })} placeholder="Enter estimated return %" required />
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
