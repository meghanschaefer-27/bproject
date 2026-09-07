'use client'

import { ChevronLeft, ChevronRight, MapPin, Moon, Sun } from 'lucide-react'
import {
  cycleDays,
  estimateEggCollection,
  phaseLabels,
  type CycleDay,
  type MedItem,
} from '@/lib/cycle-data'
import { MedRow } from '@/components/med-row'
import { cn } from '@/lib/utils'

function MedSection({
  title,
  icon,
  items,
  dayId,
  slot,
  isChecked,
  onToggle,
}: {
  title: string
  icon: React.ReactNode
  items: MedItem[]
  dayId: string
  slot: 'am' | 'pm'
  isChecked: (id: string) => boolean
  onToggle: (id: string) => void
}) {
  if (items.length === 0) return null
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => {
          const key = `${dayId}:${slot}:${item.id}`
          return (
            <MedRow
              key={key}
              item={item}
              checked={isChecked(key)}
              onToggle={() => onToggle(key)}
            />
          )
        })}
      </div>
    </section>
  )
}

export function TodayView({
  day,
  index,
  onNavigate,
  isChecked,
  onToggle,
  note,
  onNoteChange,
  triggerDateTime,
  onTriggerChange,
}: {
  day: CycleDay
  index: number
  onNavigate: (index: number) => void
  isChecked: (key: string) => boolean
  onToggle: (key: string) => void
  note: string
  onNoteChange: (value: string) => void
  triggerDateTime: string
  onTriggerChange: (value: string) => void
}) {
  const dayKeys = [
    ...day.morning.map((m) => `${day.id}:am:${m.id}`),
    ...day.evening.map((m) => `${day.id}:pm:${m.id}`),
  ]
  const done = dayKeys.filter((k) => isChecked(k)).length
  const total = dayKeys.length
  const eggCollection = estimateEggCollection(triggerDateTime)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate(index - 1)}
          disabled={index === 0}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-card"
          aria-label="Previous day"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {phaseLabels[day.phase]}
            </span>
            {day.cycleDay && (
              <span className="font-mono text-xs text-muted-foreground">{day.cycleDay}</span>
            )}
          </div>
          <h2 className="mt-1 text-balance text-xl font-semibold tracking-tight">
            {day.dateLabel}
          </h2>
          <p className="text-sm text-muted-foreground">{day.stimDay}</p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(index + 1)}
          disabled={index === cycleDays.length - 1}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-card"
          aria-label="Next day"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {day.appointment && (
        <div
          className={cn(
            'flex items-start gap-3 rounded-xl border p-3.5',
            day.appointment.potential
              ? 'border-dashed border-highlight/50 bg-highlight/5'
              : 'border-highlight/40 bg-highlight/10',
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-highlight/15 text-highlight">
            <MapPin className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {day.appointment.potential ? 'Possible appointment' : 'Appointment'}
            </p>
            <p className="text-sm text-muted-foreground">{day.appointment.label}</p>
          </div>
        </div>
      )}

      {day.phase === 'trigger' && (
        <div className="space-y-2.5 rounded-xl border border-highlight/40 bg-highlight/10 p-3.5">
          <label htmlFor="trigger-dt" className="block text-sm font-medium">
            Trigger date &amp; time from Evewell
          </label>
          <input
            id="trigger-dt"
            type="datetime-local"
            value={triggerDateTime}
            onChange={(e) => onTriggerChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          {eggCollection ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Egg collection ≈{' '}
              <span className="font-medium text-foreground">{eggCollection}</span>{' '}
              (about 36 hours later). Evewell will confirm the exact time.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Enter the exact trigger time and we&apos;ll estimate your egg collection about 36
              hours later.
            </p>
          )}
        </div>
      )}

      {day.phase === 'collection' && eggCollection && (
        <div className="rounded-xl border border-chart-2/30 bg-chart-2/10 p-3.5 text-sm leading-relaxed text-secondary-foreground">
          Estimated from your trigger time:{' '}
          <span className="font-medium">{eggCollection}</span>. Evewell will confirm the exact time.
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {done}/{total} done
          </span>
        </div>
      )}

      <div className="space-y-5">
        <MedSection
          title="Morning"
          icon={<Sun className="size-4" aria-hidden="true" />}
          items={day.morning}
          dayId={day.id}
          slot="am"
          isChecked={isChecked}
          onToggle={onToggle}
        />
        <MedSection
          title="Evening"
          icon={<Moon className="size-4" aria-hidden="true" />}
          items={day.evening}
          dayId={day.id}
          slot="pm"
          isChecked={isChecked}
          onToggle={onToggle}
        />
        {total === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            No scheduled medications for this day.
          </p>
        )}
      </div>

      {day.note && (
        <p className="rounded-xl bg-secondary/60 p-3.5 text-sm leading-relaxed text-secondary-foreground">
          {day.note}
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor="day-note" className="text-sm font-medium text-muted-foreground">
          My notes for this day
        </label>
        <textarea
          id="day-note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="How you felt, side effects, questions for Evewell…"
          className="w-full resize-y rounded-xl border border-border bg-card px-3.5 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  )
}
