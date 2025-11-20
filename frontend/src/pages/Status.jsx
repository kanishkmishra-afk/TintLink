import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const SERVER = 'https://tintlink-backend.onrender.com'

export default function Status() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLink = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${SERVER}/api/links/${code}`)
      setLink(res.data)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to load link details')
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => { fetchLink() }, [fetchLink])

  const handleDelete = async () => {
    if (!confirm(`Delete link ${code}? This cannot be undone.`)) return
    try {
      await axios.delete(`${SERVER}/api/links/${code}`)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Failed to delete link')
    }
  }

  const handleCopy = () => {
    const short = `${SERVER}/${code}`
    try { navigator.clipboard.writeText(short) } catch (e) { console.error(e) }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Back to Dashboard</button>
        </div>
      </div>
    )
  }

  if (!link) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">No link found</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Link Details</h1>
          <button onClick={() => navigate('/')} className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm">← Back</button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Short Code</label>
            <div className="px-3 py-2 bg-gray-50 border rounded-md font-mono font-semibold text-indigo-600">{link.code}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target URL</label>
            <a href={link.targetUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-50 border rounded-md text-blue-600 hover:underline break-all block">{link.targetUrl}</a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Clicks</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-lg font-semibold text-gray-900">{link.clicks || 0}</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Clicked</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-600">{link.last_clickedAt ? new Date(link.last_clickedAt).toLocaleString() : '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Created</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-600">{link.createdAt ? new Date(link.createdAt).toLocaleString() : '—'}</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Updated</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-600">{link.updatedAt ? new Date(link.updatedAt).toLocaleString() : '—'}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Copy Short URL</button>
          <a href={link.targetUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition">Visit Link</a>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  )
}

