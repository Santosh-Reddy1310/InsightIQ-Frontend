'use client'

import { useState } from 'react'
import axios from 'axios'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState<string>('')

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResponse(res.data.message)
    } catch (error) {
      setResponse('Error uploading file')
      console.error(error)
    }
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">📁 Upload CSV Dataset</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full text-black"
      />
      <button
        onClick={handleUpload}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
      >
        Upload
      </button>
      {response && <p className="mt-4">{response}</p>}
    </div>
  )
}
