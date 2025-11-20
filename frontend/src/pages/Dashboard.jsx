import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SERVER = 'https://tintlink-backend.onrender.com'

function truncate(text, n = 80) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n - 1) + '…' : text
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [q, setQ] = useState('')

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${SERVER}/api/links`)
      setLinks(res.data || [])
      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const isValidUrl = (s) => {
    try { new URL(s); return true } catch { return false }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let out = ''
    for (let i = 0; i < 6; i++) out += chars.charAt(Math.floor(Math.random() * chars.length))
    return out
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!isValidUrl(url)) { setError('Please enter a valid URL'); return }
    setSubmitting(true)
    try {
      const payload = { targetUrl: url }
      if (code && code.trim() !== '') payload.code = code.trim()
      await axios.post(`${SERVER}/api/links`, payload)
      setSuccess(`Link created successfully! Short code: ${payload.code || 'generated'}`)
      setUrl('')
      setCode('')
      setTimeout(() => setSuccess(''), 3000)
      await fetchLinks()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to create link')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (c) => {
    if (!confirm(`Delete link ${c}?`)) return
    try {
      await axios.delete(`${SERVER}/api/links/${c}`)
      setLinks((s) => s.filter(l => l.code !== c))
    } catch (err) {
      console.error(err)
      setError('Failed to delete link')
    }
  }

  const handleCopy = (c) => {
    const short = `${SERVER}/${c}`
    try { navigator.clipboard.writeText(short) } catch (e) { console.error(e) }
  }

  const filtered = links.filter(l => {
    if (!q) return true
    const lower = q.toLowerCase()
    return l.code.toLowerCase().includes(lower) || (l.targetUrl || '').toLowerCase().includes(lower)
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
      <p className="text-gray-600 mb-6">Create, manage, and track your short links</p>

      <section className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Link</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Code (optional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., docs"
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              type="submit"
              disabled={submitting || !url}
            >
              {submitting ? 'Creating...' : 'Add'}
            </button>
            <button 
              type="button" 
              onClick={() => setCode(generateCode())} 
              className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 transition"
              disabled={submitting}
            >
              Random
            </button>
          </div>
        </form>
        {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
        {success && <div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{success}</div>}
      </section>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search by code or URL..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchLinks} 
          className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-6 text-center text-gray-500">Loading links...</div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Short code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Target URL</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Last clicked</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No links found. Create your first link above!</td></tr>
              )}
              {filtered.map(link => (
                <tr key={link.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-indigo-600"><a href={`/code/${link.code}`} className="hover:underline">{link.code}</a></td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-sm" title={link.targetUrl}><span className="truncate block">{truncate(link.targetUrl)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">{link.clicks || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{link.last_clickedAt ? new Date(link.last_clickedAt).toLocaleString() : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/code/${link.code}`)} 
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition text-xs font-medium"
                    >
                      View Stats
                    </button>
                    <button 
                      onClick={() => { handleCopy(link.code); setSuccess(`Copied: ${SERVER}/${link.code}`); setTimeout(() => setSuccess(''), 2000); }} 
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition text-xs font-medium"
                    >
                      Copy
                    </button>
                    <a href={link.targetUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition text-xs font-medium">Open</a>
                    <button 
                      onClick={() => handleDelete(link.code)} 
                      className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
