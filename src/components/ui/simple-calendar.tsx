"use client"

import { useState } from "react"
import { addMonths, format, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

interface SimpleCalendarProps {
  selected?: Date
  onSelect: (date: Date) => void
}

export function SimpleCalendar({ selected, onSelect }: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selected ?? new Date())

  const handlePrevious = () => setCurrentMonth(prev => addMonths(prev, -1))
  const handleNext = () => setCurrentMonth(prev => addMonths(prev, 1))

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day
        const isOutside = !isSameMonth(currentDay, currentMonth)
        const isSelected = selected && isSameDay(currentDay, selected)

        days.push(
          <button
            key={currentDay.toString()}
            onClick={() => onSelect(currentDay)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal",
              isOutside && "text-muted-foreground",
              isSelected && "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary focus:text-primary-foreground"
            )}
          >
            {format(currentDay, "d")}
          </button>
        )
        day = addDays(day, 1)
      }
    }

    return <div className="grid grid-cols-7 gap-1 mt-2">{days}</div>
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevious}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          onClick={handleNext}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-between text-[0.8rem] font-normal text-muted-foreground">
  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
    <div key={`${d}-${i}`} className="w-9 text-center">
      {d}
    </div>
  ))}
</div>

      {renderDays()}
    </div>
  )
}
