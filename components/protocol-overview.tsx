'use client'

import { Snowflake } from 'lucide-react'
import { medReference } from '@/lib/cycle-data'

export function ProtocolOverview() {
  return (
    <div className="flex flex-col gap-8">
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
                <div className="flex items-center gap-2">
                  {med.refrigerated && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-chart-2/30 bg-chart-2/10 px-2 py-0.5 text-[10px] font-medium text-chart-2">
                      <Snowflake className="size-3" aria-hidden="true" />
                      Refrigerate
                    </span>
                  )}
                  <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    {med.dose}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Time</dt>
                  <dd className="text-foreground">{med.timing}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Route</dt>
                  <dd className="text-foreground">{med.route}</dd>
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
