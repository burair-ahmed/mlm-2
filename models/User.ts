import mongoose, { Document, Schema } from "mongoose";
// import dbConnect from "../lib/dbConnect";

// await dbConnect();

export interface IKYC {
  status: "pending" | "approved" | "rejected" | "unverified";
  fullName?: string;
  dateOfBirth?: Date;
  address?: string;
  idType?: string;
  idNumber?: string;
  documents?: string[];
  submittedAt?: Date;
  approvedAt?: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  userName?: string;
  fullName?: string;
  profilePicture?: string;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referrals: mongoose.Types.ObjectId[];
  createdAt: Date;
  balance: number;
  hierarchyLevel: number;
  commissionEarned: number;
  equityUnits: number;
  isAdmin: boolean;
  withdrawnProfits: number;
  purchasedPackages: Array<{
    packageId: mongoose.Types.ObjectId;
    totalUnits: number;
  }>;
  kyc?: IKYC;
  role?: string;
  customRoleId?: mongoose.Types.ObjectId;
  permissions?: string[];
  customPermissions?: string[];
}

const KycSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "unverified"],
      default: "unverified",
    },
    fullName: String,
    dateOfBirth: Date,
    address: String,
    idType: String,
    idNumber: String,
    documents: [String],
    submittedAt: Date,
    approvedAt: Date,
  },
  { _id: false }
);

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String },
  fullName: { type: String },
  profilePicture: { type: String },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "User" },
  referrals: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 },
  hierarchyLevel: { type: Number, default: 0 },
  commissionEarned: { type: Number, default: 0 },
  equityUnits: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  withdrawnProfits: { type: Number, default: 0 },

  purchasedPackages: [
    {
      packageId: {
        type: Schema.Types.ObjectId,
        refPath: "packageType",
        required: true,
      },
      totalUnits: { type: Number, required: true },
    },
  ],

  kyc: { type: KycSchema, default: { status: "unverified" } },

  role: {
    type: String,
    default: "user", // Optional default
  },

  customRoleId: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
  customPermissions: [{ type: String }],
});

// Optional: referral hierarchy virtual
UserSchema.virtual("referralHierarchy", {
  ref: "User",
  localField: "_id",
  foreignField: "referredBy",
});

// Optional: computed permissions virtual (requires population)
UserSchema.methods.getEffectivePermissions = async function () {
  let roleSlugs: string[] = [];

  if (this.customRoleId) {
    const Role = mongoose.model('Role');
    const roleDoc = await Role.findById(this.customRoleId).populate({
      path: 'permissions',
      select: 'slug', // only pull slug
    });

    if (roleDoc && Array.isArray(roleDoc.permissions)) {
      roleSlugs = roleDoc.permissions.map((perm: any) => perm.slug);
    }
  }

  const customSlugs = this.customPermissions || [];

  // Combine and deduplicate
  return [...new Set([...roleSlugs, ...customSlugs])];
};


export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
