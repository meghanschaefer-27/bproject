'use client'

import { MapPin } from 'lucide-react'
import { cycleDays, phaseLabels, formLabels, type CycleDay } from '@/lib/cycle-data'
import { cn } from '@/lib/utils'

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
  return (
    <div className="flex flex-col gap-3">
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

        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onSelectDay(index)}
            className={cn(
              'flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-colors',
              active
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
