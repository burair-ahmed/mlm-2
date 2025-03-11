import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ShortTermPackageFormData {
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  durationValue: number;
  durationUnit: "seconds" | "minutes" | "days" | "weeks" | "months";
  returnType: "fixed" | "performance-based" | "both";
  returnPercentage: number;
  reinvestmentAllowed: boolean;
  exitPenalty?: number;
}

const ShortTermPackageForm = () => {
  const { register, handleSubmit, reset } = useForm<ShortTermPackageFormData>();
  const [loading, setLoading] = useState(false);
  const [selectedDurationUnit, setSelectedDurationUnit] = useState<"seconds" | "minutes" | "days" | "weeks" | "months">("days");
  const [selectedReturnType, setSelectedReturnType] = useState<"fixed" | "performance-based" | "both">("fixed");
  
  const onSubmit = async (data: ShortTermPackageFormData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        totalUnits: Number(data.totalUnits),
        availableUnits: Number(data.availableUnits),
        equityUnits: Number(data.equityUnits),
        duration: { value: Number(data.durationValue), unit: selectedDurationUnit }, // Ensure unit is included
        returnType: selectedReturnType, // Ensure this is included
        returnPercentage: Number(data.returnPercentage),
        reinvestmentAllowed: !!data.reinvestmentAllowed, // Convert "on" to Boolean
        exitPenalty: data.exitPenalty ? Number(data.exitPenalty) : undefined,
      };
  
      console.log("Sending Data:", payload); // Debugging line
  
      const response = await fetch("/api/admin/short-term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText); // Debugging line
        throw new Error("Failed to save package");
      }
  
      alert("Package created successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating package");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      {/* <h2 className="text-2xl font-bold mb-4 text-center">Create Short-Term Package</h2> */}
      {/* <Separator className="mb-4" /> */}
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
            <Select value={selectedDurationUnit} onValueChange={(value: string) => setSelectedDurationUnit(value as ShortTermPackageFormData["durationUnit"])}>
  <SelectTrigger>
    <SelectValue placeholder="Unit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="seconds">Seconds</SelectItem>
    <SelectItem value="minutes">Minutes</SelectItem>
    <SelectItem value="days">Days</SelectItem>
    <SelectItem value="weeks">Weeks</SelectItem>
    <SelectItem value="months">Months</SelectItem>
  </SelectContent>
</Select>

          </div>
        </div>

        <div className="grid grid-cols-12 gap-2">
       <div className="col-span-4">
          <Label>Return Type</Label>
          <Select value={selectedReturnType} onValueChange={(value: string) => setSelectedReturnType(value as ShortTermPackageFormData["returnType"])}>
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
          <Checkbox {...register("reinvestmentAllowed")} />
          <Label>Reinvestment Allowed</Label>
        </div>

        <div>
          <Label>Exit Penalty</Label>
          <Input type="number" {...register("exitPenalty")} placeholder="Optional" />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Package"}
        </Button>
      </form>
    </div>
  );
};

export default ShortTermPackageForm;
