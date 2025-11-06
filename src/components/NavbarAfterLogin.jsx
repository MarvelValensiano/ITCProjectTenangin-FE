import { Link } from 'react-router-dom'
import '../styles/Navbar.css'


function NavbarAfterLogin() {
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
            <li><Link to="/Profile">Profile</Link></li>
            <Link to="/Profile"><img src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" /></Link>
            <button><Link to="/">Log Out</Link></button>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavbarAfterLogin
