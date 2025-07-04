'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ConfidenceChart from './ConfidenceChart'
import { Brain, Download, AlertCircle, CheckCircle } from 'lucide-react'

const initialForm = {
  Pregnancies: '',
  Glucose: '',
  BloodPressure: '',
  SkinThickness: '',
  Insulin: '',
  BMI: '',
  DiabetesPedigreeFunction: '',
  Age: '',
}

const fieldLabels = {
  Pregnancies: 'Number of Pregnancies',
  Glucose: 'Glucose Level',
  BloodPressure: 'Blood Pressure',
  SkinThickness: 'Skin Thickness',
  Insulin: 'Insulin Level',
  BMI: 'Body Mass Index',
  DiabetesPedigreeFunction: 'Diabetes Pedigree Function',
  Age: 'Age',
}

export default function PredictForm() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState<null | any>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/predict`, {
        file: 'diabetes.csv',
        data: {
          ...Object.fromEntries(
            Object.entries(form).map(([key, value]) => [key, parseFloat(value)])
          )
        }
      })
      setResult(data)
    } catch (err) {
      console.error(err)
      setResult({ error: 'Prediction failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!result) return

    try {
      const confidence = Math.max(...result.probabilities) * 100

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/report`, {
        file: 'diabetes',
        prediction: result.prediction,
        confidence,
        input_data: Object.fromEntries(
          Object.entries(form).map(([k, v]) => [k, parseFloat(v)])
        ),
        insight: `Based on your health data, you are ${
          result.prediction === 1 ? 'likely to have' : 'unlikely to have'
        } diabetes. Confidence: ${confidence.toFixed(2)}%.`
      }, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'insightiq-report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('PDF download failed', err)
    }
  }

  const isFormValid = Object.values(form).every(value => value.trim() !== '')

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          AI Health Prediction
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your health metrics to get an AI-powered diabetes risk assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-black dark:text-white" />
              <span>Health Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(initialForm).map(([field, _]) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  {fieldLabels[field as keyof typeof fieldLabels]}
                </label>
                <Input
                  type="number"
                  name={field}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldLabels[field as keyof typeof fieldLabels].toLowerCase()}`}
                  className="w-full"
                />
              </div>
            ))}

            <Button 
              onClick={handleSubmit} 
              className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-12"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Predict Risk
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              {result.error ? (
                <Card className="border-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{result.error}</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Prediction Result */}
                  <Card className={`border-2 ${result.prediction === 1 ? 'border-red-500' : 'border-green-500'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {result.prediction === 1 ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <span>Prediction Result</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <Badge 
                          variant={result.prediction === 1 ? 'destructive' : 'default'}
                          className="text-lg px-4 py-2 mb-4"
                        >
                          {result.prediction === 1 ? 'High Risk' : 'Low Risk'}
                        </Badge>
                        
                        <p className="text-2xl font-bold mb-2">
                          {(Math.max(...result.probabilities) * 100).toFixed(1)}% Confidence
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400">
                          Based on your health information, the AI model predicts you
                          {result.prediction === 1 ? ' have a high risk' : ' have a low risk'} of diabetes.
                        </p>
                      </div>

                      <ConfidenceChart prob={result.probabilities} />
                    </CardContent>
                  </Card>

                  {/* Download Report */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold">Get Detailed Report</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Download a comprehensive PDF report with your prediction results and recommendations.
                        </p>
                        <Button 
                          onClick={handleDownloadReport} 
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {!result && (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Fill in your health metrics and click "Predict Risk" to get your AI-powered assessment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}