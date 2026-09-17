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
})
const gonal = (): MedItem => ({
  id: 'gonal-f',
  name: 'Gonal-F',
  dose: '300 IU',
  form: 'injection-pen',
  window: '6–9pm',
  refrigerated: true,
})
const menopur = (opts?: { anticipatedLast?: boolean }): MedItem => ({
  id: 'menopur',
  name: 'Menopur',
  dose: '150 IU',
  form: 'injection',
  window: '6–9am',
  refrigerated: true,
  anticipatedLast: opts?.anticipatedLast,
})
const pergoveris = (opts?: { anticipatedLast?: boolean }): MedItem => ({
  id: 'pergoveris',
  name: 'Pergoveris',
  dose: '150 IU',
  form: 'injection-pen',
  window: '6–9pm',
  refrigerated: true,
  anticipatedLast: opts?.anticipatedLast,
})
const luveris = (opts?: { anticipatedLast?: boolean }): MedItem => ({
  id: 'luveris',
  name: 'Luveris',
  dose: '75 IU',
  form: 'injection',
  anticipatedLast: opts?.anticipatedLast,
})
const fyremadel = (opts?: { anticipatedLast?: boolean; tbc?: boolean; note?: string }): MedItem => ({
  id: 'fyremadel',
  name: 'Fyremadel',
  dose: '250 mcg',
  form: 'syringe',
  conditional: true,
  anticipatedLast: opts?.anticipatedLast,
  tbc: opts?.tbc,
  note: opts?.note,
  })

