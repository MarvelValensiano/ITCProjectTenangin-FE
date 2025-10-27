import '../styles/SiteInfoA.css'

function SiteInfoA() {
  return (
    <div>

        <div className="siteInfoA">
            <hr></hr>
            <div className="SIACont">
                <div className="SIACont1">
                    <div className="logo">
                        <img src="./public/tenanginLogo.png"></img>
                        <a href="">TENANGIN</a>    
                    </div>
                    <p>Calm mind, happy life.</p>
                </div>
                <div className="SIACont2">
                    <h7>Quick Links</h7>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#checkMood">Mood Tracker</a></li>
                        <li><a href="#videos">Videos</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </div>    
                <div className="SIACont3">
                    <h7>Contact Info</h7>
                    <ul>
                        <li>
                            <img src="./public/mail.png" alt="Mail icon" />
                            <a href="mailto:hello@tenangin.com">hello@tenangin.com</a>
                        </li>
                        <li>
                            <img src="./public/insta.png" alt="Instagram icon" />
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">@tenangin_official</a>
                        </li>
                        <li>
                            <img src="./public/linkedin.png" alt="LinkedIn icon" />
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">TENANGIN Team</a>
                        </li>
                    </ul>
                </div>
                <div className="SIACont4">
                    <h7>Stay Connected</h7>
                    <p>Get daily motivation in your inbox</p>
                    <form>
                        <input type='email' name='email' placeholder='Your email'></input>
                        <button type='submit'><img src='./public/send.png'></img></button>
                    </form>
                </div>
            </div>
            <hr></hr>
        </div>
    </div>
  )
}

export default SiteInfoA
