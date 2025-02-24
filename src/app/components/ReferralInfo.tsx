import React from 'react';

export default function ReferralInfo({ referralLink, referralCode }: { referralLink: string; referralCode: string }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="font-medium mb-2">Your Referral Code:</h3>
      <div className="flex items-center gap-2">
        <code className="bg-gray-100 px-2 py-1 rounded">{referralCode}</code>
        <button onClick={() => copyToClipboard(referralCode)} className="text-blue-600 hover:text-blue-500 text-sm">
          Copy
        </button>
      </div>

      <h3 className="font-medium mt-4">Your Referral Link:</h3>
      <div className="flex items-center gap-2">
        <input type="text" value={referralLink} readOnly className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm" />
        <button onClick={() => copyToClipboard(referralLink)} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
          Copy Link
        </button>
      </div>
    </div>
  );
}
