import Navbar from "../components/Navbar"
import "../styles/LandingPage.css"
import SiteInfoA from "../components/SiteInfoA"

function LandingPage() {
  return (
    <>
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
            <button id="LPBtn1">Check Your Mood</button>
            <button id="LPBtn2">Learn More</button>
          </div>
        </div>
        <div className="LPCont2"></div>
      </div>
      <SiteInfoA />
    </>
  )
}

export default LandingPage