export const cycleDays: CycleDay[] = [
  {
    id: 'd1',
    dateLabel: 'Fri 11 Sep',
    date: '2026-09-11',
    cycleDay: 'CD22',
    stimDay: 'Day 1',
    phase: 'stimulation',
    appointment: { label: '8am Evewell — baseline scan + bloods' },
    morning: [],
    evening: [gonal()],
    note: 'Consultant reviews results. Do not start meds until Evewell clears you after the scan. If cleared, today becomes Stim Day 1 — evening Gonal-F shot only tonight; the morning Dexamethasone course begins tomorrow.',
  },
  {
    id: 'd2',
    dateLabel: 'Sat 12 Sep',
    date: '2026-09-12',
    cycleDay: 'CD23',
    stimDay: 'Day 2',
    phase: 'stimulation',
    morning: [dex()],
    evening: [gonal()],
    note: 'Continue stimulation.',
  },
  {
    id: 'd3',
    dateLabel: 'Sun 13 Sep',
    date: '2026-09-13',
    cycleDay: 'CD24',
    stimDay: 'Day 3',
    phase: 'stimulation',
    morning: [dex()],
    evening: [gonal()],
    note: 'Last planned Gonal-F dose. Completes the first 3 nights of stimulation.',
  },
  {
    id: 'd4',
    dateLabel: 'Mon 14 Sep',
    date: '2026-09-14',
    cycleDay: 'CD25',
    stimDay: 'Day 4',
    phase: 'stimulation',
    morning: [dex(), menopur()],
    evening: [pergoveris()],
    note: 'Switch to morning + evening stimulation shots. First monitoring appointment expected Day 4 or Day 5.',
  },
  {
    id: 'd5',
    dateLabel: 'Tue 15 Sep',
    date: '2026-09-15',
    cycleDay: 'CD26',
    stimDay: 'Day 5',
    phase: 'stimulation',
    appointment: { label: '10am Evewell — scan + bloods' },
    morning: [dex(), menopur()],
    evening: [pergoveris()],
    note: 'Confirmed monitoring appointment. From this first monitoring scan, expect appointments approximately every 3 days. Fyremadel not started yet — Evewell will advise.',
  },
  {
    id: 'd6',
    dateLabel: 'Wed 16 Sep',
    date: '2026-09-16',
    cycleDay: 'CD27',
    stimDay: 'Day 6',
    phase: 'stimulation',
    morning: [dex(), menopur()],
    evening: [pergoveris(), luveris()],
    note: 'Luveris starts. Fyremadel not started yet — Evewell will advise when to begin.',
  },
  {
    id: 'd7',
    dateLabel: 'Thu 17 Sep',
    date: '2026-09-17',
    cycleDay: 'CD28',
    stimDay: 'Day 7',
    phase: 'stimulation',
    appointment: { label: '11am Evewell — scan + bloods' },
    morning: [dex(), menopur()],
    evening: [pergoveris(), luveris(), fyremadel({ tbc: true, note: 'Bring Fyremadel injection to appt' })],
    note: 'Confirmed monitoring appointment. Bring your Fyremadel injection to the appointment — Evewell will confirm at this scan whether to start it.',
  },
  {
    id: 'd8',
    dateLabel: 'Fri 18 Sep',
    date: '2026-09-18',
    cycleDay: 'CD29',
    stimDay: 'Day 8',
    phase: 'stimulation',
    morning: [dex(), menopur()],
    evening: [pergoveris(), luveris(), fyremadel()],
    note: 'Medication doses may be adjusted based on follicle growth.',
  },
  {
    id: 'd9',
    dateLabel: 'Sat 19 Sep',
    date: '2026-09-19',
    cycleDay: 'CD30',
    stimDay: 'Day 9',
    phase: 'stimulation',
    appointment: { label: '11am Evewell — scan + bloods' },
    morning: [dex(), menopur()],
    evening: [pergoveris(), luveris(), fyremadel()],
    note: 'Confirmed monitoring appointment. Continue stimulation unless Evewell changes doses.',
  },
  {
    id: 'd10',
    dateLabel: 'Sun 20 Sep',
    date: '2026-09-20',
    cycleDay: 'CD31',
    stimDay: 'Day 10',
    phase: 'stimulation',
    morning: [dex(), menopur()],
    evening: [pergoveris(), luveris(), fyremadel()],
    note: '10th / final planned Dexamethasone day. Other stimulation meds continue.',
  },
  {
    id: 'd11',
    dateLabel: 'Mon 21 Sep',
    date: '2026-09-21',
    cycleDay: 'CD32',
    stimDay: 'Day 11',
    phase: 'stimulation',
    appointment: { label: 'Evewell monitoring scan + bloods', potential: true },
    morning: [menopur()],
    evening: [pergoveris(), luveris(), fyremadel()],
    note: "Approx. next monitoring visit. Getting close to the trigger decision. You'll know your actual egg-collection date roughly 2 days beforehand.",
  },
  {
    id: 'd12',
    dateLabel: 'Tue 22 Sep',
    date: '2026-09-22',
    cycleDay: 'CD33',
    stimDay: 'Day 12',
    phase: 'stimulation',
    morning: [menopur({ anticipatedLast: true })],
    evening: [
      pergoveris({ anticipatedLast: true }),
      luveris({ anticipatedLast: true }),
      fyremadel({ anticipatedLast: true }),
    ],
    note: '~12 days of stimulation anticipated. Exact stopping point depends on your scans.',
  },
  {
    id: 'trigger',
    dateLabel: 'When ready',
    stimDay: 'Trigger · Day 10–12',
    phase: 'trigger',
    morning: [],
    evening: [
      { id: 'buserelin', name: 'Buserelin', dose: '1 ml', form: 'trigger' },
      { id: 'zivafert', name: 'Zivafert', dose: '10,000 IU', form: 'trigger' },
    ],
    note: 'Exact timing comes from Evewell. Egg collection approximately 36 hours later.',
  },
  {
    id: 'collection',
    dateLabel: '24–27 Sep',
    cycleDay: '~CD35–38',
    stimDay: 'Egg collection',
    phase: 'collection',
    appointment: { label: 'Evewell — egg collection' },
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
    note: "You'll know the exact procedure date ~2 days before. On the day, you'll find out how many eggs were collected.",
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
    id: 'baseline-start',
    range: 'Cycle Day 20–22',
    stimRange: 'Stimulation Day 1 to 5/6',
    appointment: 'Baseline scan Fri 11 Sep, 8am',
    summary:
      'Ultrasound scan + bloods at your baseline appointment, undertaken by the nurse and reviewed by your consultant. If you are cleared to start, that day becomes Stimulation Day 1. You can also have a medication teach with the nurses after this appointment.',
    points: [
      'Stim days 1–3 — AM: Dexamethasone 1mg (10 day course); PM 6–9pm: Gonal-F 300iu',
      'From stim day 4 onwards — AM 6–9am: Menopur 150iu + Dexamethasone 1mg; PM 6–9pm: Pergoveris 150iu',
      'From Day 6 you introduce Luveris 75iu every evening',
    ],
  },
  {
    id: 'mid-monitoring',
    range: '',
    stimRange: 'Stimulation Day 5/6',
    appointment: 'Ultrasound scan and possibly bloods',
    summary:
      'You will have 3–4 further scans every 2–3 days after this point.',
    points: [
      'You will be told whether to commence Fyremadel 250mcg (every day thereafter, until approx. Cycle Day 10–12)',
      'Continue with your stimulation medication today and every day thereafter',
      'Following this scan your dose may change and additional medication may be added depending on your response to the stimulation',
    ],
  },
  {
    id: 'trigger-phase',
    range: '',
    stimRange: 'Stimulation Day 10–12',
    summary:
      'Buserelin 1ml + Zivafert 10,000iu trigger injections. This is very specifically timed and the nurses will tell you when to take this medication. Do not take this medication without specific instruction.',
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
    id: 'dexamethasone',
    name: 'Dexamethasone',
    dose: '1 mg',
    route: 'Oral',
    frequency: 'Take 1mg tablet orally once a day in the morning',
    duration: '10 days',
    timing: 'AM',
  },
  {
    id: 'gonal-f',
    name: 'Gonal F PFS',
    dose: '300 IU',
    route: 'Injection s.c.',
    frequency: 'Once daily',
    duration: '3 days',
    timing: 'PM',
    refrigerated: true,
  },
  {
    id: 'pergoveris',
    name: 'Pergoveris PFS',
    dose: '150 IU',
    route: 'Injection s.c.',
    frequency: 'Once daily',
    duration: '9 days',
    timing: 'PM',
    refrigerated: true,
  },
  {
    id: 'menopur-multi',
    name: 'Menopur Multidose 1 × 600iu',
    dose: '150 IU',
    route: 'Injection s.c.',
    frequency: '150iu daily',
    duration: '8 days',
    timing: 'AM',
    refrigerated: true,
  },
  {
    id: 'menopur-vial',
    name: 'Menopur Vial 75iu',
    dose: '150 IU',
    route: 'Injection s.c.',
    frequency: '150iu daily',
    duration: '1 day',
    timing: 'AM (6–9am)',
    info: 'Dispense with needles and syringes',
  },
  {
    id: 'luveris',
    name: 'Luveris 75iu Vial',
    dose: '75 IU',
    route: 'Injection s.c.',
    frequency: '75iu daily',
    duration: '6 days',
    timing: 'PM',
    info: 'Dispense with needles and syringes',
  },
  {
    id: 'fyremadel',
    name: 'Fyremadel',
    dose: '250 mcg',
    route: 'Injection s.c.',
    frequency: '1 × day',
    duration: '8 days',
    timing: 'PM',
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
    when: 'Fri 11 Sep',
    title: 'Baseline scan',
    description:
      'Scan + bloods at Evewell. The consultant reviews your results and clears you to begin stimulation.',
  },
  {
    id: 'trigger',
    when: 'When ready',
    title: 'Trigger injections',
    description:
      'Buserelin + Zivafert trigger shots at the exact time Evewell specifies. Egg collection follows roughly 36 hours later.',
  },
  {
    id: 'collection',
    when: '24–27 Sep (approx.)',
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
 * datetime-local value (e.g. "2026-09-22T21:00") and returns a friendly label.
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
