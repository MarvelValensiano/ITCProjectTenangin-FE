import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

// Default avatar lokal
import defaultAva from "../assets/profile/defaultAva.jpg";

// pola untuk mendeteksi avatar default backend
const BACKEND_DEFAULT_KEYWORD = "/profile_pictures/default";

function Navbar({ avatarUrl: avatarFromProps }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(avatarFromProps || defaultAva);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        const raw = user.foto_profile_url;

        const shouldUseDefault =
          !raw || raw.includes(BACKEND_DEFAULT_KEYWORD);

        setAvatarUrl(shouldUseDefault ? defaultAva : raw);
      } catch {
        setAvatarUrl(defaultAva);
      }
    }
  }, [avatarFromProps]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
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
            <li>
              <Link to={isLoggedIn ? "/home" : "/"}>
                Home
              </Link>
            </li>

            <li>
              <Link to={isLoggedIn ? "/CheckMood" : "/Login"}>
                Check Mood
              </Link>
            </li>

            <li>
              <Link to={isLoggedIn ? "/Videos" : "/Login"}>
                Videos
              </Link>
            </li>

            <li>
              <Link to="/About">About</Link>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <Link to="/Profile">Profile</Link>
                </li>

                <li className="nav-avatar">
                  <Link to="/Profile">
                    <img
                      src={avatarUrl || defaultAva}
                      alt="User avatar"
                      className="nav-avatar-img"
                    />
                  </Link>
                </li>
                <button className="logoutBtn" onClick={handleLogout}>Log Out</button>
              </>
            )}

            {!isLoggedIn && (
              <button>
                <Link to="/Login">Login / Sign Up</Link>
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
