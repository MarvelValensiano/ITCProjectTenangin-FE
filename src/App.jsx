import './App.css'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import CheckMood from './pages/CheckMood'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/About" element={<About />} />
      <Route path='/CheckMood' element={<CheckMood />} />
    </Routes>
  )
}

export default App
