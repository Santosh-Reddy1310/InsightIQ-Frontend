'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

interface EdaData {
  shape: [number, number]
  dtypes: Record<string, string>
  nulls: Record<string, number>
  describe: Record<string, Record<string, number | string>>
}

export default function EDAReport() {
  const searchParams = useSearchParams()
  const filename = searchParams.get('file') || ''

  const [eda, setEda] = useState<EdaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEDA = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/eda?filename=${filename}`
        )
        setEda(data.eda)
      } catch (err) {
        console.error('Failed to fetch EDA data:', err)
        setError('Failed to load EDA report. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (filename) {
      fetchEDA()
    } else {
      setError('No file specified for EDA report.')
      setLoading(false)
    }
  }, [filename])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-center text-muted-foreground ml-4">Loading EDA Report...</p>
      </div>
    )
  }

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  if (!eda) return <p className="text-center text-muted-foreground mt-10">No EDA data available for this file.</p>

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        📊 InsightIQ – EDA Report for <span className="text-primary">{filename}</span>
      </h2>

      {/* Shape */}
      <Card>
        <CardHeader>
          <CardTitle>📐 Shape</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{eda.shape[0]} rows × {eda.shape[1]} columns</p>
        </CardContent>
      </Card>

      {/* Columns + Types */}
      <Card>
        <CardHeader>
          <CardTitle>📄 Columns + Types</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(eda.dtypes).map(([col, type]) => (
            <Badge variant="outline" key={col}>
              <span className="font-medium">{col}</span>: <span className="ml-1 text-muted-foreground">{type}</span>
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Null Values */}
      <Card>
        <CardHeader>
          <CardTitle>⚠️ Null Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {Object.entries(eda.nulls).map(([col, count]) => (
            <p key={col} className={`${count > 0 ? 'text-red-500' : 'text-green-600'} font-medium`}>
              {col}: {count}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Column Distributions */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Column Distributions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 pr-4">
            {Object.entries(eda.describe).map(([col, stats]) => (
              <div key={col} className="mb-4">
                <h4 className="font-semibold text-primary">{col}</h4>
                <ul className="text-sm text-muted-foreground pl-4 list-disc">
                  {Object.entries(stats).map(([stat, value]) => (
                    <li key={stat}>
                      <strong>{stat}:</strong> {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </li>
                  ))}
                </ul>
                <Separator className="my-3" />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
