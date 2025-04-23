'use client';

import React from 'react';
import { toast } from 'sonner';

export default function ReferralInfo({
  referralLink,
  referralCode,
}: {
  referralLink: string;
  referralCode: string;
}) {
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } else {
        // Fallback for unsupported environments (e.g. some mobile browsers)
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          toast.success('Copied to clipboard!');
        } else {
          throw new Error('Fallback copy failed');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy. Please copy manually.');
    }
  };

  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="font-medium mb-2">Your Referral Code:</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <code className="bg-gray-100 px-2 py-1 rounded">{referralCode}</code>
        <button
          onClick={() => copyToClipboard(referralCode)}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          Copy
        </button>
      </div>

      <h3 className="font-medium mt-4">Your Referral Link:</h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm"
        />
        <button
          onClick={() => copyToClipboard(referralLink)}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
