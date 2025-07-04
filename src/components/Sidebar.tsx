'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Brain, 
  Settings,
  HelpCircle
} from 'lucide-react'

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Visualize', href: '/visualize', icon: BarChart3 },
  { name: 'Predict', href: '/predict', icon: Brain },
]

const secondaryLinks = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-sm">IQ</span>
          </div>
          <span className="text-lg font-bold text-black dark:text-white">
            InsightIQ
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <nav className="space-y-1">
            {secondaryLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}