// File: src/app/api/users/[userId]/hierarchy/route.ts

import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../../models/User';
import dbConnect from '../../../../../../lib/dbConnect';
import { authenticate } from '../../../../../../middleware/auth';

interface HierarchyUser {
  _id: string;
  email: string;
  referralCode: string;
  balance: number;
  equityUnits: number;
  commissionEarned: number;
  createdAt: string | Date;
  kyc?: {
    status: string;
  };
  purchasedPackages?: unknown[];
  referrals: HierarchyUser[];
}

interface TreeNode {
  _id: string;
  email: string;
  referralCode: string;
  balance: number;
  name: string;
  attributes: {
    balance: number;
    referralCode: string;
    equityUnits: number;
    commissionEarned: number;
    kycStatus: string;
    level: number;
    joinedAt: string;
    totalDirectReferrals: number;
    purchasedPackagesCount: number;
  };
  children: TreeNode[];
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = await context.params;

  if (auth._id.toString() !== userId && !auth.isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to view this hierarchy tree" },
      { status: 403 }
    );
  }

  if (!process.env.MONGODB_URI) {
    const mockHierarchy: TreeNode = {
      _id: userId,
      email: "admin@example.com",
      referralCode: "ADMIN123",
      balance: 10000,
      name: "admin@example.com",
      attributes: {
        balance: 10000,
        referralCode: "ADMIN123",
        equityUnits: 120,
        commissionEarned: 2450,
        kycStatus: "approved",
        level: 0,
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalDirectReferrals: 2,
        purchasedPackagesCount: 3,
      },
      children: [
        {
          _id: "mock-user-2",
          email: "user2@example.com",
          referralCode: "USER2_123",
          balance: 500,
          name: "user2@example.com",
          attributes: {
            balance: 500,
            referralCode: "USER2_123",
            equityUnits: 20,
            commissionEarned: 150,
            kycStatus: "pending",
            level: 1,
            joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            totalDirectReferrals: 0,
            purchasedPackagesCount: 1,
          },
          children: []
        },
        {
          _id: "mock-user-3",
          email: "user3@example.com",
          referralCode: "USER3_123",
          balance: 1200,
          name: "user3@example.com",
          attributes: {
            balance: 1200,
            referralCode: "USER3_123",
            equityUnits: 80,
            commissionEarned: 500,
            kycStatus: "approved",
            level: 1,
            joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            totalDirectReferrals: 1,
            purchasedPackagesCount: 2,
          },
          children: [
            {
              _id: "mock-user-4",
              email: "sub-user4@example.com",
              referralCode: "SUB4_123",
              balance: 150,
              name: "sub-user4@example.com",
              attributes: {
                balance: 150,
                referralCode: "SUB4_123",
                equityUnits: 5,
                commissionEarned: 0,
                kycStatus: "unverified",
                level: 2,
                joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                totalDirectReferrals: 0,
                purchasedPackagesCount: 0,
              },
              children: []
            }
          ]
        }
      ]
    };
    return NextResponse.json(mockHierarchy);
  }

  await dbConnect();

  try {
    const buildTree = async (uId: string, currentDepth: number = 0): Promise<TreeNode | null> => {
      const user = await User.findById(uId)
        .select('email referralCode balance referrals equityUnits commissionEarned createdAt kyc purchasedPackages')
        .populate({
          path: 'referrals',
          select: 'email referralCode balance referrals equityUnits commissionEarned createdAt kyc purchasedPackages',
        })
        .lean() as unknown as HierarchyUser;

      if (!user) return null;

      const children = await Promise.all(
        user.referrals.map(ref => buildTree(ref._id.toString(), currentDepth + 1))
      );

      return {
        _id: user._id.toString(),
        email: user.email,
        referralCode: user.referralCode,
        balance: user.balance,
        name: user.email,
        attributes: {
          balance: user.balance,
          referralCode: user.referralCode,
          equityUnits: user.equityUnits || 0,
          commissionEarned: user.commissionEarned || 0,
          kycStatus: user.kyc?.status || 'unverified',
          level: currentDepth,
          joinedAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          totalDirectReferrals: user.referrals ? user.referrals.length : 0,
          purchasedPackagesCount: user.purchasedPackages ? user.purchasedPackages.length : 0
        },
        children: children.filter(Boolean) as TreeNode[],
      };
    };

    const hierarchy = await buildTree(userId);

    if (!hierarchy) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(hierarchy);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching hierarchy' },
      { status: 500 }
    );
  }
}
