// components/NoAccess.tsx
'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function NoAccess() {
  const router = useRouter();

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-[#f9f7f4] dark:bg-[#1a1917] p-0">
      <Card className="max-w-md w-full text-center shadow-xl border-2 border-[#865d36] bg-[#fffaf6] dark:bg-[#2a2520]">
        <CardContent className="py-10 px-6">
          <div className="flex justify-center mb-4 text-[#865d36]">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-semibold text-[#3e362e] dark:text-[#f3ebe3]">
            You don’t have access to this page
          </h2>
          <p className="mt-2 text-sm text-[#93785b] dark:text-[#d0bfae]">
            This page is restricted based on your permissions.
          </p>
          <Button
            className="mt-6 bg-[#865d36] hover:bg-[#a69080] text-white w-full"
            onClick={() => router.push('/user')}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
