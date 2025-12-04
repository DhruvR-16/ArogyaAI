import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { getReports, uploadReport, deleteReport, getUploadedReports, updateReport } from '../services/api'

const Reports = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [updatingNotes, setUpdatingNotes] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadReports()
    }
  }, [isAuthenticated, navigate])

  const loadReports = async () => {
    setLoading(true)
    try {
      const [reportsResult, uploadsResult] = await Promise.allSettled([
        getReports(),
        getUploadedReports()
      ]);

      let allReports = [];

      if (reportsResult.status === 'fulfilled') {
        const data = reportsResult.value;
        const reportsList = Array.isArray(data) ? data : (data.data || []);
        allReports = [...allReports, ...reportsList];
      }

      if (uploadsResult.status === 'fulfilled') {
        allReports = [...allReports, ...uploadsResult.value];
      }

      allReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setReports(allReports)
      if (allReports.length > 0) {
        setSelectedReport(allReports[0])
      }
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) { 
      setUploadStatus('File size exceeds 1MB limit.')
      return
    }

    setUploading(true)
    setUploadStatus('Uploading...')

    try {
      await uploadReport(file)
      setUploadStatus('Upload successful!')
      loadReports() 
      setTimeout(() => setUploadStatus(''), 3000)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return

    try {
      await deleteReport(id)

      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(null)
      }
      loadReports() 
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete report. Please try again.')
    }
  }

  const handleUpdateNotes = async () => {
    if (!selectedReport) return
    
    setUpdatingNotes(true)
    try {
      const updatedReport = await updateReport(selectedReport.id, { notes })
      
      setSelectedReport({ ...selectedReport, notes: updatedReport.data.notes })
      
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, notes: updatedReport.data.notes } : r
      ))
      
      setIsEditingNotes(false)
    } catch (error) {
      console.error('Update notes error:', error)
      alert('Failed to update notes. Please try again.')
    } finally {
      setUpdatingNotes(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || 
      (filter === 'uploaded' && !report.disease_type) ||
      (report.disease_type === filter);

    const matchesSearch = searchQuery === '' || 
      report.id.toString().includes(searchQuery) ||
      (report.disease_type && report.disease_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.notes && report.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

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
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">History</h2>
                  
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="all">All Reports</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="heart">Heart</option>
                    <option value="kidney">Kidney</option>
                    <option value="uploaded">Uploaded</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12 px-6 text-gray-500">
                    <p>No reports found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => {
                          setSelectedReport(report)
                          setNotes(report.notes || '')
                          setIsEditingNotes(false)
                        }}
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
                  <div className="flex gap-2">
                    <button
                        onClick={() => handleDelete(selectedReport.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Report"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-8 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Notes
                      </h3>
                      {!isEditingNotes && (
                        <button 
                          onClick={() => setIsEditingNotes(true)}
                          className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditingNotes ? (
                      <div>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                          rows="3"
                          placeholder="Add your notes here..."
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setIsEditingNotes(false)
                              setNotes(selectedReport.notes || '')
                            }}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            disabled={updatingNotes}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateNotes}
                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                            disabled={updatingNotes}
                          >
                            {updatingNotes ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedReport.notes || <span className="text-gray-400 italic">No notes added.</span>}
                      </p>
                    )}
                  </div>

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
                      {selectedReport.file_url && (
                         <a 
                           href={selectedReport.file_url} 
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
