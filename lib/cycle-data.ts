export type MedForm =
  | 'pill'
  | 'injection-pen'
  | 'injection'
  | 'syringe'
  | 'suppository'
  | 'trigger'

export type MedItem = {
  id: string
  name: string
  dose: string
  form: MedForm
  window?: string
  /** Start only once Evewell confirms (table footnote *) */
  conditional?: boolean
  /** Anticipated final dose — exact stopping depends on scans (table footnote †) */
  anticipatedLast?: boolean
  /** Not yet confirmed — Evewell will advise whether to take it */
  tbc?: boolean
  /** Must be stored in the fridge */
  refrigerated?: boolean
  /** Short inline note shown beside the medication name */
  note?: string
}

export type CyclePhase = 'stimulation' | 'trigger' | 'collection'

export type CycleDay = {
  id: string
  dateLabel: string
  /** ISO date (YYYY-MM-DD) for fixed-date days; omitted for scan-dependent days */
  date?: string
  cycleDay?: string
  stimDay: string
  phase: CyclePhase
  appointment?: { label: string; potential?: boolean }
  morning: MedItem[]
  evening: MedItem[]
  note?: string
}

export const phaseLabels: Record<CyclePhase, string> = {
  stimulation: 'Stimulation',
  trigger: 'Trigger',
  collection: 'Egg collection',
}

export const formLabels: Record<MedForm, string> = {
  pill: 'Pill',
  'injection-pen': 'Injection pen',
  injection: 'Injection',
  syringe: 'Syringe',
  suppository: 'Suppository',
  trigger: 'Trigger',
}

const dex = (): MedItem => ({
  id: 'dexamethasone',
  name: 'Dexamethasone',
  dose: '1 mg',
  form: 'pill',
  window: '6–9am',
})
const menopur = (): MedItem => ({
  id: 'menopur',
  name: 'Menopur',
  dose: '150 IU',
  form: 'injection',
  window: '6–9am',
  refrigerated: true,
})
const pergoveris = (): MedItem => ({
  id: 'pergoveris',
  name: 'Pergoveris',
  dose: '150 IU',
  form: 'injection-pen',
  window: '6–9pm',
  refrigerated: true,
})
const luveris = (opts?: { note?: string }): MedItem => ({
  id: 'luveris',
  name: 'Luveris',
  dose: '75 IU',
  form: 'injection',
  window: '6–9pm',
  note: opts?.note,
})
const fyremadel = (opts?: { note?: string }): MedItem => ({
  id: 'fyremadel',
  name: 'Fyremadel',
  dose: '250 mcg',
  form: 'syringe',
  window: '6–9am',
  conditional: true,
  tbc: true,
  note: opts?.note,
})
const buserelin = (): MedItem => ({
  id: 'buserelin',
  name: 'Buserelin',
  dose: '1 ml',
  form: 'trigger',
  tbc: true,
})
const zivafert = (): MedItem => ({
  id: 'zivafert',
  name: 'Zivafert',
  dose: '10,000 IU',
  form: 'trigger',
  tbc: true,
})

const stimDays: Array<{ date: string; label: string }> = [
  { date: '2026-10-27', label: 'Tue 27 Oct' },
  { date: '2026-10-28', label: 'Wed 28 Oct' },
  { date: '2026-10-29', label: 'Thu 29 Oct' },
  { date: '2026-10-30', label: 'Fri 30 Oct' },
  { date: '2026-10-31', label: 'Sat 31 Oct' },
  { date: '2026-11-01', label: 'Sun 1 Nov' },
  { date: '2026-11-02', label: 'Mon 2 Nov' },
  { date: '2026-11-03', label: 'Tue 3 Nov' },
  { date: '2026-11-04', label: 'Wed 4 Nov' },
  { date: '2026-11-05', label: 'Thu 5 Nov' },
]

function stimNote(day: number): string {
  if (day === 1) return 'Medication starts today. Continue stimulation each morning and evening.'
  if (day <= 3) return 'Continue stimulation.'
  if (day === 4) return 'Luveris 75iu starts this evening.'
  if (day === 5) return 'Fyremadel 250mcg may start this morning — confirm with Evewell first.'
  if (day === 10)
    return 'Final planned stimulation day. Continue stimulation.'
  return 'Continue stimulation. Fyremadel only if confirmed by Evewell.'
}

