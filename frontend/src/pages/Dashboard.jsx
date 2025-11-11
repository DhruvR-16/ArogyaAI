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


        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Analyses</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.total_analyses || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Analyses Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.processing || 0}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-amber-600">{completionRate}%</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/analysis')}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <p className="font-semibold text-gray-800">Start Analysis</p>
              <p className="text-sm text-gray-600">Analyze available files</p>
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <p className="font-semibold text-gray-800">View Reports</p>
              <p className="text-sm text-gray-600">Check your health reports</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm mt-2">Start an analysis to see your activity here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

