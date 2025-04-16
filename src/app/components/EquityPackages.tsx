// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";

// interface Package {
//   _id: string;
//   name: string;
//   totalUnits: number;
//   availableUnits: number;
//   equityUnits: number;
//   returnPercentage?: number;
//   returnType?: "fixed" | "performance-based" | "both";
//   duration?: { value: number; unit: string };
//   minHoldingPeriod?: number;
//   resaleAllowed?: boolean;
//   reinvestmentAllowed?: boolean;
//   exitPenalty?: number;
//   depreciationModel?: "fixed" | "performance-based" | "company-buyback";
//   lifespan?: number;
//   packageDuration?: { value: number; unit: string };
//   createdAt?: Date;
// }

// const EquityPackages = () => {
//   const [shortTerm, setShortTerm] = useState<Package[]>([]);
//   const [longTerm, setLongTerm] = useState<Package[]>([]);
//   const [trading, setTrading] = useState<Package[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const [shortRes, longRes, tradingRes] = await Promise.all([
//           fetch("/api/admin/short-term"),
//           fetch("/api/admin/long-term"),
//           fetch("/api/admin/trading"),
//         ]);

//         if (!shortRes.ok || !longRes.ok || !tradingRes.ok) {
//           throw new Error("API request failed");
//         }

//         const [shortData, longData, tradingData] = await Promise.all([
//           shortRes.json(),
//           longRes.json(),
//           tradingRes.json(),
//         ]);

//         setShortTerm(shortData);
//         setLongTerm(longData);
//         setTrading(tradingData);
//       } catch (error) {
//         console.error("Error fetching packages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, []);

//   if (loading) return <p>Loading packages...</p>;

//   return (
//     <>
//       <Tabs defaultValue="short-term" className="w-full">
//         <TabsList className="flex justify-center mb-4">
//           <TabsTrigger value="short-term">Short-Term</TabsTrigger>
//           <TabsTrigger value="long-term">Long-Term</TabsTrigger>
//           <TabsTrigger value="trading">Trading</TabsTrigger>
//         </TabsList>

//         <TabsContent value="short-term">
//           <PackageList packages={shortTerm} onInvest={setSelectedPackage} />
//         </TabsContent>
//         <TabsContent value="long-term">
//           <PackageList packages={longTerm} onInvest={setSelectedPackage} />
//         </TabsContent>
//         <TabsContent value="trading">
//           <PackageList packages={trading} onInvest={setSelectedPackage} />
//         </TabsContent>
//       </Tabs>

//       {selectedPackage && (
//         <InvestmentDialog pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
//       )}
//     </>
//   );
// };

// const PackageList = ({ packages, onInvest }: { packages: Package[]; onInvest: (pkg: Package) => void }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {packages.map((pkg) => (
//         <Card key={pkg._id} className="p-4">
//           <CardHeader>
//             <CardTitle>{pkg.name}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>Available Units: {pkg.availableUnits}</p>
//             {pkg.returnPercentage && <p>Return: {pkg.returnPercentage}%</p>}
//             {pkg.duration && <p>Duration: {pkg.duration.value} {pkg.duration.unit}</p>}
//             {pkg.lifespan && <p>Lifespan: {pkg.lifespan} years</p>}
//             <Button className="mt-2 w-full" onClick={() => onInvest(pkg)}>Invest</Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// const InvestmentDialog = ({ pkg, onClose }: { pkg: Package; onClose: () => void }) => {
//   const [units, setUnits] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const getPackageType = (pkg: Package): string => {
//     if (pkg.depreciationModel) return "trading";  // If it has depreciation, it's a trading package
//     if (pkg.minHoldingPeriod) return "long-term"; // If it has a minimum holding period, it's a long-term package
//     return "short-term";                           // Otherwise, assume it's a short-term package
//   };
//   const handlePurchase = async () => {
//     if (units <= 0 || units > pkg.availableUnits) {
//       alert("Invalid unit selection");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch("/api/transactions/purchase", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}` // Ensure token is correctly retrieved
//         },      
//         body: JSON.stringify({
//           packageId: pkg._id,
//           packageType: getPackageType(pkg),
//           quantity: units,  // ✅ Now sending quantity
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         alert("Purchase successful");
//         onClose();
//       } else {
//         alert(data.message || "Purchase failed");
//       }
//     } catch (error) {
//       console.error("Purchase error:", error);
//       alert("An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Invest in {pkg.name}</DialogTitle>
//           <DialogDescription>Secure your investment today!</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-2">
//           <p><strong>Total Units:</strong> {pkg.totalUnits}</p>
//           <p><strong>Available Units:</strong> {pkg.availableUnits}</p>
//           <p><strong>Equity Units:</strong> {pkg.equityUnits}</p>
//           {pkg.returnPercentage && <p><strong>Return Percentage:</strong> {pkg.returnPercentage}%</p>}
//           {pkg.returnType && <p><strong>Return Type:</strong> {pkg.returnType}</p>}
//           {pkg.duration && <p><strong>Duration:</strong> {pkg.duration.value} {pkg.duration.unit}</p>}
//           {pkg.minHoldingPeriod && <p><strong>Min Holding Period:</strong> {pkg.minHoldingPeriod} months</p>}
//           {pkg.resaleAllowed !== undefined && <p><strong>Resale Allowed:</strong> {pkg.resaleAllowed ? "Yes" : "No"}</p>}
//           {pkg.reinvestmentAllowed !== undefined && <p><strong>Reinvestment Allowed:</strong> {pkg.reinvestmentAllowed ? "Yes" : "No"}</p>}
//           {pkg.exitPenalty && <p><strong>Exit Penalty:</strong> {pkg.exitPenalty}%</p>}
//           {pkg.depreciationModel && <p><strong>Depreciation Model:</strong> {pkg.depreciationModel}</p>}
//           {pkg.lifespan && <p><strong>Lifespan:</strong> {pkg.lifespan} years</p>}

//           <p><strong>Units to Buy:</strong></p>
//           <Input
//             type="number"
//             value={units}
//             onChange={(e) => setUnits(Number(e.target.value))}
//             min={1}
//             max={pkg.availableUnits}
//           />
//           <p><strong>Total Cost:</strong> {pkg.equityUnits * units} Equity Units</p>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handlePurchase} disabled={loading}>
//             {loading ? "Processing..." : "Proceed to Buy"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EquityPackages;
export {};