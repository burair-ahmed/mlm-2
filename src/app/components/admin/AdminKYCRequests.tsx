'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
// import Image from 'next/image'; // If you have a custom wrapper, otherwise use next/image
import { toast } from 'sonner';
import { useAuth } from '../../../../context/AuthContext';

type KYC = {
  _id: string;
  userName: string;
  email: string;
  kyc: {
    fullName: string;
    dateOfBirth: string;
    address: string;
    idType: string;
    idNumber: string;
    documents: string[]; // URLs or base64
    submittedAt: string;
    status: string;
  };
};

export default function AdminKYCRequests() {
    const { user } = useAuth();
  const [requests, setRequests] = useState<KYC[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKYCs();
  }, []);

  const fetchKYCs = async () => {
    setLoading(true);
    try {
        if (!user?.isAdmin) return;

      const res = await fetch('/api/admin/kyc/pending' ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.kycRequests || []);
      } else {
        toast.error(data.error || 'Failed to fetch KYC requests');
      }
    } catch {
      toast.error('Something went wrong while fetching KYC data');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/kyc/approve/${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`KYC approved for ${data.user?.kyc?.fullName || data.user?.email || data.user?.userName}`);
  setRequests((prev) => prev.filter((u) => u._id !== userId));
      } else {
        toast.error(data.error || 'Failed to approve KYC');
      }
    } catch {
      toast.error('Error approving KYC');
    }
  };

  return (
    <ScrollArea className="h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending KYC Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-muted-foreground">No pending requests.</p>
      ) : (
        requests.map((user) => (
          <Card key={user._id} className="mb-4">
            <CardContent className="p-4 space-y-2">
              <div className="space-y-1">
                <p><strong>Name:</strong> {user.kyc.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.userName}</p>
                <p><strong>Date of Birth:</strong> {user.kyc.dateOfBirth}</p>
                <p><strong>Address:</strong> {user.kyc.address}</p>
                <p><strong>ID Type:</strong> {user.kyc.idType}</p>
                <p><strong>ID Number:</strong> {user.kyc.idNumber}</p>
                <p><strong>Submitted At:</strong> {new Date(user.kyc.submittedAt).toLocaleString()}</p>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-3">
                {user.kyc.documents.map((doc, idx) => (
                  <img
                    key={idx}
                    src={doc}
                    alt={`Document ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-md border"
                  />
                ))}
              </div>

              <Button onClick={() => approve(user._id)} className="mt-4">
                Approve
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollArea>
  );
}
