'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Send, FileText, MessageSquare } from 'lucide-react'

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
      setAnswer('❌ Failed to get insight. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = [
    "What are the most important features influencing the outcome?",
    "Are there any correlations between variables?",
    "What patterns can you identify in the data?",
    "How can I improve the model performance?"
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2 flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-black dark:text-white" />
          <span>AI Data Assistant</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ask questions about your dataset and get intelligent insights powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-black dark:text-white" />
                <span>Dataset Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  Dataset Filename
                </label>
                <Input 
                  value={file} 
                  onChange={(e) => setFile(e.target.value)} 
                  placeholder="e.g., diabetes.csv"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  Your Question
                </label>
                <Textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about your data..."
                  className="w-full resize-none"
                />
              </div>

              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-12" 
                onClick={handleSubmit} 
                disabled={loading || !file || !question}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(q)}
                    className="w-full text-left p-3 text-sm bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-800"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Section */}
        <div className="space-y-6">
          {answer ? (
            <Card className="border-l-4 border-l-black dark:border-l-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-black dark:text-white" />
                  <span>AI Response</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-black dark:text-white leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Ready to Help
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Enter your dataset filename and ask a question to get started with AI-powered insights.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}