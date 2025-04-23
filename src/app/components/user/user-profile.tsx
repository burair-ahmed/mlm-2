"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Types } from "mongoose";

interface UserProfileProps {
  user?: {
    userName?: string;
    fullName?: string;
    email: string;
    profilePicture?: string;
    referralCode: string;
    referredBy?: ObjectId | string;
    balance: number;
    hierarchyLevel: number;
    commissionEarned: number;
    equityUnits: number;
    withdrawnProfits: number;
  }
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
        const errorData = await res.text(); // Get the error page content as text
        console.error("Failed to update profile:", errorData);
        return;
      }
  
      const data = await res.json();  // Parse the response as JSON
      console.log("Profile updated successfully:", data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border">
          <Image
            src={formData.profilePicture || "/default-profile.png"}
            alt="Profile"
            layout="fill"
            objectFit="cover"
          />
        </div>
        {isEditing && (
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        )}
      </div>

      <div className="grid gap-4">
        <Field label="User Name" name="userName" value={formData.userName || ""} onChange={handleChange} isEditing={isEditing} />
        <Field label="Full Name" name="fullName" value={formData.fullName || ""} onChange={handleChange} isEditing={isEditing} />
        <Field label="Email" name="email" value={formData.email} onChange={handleChange} isEditing={false} />
        <Field label="Referral Code" name="referralCode" value={formData.referralCode} onChange={handleChange} isEditing={false} />
        <Field label="Referred By" name="referredBy" value={formData.referredBy ? formData.referredBy.toString() : ""} onChange={handleChange} isEditing={false} />
        <Field label="Balance" name="balance" value={formData.balance.toString()} onChange={handleChange} isEditing={false} />
        <Field label="Hierarchy Level" name="hierarchyLevel" value={formData.hierarchyLevel.toString()} onChange={handleChange} isEditing={false} />
        <Field label="Commission Earned" name="commissionEarned" value={formData.commissionEarned.toString()} onChange={handleChange} isEditing={false} />
        <Field label="Equity Units" name="equityUnits" value={formData.equityUnits.toString()} onChange={handleChange} isEditing={false} />
        <Field label="Withdrawn Profits" name="withdrawnProfits" value={formData.withdrawnProfits.toString()} onChange={handleChange} isEditing={false} />
      </div>

      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={toggleEdit}>Cancel</Button>
          </>
        ) : (
          <Button onClick={toggleEdit}>Edit Profile</Button>
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <Input type="text" name={name} value={value} onChange={onChange} />
      ) : (
        <div className="text-gray-900">{value}</div>
      )}
    </div>
  );
}
