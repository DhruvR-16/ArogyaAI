import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { uploadService } from '../services/uploadService'

const Upload = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [fileType, setFileType] = useState('medical_image')
  const [description, setDescription] = useState('')
  const [userUploads, setUserUploads] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      loadUploads()
    }
  }, [isAuthenticated, navigate])

  const loadUploads = async () => {
    try {
      const response = await uploadService.getUserUploads()
      setUserUploads(response.uploads || [])
    } catch (error) {
      console.error('Error loading uploads:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first')
      return
    }

    setLoading(true)
    setUploadStatus('Uploading...')
    
    try {
      await uploadService.uploadFile(selectedFile, fileType, description)
      setUploadStatus('Upload successful!')
      setSelectedFile(null)
      setDescription('')
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      loadUploads()
    } catch (error) {
      setUploadStatus(error.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this upload?')) return
    
    try {
      await uploadService.deleteUpload(id)
      loadUploads()
    } catch (error) {
      console.error('Error deleting upload:', error)
      alert('Failed to delete upload')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Upload Medical Files
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your medical images or reports for AI-powered analysis
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
            <div className="mb-6 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="medical_image">Medical Image</option>
                  <option value="xray">X-Ray</option>
                  <option value="ct_scan">CT Scan</option>
                  <option value="mri">MRI</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Add any notes about this file..."
                />
              </div>

              <div className="text-center">
                <label
                  htmlFor="file-input"
                  className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </label>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
              
              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Selected file:</p>
                  <p className="font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="w-full px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </button>
              
              {uploadStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  uploadStatus.includes('successful') 
                    ? 'bg-green-50 text-green-700' 
                    : uploadStatus === 'Uploading...'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
          
          {userUploads.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Uploads</h3>
              <div className="space-y-3">
                {userUploads.map((upload) => (
                  <div key={upload.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{upload.original_filename}</p>
                      <p className="text-sm text-gray-500">
                        {upload.file_type} • {(upload.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(upload.created_at).toLocaleDateString()}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        upload.status === 'analyzed' ? 'bg-green-100 text-green-700' :
                        upload.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {upload.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(upload.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Supported File Types
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Medical images (JPG, PNG, DICOM)</li>
              <li>• PDF documents</li>
              <li>• Word documents (.doc, .docx)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload

