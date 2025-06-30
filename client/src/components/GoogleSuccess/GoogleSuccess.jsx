import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GoogleSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const token = query.get('accessToken')

    if (token) {
      localStorage.setItem('accessToken', token)
      navigate('/brands') 
    } else {
      navigate('/login')
    }
  }, [])

  return <p>Logging you in with Google...</p>
}

export default GoogleSuccess
