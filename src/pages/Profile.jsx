import { useState } from "react"
import "../styles/Profile.css"
import NavbarAfterLogin from "../components/NavbarAfterLogin"

import React from 'react'

function YourProfile() {
  return (
    <div className="yourProfile">
      <div className="avatar">
        <img className="fotoAvatar" src="https://tse1.mm.bing.net/th/id/OIP.ycibzyiTKWu1tCxb4tvn3QAAAA?pid=Api&P=0&h=220" alt="" />
        <img className="iconEdit" src="src/assets/profile/editIcon.png"/>
      </div>
      <div className="miniProfile">
        <div className="namaStatus">
          <h3>Nama Lengkap</h3>
          <h4>Active</h4>
        </div>
        <p>@Username</p>
        <p>Description</p>
      </div>
    </div>
  )
}

function ProfileDetails() {
  return (
    <div className="profileDetails">
      <div className="detailsContent">
        <div className="leftBox">
          <div className="detailsBox">
            <h5>Full Name</h5>
            <p>Nama</p>
          </div>
          <div className="detailsBox">            
            <h5>Age</h5>
            <p>Umur</p>
          </div>
          <div className="detailsBox">
            <h5>Joined Date</h5>
            <p>Bulan tanggal, tahun</p>        
          </div>             
        </div>
        <div className="rightBox">
          <div className="detailsBox">
            <h5>Email</h5>
            <p>Akun email</p>
          </div>
          <div className="detailsBox">            
            <h5>Gender</h5>
            <p>Male/Female</p>
          </div>
          <div className="detailsBox">
            <h5>Location</h5>
            <p>Provinsi, Negara</p>
          </div>          
        </div>

      </div>
      <div className="detailsBtn">
        <button>Edit Profile</button>
      </div>
    </div>      
  )
}

function Profile() {
  return (
    <div style={{ background: "linear-gradient(0deg, #ffffff 0%, #D9EFF7 100%)" }}>
      <NavbarAfterLogin />
      <div className="profile">
        <h1>Your Profile</h1>  
        <YourProfile />
        <h1 id="PDTitle">Profile Details</h1>
        <ProfileDetails />
      </div>
    </div>
  )
}

export default Profile
