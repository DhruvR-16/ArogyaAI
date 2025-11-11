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

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Total Analyses</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_analyses || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Processing</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.processing || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Failed</p>
              <p className="text-3xl font-bold text-red-600">{stats.failed || 0}</p>
            </div>
          </div>
        )}

        {/* Start New Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Start New Analysis</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Upload
              </label>
              <select
                value={selectedUpload}
                onChange={(e) => setSelectedUpload(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">Select an uploaded file...</option>
                {availableUploads.map((upload) => (
                  <option key={upload.id} value={upload.id}>
                    {upload.original_filename} ({upload.file_type})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleStartAnalysis}
              disabled={!selectedUpload || loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting Analysis...' : 'Start Analysis'}
            </button>
          </div>
        </div>

        {/* Analysis History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis History</h2>
          {analyses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No analyses yet</p>
              <p className="text-sm mt-2">Upload a file and start an analysis to see results here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-800">{analysis.original_filename}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(analysis.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded ${
                      analysis.status === 'completed' ? 'bg-green-100 text-green-700' :
                      analysis.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {analysis.status}
                    </span>
                  </div>
                  
                  {analysis.status === 'completed' && analysis.results && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Results:</h4>
                      {typeof analysis.results === 'string' ? (
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(JSON.parse(analysis.results), null, 2)}
                        </pre>
                      ) : (
                        <div className="text-sm text-gray-700">
                          {analysis.results.diseases && (
                            <div className="mb-3">
                              <p className="font-medium mb-1">Detected Conditions:</p>
                              <ul className="list-disc list-inside">
                                {analysis.results.diseases.map((d, i) => (
                                  <li key={i}>
                                    {d.name}: {(d.confidence * 100).toFixed(1)}%
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {analysis.results.recommendations && (
                            <div>
                              <p className="font-medium mb-1">Recommendations:</p>
                              <ul className="list-disc list-inside">
                                {analysis.results.recommendations.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/reports?analysis_id=${analysis.id}`)}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Generate Report
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analysis

