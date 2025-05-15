'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
// import EquityPackages from '../components/EquityPackages';
// import AdminEquityTracking from '../components/AdminEquityTracking';
// import CreateEquityPackageForm from '../components/CreateEquityPackageForm';
// import EquityPackageList from '../components/EquityPackageList';
// import AdminEquityPanel from '../components/AdminEquityPanel';
// import AdminEquityPackageForm from '../components/AdminEquityPackageForm';
import AdminEquityPackages from '../components/AdminEquityPackages';
import AdminProfitUpdate from '../components/admin/AdminProfitUpdate';
import AdminKYCRequests from '../components/admin/AdminKYCRequests';
import AdminWithdrawalsTable from '../components/admin/AdminWithdrawalsTable';
import AssignRoleToUser from '../components/admin/roles/AssignRoleToUser';
import PermissionManagement from '../components/admin/roles/PermissionManagement';
import RoleManagement from '../components/admin/roles/RoleManagement';

interface User {
  _id: string;
  email: string;
  balance: number;
  commissionEarned: number;
  isAdmin: boolean;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user?.isAdmin) return;

        const response = await fetch('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  if (!user?.isAdmin) return <div className="p-4 text-red-500">Unauthorized access</div>;
  if (loading) return <div className="p-4 text-gray-500">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Balance</th>
                <th className="text-left py-2">Commission</th>
                <th className="text-left py-2">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t">
               <td className="py-2">{user.email}</td>
                    <td className="py-2">${user.balance?.toFixed(2) || '0.00'}</td>
                    <td className="py-2">${user.commissionEarned?.toFixed(2) || '0.00'}</td>
                    <td className="py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Equity Packages</h2>
        <AdminEquityPackages/>
        {/* <CreateEquityPackageForm /> */}
        {/* <AdminEquityPackageForm/> */}
        {/* <EquityPackages /> */}
              {/* <EquityPackageList/> */}
              {/* <AdminEquityPanel/> */}
      </div>
      <AdminKYCRequests/>
      <AdminWithdrawalsTable/>
      <AssignRoleToUser/>
      <RoleManagement/>
      <PermissionManagement/>
<AdminProfitUpdate/>
      {/* Equity Ownership Tracking */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Equity Ownership</h2>
        {/* <AdminEquityTracking /> */}
      </div>
    </div>
  );
}