import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { getReports, uploadReport } from '../services/api'

const Reports = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadReports()
    }
  }, [isAuthenticated, navigate])

  const loadReports = async () => {
    try {
      const data = await getReports()
      const reportsList = Array.isArray(data) ? data : (data.data || [])
      setReports(reportsList)
    } catch (error) {
      console.error('Error loading reports:', error)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) { // 1MB limit
      setUploadStatus('File size exceeds 1MB limit.')
      return
    }

    setUploading(true)
    setUploadStatus('Uploading...')

    try {
      await uploadReport(file)
      setUploadStatus('Upload successful!')
      loadReports() // Refresh list
      setTimeout(() => setUploadStatus(''), 3000)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Medical Reports & History
            </h1>
            <p className="text-gray-600">
              View your prediction history and upload medical documents.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div>
              <label 
                htmlFor="report-upload" 
                className={`cursor-pointer px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? 'Uploading...' : 'Upload Report'}
              </label>
              <input 
                id="report-upload" 
                type="file" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>
            <div className="text-xs text-gray-500">
              <p>Max 1MB</p>
              <p>PDF, JPG, PNG</p>
            </div>
          </div>
        </div>

        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg ${uploadStatus.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
            {uploadStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900">History</h2>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {reports.length === 0 ? (
                  <div className="text-center py-12 px-6 text-gray-500">
                    <p>No reports found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
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
                            {report.disease_type ? `${report.disease_type.charAt(0).toUpperCase() + report.disease_type.slice(1)} Prediction` : 'Uploaded Report'}
                          </p>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                           ID: {report.id}
                        </p>
                        {report.risk_category && (
                           <span className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full ${
                             report.risk_category === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                           }`}>
                             {report.risk_category} Risk
                           </span>
                        )}
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
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedReport.disease_type 
                        ? `${selectedReport.disease_type.charAt(0).toUpperCase() + selectedReport.disease_type.slice(1)} Analysis` 
                        : 'Uploaded Document'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Generated on {new Date(selectedReport.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  {selectedReport.disease_type ? (
                    <div className="space-y-6">
                      <div className={`p-4 rounded-lg border ${
                        selectedReport.prediction === 1 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-lg font-bold ${
                            selectedReport.prediction === 1 ? 'text-red-700' : 'text-green-700'
                          }`}>
                            {selectedReport.risk_category} Risk Detected
                          </span>
                        </div>
                        <p className="text-gray-700">
                          Probability: <strong>{(selectedReport.probability * 100).toFixed(1)}%</strong>
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Input Parameters</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          {Object.entries(selectedReport.input_values || {}).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-500 block text-xs uppercase">{key}</span>
                              <span className="font-medium text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Document Uploaded</h3>
                      <p className="text-gray-500 mb-6">This is an uploaded medical report file.</p>
                      {selectedReport.report_file && (
                         <a 
                           href={selectedReport.report_file} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
                         >
                           View Document
                         </a>
                      )}
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
                  Choose a report from the history sidebar to view details.
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
