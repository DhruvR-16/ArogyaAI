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
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Reports
          </h1>
          <p className="text-gray-600">
            Detailed analysis and AI-generated health insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900">History</h2>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {reports.length === 0 ? (
                  <div className="text-center py-12 px-6 text-gray-500">
                    <p>No reports generated yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => handleViewReport(report.id)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedReport?.id === report.id
                            ? 'bg-cyan-50 border-l-4 border-primary'
                            : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className={`font-medium truncate pr-2 ${
                            selectedReport?.id === report.id ? 'text-primary-dark' : 'text-gray-900'
                          }`}>
                            {report.original_filename || 'Untitled Report'}
                          </p>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {report.report_type.toUpperCase()} • ID: {report.id.slice(0, 8)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-cyan-100 text-primary-dark text-xs font-medium rounded uppercase tracking-wide">
                      {selectedReport.report_type} Report
                    </span>
                    <span className="text-sm text-gray-500">
                      Generated {new Date(selectedReport.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Print Report"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteReport(selectedReport.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>


                <div className="p-8 print:p-0" id="printable-report">

                  <div className="border-b-2 border-gray-800 pb-6 mb-8">
                    <div className="flex justify-between items-end">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">Medical Analysis Report</h1>
                        <p className="text-gray-600 mt-1">ArogyaAI Diagnostic System</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Report ID</p>
                        <p className="font-mono text-gray-900">{selectedReport.id}</p>
                      </div>
                    </div>
                  </div>

                  {selectedReport.report_data && (
                    <div className="space-y-8">

                      <div className="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">File Name</p>
                          <p className="font-medium text-gray-900">{selectedReport.report_data.filename}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Analysis Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedReport.report_data.analysis_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>


                      {(() => {
                        const results = typeof selectedReport.report_data.results === 'string'
                          ? JSON.parse(selectedReport.report_data.results)
                          : selectedReport.report_data.results;

                        return (
                          <>
                            <div className="flex gap-6 items-start">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Clinical Summary</h3>
                                <p className="text-gray-700 leading-relaxed">
                                  {results.summary || "No summary available."}
                                </p>
                              </div>
                              <div className="w-48 bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Risk Level</p>
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                                  results.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                                  results.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {results.risk_level || 'UNKNOWN'}
                                </span>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Confidence</p>
                                  <p className="text-xl font-bold text-primary">
                                    {results.confidence_score ? `${(results.confidence_score * 100).toFixed(0)}%` : 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {results.vitals && (
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Vitals & Measurements</h3>
                                <div className="grid grid-cols-3 gap-4">
                                  {Object.entries(results.vitals).map(([key, value]) => (
                                    <div key={key} className="bg-cyan-50 p-4 rounded-lg">
                                      <p className="text-xs font-medium text-primary-dark uppercase mb-1">
                                        {key.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-lg font-semibold text-gray-900">{value}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {results.findings && (
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Detailed Findings</h3>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {results.findings.map((finding, idx) => (
                                        <tr key={idx}>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{finding.area}</td>
                                          <td className="px-6 py-4 text-sm text-gray-500">{finding.observation}</td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              finding.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                              {finding.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}


                            {results.diseases && (
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Condition Analysis</h3>
                                <div className="space-y-2">
                                  {results.diseases.map((disease, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="font-medium text-gray-900">{disease.name}</span>
                                      <div className="flex items-center gap-4">
                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${disease.confidence * 100}%` }}
                                          />
                                        </div>
                                        <span className="text-sm font-mono text-gray-600 w-12 text-right">
                                          {(disease.confidence * 100).toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}


                            {results.recommendations && (
                              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                <h3 className="text-lg font-bold text-green-900 mb-4">Recommendations</h3>
                                <ul className="space-y-2">
                                  {results.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-3 text-green-800">
                                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}


                            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                              <p className="text-xs text-gray-400 italic">
                                {results.disclaimer || "This report is generated by AI and should be reviewed by a certified medical professional."}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Report</h3>
                <p className="text-gray-500 max-w-sm">
                  Choose a report from the history sidebar to view detailed analysis and insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports

