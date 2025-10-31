import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <nav>
      <div className="wrapper">
        <div className="logo">
          <img src="/tenanginLogo.png" alt="logo" />
          <Link to="/">TENANGIN</Link>
        </div>
        <div className="menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/CheckMood">Check Mood</Link></li>
            <li><Link to="/">Videos</Link></li>
            <li><Link to="/About">About</Link></li>
            <button><Link to="/">Login / Sign Up</Link></button>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
