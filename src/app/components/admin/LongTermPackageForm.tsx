import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LongTermIndustryForm from "./LongTermIndustry";
import LongTermRentalForm from "./LongTermRental";

const LongTermForms = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="rental">
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

export default LongTermForms;
