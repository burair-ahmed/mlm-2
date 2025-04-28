'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'; 
// import { useRouter } from 'next/navigation';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
//   const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return 'Strong';
    }
    return 'Medium';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Weak':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const strength = getPasswordStrength(newPassword);
    if (strength === 'Weak') {
      toast.error('Password is too weak. Make it stronger.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
      } else {
        toast.success('Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Optional: redirect or logout
        // router.push('/login');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* Old Password */}
      <div className="space-y-2">
        <Label htmlFor="oldPassword">Old Password</Label>
        <div className="relative">
          <Input
            id="oldPassword"
            type={showOld ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowOld((prev) => !prev)}
          >
            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowNew((prev) => !prev)}
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        {newPassword && (
  <div className="mt-3">
    <div className="flex items-center justify-between text-sm mb-1">
      <span>Password Strength: {getPasswordStrength(newPassword)}</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-2 transition-all duration-500 ease-in-out ${getStrengthColor(getPasswordStrength(newPassword))}`}
        style={{
          width:
            getPasswordStrength(newPassword) === 'Weak'
              ? '33%'
              : getPasswordStrength(newPassword) === 'Medium'
              ? '66%'
              : '100%',
        }}
      />
    </div>
  </div>
)}

      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
}
