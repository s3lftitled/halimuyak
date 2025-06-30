import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import './AuthStyles.css'

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Login attempt:', { ...formData, rememberMe })
      
      // Simulate success
      if (onLoginSuccess) {
        onLoginSuccess(formData)
      } else {
        alert('Login successful! (This would redirect to dashboard)')
      }
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Google Sign-In clicked');
      alert('Google Sign-In integration would be implemented here')
    } catch (error) {
      setErrors({ submit: 'Google sign-in failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here')
  }

  return (
    <div className={`auth-card ${isLoading ? 'loading' : ''}`}>
      <div className="auth-header">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue to your account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="error-message" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: '#fef5f5',
            border: '1px solid #fed7d7',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            {errors.submit}
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            disabled={isLoading}
            autoComplete="email"
          />
          <Mail className="input-icon" />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className={`input-field ${errors.password ? 'input-error' : ''}`}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <Lock className="input-icon" />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '14px',
          color: '#718096'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              style={{ accentColor: '#667eea' }}
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="divider">
        <div className="divider-line"></div>
        <span className="divider-text">or continue with</span>
        <div className="divider-line"></div>
      </div>

      <button
        onClick={() => {
          window.location.href = 'http://localhost:5001/api/auth/v1/google'
        }}
        className="google-button"
        disabled={isLoading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isLoading ? 'Please wait...' : 'Continue with Google'}
      </button>

      <p className="switch-text">
        Don't have an account?{' '}
        <span
          className="switch-link"
          onClick={!isLoading ? onSwitchToRegister : undefined}
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          Create account
        </span>
      </p>

      <style>
        {
          `@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`
        }
      </style>
    </div>
  )
}

export default LoginForm