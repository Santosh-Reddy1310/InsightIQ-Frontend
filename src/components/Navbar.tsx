'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <Link href="/dashboard" className="text-xl font-semibold">
        🧠 InsightIQ
      </Link>
      <Button
        variant="ghost"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>
    </header>
  )
}
