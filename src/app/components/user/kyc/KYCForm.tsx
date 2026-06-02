'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  FileCheck, 
  Calendar, 
  Upload, 
  ChevronDown, 
  Eye 
} from 'lucide-react';

interface KYCInfo {
  status?: string;
  fullName?: string;
  dateOfBirth?: string | Date;
  address?: string;
  idType?: string;
  idNumber?: string;
  documents?: string[];
}

export default function KYCForm({ kyc }: { kyc?: KYCInfo }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isApproved = kyc?.status === 'approved';
  const isPending = kyc?.status === 'pending';
  
  const [fullName, setFullName] = useState(kyc?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    kyc?.dateOfBirth ? new Date(kyc.dateOfBirth).toISOString().split('T')[0] : ''
  );
  const [address, setAddress] = useState(kyc?.address || '');
  const [idType, setIdType] = useState(kyc?.idType || '');
  const [idNumber, setIdNumber] = useState(kyc?.idNumber || '');
  const [documents, setDocuments] = useState<string[]>(kyc?.documents || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Promises = Array.from(files).map(file =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })
    );

    try {
      const results = await Promise.all(base64Promises);
      setDocuments(results);
    } catch {
      toast.error('Failed to read files');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !dateOfBirth || !address || !idType || !idNumber || documents.length === 0) {
      return toast.error('Please fill in all fields and upload documents');
    }

    setIsSubmitting(true);

    const payload = {
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      address,
      idType,
      idNumber,
      documents,
    };

    try {
      const res = await fetch('/api/users/kyc/submit', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('KYC submitted successfully for Approval');
      } else {
        toast.error(result.error || 'Submission failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      {/* Status Alert Banner */}
      {isApproved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-xs font-semibold">
          <FileCheck className="h-5 w-5 shrink-0 text-glow-emerald" />
          <span>Your KYC verification is approved. Your account has full investor clearance.</span>
        </div>
      )}
      
      {isPending && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-400 text-xs font-semibold">
          <Calendar className="h-5 w-5 shrink-0 text-glow-gold" />
          <span>Your KYC submission is currently under review by compliance. Approval takes up to 24 hours.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl glass-panel relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-10" />

        <h2 className="text-xl font-extrabold text-foreground mb-4 pb-3 border-b border-white/5 flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary text-glow-emerald" />
          <span>Identity Verification (KYC)</span>
        </h2>

        <div className="grid gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Full Name (As Per Documents)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isApproved || isPending}
              placeholder="e.g. John Doe"
              className="w-full bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Date of Birth (As Per Documents)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={isApproved || isPending}
              className="w-full bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Address (As Per Documents)
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isApproved || isPending}
              placeholder="Complete residential address"
              className="w-full bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30 min-h-[85px] resize-y"
              required
            />
          </div>

          {/* ID Type & Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                ID Type
              </label>
              <div className="relative">
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  disabled={isApproved || isPending}
                  className="w-full bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-slate-950 text-muted-foreground">Select ID Type</option>
                  <option value="National ID" className="bg-slate-950 text-foreground">National ID Card (CNIC)</option>
                  <option value="Passport" className="bg-slate-950 text-foreground">Passport</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                disabled={isApproved || isPending}
                placeholder="National Identity card or Passport number"
                className="w-full bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
                required
              />
            </div>
          </div>

          {/* Upload Documents */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Upload Front / Back Scan of ID Document
            </label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              disabled={isApproved || isPending}
              className="w-full bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:transition-all focus:outline-none transition-all duration-300 cursor-pointer"
              required={documents.length === 0}
            />
            
            {documents.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 p-2 flex flex-col items-center justify-center">
                    {doc.startsWith("data:application/pdf") ? (
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline py-6"
                      >
                        <Eye className="h-4 w-4" /> View PDF Scan #{index + 1}
                      </a>
                    ) : (
                      <img
                        src={doc}
                        alt={`Document scan ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border border-white/5"
                      />
                    )}
                    <span className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-wider">Page {index + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isApproved && !isPending && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-primary/20 mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting Details...' : 'Submit KYC Details'}
            <Upload className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
}

