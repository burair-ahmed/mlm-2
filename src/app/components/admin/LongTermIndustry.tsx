import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


interface LongTermIndustryFormData {
    name: string;
    category: "property" | "cottage-industry" | "processing-plant" | "restaurant" | "banquet";
    totalUnits: number;
    availableUnits: number;
    equityUnits: number;
    estimatedReturn: number; 
    minHoldingPeriod: number;
    minHoldingPeriodUnit: "seconds" | "minutes" | "months" | "years";
    // marketValuation: number;
    buybackOption: boolean;
    resaleAllowed: boolean;
  }


  const LongTermIndustryForm = () => {
    const { register, handleSubmit, reset } = useForm<LongTermIndustryFormData>();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<LongTermIndustryFormData["category"]>("property");
    // const [durationUnit, setDurationUnit] = useState<LongTermIndustryFormData["durationUnit"]>("months");
    const [buybackOption, setBuybackOption] = useState(false);
    const [resaleAllowed, setResaleAllowed] = useState(false);
    const [minHoldingPeriodUnit, setMinHoldingPeriodUnit] = useState<LongTermIndustryFormData["minHoldingPeriodUnit"]>("months");
  
    
    const onSubmit = async (data: LongTermIndustryFormData) => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/long-term-industry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            category: category,
            totalUnits: Number(data.totalUnits),
            availableUnits: Number(data.availableUnits),
            equityUnits: Number(data.equityUnits),
            estimatedReturn: Number(data.estimatedReturn),
            minHoldingPeriod: Number(data.minHoldingPeriod), // Send as a number
        minHoldingPeriodUnit, // Send separately      
            buybackOption,
            resaleAllowed,
          }),
        });
  
        if (!response.ok) throw new Error("Failed to save industry package");
  
        alert("Industry Package created successfully!");
        reset();
      } catch (error) {
        console.error(error);
        alert("Error creating industry package");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Label>Package Name</Label>
        <Input {...register("name", { required: true })} placeholder="Enter Package Name" required />
  
        <Label>Category</Label>
        <Select onValueChange={(value) => setCategory(value as LongTermIndustryFormData["category"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="property">Property</SelectItem>
            <SelectItem value="cottage-industry">Cottage Industry</SelectItem>
            <SelectItem value="processing-plant">Processing Plant</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="banquet">Banquet</SelectItem>
          </SelectContent>
        </Select>
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
          <Label>Min Holding Period</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input type="number" {...register("minHoldingPeriod", { required: true })} required />
          <Select onValueChange={(value) => setMinHoldingPeriodUnit(value as LongTermIndustryFormData["minHoldingPeriodUnit"])}>
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
  
        <Label>Estimated Return (%)</Label>
        <Input type="number" step="0.01" {...register("estimatedReturn", { required: true })} placeholder="Enter Estimated Return %" required />
  
        {/* <Label>Market Valuation ($)</Label> */}
        {/* <Input type="number" {...register("marketValuation", { required: true })} placeholder="Enter Market Valuation" required /> */}
  
        <Checkbox checked={buybackOption} onCheckedChange={(checked) => setBuybackOption(Boolean(checked))} />
        <Label>Buyback Option</Label>
  
        <Checkbox checked={resaleAllowed} onCheckedChange={(checked) => setResaleAllowed(Boolean(checked))} />
        <Label>Resale Allowed</Label>
  
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Industry Package"}
        </Button>
      </form>
    );
  };

  export default LongTermIndustryForm;