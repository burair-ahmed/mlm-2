import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ShortTermPackageForm from "./admin/ShortTermPackageForm";
import LongTermPackageForm from "./admin/LongTermPackageForm";
import TradingPackageForm from "./admin/TradingPackageForm";

const AdminEquityPackages = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Equity Packages</h2>
      <Tabs defaultValue="short-term" className="w-full">
        <TabsList className="mb-4">
          {/* <TabsTrigger value="short-term">Short-Term Packages</TabsTrigger> */}
          <TabsTrigger value="long-term">Long-Term Packages</TabsTrigger>
          <TabsTrigger value="trading">Trading Packages</TabsTrigger>
        </TabsList>
        
        {/* <TabsContent value="short-term">
          <ShortTermPackageForm />
        </TabsContent> */}
        <TabsContent value="long-term">
          <LongTermPackageForm />
        </TabsContent>
        <TabsContent value="trading">
          <TradingPackageForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEquityPackages;
