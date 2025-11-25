import "../styles/SiteInfo.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function LogoJargon() {
  return (
    <div className="logoJargon">
      <div className="logo">
        <img src="/tenanginLogo.png" alt="Tenangin logo" />
        <a href="/">TENANGIN</a>
      </div>
      <p>Calm mind, happy life.</p>
    </div>
  );
}

function QuickLinks() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="quickLinks">
      <h6>Quick Links</h6>
      <ul>
        {/* Home di footer tetap ke landing page */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Halaman yang butuh data user → arahkan ke Login bila belum login */}
        <li>
          <Link to={isLoggedIn ? "/CheckMood" : "/Login"}>Check Mood</Link>
        </li>
        <li>
          <Link to={isLoggedIn ? "/Videos" : "/Login"}>Videos</Link>
        </li>

        {/* About selalu bebas diakses */}
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="contactInfo">
      <h6>Contact Info</h6>
      <ul>
        <li>
          <a href="mailto:hello@tenangin.com">
            <img src="/src/assets/site info/mail.svg" alt="Mail icon" />
            hello@tenangin.com
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/src/assets/site info/insta.svg" alt="Instagram icon" />
            @tenangin_official
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/site info/linkedin.svg"
              alt="LinkedIn icon"
            />
            TENANGIN Team
          </a>
        </li>
      </ul>
    </div>
  );
}

function ContactInfo2() {
  return (
    <div className="contactInfo2">
      <h7>Contact Info</h7>
      <a href="mailto:hello@tenangin.com">
        <p>hello@tenangin.com</p>
      </a>
      <div className="contactIcons">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/src/assets/site info/insta.svg" alt="Instagram icon" />
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/src/assets/site info/linkedin.svg"
            alt="LinkedIn icon"
          />
        </a>
        <a href="mailto:hello@tenangin.com">
          <img src="/src/assets/site info/mail.svg" alt="Mail icon" />
        </a>
      </div>
    </div>
  );
}

function InboxEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email.");

    setLoading(true);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        alert("Thank you for subscribing!");
        setEmail("");
      } else {
        alert("Failed to send. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inboxEmail">
      <h7>Stay Connected</h7>
      <p>Get daily motivation in your inbox</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : (
            <img src="/src/assets/site info/send.svg" alt="Send" />
          )}
        </button>
      </form>
    </div>
  );
}

export function SiteInfoA() {
  return (
    <div className="siteInfoA">
      <hr />
      <div className="siteInfoContent">
        <LogoJargon />
        <QuickLinks />
        <ContactInfo />
        <InboxEmail />
      </div>
      <hr />
    </div>
  );
}

export function SiteInfoB() {
  return (
    <div className="siteInfoB">
      <hr className="SIB" />
      <div className="siteInfoContent">
        <LogoJargon />
        <QuickLinks />
        <div style={{ marginRight: "200px" }}>
          <ContactInfo2 />
        </div>
      </div>
    </div>
  );
}
