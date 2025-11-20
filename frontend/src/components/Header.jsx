import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">TinyLink</Link>
        <nav className="flex gap-6 text-sm">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Dashboard</Link>
          <Link to="/health" className="text-gray-700 hover:text-indigo-600 transition">Health</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header