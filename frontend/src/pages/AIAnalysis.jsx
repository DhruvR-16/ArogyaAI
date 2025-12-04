import Navbar from '../components/Navbar'

const AIAnalysis = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Advanced AI Analysis
          </h1>
          <p className="text-gray-600">
            Upload complex medical documents like MRIs, X-Rays, and CT Scans for deep learning analysis.
          </p>
        </div>

        <div className="relative bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8">
          

          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-primary text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg  mb-4">
              Training Model…
            </div>
            <p className="text-gray-600 font-medium text-center max-w-md">
               Training our advanced models to analyze medical imagery with high precision. Stay tuned!
            </p>
          </div>


        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Reports</h3>
            <p className="text-sm text-gray-500">Get comprehensive breakdown of anomalies and potential findings.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Medication Insights</h3>
            <p className="text-sm text-gray-500">AI-suggested medication and treatment paths based on diagnosis.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Accuracy</h3>
            <p className="text-sm text-gray-500">Powered by state-of-the-art computer vision models.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AIAnalysis
