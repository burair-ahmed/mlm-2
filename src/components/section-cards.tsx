'use client'

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useAuth } from "../../context/AuthContext"

interface Investment {
  profitAmount: number
}


export function SectionCards() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [investments, setInvestments] = useState<Investment[]>([])
  const [totalProfit, setTotalProfit] = useState(0)
  const [referralCount, setReferralCount] = useState(0)

  const { user } = useAuth() // ✅ get user from AuthContext

  useEffect(() => {
    const fetchInvestments = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch("/api/transactions/my-investments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (data.success) {
          const investmentsData = data.data?.investments || data.data
          setInvestments(investmentsData)

          const total = investmentsData.reduce(
            (sum: number, pkg: Investment) => sum + (pkg.profitAmount || 0),
            0
          )
          setTotalProfit(total)
        }
      } catch (err) {
        console.error("Failed to fetch investments:", err)
      }
    }

    fetchInvestments()
  }, [])
  useEffect(() => {
    const fetchReferralCount = async () => {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch("/api/users/referral-count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
  
        const data = await res.json()
        if (data.success) {
          setReferralCount(data.referralCount)
        }
      } catch (err) {
        console.error("Failed to fetch referral count:", err)
      }
    }
  
    fetchReferralCount()
  }, [])
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Profit Available for Withdrawal</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalProfit} Equity Units
          </CardTitle>
            <p className="text-[12px] text-[#282828]">Tap to see valuation in $</p>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Profit Available for Withdrawal across all investments
          </div>
        </CardFooter>
      </Card>

      {/* Withdrawn Profit */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Withdrawn Profit</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {user?.withdrawnProfits} Equity Units
          </CardTitle>
          <p className="text-[12px] text-[#282828]">Tap to see valuation in $</p>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -3.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Withdrawals this month <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total profit already withdrawn
          </div>
        </CardFooter>
      </Card>

{/* Total Referrals */}
<Card className="@container/card">
  <CardHeader className="relative">
    <CardDescription>Total Referrals</CardDescription>
    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
      {referralCount}
    </CardTitle>
    <div className="absolute right-4 top-4">
      <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
        <TrendingUpIcon className="size-3" />
        +8.9%
      </Badge>
    </div>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">
      New signups from your code <TrendingUpIcon className="size-4" />
    </div>
    <div className="text-muted-foreground">
      Referrals linked through your code
    </div>
  </CardFooter>
</Card>

      {/* Growth Rate */}
      <Card className="@container/card">
  <CardHeader className="relative">
    <CardDescription>Total Balance</CardDescription>
    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
      {user?.equityUnits} Equity Units
    </CardTitle>
    <p className="text-[12px] text-[#282828]">Tap to see valuation in $</p>
    <div className="absolute right-4 top-4">
      <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
        <TrendingUpIcon className="size-3" />
        +4.5%
      </Badge>
    </div>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">
      Based on all deposits and returns <TrendingUpIcon className="size-4" />
    </div>
    <div className="text-muted-foreground">
      This is your overall balance
    </div>
  </CardFooter>
</Card>

    </div>
  )
}
