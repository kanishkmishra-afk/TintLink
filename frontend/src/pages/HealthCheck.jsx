import React, { useEffect, useState } from 'react'
import axios from 'axios'

const SERVER = 'http://localhost:3000'

export default function HealthCheck() {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(`${SERVER}/healthz`)
        setStatus(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }
    checkHealth()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Health Status</h1>
      
      {loading && <div className="bg-white border rounded-lg p-6 text-center text-gray-500">Loading...</div>}
      
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6">{error}</div>}
      
      {status && (
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-lg font-semibold text-green-700">Server is healthy</span>
          </div>
          <pre className="bg-gray-50 border rounded p-4 overflow-auto text-sm font-mono">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
