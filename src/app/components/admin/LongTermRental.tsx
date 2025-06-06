import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface LongTermRentalFormData {
  name: string;
  category: "industrial-shed" | "yard" | "transport";
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  durationValue: number;
  durationUnit: "minutes" | "months" | "years";
  returnPercentage: number;
  minHoldingPeriod: number;
  minHoldingPeriodUnit: "seconds" | "minutes" | "months" | "years";
  resaleAllowed: boolean;
  image: string;
}

const LongTermRentalForm = () => {
  const { register, handleSubmit, reset } = useForm<LongTermRentalFormData>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<LongTermRentalFormData["category"]>("industrial-shed");
  const [durationUnit, setDurationUnit] = useState<LongTermRentalFormData["durationUnit"]>("months");
  const [minHoldingPeriodUnit, setMinHoldingPeriodUnit] = useState<LongTermRentalFormData["minHoldingPeriodUnit"]>("months");
  const [resaleAllowed, setResaleAllowed] = useState(false);
  const [image, setImage] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: LongTermRentalFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/long-term-rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          category,
          totalUnits: Number(data.totalUnits),
          availableUnits: Number(data.availableUnits),
          equityUnits: Number(data.equityUnits),
          duration: {
            value: Number(data.durationValue),
            unit: durationUnit,
          },
          returnPercentage: Number(data.returnPercentage),
          minHoldingPeriod: Number(data.minHoldingPeriod),
          minHoldingPeriodUnit,
          resaleAllowed,
          image,
        }),
      });

      if (!response.ok) throw new Error("Failed to save rental package");

      alert("Rental Package created successfully!");
      reset();
      setImage("");
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
        <Label>Package Name</Label>
        <Input {...register("name", { required: true })} placeholder="Enter Package Name" required />

        <Label>Upload Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Preview" className="w-32 h-32 mt-2 rounded-lg" />}

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Holding Period</Label>
          <Input type="number" {...register("minHoldingPeriod", { required: true })} required />
        </div>
        <div>
          <Label>Holding Period Unit</Label>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Duration Value</Label>
          <Input type="number" {...register("durationValue", { required: true })} required />
        </div>
        <div>
          <Label>Duration Unit</Label>
          <Select onValueChange={(value) => setDurationUnit(value as LongTermRentalFormData["durationUnit"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select Duration Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Return Percentage (2–10%)</Label>
        <Input
          type="number"
          step="0.01"
          {...register("returnPercentage", { required: true })}
          placeholder="Enter Fixed Return %"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox checked={resaleAllowed} onCheckedChange={(checked) => setResaleAllowed(Boolean(checked))} />
        <Label>Resale Allowed</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Rental Package"}
      </Button>
    </form>
  );
};

export default LongTermRentalForm;
