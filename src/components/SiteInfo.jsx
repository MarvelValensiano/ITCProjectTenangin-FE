import '../styles/SiteInfo.css'
import { Link } from 'react-router-dom'

function LogoJargon() {
  return (
    <div>
        <div className="logoJargon">
            <div className="logo">
                <img src="./public/tenanginLogo.png"></img>
                <a href="">TENANGIN</a>    
            </div>
            <p>Calm mind, happy life.</p>
        </div>
    </div>
  )
}

function QuickLinks() {
  return (
    <div>
        <div className="quickLinks">
            <h7>Quick Links</h7>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Check Mood</Link></li>
                <li><Link to="/">Videos</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </div>       
    </div>
  )
}

function ContactInfo() {
  return (
    <div>
        <div className="contactInfo">
            <h7>Contact Info</h7>
            <ul>
                <li>   
                    <a href="mailto:hello@tenangin.com">
                    <img src="./src/assets/site info/mail.svg" alt="Mail icon" />hello@tenangin.com</a>
                </li>
                <li>
                    <a href="https://www.instagram.com" target="_blank">
                    <img src="./src/assets/site info/insta.svg" alt="Instagram icon" />@tenangin_official</a>
                </li>
                <li>
                    <a href="https://www.linkedin.com" target="_blank">
                    <img src="./src/assets/site info/linkedin.svg" alt="LinkedIn icon" />TENANGIN Team</a>
                </li>
            </ul>
        </div>      
    </div>
  )
}

function ContactInfo2() {
  return (
    <div>
        <div className="contactInfo2">
            <h7>Contact Info</h7>
            <a href="mailto:hello@tenangin.com"><p>hello@tenangin.com</p></a>
            <div>
                <a href="https://www.instagram.com" target="_blank">
                <img src="./src/assets/site info/insta.svg" alt="Instagram icon" /></a>
                <a href="https://www.linkedin.com" target="_blank">
                <img src="./src/assets/site info/linkedin.svg" alt="LinkedIn icon" /></a>
                <a href="mailto:hello@tenangin.com">
                <img src="./src/assets/site info/mail.svg" alt="Mail icon" /></a>                
            </div>

        </div>      
    </div>
  )
}

function InboxEmail() {
  return (
    <div>
        <div className="inboxEmail">
            <h7>Stay Connected</h7>
            <p>Get daily motivation in your inbox</p>
            <form>
                <input type='email' name='email' placeholder='Your email'></input>
                <button type='submit'><img src='./src/assets/site info/send.svg'></img></button>
            </form>
        </div>      
    </div>
  )
}

export function SiteInfoA() {
  return (
    <div>
        <div className="siteInfoA">
            <hr/>
            <div className="siteInfoContent">
                <LogoJargon className="logoJargon"/>
                <QuickLinks className="quickLinks"/>
                <ContactInfo className="contactInfo"/>
                <InboxEmail className="inboxEmail"/>
            </div>
            <hr/>
        </div>
    </div>
  )
}

export function SiteInfoB() {
  return (
    <div className="siteInfoB">
        <hr className="SIB"/>
        <div className="siteInfoContent">
            <LogoJargon />
            <QuickLinks /> 
            <div style={{ marginRight: "200px" }}>
                <ContactInfo2 /> 
            </div>
        </div>
    </div>
  )
}


