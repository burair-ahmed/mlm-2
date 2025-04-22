// Updated component with dynamic API data instead of hardcoded chartData
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  visitors: {
    label: "Transactions",
  },
  deposit: {
    label: "Deposit",
    color: "hsl(var(--chart-1))",
  },
  purchase: {
    label: "Purchase",
    color: "hsl(var(--chart-2))",
  },
  commission: {
    label: "Commission",
    color: "hsl(var(--chart-3))",
  },
  withdrawal: {
    label: "Withdrawal",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig


type ChartDataPoint = {
  date: string
  deposit?: number
  purchase?: number
  commission?: number
  withdrawal?: number
}
export function ChartAreaInteractive() {
  // const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [data, setData] = React.useState<ChartDataPoint[]>([])


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/chart-data?days=${timeRange.replace("d", "")}`)
        const json = await res.json()
  
        if (res.ok && Array.isArray(json)) {
          setData(json)
        } else {
          console.error("Unexpected data format from /api/chart-data:", json)
          setData([])
        }
      } catch (error) {
        console.error("Error fetching chart data:", error)
        setData([])
      }
    }
  
    fetchData()
  }, [timeRange])
  
  
  

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Overview of transaction activity
          </span>
          <span className="@[540px]/card:hidden">Overview</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              {Object.keys(chartConfig).map((key) => {
                if (key === "visitors") return null
                return (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                )
              })}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {Object.keys(chartConfig).map((key) => {
              if (key === "visitors") return null
              return (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#fill${key})`}
                  stroke={`var(--color-${key})`}
                  stackId="a"
                />
              )
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}