'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileCheck2, BrainCog, BarChartBig, Upload, Zap, TrendingUp } from 'lucide-react'

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Upload your data and get AI-powered insights instantly
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Uploads</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Upload className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">AI Insights</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <BrainCog className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Models Trained</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload */}
      <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload Dataset</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 dark:border-slate-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400" />
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">CSV or PDF files</p>
              </div>
              <Input 
                type="file" 
                accept=".csv, .pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{file.name}</span>
              </div>
              <Button onClick={handleUpload} size="sm">
                Upload
              </Button>
            </div>
          )}

          {status.uploaded && (
            <div className="flex items-center space-x-2 text-green-600">
              <FileCheck2 className="w-4 h-4" />
              <span className="text-sm font-medium">Successfully uploaded: {filename}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>AI Analysis Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant={status.eda ? 'default' : 'outline'} className="px-3 py-1">
              {status.eda ? '✅' : '⏳'} Exploratory Data Analysis
            </Badge>
            <Badge variant={status.insight ? 'default' : 'outline'} className="px-3 py-1">
              {status.insight ? '🧠' : '⏳'} AI Insights
            </Badge>
            <Badge variant={status.trained ? 'default' : 'outline'} className="px-3 py-1">
              {status.trained ? '🎯' : '⏳'} Model Training
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={runEDA} 
              variant="outline" 
              className="h-12 flex items-center space-x-2"
              disabled={!status.uploaded}
            >
              <BarChartBig className="w-4 h-4" />
              <span>Run EDA</span>
            </Button>
            
            <Button 
              onClick={runInsight} 
              variant="outline" 
              className="h-12 flex items-center space-x-2"
              disabled={!status.uploaded}
            >
              <BrainCog className="w-4 h-4" />
              <span>Generate Insights</span>
            </Button>
            
            <Button 
              onClick={trainModel} 
              className="h-12 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!status.uploaded}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Train Model</span>
            </Button>
          </div>

          {accuracy && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900 dark:text-green-100">
                  Model Accuracy: {(accuracy * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Answer */}
      {aiAnswer && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BrainCog className="w-5 h-5 text-blue-600" />
              <span>AI Insight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiAnswer}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}