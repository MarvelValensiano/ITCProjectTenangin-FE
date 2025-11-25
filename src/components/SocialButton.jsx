// src/components/SocialButton.jsx
import React from "react";

function GoogleIcon({ width = 20, height = 20 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-18.5-1.5-36.3-4.5-53.6H272v101.5h146.9c-6.4 34.5-25.5 63.7-54.6 83.3v68h88.2c51.6-47.5 81-117.6 81-199.2z"
      />
      <path
        fill="#34A853"
        d="M272 544.3c73.8 0 135.7-24.4 180.9-66.2l-88.2-68c-24.5 16.5-56 26.3-92.7 26.3-71 0-131.2-47.9-152.7-112.2h-90.5v70.7C80.6 483.2 167 544.3 272 544.3z"
      />
      <path
        fill="#FBBC05"
        d="M119.3 324.1c-10.9-32.6-10.9-67.6 0-100.2V153.2H28.7C-3.8 204.6-3.8 339.6 28.7 391L119.3 324.1z"
      />
      <path
        fill="#EA4335"
        d="M272 106.1c39.8 0 75.7 13.7 104 40.7l78-78C403 20.4 344.8 0 272 0 167 0 80.6 61.1 28.7 153.2l90.6 70.7C140.8 153.9 201 106.1 272 106.1z"
      />
    </svg>
  );
}

function AppleIcon({ width = 20, height = 20 }) {
  // More accurate Apple logo path (monochrome) to avoid distorted look
  return (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function SocialButton({
  provider = "google",
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`social-btn social-${provider}`}
      onClick={onClick}
      aria-label={
        provider === "google" ? "Log in with Google" : "Log in with Apple"
      }
    >
      <span className="social-icon" aria-hidden>
        {provider === "google" ? <GoogleIcon /> : <AppleIcon />}
      </span>
      <span className="social-label">{children}</span>
    </button>
  );
}
