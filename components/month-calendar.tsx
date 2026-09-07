'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cycleDays, phaseLabels, isTodayDate, type CyclePhase } from '@/lib/cycle-data'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const dateToIndex = new Map<string, number>()
cycleDays.forEach((day, index) => {
  if (day.date) dateToIndex.set(day.date, index)
})

const phaseDot: Record<CyclePhase, string> = {
  stimulation: 'bg-primary',
  trigger: 'bg-highlight',
  collection: 'bg-chart-2',
}

function parseISO(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Monday-first weekday offset (Mon = 0 … Sun = 6). */
function mondayOffset(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function MonthCalendar({
  onSelectDay,
  onClose,
  activeIndex,
}: {
  onSelectDay: (index: number) => void
  onClose: () => void
  activeIndex: number
}) {
  const firstDated = cycleDays.find((day) => day.date)?.date
  const initial = firstDated ? parseISO(firstDated) : new Date()
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = mondayOffset(firstOfMonth)
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthLabel = view.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
  const activeDate = cycleDays[activeIndex]?.date

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a day"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setView(new Date(year, month - 1, 1))}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-5" />
          </button>
          <h2 className="text-base font-semibold tracking-tight">{monthLabel}</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
              aria-label="Next month"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
              aria-label="Close calendar"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[11px] font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((dayNum, i) => {
            if (dayNum === null) return <div key={`blank-${i}`} />
            const iso = toISO(new Date(year, month, dayNum))
            const index = dateToIndex.get(iso)
            const hasCycle = index !== undefined
            const cycleDay = hasCycle ? cycleDays[index] : undefined
            const today = isTodayDate(iso)
            const active = activeDate === iso

            return (
              <button
                key={iso}
                type="button"
                disabled={!hasCycle}
                onClick={() => hasCycle && onSelectDay(index!)}
                className={cn(
                  'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors',
                  hasCycle
                    ? 'cursor-pointer text-foreground hover:bg-accent'
                    : 'text-muted-foreground/40',
                  active && 'bg-primary text-primary-foreground hover:bg-primary',
                  today && !active && 'ring-2 ring-primary/50',
                )}
                aria-label={
                  cycleDay
                    ? `${cycleDay.dateLabel} — ${phaseLabels[cycleDay.phase]}`
                    : `${dayNum}`
                }
                aria-current={active ? 'date' : undefined}
              >
                <span className={cn('font-medium', active && 'text-primary-foreground')}>
                  {dayNum}
                </span>
                {cycleDay && (
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      active ? 'bg-primary-foreground' : phaseDot[cycleDay.phase],
                    )}
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Stimulation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-highlight" aria-hidden="true" />
            Trigger
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-chart-2" aria-hidden="true" />
            Egg collection
          </span>
        </div>
      </div>
    </div>
  )
}
