'use client'

import { useEffect, useMemo, useState } from 'react'
import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

type ThemeSelection = 'light' | 'dark' | 'system'

const THEME_SEQUENCE: ThemeSelection[] = ['light', 'dark', 'system']
const ICON_MAP: Record<ThemeSelection, (props: React.SVGProps<SVGSVGElement>) => JSX.Element> = {
  light: Sun,
  dark: Moon,
  system: Laptop,
}

const LABEL_MAP: Record<ThemeSelection, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

function asThemeSelection(value: string | undefined): ThemeSelection {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value
  }
  return 'system'
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const selection = mounted ? asThemeSelection(theme) : 'system'
  const Icon = useMemo(() => ICON_MAP[selection], [selection])

  const nextTheme = useMemo(() => {
    const currentIndex = THEME_SEQUENCE.indexOf(selection)
    const nextIndex = (currentIndex + 1) % THEME_SEQUENCE.length
    return THEME_SEQUENCE[nextIndex]
  }, [selection])

  const effectiveThemeLabel = mounted ? resolvedTheme || 'system' : 'system'
  const title = mounted
    ? `${LABEL_MAP[selection]} theme${selection === 'system' ? ` (follows ${effectiveThemeLabel})` : ''}`
    : 'Toggle theme'
  const ariaLabel = mounted ? `Switch to ${LABEL_MAP[nextTheme]} theme` : 'Toggle theme'

  const handleToggle = () => {
    if (!mounted) return
    setTheme(nextTheme)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={title}
      data-theme-selection={selection}
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
