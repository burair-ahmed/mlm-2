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

    // Pre-populate all dates in range with zero values for nice continuous charts
    for (let i = 0; i <= days; i++) {
      const dateStr = startOfDay(subDays(new Date(), i)).toISOString().split('T')[0]
      grouped[dateStr] = {
        deposit: 0,
        purchase: 0,
        commission: 0,
        withdrawal: 0
      }
    }

    for (const tx of transactions) {
      const date = startOfDay(new Date(tx.createdAt)).toISOString().split('T')[0]
      let chartType = tx.type

      // Map DB types to Chart types
      if (tx.type === 'profit-withdrawal' || tx.type === 'withdrawal') {
        chartType = 'withdrawal'
      } else if (tx.type === 'equity_purchase' || tx.type === 'cash_to_equity' || tx.type === 'purchase') {
        chartType = 'purchase'
      } else if (tx.type === 'deposit') {
        chartType = 'deposit'
      } else if (tx.type === 'commission') {
        chartType = 'commission'
      } else {
        continue // Skip unknown transaction types
      }

      // Calculate USD value:
      // If amount is non-zero, use absolute value of amount. Otherwise fall back to equityUnits * 10
      let usdValue = 0
      if (tx.amount && tx.amount !== 0) {
        usdValue = Math.abs(tx.amount)
      } else if (tx.equityUnits && tx.equityUnits !== 0) {
        usdValue = tx.equityUnits * 10
      }

      if (!grouped[date]) {
        grouped[date] = {
          deposit: 0,
          purchase: 0,
          commission: 0,
          withdrawal: 0
        }
      }

      grouped[date][chartType] += usdValue
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
