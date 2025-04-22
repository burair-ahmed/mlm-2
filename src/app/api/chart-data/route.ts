import { NextRequest, NextResponse } from 'next/server'
import { startOfDay, subDays } from 'date-fns'
import dbConnect from '../../../../lib/dbConnect'
import Transaction from '../../../../models/Transaction'
import { authenticate } from '../../../../middleware/auth'

export async function GET(req: NextRequest) {
  const auth = await authenticate(req)
  if (auth instanceof NextResponse) return auth

  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7', 10)

    const startDate = subDays(new Date(), days)

    const transactions = await Transaction.find({
      createdAt: { $gte: startDate },
      userId: auth._id, // ✅ only show user's own data
    }).lean()

    const grouped: Record<string, Record<string, number>> = {}

    for (const tx of transactions) {
      const date = startOfDay(new Date(tx.createdAt)).toISOString().split('T')[0]
      const type = tx.type
      const amount = tx.amount || 0

      if (!grouped[date]) grouped[date] = {}
      if (!grouped[date][type]) grouped[date][type] = 0

      grouped[date][type] += amount
    }

    const result = Object.entries(grouped)
      .map(([date, types]) => ({ date, ...types }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in chart-data API:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
