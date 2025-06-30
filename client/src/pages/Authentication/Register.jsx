import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import './styles.css'

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthText = (strength) => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return texts[strength] || 'Very Weak'
  }

  const getPasswordStrengthColor = (strength) => {
    const colors = ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#0f9960']
    return colors[strength] || '#e53e3e'
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and symbols.'
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the Terms of Service and Privacy Policy'
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Update password strength for password field
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Clear confirm password error if passwords now match
    if (name === 'confirmPassword' && errors.confirmPassword && value === formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Register attempt:', { 
        ...formData, 
        acceptTerms,
        passwordStrength: getPasswordStrengthText(passwordStrength)
      })
      
      // Simulate success
      if (onRegisterSuccess) {
        onRegisterSuccess(formData)
      } else {
        alert('Registration successful! Please check your email to verify your account.')
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Google Sign-Up clicked');
      alert('Google Sign-Up integration would be implemented here')
    } catch (error) {
      setErrors({ submit: 'Google sign-up failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`auth-card ${isLoading ? 'loading' : ''}`}>
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us and start your journey today</p>
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
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`input-field ${errors.fullName ? 'input-error' : ''}`}
            disabled={isLoading}
            autoComplete="name"
          />
          <User className="input-icon" />
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
        </div>

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            className={`input-field ${errors.password ? 'input-error' : ''}`}
            disabled={isLoading}
            autoComplete="new-password"
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
          {formData.password && (
            <div style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{
                flex: 1,
                height: '4px',
                backgroundColor: '#e2e8f0',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  height: '100%',
                  backgroundColor: getPasswordStrengthColor(passwordStrength),
                  transition: 'all 0.3s ease',
                  borderRadius: '2px'
                }} />
              </div>
              <span style={{
                color: getPasswordStrengthColor(passwordStrength),
                fontWeight: '500',
                minWidth: '60px'
              }}>
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
          )}
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`input-field ${errors.confirmPassword ? 'input-error' : (formData.confirmPassword && formData.password === formData.confirmPassword ? 'input-success' : '')}`}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <Shield className="input-icon" />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
            <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} />
              Passwords match
            </div>
          )}
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        <div style={{ marginTop: '8px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '12px', 
            cursor: 'pointer',
            fontSize: '14px',
            color: '#4a5568',
            lineHeight: '1.5'
          }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (errors.terms) {
                  setErrors(prev => ({ ...prev, terms: '' }));
                }
              }}
              disabled={isLoading}
              style={{ 
                accentColor: '#667eea',
                marginTop: '2px',
                flexShrink: 0
              }}
            />
            <span>
              I agree to the{' '}
              <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && <div className="error-message" style={{ marginTop: '8px' }}>{errors.terms}</div>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
          style={{ marginTop: '24px' }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Creating account...
            </>
          ) : (
            <>
              Create Account
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
        className="google-button"
        onClick={() => {
          window.location.href = 'http://localhost:5001/api/auth/v1/google'
        }}
        disabled={isLoading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isLoading ? 'Please wait...' : 'Sign up with Google'}
      </button>

      <p className="switch-text">
        Already have an account?{' '}
        <span
          className="switch-link"
          onClick={!isLoading ? onSwitchToLogin : undefined}
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          Sign in
        </span>
      </p>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default RegisterForm