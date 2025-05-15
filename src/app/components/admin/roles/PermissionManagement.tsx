'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Define a proper type for a permission
type Permission = {
  _id: string;
  slug: string;
  label: string;
};

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [slug, setSlug] = useState('');
  const [label, setLabel] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('/api/admin/permissions', { headers });
      setPermissions(res.data);
    } catch {
      toast.error('Failed to fetch permissions');
    }
  };

  useEffect(() => {
    if (token) fetchPermissions();
  }, [token]);

const createPermission = async () => {
  if (!slug || !label) return toast.error('Slug and label are required');

  try {
    await axios.post(
      '/api/admin/permissions/create',
      { slug, label },
      { headers }
    );
    toast.success('Permission created');
    setSlug('');
    setLabel('');
    fetchPermissions();
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.error || 'Failed to create permission');
    } else {
      toast.error('An unexpected error occurred');
    }
  }
};


  return (
    <Card className="p-4 mb-6">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Create New Permission</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <Input
            placeholder="Slug (e.g. view_users)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            placeholder="Label (e.g. View Users)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button onClick={createPermission}>Create</Button>
        </div>

        <hr className="my-6" />
        <h2 className="text-lg font-semibold mb-2">All Permissions</h2>
        <ul className="space-y-1 max-h-[200px] overflow-y-auto text-sm">
          {permissions.map((perm) => (
            <li key={perm._id} className="border-b py-1">
              <strong>{perm.slug}</strong> — {perm.label}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
