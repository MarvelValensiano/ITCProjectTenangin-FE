import { useState } from "react"
import "../styles/Profile.css"
import NavbarAfterLogin from "../components/NavbarAfterLogin"

import React from 'react'

function YourProfile() {
  return (
    <div>
      
    </div>
  )
}

function ProfileDetails() {
  return (
    <div>
        <div>

        </div>
        <div>
            <button>Edit Profile</button>
        </div>
    </div>      
  )
}

function Profile() {
  return (
    <div style={{ background: "linear-gradient(0deg, #ffffff 0%, #D9EFF7 100%)" }}>
      <NavbarAfterLogin />
      <div>
        <h1>Your Profile</h1>  
        <YourProfile />
        <h1>Profile Details</h1>
        <ProfileDetails />
      </div>
    </div>
  )
}

export default Profile
