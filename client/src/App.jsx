import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

const HalimuyakLanding = lazy(() => import('./pages/Landing/LandingPage'))
const AuthContainer = lazy(() => import('./pages/Authentication/AuthContainer'))
const BrandPage = lazy(() => import('./pages/Collaborators/BrandPage'))
const GoogleSuccess = lazy(() => import('./components/GoogleSuccess/GoogleSuccess'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<HalimuyakLanding />} />
          <Route path='/authentication' element={<AuthContainer />} />
          <Route path='/brands' element={ <BrandPage />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
