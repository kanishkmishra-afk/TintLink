import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Status from './pages/Status'
import HealthCheck from './pages/HealthCheck'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<Status />} />
            <Route path="/health" element={<HealthCheck />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
