'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ConfidenceChart from './ConfidenceChart'

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

export default function PredictForm() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState<null | any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
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

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        🔮 Predict Diabetes
      </h2>

      {Object.keys(initialForm).map((field) => (
        <div key={field}>
          <label className="block font-semibold">{field}</label>
          <Input
            type="number"
            name={field}
            value={form[field as keyof typeof form]}
            onChange={handleChange}
          />
        </div>
      ))}

      <Button onClick={handleSubmit} className="w-full">🔍 Predict</Button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-muted space-y-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p className="text-lg font-bold flex items-center gap-2">
                {result.prediction === 1 ? '🔴 Diabetic' : '✅ Not Diabetic'}
              </p>
              <p>Confidence: {(Math.max(...result.probabilities) * 100).toFixed(2)}%</p>

              <ConfidenceChart prob={result.probabilities} />

              <p className="text-sm mt-2 text-purple-700">
                🧠 Based on your health information, the prediction is that you
                {result.prediction === 1 ? ' have' : ' do not have'} diabetes,
                with a {(Math.max(...result.probabilities) * 100).toFixed(0)}% confidence level.
              </p>

              <Button onClick={handleDownloadReport} className="w-full bg-green-600 hover:bg-green-700">
                📄 Download PDF Report
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
