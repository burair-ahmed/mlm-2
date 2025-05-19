"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  _id: string;
  email: string;
  fullName?: string;
  role?: string; // changed from object to string
  kyc?: { status: string };
}

interface Permission {
  _id: string;
  label: string;
  slug: string;
}

interface Role {
  _id: string;
  name: string;
}

export default function AssignRoleToUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {}
  );
  const [customPermissions, setCustomPermissions] = useState<
    Record<string, string[]>
  >({});
  const [customOpenUserId, setCustomOpenUserId] = useState<string | null>(null);

  const usersPerPage = 10;
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, permRes, roleRes] = await Promise.all([
          axios.get("/api/admin/users", { headers }),
          axios.get("/api/admin/permissions", { headers }),
          axios.get("/api/admin/roles", { headers }),
        ]);

        setUsers(userRes.data);
        setPermissions(permRes.data);
        setRoles(roleRes.data);

        setSelectedRoles(
          userRes.data.reduce((acc: Record<string, string>, user: User) => {
            if (user.role) acc[user._id] = user.role;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users, roles, or permissions");
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (userId: string, slug: string) => {
    setCustomPermissions((prev) => {
      const existing = prev[userId] || [];
      const updated = existing.includes(slug)
        ? existing.filter((s) => s !== slug)
        : [...existing, slug];
      return { ...prev, [userId]: updated };
    });
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    if (roleId === "custom") return;

    try {
      const res = await axios.put(
        `/api/admin/users/${userId}/role`,
        { roleId },
        { headers }
      );
      const updatedUser = res.data;

      toast.success("Role updated successfully");
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
      setSelectedRoles((prev) => ({ ...prev, [userId]: roleId }));
      setCustomOpenUserId(null);
    } catch {
      toast.error("Failed to assign role");
    }
  };

  const handleAssignCustom = async (userId: string) => {
    const selected = customPermissions[userId] || [];
    try {
      const res = await axios.put(
        `/api/admin/users/${userId}/role`,
        {
          roleId: "custom",
          permissions: selected,
        },
        { headers }
      );

      const updatedUser = res.data;
      toast.success("Custom role assigned");
      setCustomOpenUserId(null);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
    } catch {
      toast.error("Failed to assign custom role");
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Assign Roles to Users</h2>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search by email or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>KYC Status</TableHead>
            <TableHead>Assign Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.fullName || "—"}</TableCell>
              <TableCell>{user.role || "None"}</TableCell>
              <TableCell>{user.kyc?.status || "Not Submitted"}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {selectedRoles[user._id]
                          ? selectedRoles[user._id] === "custom"
                            ? "Custom"
                            : roles.find((r) => r._id === selectedRoles[user._id])?.name
                          : user.role || "Select Role"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {roles.map((role) => (
                        <DropdownMenuItem
                          key={role._id}
                          onClick={() => handleRoleChange(user._id, role._id)}
                        >
                          {role.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRoles((prev) => ({
                            ...prev,
                            [user._id]: "custom",
                          }));
                          setCustomOpenUserId(user._id);
                        }}
                      >
                        Custom
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {(selectedRoles[user._id] === "custom" || user.role === "custom") && (
                    <Popover
                      open={customOpenUserId === user._id}
                      onOpenChange={(open) => {
                        if (!open) setCustomOpenUserId(null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCustomOpenUserId(user._id)}
                        >
                          Set Permissions
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 max-h-96 overflow-y-auto">
                        <h4 className="font-semibold mb-2">Select Permissions</h4>
                        <div className="space-y-2">
                          {permissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No permissions found
                            </p>
                          ) : (
                            permissions.map((perm) => (
                              <div key={perm.slug} className="flex items-center space-x-2">
                                <Checkbox
                                  id={perm.slug}
                                  checked={
                                    customPermissions[user._id]?.includes(perm.slug) || false
                                  }
                                  onCheckedChange={() =>
                                    handleCheckboxChange(user._id, perm.slug)
                                  }
                                />
                                <label htmlFor={perm.slug} className="text-sm">
                                  {perm.label}
                                </label>
                              </div>
                            ))
                          )}
                          <Button
                            onClick={() => handleAssignCustom(user._id)}
                            className="mt-4 w-full"
                          >
                            Assign
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4 gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage * usersPerPage >= filteredUsers.length}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
