"use client";

import React from "react";
import { toast } from "sonner";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";

interface ReferralInfoProps {
  referralLink: string;
  referralCode: string;
}

export default function ReferralInfo({ referralLink, referralCode }: ReferralInfoProps) {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          toast.success(`${label} copied to clipboard!`);
        } else {
          throw new Error("Fallback copy failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  return (
    <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-glow-emerald pointer-events-none opacity-20" />

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">Referral Program</h3>
        <p className="text-xs text-muted-foreground">Share your referral link to earn downline commission bonuses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Left Column: Code */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Your Referral Code</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-center bg-accent/10 border border-accent/25 border-glow-gold px-4 py-2.5 rounded-xl font-bold font-mono text-sm text-accent text-glow-gold">
              {referralCode}
            </code>
            <button
              onClick={() => copyToClipboard(referralCode, "Referral Code")}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300"
              title="Copy Referral Code"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Link */}
        <div className="md:col-span-8 space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Your Referral Link</label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none"
              />
              <LinkIcon className="absolute left-3.5 top-3 h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <button
              onClick={() => copyToClipboard(referralLink, "Referral Link")}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 font-bold text-xs text-white px-5 py-3 rounded-xl shadow-lg shadow-primary/10 transition-all duration-300 shrink-0 flex items-center justify-center gap-2"
            >
              <Share2 className="h-3.5 w-3.5" /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
