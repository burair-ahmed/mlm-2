// File: src/app/api/users/[userId]/hierarchy/route.ts

import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../../models/User';
import dbConnect from '../../../../../../lib/dbConnect';
import { authenticate } from '../../../../../../middleware/auth';
// import { HydratedDocument } from 'mongoose';

interface HierarchyUser {
  _id: string;
  email: string;
  referralCode: string;
  balance: number;
  referrals: HierarchyUser[];
}

interface TreeNode extends HierarchyUser {
  name: string;
  attributes: {
    balance: number;
    referralCode: string;
  };
  children: TreeNode[];
}

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
): Promise<NextResponse> {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  const { userId } = context.params;

  try {
    const buildTree = async (userId: string): Promise<TreeNode | null> => {
      const user = await User.findById(userId)
  .select('email referralCode balance referrals')
  .populate({
    path: 'referrals',
    select: 'email referralCode balance referrals',
  })
  .lean() as unknown as HierarchyUser;


      if (!user) return null;

      const children = await Promise.all(
        user.referrals.map(ref => buildTree(ref._id.toString()))
      );

      return {
        _id: user._id.toString(),
        email: user.email,
        referralCode: user.referralCode,
        balance: user.balance,
        referrals: user.referrals.map(ref => ({
          _id: ref._id.toString(),
          email: ref.email,
          referralCode: ref.referralCode,
          balance: ref.balance,
          referrals: [],
        })),
        name: user.email,
        attributes: {
          balance: user.balance,
          referralCode: user.referralCode,
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
