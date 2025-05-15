'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface Permission {
  _id: string;
  slug: string;
  label: string;
}

interface Role {
  _id: string;
  name: string;
  permissions: Permission[];
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchRoles = async () => {
    const res = await axios.get('/api/admin/roles', { headers });
    setRoles(res.data);
  };

  const fetchPermissions = async () => {
    const res = await axios.get('/api/admin/permissions', { headers });
    setPermissions(res.data);
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handlePermissionToggle = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setRoleName('');
    setSelectedPermissions([]);
    setEditingRoleId(null);
  };

  const saveRole = async () => {
    try {
      if (editingRoleId) {
        await axios.put(`/api/admin/roles/${editingRoleId}/update`, {
          name: roleName,
          permissionIds: selectedPermissions,
        }, { headers });
        toast.success('Role updated');
      } else {
        await axios.post('/api/admin/roles/create', {
          name: roleName,
          permissionIds: selectedPermissions,
        }, { headers });
        toast.success('Role created');
      }

      resetForm();
      fetchRoles();
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    toast.error(err.response?.data?.error || 'Action failed');
  } else {
    toast.error('An unexpected error occurred');
  }
}

  };

  const deleteRole = async (id: string, name: string) => {
    if (name === 'super-admin') {
      return toast.error('Cannot delete super-admin role');
    }

    try {
      await axios.delete(`/api/admin/roles/${id}/delete`, { headers });
      toast.success('Role deleted');
      fetchRoles();
    } catch {
      toast.error('Failed to delete role');
    }
  };

  const startEditing = (role: Role) => {
    setRoleName(role.name);
    setSelectedPermissions(role.permissions.map(p => p._id));
    setEditingRoleId(role._id);
  };

  return (
    <Card className="p-4 mb-6">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{editingRoleId ? 'Edit Role' : 'Create New Role'}</h2>
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <Button onClick={saveRole}>{editingRoleId ? 'Update' : 'Create'}</Button>
          {editingRoleId && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border p-2 rounded">
          {permissions.map((perm) => (
            <label key={perm._id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedPermissions.includes(perm._id)}
                onCheckedChange={() => handlePermissionToggle(perm._id)}
              />
              {perm.label} ({perm.slug})
            </label>
          ))}
        </div>

        <hr className="my-6" />
        <h2 className="text-lg font-semibold mb-2">Existing Roles</h2>
        <ul>
          {roles.map((role) => (
            <li key={role._id} className="flex justify-between items-center border-b py-2">
              <span>{role.name}</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => startEditing(role)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteRole(role._id, role.name)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
