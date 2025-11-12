import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { analysisService } from '../services/analysisService'

const Dashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadStats()
    }
  }, [isAuthenticated, navigate])

  const loadStats = async () => {
    try {
      const response = await analysisService.getStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const completionRate = stats
    ? Math.round(((stats?.completed || 0) / Math.max(stats?.total_analyses || 0, 1)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Your health analysis dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

