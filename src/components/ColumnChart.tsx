'use client'

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

type Props = {
  title: string
  data: number[]
  labels?: string[]
}

export default function ColumnChart({ title, data, labels }: Props) {
  const chartData = {
    labels: labels || data.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: title,
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.6)', // indigo
        borderRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  }

  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <Bar data={chartData} options={options} />
    </div>
  )
}