export const cycleDays: CycleDay[] = [
  ...stimDays.map(({ date, label }, i): CycleDay => {
    const day = i + 1
    return {
      id: `d${day}`,
      dateLabel: label,
      date,
      stimDay: `Day ${day}`,
      phase: 'stimulation',
      ...(day === 4
        ? { appointment: { label: '8:00am scan · 9:45am acupuncture' } }
        : {}),
      morning: day >= 5 ? [dex(), menopur(), fyremadel()] : [dex(), menopur()],
      evening: [
        pergoveris(),
        ...(day >= 4 ? [luveris(day === 4 ? { note: 'Introducing new medication' } : undefined)] : []),
      ],
      note: stimNote(day),
    }
  }),
  {
    id: 'd11',
    dateLabel: 'Fri 6 Nov',
    date: '2026-11-06',
    stimDay: 'Day 11',
    phase: 'trigger',
    morning: [],
    evening: [buserelin(), zivafert()],
    note: 'Trigger injections TBC. Do not take without specific instruction from Evewell.',
  },
  {
    id: 'collection',
    dateLabel: 'Mon 9 Nov',
    date: '2026-11-09',
    stimDay: 'Egg collection',
    phase: 'collection',
    appointment: { label: 'Evewell — egg collection (potential date)', potential: true },
    morning: [
      {
        id: 'voltarol',
        name: 'Voltarol',
        dose: '100 mg',
        form: 'suppository',
        window: 'a couple of hours before, as instructed',
      },
    ],
    evening: [],
    note: "Potential egg retrieval date — approx. 36 hours after the trigger. You'll know the exact date ~2 days before.",
  },
]

export type ProtocolPhase = {
  id: string
  range: string
  stimRange: string
  summary: string
  points: string[]
  appointment?: string
}

export const protocolPhases: ProtocolPhase[] = [
  {
    id: 'stim-start',
    range: 'Tue 27 Oct',
    stimRange: 'Stimulation Day 1–4',
    summary: 'Medication starts today.',
    points: [
      'Day 1–3 — AM 6–9am: Dexamethasone 1mg + Menopur 150iu; PM 6–9pm: Pergoveris 150iu',
      'Day 4 — as above, plus Luveris 75iu in the evening',
    ],
  },
  {
    id: 'stim-mid',
    range: '',
    stimRange: 'Stimulation Day 5–10',
    summary: 'Fyremadel 250mcg added in the mornings, to be confirmed with Evewell first.',
    points: [
      'AM 6–9am: Dexamethasone 1mg + Menopur 150iu + Fyremadel 250mcg (TBC)',
      'PM 6–9pm: Pergoveris 150iu + Luveris 75iu',
    ],
  },
  {
    id: 'trigger-phase',
    range: '',
    stimRange: 'Stimulation Day 11',
    summary:
      'Buserelin 1ml + Zivafert 10,000iu trigger injections (TBC). Very specifically timed — do not take without instruction from Evewell.',
    points: [],
  },
]

export type MedReference = {
  id: string
  name: string
  dose: string
  route: string
  frequency: string
  duration: string
  /** When in the day it's taken */
  timing: string
  /** Must be stored in the fridge */
  refrigerated?: boolean
  info?: string
}

export const medReference: MedReference[] = [
  {
    id: 'pergoveris',
    name: 'Pergoveris PFS',
    dose: '150 IU',
    route: 'Injection s.c.',
    frequency: '150iu daily',
    duration: '12 days',
    timing: 'PM',
    refrigerated: true,
  },
  {
    id: 'menopur-multi',
    name: 'Menopur Multidose',
    dose: '150 IU',
    route: 'Injection s.c.',
    frequency: '150iu daily',
    duration: '12 days',
    timing: 'AM',
    refrigerated: true,
  },
  {
    id: 'fyremadel',
    name: 'Fyremadel',
    dose: '250 mcg',
    route: 'Injection s.c.',
    frequency: '1 × day',
    duration: '5 days',
    timing: 'AM',
  },
  {
    id: 'luveris',
    name: 'Luveris 75iu Vial',
    dose: '75 IU',
    route: 'Injection s.c.',
    frequency: 'Once daily',
    duration: '9 days',
    timing: 'PM',
    info: 'Dispense with needles and syringes',
  },
  {
    id: 'buserelin',
    name: 'Buserilin 1mg/ml × 5.5ml vial SLS',
    dose: '1 ml',
    route: 'Injection s.c.',
    frequency: '1ml as directed 36 hours pre VEC',
    duration: '1 day',
    timing: 'PM',
    info: 'Dispense with needles and syringes',
  },
  {
    id: 'zivafert',
    name: 'Zivafert PFS (Human chorionic gonadotropin (hCG) 5000 IU)',
    dose: '10,000 IU',
    route: 'Injection s.c.',
    frequency: '10,000iu s/c as directed 36 hours pre VEC',
    duration: '1 day',
    timing: 'PM',
    info: 's/c as directed 36 hours before egg collection as directed',
  },
  {
    id: 'voltarol',
    name: 'Voltarol 100mg suppository',
    dose: '100 mg',
    route: 'Rectal',
    frequency: 'In the morning',
    duration: '1 day',
    timing: 'AM',
    info: "DON'T TAKE IF SENSITIVITY OR ALLERGY TO NSAIDS",
  },
  {
    id: 'dexamethasone',
    name: 'Dexamethasone',
    dose: '1 mg',
    route: 'Oral',
    frequency: 'Take 1mg tablet orally once a day in the morning',
    duration: '10 days',
    timing: 'AM',
  },
]

