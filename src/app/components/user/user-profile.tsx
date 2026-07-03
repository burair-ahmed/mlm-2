"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Types } from "mongoose";
import { User as UserIcon, Camera, Edit2, Check, X, Shield, Wallet, Award, Network } from "lucide-react";

interface UserProfileProps {
  user?: {
    userName?: string;
    fullName?: string;
    email: string;
    profilePicture?: string;
    referralCode: string;
    referredBy?: ObjectId | string;
    balance: number;
    depositedBalance: number;
    hierarchyLevel: number;
    commissionEarned: number;
    equityUnits: number;
    withdrawnProfits: number;
  };
}

type ObjectId = Types.ObjectId;

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    userName?: string;
    fullName?: string;
    email: string;
    profilePicture?: string;
    referralCode: string;
    referredBy?: ObjectId | string;
    balance: number;
    depositedBalance: number;
    hierarchyLevel: number;
    commissionEarned: number;
    equityUnits: number;
    withdrawnProfits: number;
  }>({
    userName: user?.userName || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
    referralCode: user?.referralCode || "",
    referredBy: user?.referredBy || "",
    balance: user?.balance || 0,
    depositedBalance: user?.depositedBalance || 0,
    hierarchyLevel: user?.hierarchyLevel || 0,
    commissionEarned: user?.commissionEarned || 0,
    equityUnits: user?.equityUnits || 0,
    withdrawnProfits: user?.withdrawnProfits || 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString() || "";
      setFormData((prev) => ({ ...prev, profilePicture: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Failed to update profile:", errorData);
        return;
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-white/5 bg-slate-900/35 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background glow blob */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-glow-emerald pointer-events-none opacity-20" />

      {/* Profile Header & Avatar section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-950/20 flex items-center justify-center group shadow-lg">
          {formData.profilePicture ? (
            <Image
              src={formData.profilePicture}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <UserIcon className="h-10 w-10 text-muted-foreground" />
          )}

          {isEditing && (
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="h-5 w-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {formData.fullName || "User Profile"}
          </h2>
          <p className="text-xs text-muted-foreground">{formData.email}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary tracking-wider uppercase mt-2">
            <Shield className="h-3 w-3 text-glow-emerald" /> Level {formData.hierarchyLevel} Node
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field
          label="Username"
          name="userName"
          value={formData.userName || ""}
          onChange={handleChange}
          isEditing={isEditing}
          icon={<UserIcon className="h-4 w-4" />}
        />
        <Field
          label="Full Name"
          name="fullName"
          value={formData.fullName || ""}
          onChange={handleChange}
          isEditing={isEditing}
          icon={<UserIcon className="h-4 w-4" />}
        />
        <Field
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          isEditing={false}
          icon={<UserIcon className="h-4 w-4" />}
        />
        <Field
          label="Referral Code"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleChange}
          isEditing={false}
          icon={<Award className="h-4 w-4 text-accent text-glow-gold" />}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-accent uppercase tracking-wider text-glow-gold">Portfolio Overview</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1 shadow-lg relative">
            <Wallet className="h-4 w-4 text-primary absolute top-3 right-3 opacity-60" />
            <p className="text-[10px] text-muted-foreground uppercase">Deposited</p>
            <p className="text-base font-bold text-foreground">${formData.depositedBalance?.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1 shadow-lg relative">
            <Wallet className="h-4 w-4 text-primary absolute top-3 right-3 opacity-60" />
            <p className="text-[10px] text-muted-foreground uppercase">Withdrawable</p>
            <p className="text-base font-bold text-foreground">${formData.balance?.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1 shadow-lg relative">
            <Award className="h-4 w-4 text-accent absolute top-3 right-3 opacity-60" />
            <p className="text-[10px] text-muted-foreground uppercase">Equity Units</p>
            <p className="text-base font-bold text-accent text-glow-gold">{formData.equityUnits?.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1 shadow-lg relative">
            <Network className="h-4 w-4 text-primary absolute top-3 right-3 opacity-60" />
            <p className="text-[10px] text-muted-foreground uppercase">Yield Earnings</p>
            <p className="text-base font-bold text-primary">${formData.commissionEarned?.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1 shadow-lg relative">
            <Wallet className="h-4 w-4 text-muted-foreground absolute top-3 right-3 opacity-60" />
            <p className="text-[10px] text-muted-foreground uppercase">Withdrawn</p>
            <p className="text-base font-bold text-foreground">${formData.withdrawnProfits?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Form buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/5">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 flex items-center gap-1.5 transition-all duration-300"
            >
              <Check className="h-4 w-4" /> Save Profile
            </button>
            <button
              onClick={toggleEdit}
              className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-300"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEdit}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-300"
          >
            <Edit2 className="h-3.5 w-3.5 text-primary" /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  isEditing,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase">{label}</label>
      {isEditing ? (
        <div className="relative flex items-center w-full">
          {icon && <div className="absolute left-4 text-muted-foreground pointer-events-none">{icon}</div>}
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300 ${
              icon ? "pl-11" : ""
            }`}
          />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-foreground font-semibold flex items-center gap-2.5 w-full">
          {icon && <div className="text-muted-foreground shrink-0">{icon}</div>}
          <span className="truncate">{value || <span className="text-muted-foreground text-xs italic">Not configured</span>}</span>
        </div>
      )}
    </div>
  );
}
