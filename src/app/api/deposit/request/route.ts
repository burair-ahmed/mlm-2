import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import DepositRequest from '../../../../../models/DepositRequest';
import { authenticate } from '../../../../../middleware/auth';
import { createNotification } from '../../../../../lib/notifications';
import { uploadToCloudinary } from '../../../../../lib/cloudinary';
import { getClientIp, isRateLimited } from '../../../../../lib/auth/rateLimiter';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitResult = isRateLimited(`deposit_request_${ip}`, 20, 60 * 1000); // 20 req/min
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const formData = await req.formData();
    const amount = formData.get('amount') as string;
    const pkrAmount = formData.get('pkrAmount') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const notes = (formData.get('notes') as string) || '';
    const proofFile = formData.get('proof') as File | null;

    if (!amount || !paymentMethod || !proofFile) {
      return NextResponse.json(
        { error: 'Amount, payment method, and proof file are required' },
        { status: 400 }
      );
    }

    // Validate proof file type and size
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(proofFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.' },
        { status: 400 }
      );
    }

    if (proofFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max proof image size is 5MB.' },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const numericPkrAmount = pkrAmount ? parseFloat(pkrAmount) : undefined;

    // Convert proof file to Buffer
    const arrayBuffer = await proofFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream upload image to Cloudinary
    let proofUrl = '';
    try {
      const uploadResult = await uploadToCloudinary(buffer, 'deposits');
      proofUrl = uploadResult.secure_url;
    } catch (uploadError) {
      console.error('[CLOUDINARY UPLOAD ERROR]', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload proof of payment image to cloud storage' },
        { status: 500 }
      );
    }

    const newRequest = await DepositRequest.create({
      userId: auth._id,
      amount: numericAmount,
      pkrAmount: numericPkrAmount,
      paymentMethod,
      notes,
      proofUrl,
      status: 'Pending'
    });

    // Create a notification for the user
    await createNotification(auth._id, {
      title: 'Deposit Request Submitted',
      message: `Your deposit request of $${numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} via ${paymentMethod} has been submitted and is pending review.`,
      type: 'deposit',
      link: '/user?tab=Deposit+History'
    });

    return NextResponse.json({
      success: true,
      request: newRequest
    }, { status: 201 });

  } catch (error) {
    console.error('[DEPOSIT REQUEST ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
