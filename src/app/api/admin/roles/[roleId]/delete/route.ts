import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../../lib/dbConnect';
import Role from '../../../../../../../models/Role';
import { authenticate } from '../../../../../../../middleware/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
  const auth = await authenticate(req);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    await Role.findByIdAndDelete(params.roleId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
