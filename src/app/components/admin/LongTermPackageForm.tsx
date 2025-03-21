import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface LongTermRentalFormData {
  name: string;
  category: "industrial-shed" | "yard" | 'transport';
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  durationValue: number;
  durationUnit: "months" | "years";
  returnPercentage: number; 
  minHoldingPeriod: number;
  minHoldingPeriodUnit: "seconds" | "minutes" | "months" | "years";
  resaleAllowed: boolean;
}

interface LongTermIndustryFormData {
  name: string;
  category: "property" | "cottage-industry" | "processing-plant";
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  durationValue: number;
  durationUnit: "months" | "years";
  estimatedReturn: number; 
  minHoldingPeriod: number;
  minHoldingPeriodUnit: "seconds" | "minutes" | "months" | "years";
  // marketValuation: number;
  buybackOption: boolean;
  resaleAllowed: boolean;
}

const LongTermForms = () => {
  const [tab, setTab] = useState<"rental" | "industry">("rental");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rental" onValueChange={(val) => setTab(val as "rental" | "industry")}>
        <TabsList className="w-full">
          <TabsTrigger value="rental">Long-Term Rental</TabsTrigger>
          <TabsTrigger value="industry">Long-Term Industry</TabsTrigger>
        </TabsList>

        <TabsContent value="rental">
          <LongTermRentalForm />
        </TabsContent>
        <TabsContent value="industry">
          <LongTermIndustryForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ------------------- Long-Term Rental Form -------------------
const LongTermRentalForm = () => {
  const { register, handleSubmit, reset } = useForm<LongTermRentalFormData>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<LongTermRentalFormData["category"]>("industrial-shed");
  const [durationUnit, setDurationUnit] = useState<LongTermRentalFormData["durationUnit"]>("months");
  const [resaleAllowed, setResaleAllowed] = useState(false);
  const [minHoldingPeriodUnit, setMinHoldingPeriodUnit] = useState<LongTermRentalFormData["minHoldingPeriodUnit"]>("months");

  const onSubmit = async (data: LongTermRentalFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/long-term-rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          category,
          duration: { value: Number(data.durationValue), unit: durationUnit },
          resaleAllowed,
        }),
      });

      if (!response.ok) throw new Error("Failed to save rental package");

      alert("Rental Package created successfully!");
      reset();
    } catch (error) {
      console.error(error);
      alert("Error creating rental package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     <div>
     <div>
     <Label>Package Name</Label>
      <Input {...register("name", { required: true })} placeholder="Enter Package Name" required />

      <Label>Category</Label>
      <Select onValueChange={(value) => setCategory(value as LongTermRentalFormData["category"])}>
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="industrial-shed">Industrial Shed</SelectItem>
          <SelectItem value="yard">Yard</SelectItem>
          <SelectItem value="transport">Transport</SelectItem>
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
      <Label>Min Holding Period</Label>
      <div className="grid grid-cols-2 gap-4">
        <Input type="number" {...register("minHoldingPeriod", { required: true })} required />
        <Select onValueChange={(value) => setMinHoldingPeriodUnit(value as LongTermRentalFormData["minHoldingPeriodUnit"])}>
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

      <Label>Return Percentage (2-10%)</Label>
      <Input type="number" step="0.01" {...register("returnPercentage", { required: true })} placeholder="Enter Fixed Return %" required />

      <Checkbox checked={resaleAllowed} onCheckedChange={(checked) => setResaleAllowed(Boolean(checked))} />
      <Label>Resale Allowed</Label>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Rental Package"}
      </Button>
      </div>
     </div>
    </form>
  );
};

// ------------------- Long-Term Industry Form -------------------
const LongTermIndustryForm = () => {
  const { register, handleSubmit, reset } = useForm<LongTermIndustryFormData>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<LongTermIndustryFormData["category"]>("property");
  const [durationUnit, setDurationUnit] = useState<LongTermIndustryFormData["durationUnit"]>("months");
  const [buybackOption, setBuybackOption] = useState(false);
  const [resaleAllowed, setResaleAllowed] = useState(false);
  const [minHoldingPeriodUnit, setMinHoldingPeriodUnit] = useState<LongTermRentalFormData["minHoldingPeriodUnit"]>("months");

  
  const onSubmit = async (data: LongTermIndustryFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/long-term-industry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          category,
          duration: { value: Number(data.durationValue), unit: durationUnit },
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
        <Select onValueChange={(value) => setMinHoldingPeriodUnit(value as LongTermRentalFormData["minHoldingPeriodUnit"])}>
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

export default LongTermForms;
