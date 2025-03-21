import { useEffect, useState } from "react";

interface Investment {
  packageName: string;
  equityUnits: number;
  expectedReturn: number;
  purchaseDate: string;
}

const UserInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Unauthorized: No token found.");
    return;
  }
  useEffect(() => {
    const fetchInvestments = async () => {
        try {
          const res = await fetch("/api/users/user-investments", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API Error ${res.status}: ${errorText}`);
          }
      
          const data = await res.json();
          console.log("Parsed JSON:", data);
      
          if (Array.isArray(data)) {
            setInvestments(data);
          } else if (data && typeof data === "object" && "investments" in data && Array.isArray(data.investments)) {
            setInvestments(data.investments);
          } else {
            console.error("Error: Expected an array but got", typeof data);
            setInvestments([]);
          }
        } catch (error) {
          console.error("Error fetching investments:", error);
        }
      };
      
  
    fetchInvestments();
  }, []);
  
  

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">My Investments</h2>
      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Package</th>
              <th className="p-2 border">Equity Units</th>
              <th className="p-2 border">Expected Return</th>
              <th className="p-2 border">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv, index) => (
              <tr key={index} className="border">
                <td className="p-2 border">{inv.packageName}</td>
                <td className="p-2 border">{inv.equityUnits}</td>
                <td className="p-2 border text-green-600">${inv.expectedReturn.toFixed(2)}</td>
                <td className="p-2 border">{new Date(inv.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserInvestments;
