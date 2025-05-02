// /api/admin/withdrawals/update/[id].ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import WithdrawalRequest from '../../../../../../../models/WithdrawalRequest';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { status } = await req.json();

  const updated = await WithdrawalRequest.findByIdAndUpdate(
    params.id,
    { status, updatedAt: new Date() },
    { new: true }
  );

  return NextResponse.json({ success: true, request: updated });
}
