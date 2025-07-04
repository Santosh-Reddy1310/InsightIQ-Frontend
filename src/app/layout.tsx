import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Layout from '@/components/Layout'

export const metadata = {
  title: 'InsightIQ',
  description: 'AI-Powered Data Science SaaS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
