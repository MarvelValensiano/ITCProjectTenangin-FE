import '../styles/Navbar.css'

function Navbar() {
  return (
    <nav>
        <div className="wrapper">
            <div className="logo">
                <img src="./public/tenanginLogo.png"></img>
                <a href="">TENANGIN</a>
            </div>
            <div className="menu">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#checkMood">Check Mood</a></li>
                    <li><a href="#videos">Videos</a></li>
                    <li><a href="#about">About</a></li>
                    <button><a href="#login">Login / Sign Up</a></button>
                </ul>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
