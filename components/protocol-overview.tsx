'use client'

import { CalendarClock } from 'lucide-react'
import { medReference, protocolPhases } from '@/lib/cycle-data'

export function ProtocolOverview() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Protocol overview</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          A summary of your Evewell stimulation protocol, from baseline scan through to the trigger.
        </p>

        <ol className="flex flex-col gap-3">
          {protocolPhases.map((phase) => (
            <li
              key={phase.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {phase.stimRange}
                </span>
                {phase.range && (
                  <span className="text-xs font-medium text-muted-foreground">{phase.range}</span>
                )}
              </div>

              {phase.appointment && (
                <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <CalendarClock className="size-3.5 text-primary" aria-hidden="true" />
                  {phase.appointment}
                </div>
              )}

              <p className="text-sm leading-relaxed text-muted-foreground">{phase.summary}</p>

              {phase.points.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {phase.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-foreground"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Medication reference</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Full dosing table for every medication used across the cycle.
        </p>

        <div className="flex flex-col gap-3">
          {medReference.map((med) => (
            <div key={med.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{med.name}</h3>
                <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {med.dose}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Route</dt>
                  <dd className="text-foreground">{med.route}</dd>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Frequency</dt>
                  <dd className="text-foreground">{med.frequency}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Duration</dt>
                  <dd className="text-foreground">{med.duration}</dd>
                </div>
              </dl>

              {med.info && (
                <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                  {med.info}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
