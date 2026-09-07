'use client'

import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) setValue(JSON.parse(raw) as T)
    } catch {
      // ignore read/parse errors and fall back to the initial value
    }
    setLoaded(true)
  }, [key])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (e.g. storage disabled or full)
    }
  }, [key, value, loaded])

  return [value, setValue, loaded] as const
}
