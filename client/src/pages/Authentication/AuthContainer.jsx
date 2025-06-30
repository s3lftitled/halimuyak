import { useState, useEffect } from 'react'
import LoginForm from './Login'
import RegisterForm from './Register'
import './styles.css'

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState('login')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleViewChange = (newView) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView(newView)
      setIsTransitioning(false)
    }, 150)
  }

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData)
    // Here you would typically:
    // 1. Store authentication tokens
    // 2. Redirect to dashboard
    // 3. Update global auth state
    alert(`Welcome back, ${userData.email}! Redirecting to dashboard...`)
  }

  const handleRegisterSuccess = (userData) => {
    console.log('Registration successful:', userData)
    // Here you would typically:
    // 1. Show email verification message
    // 2. Store temporary registration data
    // 3. Redirect to verification page
    alert(`Account created for ${userData.email}! Please check your email to verify your account.`)
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          // Allow form submission with Ctrl/Cmd + Enter
          return
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="auth-container">
      <div className="logo">Halimuyak PH</div>
      
      <div 
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >

        {currentView === 'login' ? (
          <LoginForm 
            onSwitchToRegister={() => handleViewChange('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={() => handleViewChange('login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </div>
      
      {/* Optional: Add some decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

export default AuthContainer