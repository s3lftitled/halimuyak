import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

const HalimuyakLanding = lazy(() => import('./pages/Landing/LandingPage'))

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HalimuyakLanding />} />
      </Routes>
    </Router>
  )
}

export default App
