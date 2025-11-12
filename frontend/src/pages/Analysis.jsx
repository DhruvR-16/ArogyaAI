import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { analysisService } from '../services/analysisService'
import { uploadService } from '../services/uploadService'

const Analysis = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [uploads, setUploads] = useState([])
  const [selectedUpload, setSelectedUpload] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadData()
    }
  }, [isAuthenticated, navigate])

  const loadData = async () => {
    try {
      const [analysesRes, uploadsRes, statsRes] = await Promise.all([
        analysisService.getAnalyses(),
        uploadService.getUserUploads(),
        analysisService.getStats()
      ])
      setAnalyses(analysesRes.analyses || [])
      setUploads(uploadsRes.uploads || [])
      setStats(statsRes.stats)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleStartAnalysis = async () => {
    if (!selectedUpload) {
      alert('Please select an upload to analyze')
      return
    }

    setLoading(true)
    try {
      await analysisService.startAnalysis(selectedUpload)
      alert('Analysis started! Results will be available shortly.')
      setSelectedUpload('')
      setTimeout(loadData, 2000)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start analysis')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const availableUploads = uploads.filter(u => u.status === 'uploaded' || u.status === 'analyzed')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Disease Analysis
          </h1>
          <p className="text-gray-600">
            Upload medical files and get AI-powered disease detection analysis
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analysis

