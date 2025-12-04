import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfile])

  const handleLogout = () => {
    logout()
    setShowProfile(false)
    navigate('/')
  }

  useEffect(() => {
    setShowProfile(false)
  }, [location.pathname])

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to
    return (
      <button
        onClick={() => navigate(to)}
        className="relative px-4 py-2 text-gray-700 font-medium transition-colors hover:text-primary group"
      >
        {children}
        <span
          className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
            isActive ? 'w-full' : ''
          }`}
        />
      </button>
    )
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary">ArogyaAI</h1>

              
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/analysis">Analysis</NavLink>
                  <NavLink to="/reports">Reports</NavLink>
                  <NavLink to="/medications">Medications</NavLink>
                  <NavLink to="/ai-analysis">AI Analysis</NavLink>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span>{user?.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showProfile ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50 animate-[fadeIn_.15s_ease-out]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary font-semibold text-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2">
                        <button
                          onClick={() => {
                            setShowProfile(false)
                            navigate('/profile')
                          }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

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
    </>
  )
}

export default Navbar


