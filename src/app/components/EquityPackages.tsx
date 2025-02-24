'use client';
import { useEffect, useState } from 'react';
import PackageDetails from './PackageDetails';

interface EquityPackage {
  _id: string;
  name: string;
  availableUnits: number;
  equityUnits: number;
}

export default function EquityPackages() {
  const [packages, setPackages] = useState<EquityPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<EquityPackage | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/equity/packages');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setPackages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <p>Loading packages...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Available Equity Packages</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div 
            key={pkg._id} 
            className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setSelectedPackage(pkg)}
          >
            <h4 className="font-semibold">{pkg.name}</h4>
            <p>Units Available: {pkg.availableUnits}</p>
            <p>Equity Units: {pkg.equityUnits}</p> {/* ✅ Changed from Price to Equity Units */}
          </div>
        ))}
      </div>

      {/* Package Details Modal */}
      {selectedPackage && (
        <PackageDetails pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}
    </div>
  );
}
