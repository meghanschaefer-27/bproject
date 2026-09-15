'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Snowflake } from 'lucide-react'
import {
  cycleDays,
  phaseLabels,
  formLabels,
  isTodayDate,
  type CycleDay,
  type CyclePhase,
} from '@/lib/cycle-data'
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

function InlineMonthCalendar({
  onSelectDay,
  activeIndex,
}: {
  onSelectDay: (index: number) => void
  activeIndex: number
}) {
  const firstDated = cycleDays.find((day) => day.date)?.date
  const initial = firstDated ? parseISO(firstDated) : new Date()
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1))

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
    <div className="rounded-2xl border border-border bg-card p-4">
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
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
          aria-label="Next month"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium text-muted-foreground">
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
                cycleDay ? `${cycleDay.dateLabel} — ${phaseLabels[cycleDay.phase]}` : `${dayNum}`
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
  )
}

function MedLine({ time, day }: { time: 'AM' | 'PM'; day: CycleDay }) {
  const items = time === 'AM' ? day.morning : day.evening
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-1">
      {items.map((m) => (
        <p key={m.id} className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-mono text-[10px] font-medium text-foreground/70">{time}</span>
          <span className="mx-1 text-muted-foreground/50">•</span>
          {formLabels[m.form]} — <span className="text-foreground">{m.name}</span> {m.dose}
          {m.tbc && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-highlight/15 px-1.5 py-0.5 align-middle text-[10px] font-medium text-highlight">
              TBC
            </span>
          )}
          {m.refrigerated && (
            <span className="ml-1.5 inline-flex items-center gap-0.5 align-middle text-[10px] font-medium text-chart-2">
              <Snowflake className="size-3" aria-hidden="true" />
              Refrigerate
            </span>
          )}
        </p>
      ))}
    </div>
  )
}

export function CycleCalendar({
  isChecked,
  onSelectDay,
  activeIndex,
}: {
  isChecked: (key: string) => boolean
  onSelectDay: (index: number) => void
  activeIndex: number
}) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const scrollToCard = (index: number) => {
    setFocusedIndex(index)
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="flex flex-col gap-3">
      <InlineMonthCalendar
        onSelectDay={scrollToCard}
        activeIndex={focusedIndex ?? activeIndex}
      />
      {cycleDays.map((day, index) => {
        const keys = [
          ...day.morning.map((m) => `${day.id}:am:${m.id}`),
          ...day.evening.map((m) => `${day.id}:pm:${m.id}`),
        ]
        const done = keys.filter((k) => isChecked(k)).length
        const total = keys.length
        const complete = total > 0 && done === total
        const active = index === activeIndex
        const hasMeds = day.morning.length > 0 || day.evening.length > 0

        const focused = index === focusedIndex

        return (
          <button
            key={day.id}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            type="button"
            onClick={() => onSelectDay(index)}
            className={cn(
              'flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-colors',
              active || focused
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border bg-card hover:border-primary/30 hover:bg-accent/40',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{day.dateLabel}</p>
                <p className="truncate text-xs text-muted-foreground">{day.stimDay}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {day.appointment && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-medium',
                      day.appointment.potential ? 'text-highlight/60' : 'text-highlight',
                    )}
                  >
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {day.appointment.potential ? 'Possible appointment' : 'Appointment'}
                  </span>
                )}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    day.phase === 'stimulation' && 'bg-primary/10 text-primary',
                    day.phase === 'trigger' && 'bg-highlight/15 text-highlight',
                    day.phase === 'collection' && 'bg-chart-2/15 text-chart-2',
                  )}
                >
                  {phaseLabels[day.phase]}
                </span>
              </div>
            </div>

            {hasMeds ? (
              <div className="flex flex-col gap-1 border-t border-border/60 pt-2.5">
                <MedLine time="AM" day={day} />
                <MedLine time="PM" day={day} />
              </div>
            ) : (
              <p className="border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
                No scheduled medications
              </p>
            )}

            {total > 0 && (
              <span
                className={cn(
                  'font-mono text-[11px]',
                  complete ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {done}/{total} taken
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
