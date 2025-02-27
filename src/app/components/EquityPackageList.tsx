'use client';
import { useEffect, useState } from 'react';

interface EquityOwner {
  email: string;
  unitsHeld: number;
  holdingPercentage: string;
  valueOfHolding: string;
}

interface EquityPackage {
  packageId: string;
  name: string;
  totalUnits: number;
  availableUnits: number;
  equityUnits: number;
  owners: EquityOwner[];
}

export default function EquityPackagesList() {
  const [packages, setPackages] = useState<EquityPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<EquityPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('/api/admin/equity-packages', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch packages');

        const data = await response.json();
        setPackages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <p>Loading equity packages...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Equity Packages</h3>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Package Name</th>
            <th className="py-2 px-4 border">Total Units</th>
            <th className="py-2 px-4 border">Available Units</th>
            <th className="py-2 px-4 border">Equity Price</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.packageId} className="border">
              <td className="py-2 px-4">{pkg.name}</td>
              <td className="py-2 px-4">{pkg.totalUnits}</td>
              <td className="py-2 px-4">{pkg.availableUnits}</td>
              <td className="py-2 px-4"> {pkg.equityUnits} Equity Units</td>
              <td className="py-2 px-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Package Details Popup */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold">{selectedPackage.name}</h3>
            <p><strong>Total Units:</strong> {selectedPackage.totalUnits}</p>
            <p><strong>Available Units:</strong> {selectedPackage.availableUnits}</p>
            <p><strong>Equity Price:</strong> {selectedPackage.equityUnits} Equity Units</p>

            <h4 className="mt-4 font-semibold">Owners:</h4>
            <table className="w-full border mt-2">
              <thead>
                <tr>
                  <th className="py-1 px-2 border">Email</th>
                  <th className="py-1 px-2 border">Units Held</th>
                  <th className="py-1 px-2 border">Holding %</th>
                  <th className="py-1 px-2 border">Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedPackage.owners.length > 0 ? (
                  selectedPackage.owners.map((owner, i) => (
                    <tr key={i} className="border">
                      <td className="py-1 px-2">{owner.email}</td>
                      <td className="py-1 px-2">{owner.unitsHeld}</td>
                      <td className="py-1 px-2">{owner.holdingPercentage}</td>
                      <td className="py-1 px-2">{owner.valueOfHolding}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-2">No owners found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedPackage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
