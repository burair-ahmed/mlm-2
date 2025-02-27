'use client';

import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { useAuth } from '../../../context/AuthContext';
import { useCenteredTree } from '../../../hooks/useCenteredTree';



export default function HierarchyTree() {
    const { user } = useAuth();
    const [hierarchy, setHierarchy] = useState<any>(null);
    const [error, setError] = useState('');
    const { translate, containerRef } = useCenteredTree();
  
    useEffect(() => {
      const fetchHierarchy = async () => {
        try {
          if (!user?._id) return;
          
          const token = localStorage.getItem('token'); // Get token from storage
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
              <circle r="25" fill="#00a884" stroke="#000" strokeWidth="2" />
              <text
                x="0"
                y="50"
                textAnchor="middle"
                fill="black"
                fontSize="14"
                fontWeight="600"
              >
                {nodeDatum.name}
              </text>
              <text
                x="0"
                y="70"
                textAnchor="middle"
                fill="#ea5d0c"
                fontSize="12"
              >
                ${nodeDatum.attributes.balance.toFixed(2)}
              </text>
              <text
                x="0"
                y="90"
                textAnchor="middle"
                fill="#ea5d0c"
                fontSize="10"
              >
                {nodeDatum.attributes.referralCode}
              </text>
            </g>
          )}
        />
      </div>
    );
  }
  