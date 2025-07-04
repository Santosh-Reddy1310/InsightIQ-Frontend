'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileCheck2, BrainCog, BarChartBig } from 'lucide-react'

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null)
  const [filename, setFilename] = useState('')
  const [status, setStatus] = useState({
    uploaded: false,
    eda: false,
    insight: false,
    trained: false
  })
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [aiAnswer, setAiAnswer] = useState<string>('')

  const handleUpload = async () => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/upload`, form)
      setFilename(file.name)
      setStatus({ ...status, uploaded: true })
    } catch (err) {
      console.error(err)
    }
  }

  const runEDA = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/eda?filename=${filename}`)
      setStatus({ ...status, eda: true })
    } catch (err) {
      console.error(err)
    }
  }

  const runInsight = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/insight`, {
        file: filename,
        question: 'What are the most important features influencing the outcome?'
      })
      setAiAnswer(data.answer)
      setStatus({ ...status, insight: true })
    } catch (err) {
      console.error(err)
    }
  }

  const trainModel = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/train`, {
        file: filename,
        target_column: 'Outcome'
      })
      setAccuracy(data.accuracy)
      setStatus({ ...status, trained: true })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        📊 Dashboard
      </h1>

      {/* File Upload */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <label className="font-semibold">📁 Upload CSV or PDF</label>
          <Input type="file" accept=".csv, .pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={handleUpload}>Upload</Button>
          {status.uploaded && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <FileCheck2 size={16} /> Uploaded: {filename}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">⚙️ Auto Analysis</h2>

          <div className="flex flex-wrap gap-2">
            <Badge variant={status.eda ? 'default' : 'outline'}>EDA ✅</Badge>
            <Badge variant={status.insight ? 'default' : 'outline'}>AI Insight 🧠</Badge>
            <Badge variant={status.trained ? 'default' : 'outline'}>Model 🎯</Badge>
          </div>

          <div className="flex gap-3">
            <Button onClick={runEDA} variant="secondary">Run EDA</Button>
            <Button onClick={runInsight} variant="secondary">Generate Insight</Button>
            <Button onClick={trainModel}>Train Model</Button>
          </div>

          {accuracy && (
            <p className="text-sm mt-2 text-green-600">
              🎯 Model Accuracy: {(accuracy * 100).toFixed(2)}%
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Answer */}
      {aiAnswer && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-1">
              <BrainCog size={20} /> AI Insight
            </h3>
            <p className="text-muted-foreground text-sm">{aiAnswer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
