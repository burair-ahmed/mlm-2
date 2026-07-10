import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const authResult = await authenticate(req);
  if (authResult instanceof NextResponse) return authResult;

  const safeUser = {
    _id: authResult._id,
    email: authResult.email,
    userName: authResult.userName,
    fullName: authResult.fullName,
    profilePicture: authResult.profilePicture,
    role: authResult.role,
    balance: authResult.balance,
    depositedBalance: authResult.depositedBalance,
    hierarchyLevel: authResult.hierarchyLevel,
    commissionEarned: authResult.commissionEarned,
    equityUnits: authResult.equityUnits,
    referralCode: authResult.referralCode,
    referredBy: authResult.referredBy,
    kyc: authResult.kyc,
  };

  return NextResponse.json(safeUser);
}

