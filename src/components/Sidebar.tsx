'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const links = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Chat', href: '/chat' },
  { name: 'Visualize', href: '/visualize' },
  { name: 'Predict', href: '/predict' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-48 bg-muted h-screen p-4 border-r">
      <div className="font-bold text-xl mb-6">📡 InsightIQ</div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'block px-3 py-2 rounded hover:bg-primary hover:text-primary-foreground',
              pathname === link.href && 'bg-primary text-white'
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
