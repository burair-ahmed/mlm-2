import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface LongTermPackageFormData {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  durationValue: number;
  durationUnit: "seconds" | "minutes" | "months" | "years";
  returnPercentage: number;
  returnType: "fixed" | "performance-based" | "both";
  reinvestmentAllowed: boolean;
  minHoldingPeriod: number;
  resaleAllowed: boolean;
}

const LongTermPackageForm = () => {
  const { register, handleSubmit, reset, setValue } = useForm<LongTermPackageFormData>();
  const [loading, setLoading] = useState(false);

  // Handle Select manually using setValue
  const [durationUnit, setDurationUnit] = useState<"seconds" | "minutes" | "months" | "years">("months");
  const [returnType, setReturnType] = useState<"fixed" | "performance-based" | "both">("fixed");
  const [reinvestmentAllowed, setReinvestmentAllowed] = useState(false);
  const [resaleAllowed, setResaleAllowed] = useState(false);

  const onSubmit = async (data: LongTermPackageFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/long-term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          totalUnits: Number(data.totalUnits),
          availableUnits: Number(data.availableUnits),
          equityUnits: Number(data.equityUnits),
          duration: {
            value: Number(data.durationValue),
            unit: durationUnit, // ✅ Correctly capturing unit
          },
          returnPercentage: Number(data.returnPercentage),
          returnType: returnType, // ✅ Correctly capturing return type
          reinvestmentAllowed: reinvestmentAllowed, // ✅ Correctly capturing boolean
          minHoldingPeriod: Number(data.minHoldingPeriod),
          resaleAllowed: resaleAllowed, // ✅ Correctly capturing boolean
        }),
      });

      if (!response.ok) throw new Error("Failed to save package");

      alert("Package created successfully!");
      reset();
    } catch (error) {
      console.error(error);
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
          <Label>Duration</Label>
          <div className="flex gap-2">
            <Input type="number" {...register("durationValue", { required: true })} className="w-24" required />
            <Select onValueChange={(value) => setDurationUnit(value as LongTermPackageFormData["durationUnit"])}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seconds">Seconds</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <Label>Return Type</Label>
            <Select onValueChange={(value) => setReturnType(value as LongTermPackageFormData["returnType"])}>
              <SelectTrigger>
                <SelectValue placeholder="Return Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="performance-based">Performance-Based</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-8">
            <Label>Return Percentage</Label>
            <Input type="number" step="0.01" {...register("returnPercentage", { required: true })} placeholder="Enter Return Percentage" required />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={reinvestmentAllowed}
            onCheckedChange={(checked) => setReinvestmentAllowed(Boolean(checked))}
          />
          <Label>Reinvestment Allowed</Label>
        </div>

        <div>
          <Label>Minimum Holding Period (Months)</Label>
          <Input type="number" {...register("minHoldingPeriod", { required: true })} required />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={resaleAllowed}
            onCheckedChange={(checked) => setResaleAllowed(Boolean(checked))}
          />
          <Label>Resale Allowed</Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Package"}
        </Button>
      </form>
    </div>
  );
};

export default LongTermPackageForm;
