'use client';

import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { useAuth } from '../../../context/AuthContext';
import { useCenteredTree } from '../../../hooks/useCenteredTree';

// interface NodeAttributes {
//   balance?: number;
//   referralCode?: string;
// }

interface RawNodeDatum {
  name: string;
  attributes: Record<string, string | number | boolean>; // Ensure attributes conform to the expected type
  children?: RawNodeDatum[];
}

type Hierarchy = RawNodeDatum | null;

export default function HierarchyTree() {
  const { user } = useAuth();
  const [hierarchy, setHierarchy] = useState<Hierarchy>(null); // Use the RawNodeDatum type
  const [error, setError] = useState<string>('');
  const { translate, containerRef } = useCenteredTree();

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        if (!user?._id) return;

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`/api/users/${user._id}/hierarchy`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch hierarchy');

        const data = await response.json();
        setHierarchy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hierarchy');
      }
    };

    fetchHierarchy();
  }, [user]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!hierarchy) return <div className="text-gray-500 p-4">Loading hierarchy...</div>;

  return (
    <div ref={containerRef} className="h-[600px] w-full bg-white border rounded-lg">
      <Tree
        data={hierarchy}
        translate={translate}
        pathFunc="step"
        orientation="vertical"
        nodeSize={{ x: 200, y: 150 }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g>
            {/* Circle Node */}
            <circle r="25" fill="#00a884" stroke="#000" strokeWidth="2" />

            {/* Name Text */}
            {nodeDatum.name && (
              <text x="0" y="40" textAnchor="middle" fill="black" fontSize="14" fontWeight="600">
                {nodeDatum.name}
              </text>
            )}

            {/* Balance Text (only show if balance exists) */}
            {typeof nodeDatum.attributes?.balance === 'number' && (
              <text x="0" y="60" textAnchor="middle" fill="#ea5d0c" fontSize="12">
                ${nodeDatum.attributes.balance.toFixed(2)}
              </text>
            )}

            {/* Referral Code (only show if exists) */}
            {nodeDatum.attributes?.referralCode && (
              <text x="0" y="80" textAnchor="middle" fill="#ea5d0c" fontSize="10">
                {nodeDatum.attributes.referralCode}
              </text>
            )}
          </g>
        )}
      />
    </div>
  );
}
