import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Notification from '../../../../../../models/Notification';
import { authenticate } from '../../../../../../middleware/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const { id } = await params;

    // Find and update the notification if it belongs to the authenticated user
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: auth._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('[MARK SINGLE READ ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update notification status' },
      { status: 500 }
    );
  }
}
