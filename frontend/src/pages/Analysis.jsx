import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { predictDisease } from '../services/api'

const Analysis = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [selectedDisease, setSelectedDisease] = useState('diabetes')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')


  const [diabetesData, setDiabetesData] = useState({
    Pregnancies: 0,
    Glucose: 120,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 79,
    BMI: 25.0,
    DiabetesPedigreeFunction: 0.5,
    Age: 33
  })

  const [heartData, setHeartData] = useState({
    Age: 50,
    RestingBP: 120,
    Cholesterol: 200,
    FastingBS: 0,
    MaxHR: 150,
    Oldpeak: 0.0
  })

  const [kidneyData, setKidneyData] = useState({
    age: 50,
    bp: 80,
    bgr: 120,
    bu: 40,
    sc: 1.2,
    hemo: 14.0,
    pcv: 40,
    wc: 8000,
    rc: 4.5
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e, disease) => {
    const { name, value } = e.target
    const numValue = parseFloat(value) || 0

    if (disease === 'diabetes') {
      setDiabetesData(prev => ({ ...prev, [name]: numValue }))
    } else if (disease === 'heart') {
      setHeartData(prev => ({ ...prev, [name]: numValue }))
    } else if (disease === 'kidney') {
      setKidneyData(prev => ({ ...prev, [name]: numValue }))
    }
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      let data = {}
      if (selectedDisease === 'diabetes') data = diabetesData
      else if (selectedDisease === 'heart') data = heartData
      else if (selectedDisease === 'kidney') data = kidneyData

      const res = await predictDisease(selectedDisease, data)
      setResult(res)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err.response?.data?.error || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Disease Prediction Analysis
          </h1>
          <p className="text-gray-600">
            Select a disease type and enter patient data for instant AI prediction.
          </p>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Disease Type</label>
          <select
            value={selectedDisease}
            onChange={(e) => {
              setSelectedDisease(e.target.value)
              setResult(null)
              setError('')
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-lg"
          >
            <option value="diabetes">Diabetes Prediction</option>
            <option value="heart">Heart Disease Prediction</option>
            <option value="kidney">Kidney Disease Prediction</option>
          </select>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 capitalize">
            Enter {selectedDisease} Data
          </h2>

          <form onSubmit={handlePredict}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {selectedDisease === 'diabetes' && (
                <>
                  <Input label="Pregnancies" name="Pregnancies" value={diabetesData.Pregnancies} onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="Glucose Level" name="Glucose" value={diabetesData.Glucose} onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="Blood Pressure" name="BloodPressure" value={diabetesData.BloodPressure} onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="Skin Thickness" name="SkinThickness" value={diabetesData.SkinThickness} onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="Insulin" name="Insulin" value={diabetesData.Insulin} onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="BMI" name="BMI" value={diabetesData.BMI} step="0.1" onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="Diabetes Pedigree Function" name="DiabetesPedigreeFunction" value={diabetesData.DiabetesPedigreeFunction} step="0.01" onChange={(e) => handleInputChange(e, 'diabetes')} />
                  <Input label="Age" name="Age" value={diabetesData.Age} onChange={(e) => handleInputChange(e, 'diabetes')} />
                </>
              )}

              {selectedDisease === 'heart' && (
                <>
                  <Input label="Age" name="Age" value={heartData.Age} onChange={(e) => handleInputChange(e, 'heart')} />
                  <Input label="Resting BP" name="RestingBP" value={heartData.RestingBP} onChange={(e) => handleInputChange(e, 'heart')} />
                  <Input label="Cholesterol" name="Cholesterol" value={heartData.Cholesterol} onChange={(e) => handleInputChange(e, 'heart')} />
                  <Input label="Fasting BS (0 or 1)" name="FastingBS" value={heartData.FastingBS} onChange={(e) => handleInputChange(e, 'heart')} />
                  <Input label="Max HR" name="MaxHR" value={heartData.MaxHR} onChange={(e) => handleInputChange(e, 'heart')} />
                  <Input label="Oldpeak" name="Oldpeak" value={heartData.Oldpeak} step="0.1" onChange={(e) => handleInputChange(e, 'heart')} />
                </>
              )}

              {selectedDisease === 'kidney' && (
                <>
                  <Input label="Age" name="age" value={kidneyData.age} onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Blood Pressure" name="bp" value={kidneyData.bp} onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Blood Glucose Random" name="bgr" value={kidneyData.bgr} onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Blood Urea" name="bu" value={kidneyData.bu} onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Serum Creatinine" name="sc" value={kidneyData.sc} step="0.1" onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Hemoglobin" name="hemo" value={kidneyData.hemo} step="0.1" onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Packed Cell Volume" name="pcv" value={kidneyData.pcv} onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="White Blood Cell Count" name="wc" value={kidneyData.wc} onChange={(e) => handleInputChange(e, 'kidney')} />
                  <Input label="Red Blood Cell Count" name="rc" value={kidneyData.rc} step="0.1" onChange={(e) => handleInputChange(e, 'kidney')} />
                </>
              )}

            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? 'Analyzing...' : 'Predict Risk'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </form>
        </div>


        {result && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className={`p-6 ${result.prediction === 1 ? 'bg-red-50' : 'bg-green-50'} border-b border-gray-100`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Prediction Result</h3>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                  result.prediction === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {result.risk_category} Risk
                </span>
                <span className="text-gray-500 font-medium">
                  Confidence: {(result.probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {result.prediction === 1 
                  ? "The analysis indicates a high probability of the disease. It is strongly recommended to consult with a healthcare professional for further diagnosis."
                  : "The analysis indicates a low probability of the disease. However, maintaining a healthy lifestyle and regular checkups is always advised."}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Input Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(result.input_values || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-500 block">{key}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const Input = ({ label, name, value, onChange, type = "number", step = "1" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      step={step}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors"
      required
    />
  </div>
)

export default Analysis
