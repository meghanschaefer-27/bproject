'use client'

import { Star } from 'lucide-react'
import { milestones } from '@/lib/cycle-data'
import { cn } from '@/lib/utils'

export function MilestoneTimeline({
  results,
  onResultChange,
}: {
  results: Record<string, string>
  onResultChange: (key: string, value: string) => void
}) {
  return (
    <ol className="relative space-y-6 pl-8">
      <span
        className="absolute left-[11px] top-2 bottom-2 w-px bg-border"
        aria-hidden="true"
      />
      {milestones.map((m) => (
        <li key={m.id} className="relative">
          <span
            className={cn(
              'absolute -left-8 top-0.5 flex size-6 items-center justify-center rounded-full ring-4 ring-background',
              m.big ? 'bg-highlight text-highlight-foreground' : 'bg-primary text-primary-foreground',
            )}
            aria-hidden="true"
          >
            {m.big ? <Star className="size-3.5" fill="currentColor" /> : null}
          </span>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h3 className="font-semibold tracking-tight">{m.title}</h3>
              {m.big && (
                <span className="rounded-full bg-highlight/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-highlight">
                  Big update
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-muted-foreground">{m.when}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{m.description}</p>
          </div>

          {m.results && (
            <div className="mt-3 grid gap-3 rounded-xl border border-border bg-card p-3.5 sm:grid-cols-2">
              {m.results.map((r) => (
                <div key={r.key} className="space-y-1.5">
                  <label
                    htmlFor={`result-${r.key}`}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {r.label}
                  </label>
                  <input
                    id={`result-${r.key}`}
                    type="text"
                    inputMode="text"
                    value={results[r.key] ?? ''}
                    onChange={(e) => onResultChange(r.key, e.target.value)}
                    placeholder={r.placeholder}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
