import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/LandingPage.css";
import { SiteInfoA } from "../components/SiteInfo";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <div style={{ background: "linear-gradient(0deg, #ffffff 0%, #D9EFF7 100%)" }}>
      <Navbar />
      <div className="LPcontent">
        <div className="LPCont1">
          <h1>
            Take Care of Your <span>Mind</span>, Every Day.
          </h1>
          <p>
            Find daily motivation, track your mood, and discover content that brightens your day.
          </p>
          <div className="LPbutton">
            <Link to="/CheckMood" id="LPBtn1" className="LPbuttonLink">
              Check Your Mood
            </Link>
            <Link to="/About" id="LPBtn2" className="LPbuttonLink2">
              Learn More
            </Link>
          </div>
        </div>
        <div className="LPCont2">
          <img src="/src/assets/landing page/landingPage.svg" alt="Landing illustration" />
        </div>
      </div>
      <SiteInfoA />
      <Footer />
    </div>
  );
}

export default LandingPage;
