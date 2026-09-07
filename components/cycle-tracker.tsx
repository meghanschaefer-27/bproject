'use client'

import { useEffect, useState } from 'react'
import { BookOpen, CalendarClock, CalendarDays, ClipboardCheck, Sparkles } from 'lucide-react'
import { cycleDays, getTodayIndex } from '@/lib/cycle-data'
import { useLocalStorage } from '@/lib/use-local-storage'
import { TodayView } from '@/components/today-view'
import { CycleCalendar } from '@/components/cycle-calendar'
import { MilestoneTimeline } from '@/components/milestone-timeline'
import { MonthCalendar } from '@/components/month-calendar'
import { ProtocolOverview } from '@/components/protocol-overview'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'today' | 'calendar' | 'milestones'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BookOpen className="size-4" /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="size-4" /> },
  { id: 'today', label: 'Today', icon: <ClipboardCheck className="size-4" /> },
  { id: 'milestones', label: 'Milestones', icon: <Sparkles className="size-4" /> },
]

export function CycleTracker() {
  const [tab, setTab] = useState<Tab>('calendar')
  const [selectedIndex, setSelectedIndex] = useLocalStorage('efc:selected-day', 0)
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('efc:checked', {})
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('efc:notes', {})
  const [results, setResults] = useLocalStorage<Record<string, string>>('efc:results', {})
  const [triggerDateTime, setTriggerDateTime] = useLocalStorage('efc:trigger', '')

  const [todayIndex, setTodayIndex] = useState<number | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  useEffect(() => {
    const ti = getTodayIndex()
    setTodayIndex(ti)
    if (ti !== null) {
      setSelectedIndex(Math.min(Math.max(ti, 0), cycleDays.length - 1))
    }
  }, [setSelectedIndex])

  const index = Math.min(Math.max(selectedIndex, 0), cycleDays.length - 1)
  const day = cycleDays[index]

  const isChecked = (key: string) => Boolean(checked[key])
  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))

  const goToDay = (i: number) => {
    setSelectedIndex(Math.min(Math.max(i, 0), cycleDays.length - 1))
    setTab('today')
  }

  const selectFromCalendar = (i: number) => {
    goToDay(i)
    setCalendarOpen(false)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-10 pt-6 sm:pt-10">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          Egg Freezing Cycle
        </div>
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-accent"
        >
          <CalendarClock className="size-3.5" aria-hidden="true" />
          Today
        </button>
      </header>

      <nav className="mb-6 grid grid-cols-4 gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg px-1.5 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-3',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1">
        {tab === 'overview' && <ProtocolOverview />}

        {tab === 'today' && (
          <TodayView
            day={day}
            index={index}
            onNavigate={setSelectedIndex}
            isChecked={isChecked}
            onToggle={toggle}
            note={notes[day.id] ?? ''}
            onNoteChange={(value) =>
              setNotes((prev) => ({ ...prev, [day.id]: value }))
            }
            triggerDateTime={triggerDateTime}
            onTriggerChange={setTriggerDateTime}
          />
        )}

        {tab === 'calendar' && (
          <CycleCalendar
            isChecked={isChecked}
            onSelectDay={goToDay}
            activeIndex={index}
          />
        )}

        {tab === 'milestones' && (
          <MilestoneTimeline
            results={results}
            onResultChange={(key, value) =>
              setResults((prev) => ({ ...prev, [key]: value }))
            }
          />
        )}
      </main>

      <footer className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-highlight/15 px-2 py-0.5 text-[10px] font-medium text-highlight">
            confirm with Evewell first
          </span>
          <span>Start only once Evewell confirms.</span>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            likely last dose
          </span>
          <span>Anticipated final dose — exact stopping point depends on your scans.</span>
        </div>
        <p>
          This tracker follows your Evewell protocol for reference only. Always follow the guidance
          from your clinic, and contact them with any questions or concerns.
        </p>
      </footer>

      {calendarOpen && (
        <MonthCalendar
          onSelectDay={selectFromCalendar}
          onClose={() => setCalendarOpen(false)}
          activeIndex={index}
        />
      )}
    </div>
  )
}
