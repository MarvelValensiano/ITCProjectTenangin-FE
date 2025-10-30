import './App.css'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
