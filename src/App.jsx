import './App.css'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import CheckMood from './pages/CheckMood'
import Login from './pages/Login'
import Register from './pages/Register';
import Home from "./pages/Home";
import VideosPage from "./pages/Videos";
import Profile from './pages/Profile'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/Login' element={<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/About" element={<About />} />
      <Route path='/CheckMood' element={<CheckMood />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/home" element={<Home />} />
      <Route path='/Profile' element={<Profile />} />
    </Routes>
  )
}

export default App
