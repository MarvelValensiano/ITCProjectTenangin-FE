// src/pages/LandingPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/LandingPage.css";
import { SiteInfoA } from "../components/SiteInfo";
import Footer from "../components/Footer";
import { fetchUserQuote } from "../services/tenanginData";
import { getAccessToken } from "../services/auth";

function LandingPage() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const token = getAccessToken();

    // 🚫 Jika user belum login → jangan fetch quote
    if (!token) {
      console.log("LandingPage: no token → skip fetchUserQuote");
      return;
    }

    (async () => {
      try {
        const q = await fetchUserQuote();
        setQuote(q);
      } catch (err) {
        // Diam saja supaya landing tetap aman
        console.error("[LandingPage] fetchUserQuote error:", err);
      }
    })();
  }, []);

  return (
    <div style={{ background: "linear-gradient(0deg, #ffffff 0%, #D9EFF7 100%)" }}>
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

          {/* tampilkan quote hanya kalau user login */}
          {quote && (
            <p className="LPQuote">“{quote.quote}”</p>
          )}

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
          <img
            src="/src/assets/landing page/landingPage.svg"
            alt="Landing illustration"
          />
        </div>
      </div>
      <SiteInfoA />
      <Footer />
    </div>
  );
}

export default LandingPage;
