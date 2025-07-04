'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Bell, Search, User } from 'lucide-react'

export default function Navbar() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-sm">IQ</span>
          </div>
          <span className="text-xl font-bold text-black dark:text-white">
            InsightIQ
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-900">
          <Search className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-900">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          {mounted ? (
            theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
          ) : null}
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-900">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}