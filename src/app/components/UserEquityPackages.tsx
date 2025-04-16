// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";

// interface EquityPackage {
//   _id: string;
//   name: string;
//   category: "short-term" | "long-term" | "trading";
//   equityUnits: number;
//   totalUnits: number;
//   availableUnits: number;
// }

// const UserEquityPackages = () => {
//   const [packages, setPackages] = useState<EquityPackage[]>([]);
//   const [selectedPackage, setSelectedPackage] = useState<EquityPackage | null>(null);
//   const [unitsToBuy, setUnitsToBuy] = useState<number>(1);

//   useEffect(() => {
//     const fetchPackages = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No authentication token found');
//       try {
//         const response = await fetch("/api/admin/equity-packages", {
//             method: "GET",
//             credentials: "include", // Ensures session cookies/tokens are sent
//             headers: { Authorization: `Bearer ${token}` },
  
//           });
//         if (!response.ok) throw new Error("Failed to fetch packages");
//         const data = await response.json();
//         setPackages(data);
//       } catch (error) {
//         console.error("Error fetching packages:", error);
//       }
//     };
//     fetchPackages();
//   }, []);

//   const handlePackageClick = (pkg: EquityPackage) => {
//     setSelectedPackage(pkg);
//     setUnitsToBuy(1);
//   };

//   const closeModal = () => setSelectedPackage(null);

//   const handleBuyNow = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No authentication token found');
//     if (!selectedPackage) return;
//     if (unitsToBuy <= 0 || unitsToBuy > selectedPackage.availableUnits) {
//       toast.error("Invalid unit quantity");
//       return;
//     }
//     console.log("📢 Sending purchase request:", {
//       packageId: selectedPackage._id,
//       units: unitsToBuy,
//     });
    
//     try {
//       const response = await fetch("/api/equity/purchase", {
//         method: "POST",
//         headers: { "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//          },
//         body: JSON.stringify({
//           packageId: selectedPackage._id,
//           units: unitsToBuy,
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         console.error("Purchase API Error:", data);
//         toast.error(data.error || "Purchase failed");
//         return;
//       }

//       console.log(selectedPackage._id || "No Package ID", data)
//       toast.success("Purchase successful!");
//       closeModal();
//     } catch (error) {
//       toast.error("Error purchasing package");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Available Equity Packages</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {packages.map((pkg, index) => (
//   <Card key={pkg._id || index} className="p-4 cursor-pointer hover:shadow-lg" onClick={() => handlePackageClick(pkg)}>
//     <CardContent>
//       <h3 className="text-lg font-semibold">{pkg.name}</h3>
//       <p className="text-gray-600">Category: {pkg.category}</p>
//       <p className="text-gray-600">Equity Units: {pkg.equityUnits} Units</p>
//       <p className="text-gray-600">Available Units: {pkg.availableUnits}</p>
//       <Button onClick={() => handlePackageClick(pkg)} className="mt-2">Buy Now</Button>
//     </CardContent>
//   </Card>
// ))}
//       </div>

//       {/* Buy Package Popup */}
//       {selectedPackage && (
//         <Dialog open={true} onOpenChange={closeModal}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Buy {selectedPackage.name}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-2">
//               <p><strong>Category:</strong> {selectedPackage.category}</p>
//               <p><strong>Equity Units:</strong> {selectedPackage.equityUnits} Units</p>
//               <p><strong>Available Units:</strong> {selectedPackage.availableUnits}</p>
              
//               <label className="block font-semibold">Enter Units:</label>
//               <Input
//                 type="number"
//                 value={unitsToBuy}
//                 min={1}
//                 max={selectedPackage.availableUnits}
//                 onChange={(e) => setUnitsToBuy(Number(e.target.value))}
//               />

//               <Button className="w-full mt-2" onClick={handleBuyNow}>Confirm Purchase</Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default UserEquityPackages;
export {};