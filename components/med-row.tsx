'use client'

import { Check, Pill, Syringe, Zap, CircleDot } from 'lucide-react'
import type { MedForm, MedItem } from '@/lib/cycle-data'
import { cn } from '@/lib/utils'

function FormIcon({ form, className }: { form: MedForm; className?: string }) {
  switch (form) {
    case 'pill':
      return <Pill className={className} aria-hidden="true" />
    case 'suppository':
      return <CircleDot className={className} aria-hidden="true" />
    case 'trigger':
      return <Zap className={className} aria-hidden="true" />
    default:
      return <Syringe className={className} aria-hidden="true" />
  }
}

export function MedRow({
  item,
  checked,
  onToggle,
}: {
  item: MedItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
        checked
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-card hover:border-primary/30 hover:bg-accent/40',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          checked ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        <FormIcon form={item.form} className="size-4.5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={cn(
              'font-medium leading-tight',
              checked && 'text-muted-foreground line-through decoration-primary/50',
            )}
          >
            {item.name}
          </span>
          <span className="font-mono text-sm text-muted-foreground">{item.dose}</span>
          {item.conditional && (
            <span className="rounded-full bg-highlight/15 px-2 py-0.5 text-[10px] font-medium text-highlight">
              confirm with Evewell first
            </span>
          )}
          {item.anticipatedLast && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              likely last dose
            </span>
          )}
        </span>
        {item.window && (
          <span className="mt-0.5 block text-sm text-muted-foreground">{item.window}</span>
        )}
      </span>

      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-transparent text-transparent group-hover:border-primary/50',
        )}
        aria-hidden="true"
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
    </button>
  )
}
