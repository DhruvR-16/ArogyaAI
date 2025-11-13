import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { reportService } from '../services/reportService'
import { analysisService } from '../services/analysisService'

const Reports = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadReports()
      const analysisId = searchParams.get('analysis_id')
      if (analysisId) {
        handleGenerateReport(analysisId)
      }
    }
  }, [isAuthenticated, navigate, searchParams])

  const loadReports = async () => {
    try {
      const response = await reportService.getReports()
      setReports(response.reports || [])
    } catch (error) {
      console.error('Error loading reports:', error)
    }
  }

  const handleGenerateReport = async (analysisId) => {
    setLoading(true)
    try {
      await reportService.generateReport(analysisId)
      alert('Report generated successfully!')
      loadReports()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handleViewReport = async (id) => {
    try {
      const response = await reportService.getReport(id)
      setSelectedReport(response.report)
    } catch (error) {
      console.error('Error loading report:', error)
    }
  }

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return
    
    try {
      await reportService.deleteReport(id)
      loadReports()
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(null)
      }
    } catch (error) {
      alert('Failed to delete report')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Health Reports
          </h1>
          <p className="text-gray-600">
            View and manage your generated health analysis reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Reports</h2>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reports yet</p>
                  <p className="text-sm mt-2">Generate reports from your analyses</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => handleViewReport(report.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport?.id === report.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-800">{report.original_filename || 'Report'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {report.report_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Report Details</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Generated on {new Date(selectedReport.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReport(selectedReport.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {selectedReport.report_data && (
                  <div className="space-y-4">
                    {typeof selectedReport.report_data === 'string' ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(JSON.parse(selectedReport.report_data), null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-800 mb-2">File Information</h3>
                          <p className="text-sm text-blue-700">
                            {selectedReport.report_data.filename || selectedReport.original_filename}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Analyzed on {new Date(selectedReport.report_data.analysis_date).toLocaleDateString()}
                          </p>
                        </div>

                        {selectedReport.report_data.results && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Analysis Results</h3>
                            
                            {selectedReport.report_data.results.diseases && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Detected Conditions:</h4>
                                <div className="space-y-2">
                                  {selectedReport.report_data.results.diseases.map((disease, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                                      <span className="text-sm text-gray-800">{disease.name}</span>
                                      <span className="text-sm font-medium text-blue-600">
                                        {(disease.confidence * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedReport.report_data.results.risk_level && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Risk Level:</h4>
                                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                                  selectedReport.report_data.results.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                                  selectedReport.report_data.results.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {selectedReport.report_data.results.risk_level.toUpperCase()}
                                </span>
                              </div>
                            )}

                            {selectedReport.report_data.results.recommendations && (
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {selectedReport.report_data.results.recommendations.map((rec, i) => (
                                    <li key={i} className="text-sm text-gray-700">{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500">Select a report to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports

