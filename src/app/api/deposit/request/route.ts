import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import dbConnect from '../../../../../lib/dbConnect';
import DepositRequest from '../../../../../models/DepositRequest';
import { authenticate } from '../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    const formData = await req.formData();
    const amount = formData.get('amount') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const notes = (formData.get('notes') as string) || '';
    const proofFile = formData.get('proof') as File | null;

    if (!amount || !paymentMethod || !proofFile) {
      return NextResponse.json(
        { error: 'Amount, payment method, and proof file are required' },
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

    // Save proof image file
    const arrayBuffer = await proofFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'deposits');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = path.extname(proofFile.name) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const proofUrl = `/uploads/deposits/${filename}`;

    const newRequest = await DepositRequest.create({
      userId: auth._id,
      amount: numericAmount,
      paymentMethod,
      notes,
      proofUrl,
      status: 'Pending'
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
