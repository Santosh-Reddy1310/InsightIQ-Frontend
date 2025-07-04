'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles } from 'lucide-react'

export default function InsightChat() {
  const [file, setFile] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setAnswer(null)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/insight`, {
        file,
        question
      })
      setAnswer(res.data.answer)
    } catch (err) {
      setAnswer('❌ Failed to get insight. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Sparkles className="text-purple-500" /> Ask InsightIQ AI
      </h1>

      <div className="space-y-2">
        <label className="font-medium">📁 Dataset Filename (e.g., diabetes.csv)</label>
        <Input value={file} onChange={(e) => setFile(e.target.value)} placeholder="Enter filename..." />
      </div>

      <div className="space-y-2">
        <label className="font-medium">❓Your Question</label>
        <Textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What are the most important features influencing the outcome?"
        />
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? '🌀 Generating Insight...' : '🔍 Ask AI'}
      </Button>

      {answer && (
        <div className="mt-6 p-4 border rounded-md bg-muted whitespace-pre-wrap">
          <h3 className="font-semibold mb-2">📬 InsightIQ Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}
