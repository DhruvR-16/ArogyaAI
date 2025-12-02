import { useEffect, useRef, useState } from 'react'

const UploadModal = ({ onClose, onSubmit, mode = 'new_case', defaultDisease = '' }) => {
  const dropRef = useRef(null)
  const [title, setTitle] = useState('')
  const [disease, setDisease] = useState(defaultDisease)
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const el = dropRef.current
    if (!el) return
    const prevent = (e) => { e.preventDefault(); e.stopPropagation() }
    const onDrop = (e) => {
      prevent(e)
      const list = Array.from(e.dataTransfer.files || [])
      setFiles((prev) => [...prev, ...list])
    }
    el.addEventListener('dragover', prevent)
    el.addEventListener('dragenter', prevent)
    el.addEventListener('drop', onDrop)
    return () => {
      el.removeEventListener('dragover', prevent)
      el.removeEventListener('dragenter', prevent)
      el.removeEventListener('drop', onDrop)
    }
  }, [])

  const onBrowse = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...list])
  }
  const removeAt = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), disease: disease.trim(), files })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = files.length > 0 && (mode === 'add_report' ? true : title.trim() && disease.trim())

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Close">×</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{mode === 'add_report' ? 'Add New Report' : 'Create New Case'}</h2>

        {mode !== 'add_report' ? (
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Title</label>
              <input className="input-field" placeholder="e.g., Skin Cancer Check" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disease</label>
              <input className="input-field" placeholder="e.g., Melanoma" value={disease} onChange={(e) => setDisease(e.target.value)} />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
            <input className="input-field" value={disease} disabled />
          </div>
        )}

        <div ref={dropRef} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-3">Drag & drop files here</p>
          <label className="inline-block">
            <span className="btn btn-outline">Browse Files</span>
            <input type="file" multiple className="hidden" onChange={onBrowse} />
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4 border border-gray-200 rounded-lg divide-y">
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`} className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-800">{f.name}</p>
                  <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button className="text-gray-500 hover:text-red-600 text-sm" onClick={() => removeAt(i)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button disabled={!canSubmit || submitting} className="btn btn-primary" onClick={handleSubmit}>
            {submitting ? 'Submitting...' : mode === 'add_report' ? 'Add Report' : 'Create Case'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal