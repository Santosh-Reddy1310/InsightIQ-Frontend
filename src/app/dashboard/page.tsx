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
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload your data and get AI-powered insights instantly
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black dark:bg-white text-white dark:text-black border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-700 text-sm font-medium">Total Uploads</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Upload className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-700 text-sm font-medium">AI Insights</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <BrainCog className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 dark:text-gray-700 text-sm font-medium">Models Trained</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload */}
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-black dark:text-white" />
            <span>Upload Dataset</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV or PDF files</p>
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
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm font-medium text-black dark:text-white">{file.name}</span>
              </div>
              <Button onClick={handleUpload} size="sm" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
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
            <Zap className="w-5 h-5 text-black dark:text-white" />
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
              className="h-12 flex items-center space-x-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              disabled={!status.uploaded}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Train Model</span>
            </Button>
          </div>

          {accuracy && (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-black dark:text-white">
                  Model Accuracy: {(accuracy * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Answer */}
      {aiAnswer && (
        <Card className="border-l-4 border-l-black dark:border-l-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BrainCog className="w-5 h-5 text-black dark:text-white" />
              <span>AI Insight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-black dark:text-white leading-relaxed">{aiAnswer}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}