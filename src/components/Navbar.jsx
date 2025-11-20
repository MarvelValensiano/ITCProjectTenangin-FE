import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/Navbar.css'

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/"); // kembali ke landing page
  };

  return (
    <nav>
      <div className="wrapper">
        <div className="logo">
          <img src="/tenanginLogo.png" alt="logo" />
          <Link to="/">TENANGIN</Link>
        </div>

        <div className="menu">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/CheckMood">Check Mood</Link></li>
            <li><Link to="/Videos">Videos</Link></li>
            <li><Link to="/About">About</Link></li>

            {/* --- tombol login / logout --- */}
            {!isLoggedIn ? (
              <button>
                <Link to="/Login">Login / Sign Up</Link>
              </button>
            ) : (
              <button onClick={handleLogout}>
                Logout
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
