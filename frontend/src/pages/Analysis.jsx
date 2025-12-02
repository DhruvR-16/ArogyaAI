import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { analysisService } from '../services/analysisService'
import { uploadService } from '../services/uploadService'

const Analysis = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [stats, setStats] = useState(null)
  

  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState('medical_image')
  const [description, setDescription] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadData()
    }
  }, [isAuthenticated, navigate])

  const loadData = async () => {
    try {
      const [analysesRes, statsRes] = await Promise.all([
        analysisService.getAnalyses(),
        analysisService.getStats()
      ])
      setAnalyses(analysesRes.analyses || [])
      setStats(statsRes.stats)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus('')
    }
  }

  const pollAnalysis = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await analysisService.getAnalysis(id)
        const status = res.analysis.status
        
        if (status === 'completed' || status === 'failed') {
          clearInterval(interval)
          loadData()
          setUploadStatus(status === 'completed' ? 'Analysis completed!' : 'Analysis failed.')
          setLoading(false)
        }
      } catch (error) {
        clearInterval(interval)
        setLoading(false)
        console.error('Polling error:', error)
      }
    }, 2000)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first')
      return
    }

    setLoading(true)
    setUploadStatus('Uploading and Analyzing...')

    try {
      // 1. Upload the file
      const uploadRes = await uploadService.uploadFile(selectedFile, fileType, description)
      const uploadId = uploadRes.upload.id

      // 2. Start Analysis
      const analysisRes = await analysisService.startAnalysis(uploadId)
      const analysisId = analysisRes.analysis.id
      
      setUploadStatus('Analysis started... Please wait.')
      setSelectedFile(null)
      setDescription('')
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      
      // 3. Poll for completion
      pollAnalysis(analysisId)

    } catch (error) {
      console.error('Error:', error)
      setUploadStatus(error.response?.data?.error || 'Operation failed. Please try again.')
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analysis & Reports
          </h1>
          <p className="text-gray-600">
            Upload medical files for instant AI analysis and generate detailed reports.
          </p>
        </div>


        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase">Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total_analyses || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase">Completed</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.completed || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase">Processing</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.processing || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase">Failed</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.failed || 0}</p>
            </div>
          </div>
        )}


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Start New Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <label htmlFor="file-input" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-primary hover:text-primary-dark">
                  {selectedFile ? selectedFile.name : 'Select a file to analyze'}
                </span>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>


            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="medical_image">Medical Image</option>
                  <option value="xray">X-Ray</option>
                  <option value="ct_scan">CT Scan</option>
                  <option value="mri">MRI</option>
                  <option value="lab_report">Lab Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="Add any notes..."
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Upload & Analyze
                  </>
                )}
              </button>

              {uploadStatus && (
                <p className={`text-sm text-center ${
                  uploadStatus.includes('success') ? 'text-green-600' : 
                  uploadStatus.includes('Uploading') ? 'text-primary' : 'text-red-600'
                }`}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        </div>


        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Analyses</h2>
        
        {analyses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No analyses yet</h3>
            <p className="text-gray-500 mt-1">Upload a file above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-cyan-50 rounded-lg">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      analysis.status === 'completed' ? 'bg-green-100 text-green-700' :
                      analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={analysis.original_filename}>
                    {analysis.original_filename}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(analysis.created_at).toLocaleDateString()} at {new Date(analysis.created_at).toLocaleTimeString()}
                  </p>

                  {analysis.status === 'completed' && analysis.results && (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {typeof analysis.results === 'string' 
                            ? JSON.parse(analysis.results).summary || "Analysis completed."
                            : analysis.results.summary || "Analysis completed."}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/reports?analysis_id=${analysis.id}`)}
                        className="w-full mt-2 px-4 py-2 bg-white border border-primary text-primary text-sm font-medium rounded-lg hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Full Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis

