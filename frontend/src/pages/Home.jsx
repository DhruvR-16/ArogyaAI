import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoginModal from '../components/LoginModal'
import SignupModal from '../components/SignupModal'
import { useState } from 'react'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/analysis')
    } else {
      setShowSignup(true)
    }
  }

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />


      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
            Early Disease Detection
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            AI-powered analysis for faster, clearer healthcare decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="btn btn-primary btn-large"
            >
              {isAuthenticated ? 'Start Analyzing' : 'Get Started'}
            </button>
          </div>
        </div>
      </section>




      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false)
            setShowSignup(true)
          }}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
        />
      )}
    </div>
  )
}

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow transition-shadow duration-300 text-center">
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

export default Home



