// 'use client';
// import { useState } from 'react';
// import { useAuth } from '../../../context/AuthContext';

// export default function EquityPurchaseForm() {
//   const { user, refreshUser } = useAuth();
//   const [units, setUnits] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch('/api/equity/purchase', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ units })
//       });

//       const data = await response.json();
      
//       if (!response.ok) throw new Error(data.error || 'Purchase failed');
      
//       setSuccess(`Purchased ${units} equity units!`);
//       setUnits('');
//       refreshUser();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Purchase failed');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow mt-4">
//       <h3 className="text-lg font-semibold mb-4">Purchase Equity</h3>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Units to Buy</label>
//           <input
//             type="number"
//             value={units}
//             onChange={(e) => setUnits(e.target.value)}
//             className="w-full p-2 border rounded"
//             min="1"
//             required
//           />
//           <p className="text-sm text-gray-500 mt-2">
//             Available Equity Units: {user?.equityUnits || 0}
//           </p>
//         </div>

//         {error && <p className="text-red-500">{error}</p>}
//         {success && <p className="text-green-500">{success}</p>}

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Buy Equity
//         </button>
//       </form>
//     </div>
//   );
// }