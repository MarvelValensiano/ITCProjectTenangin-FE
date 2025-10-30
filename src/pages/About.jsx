import Navbar from "../components/Navbar"
import SiteInfoA from "../components/SiteInfoA"
import "../styles/About.css"
import React from 'react'
import Footer from "../components/footer"
import HeartIcon from "../assets/about/heart.svg?react"
import BrainIcon from "../assets/about/brain.svg?react"
import LeafIcon from "../assets/about/leaf.svg?react"


function Desc() {
  return (
    <div className="desc" style={{ background: 'linear-gradient(90deg, #A8E6CF 0%, #88D8E8 100%)'}}>
      <div className="descText">
        <h1>About <span>TENANGIN</span></h1>
        <h2>A space to understand, care for, and support your mental well-being.</h2>
        <p>TENANGIN is a mental health information platform that helps people reflect on their emotions, discover uplifting content, and stay motivated every day. We aim to make mental wellness simple, approachable, and accessible for everyone.</p>
        <button><a href="">Explore Our Features</a></button>
      </div>
      <div className="descImg">
        <img src="src/assets/about/descImage.svg" alt="" />
      </div>
    </div>
  )
}

function Mission() {
  return (
    <section className="mission">
      <h2>Our Mission</h2>
      <div className="missionBox">
        <p>
          We believe that taking care of your mental health should be easy, supportive, and stigma-free. TENANGIN was created to promote awareness and positivity through mood tracking, motivational content, and education.
        </p>
        <img src="../src/assets/about/heart.svg" alt="heart" className="iconLeft" />
        <img src="../src/assets/about/leaf.svg" alt="leaf" className="iconBottom" />
        <img src="../src/assets/about/brain.svg" alt="brain" className="iconRight" />
      </div>
    </section>
  )
}

function SDG3() {
  return (
    <div className="SDG3">
      <h2>Supporting Global Well-being</h2>
      <div className="SDG3Content">
        <div className="SDG3Img">
          <img src="../src/assets/about/SDG3Img.svg" alt="" />
        </div>        
        <div className="SDG3Text">
          <h3>Sustainable Development Goal 3</h3>
          <p>
            TENANGIN supports Sustainable Development Goal 3 by improving access to mental health information and emotional support. We believe that mental wellness is a fundamental part of overall health and well-being. 
          </p>
          <p>
            Through our platform, we contribute to creating a world where mental health resources are accessible, stigma-free, and supportive for everyone, regardless of their background or circumstances.
          </p>
        </div>
      </div>
    </div>
  )
}

function TenanginTeam() {
  return (
    <div className="tenanginTeam">
      <h2>Meet the People Behind TENANGIN</h2>
      <p>We're a small team passionate about mental health and technology.</p>
      <div className="teamBox">
        <div className="teamCard" id="kevin">
          <img src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" />
          <h6>KEVIN</h6>
          <p>UI/UX Designer</p>
        </div>
        <div className="teamCard" id="marvel">
          <img src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" />
          <h6>MARVEL</h6>
          <p>Front-end Developer</p>
        </div>
        <div className="teamCard" id="fiernaz">
          <img src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" />
          <h6>FIERNAZ</h6>
          <p>Back-end Developer</p>
        </div>
        <div className="teamCard" id="fariz">
          <img src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" />
          <h6>FARIZ</h6>
          <p>Project Manager</p>
        </div>
        <div className="teamCard" id="nahdia">
          <img src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" />
          <h6>NAHDIA</h6>
          <p>Front-end Developer</p>
        </div>
      </div>
    </div>
  )
}

function Purpose() {
  return (
    <div className="purpose">
      <h2>Together for Better Mental Health</h2>
      <p>TENANGIN is not just a website — it's a reminder that taking care of your mind matters. Every small step toward emotional balance is a victory worth celebrating.</p>
      <img src="../src/assets/about/purposeImg.svg" alt="" />
    </div>
  )
}

function Feedback() {
  return (
    <div className="feedback">
      <h2>Get in Touch</h2>
      <p>We'd love to hear your feedback or collaboration ideas.</p>
      <div className="feedbackBox">
        <form className="messageForm">
          <h3>Send us a message</h3>
          <input type="text" placeholder="Your Name"/>
          <input type="email" placeholder="Your E-mail"/>
          <textarea placeholder="Your Message"/>
          <button type="submit"> Send Message</button>
        </form>
        <div className="socmed">
          <h3>Connect with us</h3>
          <ul>
            <li>
              <a href="mailto:hello@tenangin.com">
                  <div id="mail"><img src="./src/assets/about/mail.svg" alt="Mail icon" /></div>
                  <p>hello@tenangin.com</p>
                </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank">
                <div id="insta"><img src="./src/assets/about/insta.svg" alt="Instagram icon" /></div>
                <p>@tenangin_official</p>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" target="_blank">
                <div id="linkedin"><img src="./src/assets/about/linkedin.svg" alt="LinkedIn icon" /></div>
                <p>TENANGIN Team</p>
              </a>
            </li>
          </ul>
          <hr />
          <p>Follow us on social media for daily motivation, mental health tips, and community updates.</p>          
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <div>
      <Navbar/>
      <Desc />
      <Mission />
      <SDG3 />
      <TenanginTeam />
      <Purpose />
      <Feedback />
    </div>
  );
}

export default About;
