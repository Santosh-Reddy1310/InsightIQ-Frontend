'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ConfidenceChart({ prob }: { prob: number[] }) {
  const data = {
    labels: ['Not Diabetic', 'Diabetic'],
    datasets: [
      {
        data: [prob[0] * 100, prob[1] * 100],
        backgroundColor: ['#4ade80', '#f87171'],
        borderColor: ['#22c55e', '#ef4444'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="w-[300px] mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  )
}
