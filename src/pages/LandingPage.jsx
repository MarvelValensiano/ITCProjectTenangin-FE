import Navbar from "../components/Navbar"
import "../styles/LandingPage.css"
import SiteInfoA from "../components/SiteInfoA"
import Footer from "../components/footer"

function LandingPage() {
  return (
    <>
    <div style={{ background: 'linear-gradient(0deg, #ffffff 0%, #D9EFF7 100%)'}}>
      <Navbar />
      <div className="LPcontent">
        <div className="LPCont1">
          <h1>
            Take Care of Your <span>Mind</span>, Every Day.
          </h1>
          <p>
            Find daily motivation, track your mood, and discover content that
            brightens your day.
          </p>
          <div className="LPbutton">
            <button id="LPBtn1"><a href="">Check Your Mood</a></button>
            <button id="LPBtn2"><a href="">Learn More</a></button>
          </div>
        </div>
        <div className="LPCont2"></div>
      </div>
      <SiteInfoA />
      <Footer />      
    </div>

    </>
  )
}

export default LandingPage
