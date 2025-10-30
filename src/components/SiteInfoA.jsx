import '../styles/SiteInfoA.css'
import { Link } from 'react-router-dom'

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
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/">Check Mood</Link></li>
                        <li><Link to="/">Videos</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>    
                <div className="SIACont3">
                    <h7>Contact Info</h7>
                    <ul>
                        <li>   
                            <a href="mailto:hello@tenangin.com">
                            <img src="./src/assets/site info/mail.svg" alt="Mail icon" />hello@tenangin.com</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="./src/assets/site info/insta.svg" alt="Instagram icon" />@tenangin_official</a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src="./src/assets/site info/linkedin.svg" alt="LinkedIn icon" />TENANGIN Team</a>
                        </li>
                    </ul>
                </div>
                <div className="SIACont4">
                    <h7>Stay Connected</h7>
                    <p>Get daily motivation in your inbox</p>
                    <form>
                        <input type='email' name='email' placeholder='Your email'></input>
                        <button type='submit'><img src='./src/assets/site info/send.svg'></img></button>
                    </form>
                </div>
            </div>
            <hr></hr>
        </div>
    </div>
  )
}

export default SiteInfoA