export type MilestoneResult = {
  key: string
  label: string
  placeholder?: string
}

export type Milestone = {
  id: string
  when: string
  title: string
  description: string
  big?: boolean
  results?: MilestoneResult[]
}

export const milestones: Milestone[] = [
  {
    id: 'baseline',
    when: 'Tue 27 Oct',
    title: 'Medication starts',
    description: 'Stimulation Day 1 — morning Dexamethasone + Menopur, evening Pergoveris.',
  },
  {
    id: 'trigger',
    when: 'Day 10–11 (TBC)',
    title: 'Trigger injections',
    description:
      'Buserelin + Zivafert trigger shots at the exact time Evewell specifies. Egg collection follows roughly 36 hours later.',
  },
  {
    id: 'collection',
    when: 'Mon 9 Nov (potential)',
    title: 'Egg collection',
    description:
      "The procedure itself. You'll know the exact date about 2 days beforehand, and learn how many eggs were collected on the day.",
    results: [{ key: 'eggsCollected', label: 'Eggs collected', placeholder: 'e.g. 12' }],
  },
  {
    id: 'fertilisation',
    when: 'Day after collection',
    title: 'Fertilisation update',
    description: 'First update from Evewell: how many of the collected eggs fertilised.',
    results: [{ key: 'eggsFertilised', label: 'Eggs fertilised', placeholder: 'e.g. 9' }],
  },
  {
    id: 'blastocyst',
    when: 'Day 5–7 after collection',
    title: 'Blastocyst update',
    description:
      'The big one: how many embryos reached blastocyst and their grading. Suitable blastocysts are biopsied for PGT-A and frozen.',
    big: true,
    results: [
      { key: 'blastocysts', label: 'Blastocysts reached', placeholder: 'e.g. 5' },
      { key: 'frozen', label: 'Embryos frozen', placeholder: 'e.g. 5' },
      { key: 'grading', label: 'Grading notes', placeholder: 'e.g. 2x 4AA, 3x 3AB' },
    ],
  },
  {
    id: 'pgta',
    when: '~2–3 weeks after biopsy',
    title: 'PGT-A results',
    description:
      'How many of the biopsied embryos are chromosomally normal (euploid) and available for a future transfer.',
    big: true,
    results: [{ key: 'euploid', label: 'Euploid (normal) embryos', placeholder: 'e.g. 3' }],
  },
  {
    id: 'period',
    when: '3–12 days after collection',
    title: 'Period expected',
    description: "Your period is expected in this window. Contact Evewell if it hasn't arrived within 2 weeks.",
  },
]

export const totalMedItems = cycleDays.reduce(
  (sum, day) => sum + day.morning.length + day.evening.length,
  0,
)

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** True when the given ISO date is the current calendar day. */
export function isTodayDate(date?: string): boolean {
  if (!date) return false
  return new Date(`${date}T00:00:00`).getTime() === startOfToday()
}

/**
 * Index of the day to land on when jumping to "today": the current day if it's
 * in the cycle, otherwise the next upcoming dated day, or the last day once the
 * cycle has passed.
 */
export function getTodayIndex(): number {
  const today = startOfToday()
  for (let i = 0; i < cycleDays.length; i++) {
    const date = cycleDays[i].date
    if (!date) continue
    if (new Date(`${date}T00:00:00`).getTime() >= today) return i
  }
  return cycleDays.length - 1
}

/**
 * Egg collection lands roughly 36 hours after the trigger shot. Takes a
 * datetime-local value (e.g. "2026-11-05T21:00") and returns a friendly label.
 */
export function estimateEggCollection(triggerDateTime: string): string | null {
  if (!triggerDateTime) return null
  const trigger = new Date(triggerDateTime)
  if (Number.isNaN(trigger.getTime())) return null
  const collection = new Date(trigger.getTime() + 36 * 60 * 60 * 1000)
  return collection.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
