// src/pages/Profile.jsx

import { useEffect, useState, useRef } from "react";
import "../styles/Profile.css";
import Navbar from "../components/Navbar";
import { getStoredUser } from "../services/auth";
import { updateProfile, fetchUserProfile } from "../services/profile";

// ambil default avatar langsung dari aset lokal
const DEFAULT_AVATAR = "src/assets/profile/defaultAva.jpg";

// untuk deteksi avatar default backend
const BACKEND_DEFAULT_AVATAR_KEYWORD = "/profile_pictures/default";

/** Bersihkan value placeholder dari backend ("Belum diatur", "Belum diisi") */
function cleanField(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();
  if (!s) return "";
  const lower = s.toLowerCase();
  if (
    lower === "belum diatur" ||
    lower === "belum diisi" ||
    lower === "belum di atur"
  ) {
    return "";
  }
  return s;
}

/* =========================
   TOP PROFILE CARD
   ========================= */
function YourProfile({ user, onAvatarChange }) {
  const cleanedFullname = cleanField(user?.fullname);
  const cleanedNama = cleanField(user?.nama);
  const cleanedUsername = cleanField(user?.username);

  const displayName =
    cleanedFullname || cleanedNama || cleanedUsername || "Full Name";

  const username =
    cleanedUsername || cleanField(user?.email) || "username";

  const descRaw =
    cleanField(user?.description) || cleanField(user?.deskripsi);
  const description =
    descRaw && descRaw.trim() !== ""
      ? descRaw
      : "You haven't added a description yet.";

  const rawAvatar = cleanField(user?.foto_profile_url);

  const isBackendDefaultAvatar =
    !rawAvatar || rawAvatar.includes(BACKEND_DEFAULT_AVATAR_KEYWORD);

  // pakai defaultAva.jpg kalau avatar kosong atau default backend
  const avatarUrl = isBackendDefaultAvatar ? DEFAULT_AVATAR : rawAvatar;

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (onAvatarChange) onAvatarChange(f);
    e.target.value = "";
  };

  return (
    <div className="yourProfile">
      <div className="avatar">
        <img className="fotoAvatar" src={avatarUrl} alt="Avatar" />

        {/* hidden file input, triggered via pencil icon */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <img
          className="iconEdit"
          src="src/assets/profile/editIcon.png"
          alt="Edit avatar"
          onClick={handleIconClick}
        />
      </div>
      <div className="miniProfile">
        <div className="namaStatus">
          <h3>{displayName}</h3>
          <h4>Active</h4>
        </div>
        <p>@{username}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================
   PROFILE DETAILS
   ========================= */
function ProfileDetails({ user, onEdit, showEditButton }) {
  const cleanedFullname = cleanField(user?.fullname);
  const cleanedNama = cleanField(user?.nama);
  const cleanedUsername = cleanField(user?.username);

  const fullName =
    cleanedFullname || cleanedNama || cleanedUsername || "Not set yet";

  const email = cleanField(user?.email) || "Not set yet";

  const umurRaw = cleanField(user?.umur);
  const umur =
    umurRaw && umurRaw !== "Not set yet"
      ? `${umurRaw} years old`
      : "Not set yet";

  const gender = cleanField(user?.jenis_kelamin) || "Not set yet";

  const lokasiValue =
    cleanField(user?.lokasi) || cleanField(user?.location);
  const lokasi = lokasiValue || "Not set yet";

  let joined = "Not set yet";
  if (user?.joined_date) {
    try {
      joined = new Date(user.joined_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      joined = user.joined_date;
    }
  }

  return (
    <div className="profileDetails">
      <div className="detailsContent">
        <div className="leftBox">
          <div className="detailsBox">
            <h5>Full Name</h5>
            <p>{fullName}</p>
          </div>
          <div className="detailsBox">
            <h5>Age</h5>
            <p>{umur}</p>
          </div>
          <div className="detailsBox">
            <h5>Joined Date</h5>
            <p>{joined}</p>
          </div>
        </div>
        <div className="rightBox">
          <div className="detailsBox">
            <h5>Email</h5>
            <p>{email}</p>
          </div>
          <div className="detailsBox">
            <h5>Gender</h5>
            <p>{gender}</p>
          </div>
          <div className="detailsBox">
            <h5>Location</h5>
            <p>{lokasi}</p>
          </div>
        </div>
      </div>

      {/* Edit button DI DALAM kotak Profile Details */}
      {showEditButton && (
        <div className="detailsBtn">
          <button onClick={onEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

/* =========================
   EDIT PROFILE FORM
   ========================= */
function EditProfileForm({ user, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    umur: "",
    jenis_kelamin: "",
    lokasi: "",
    password: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        username: cleanField(user.username),
        email: cleanField(user.email),
        fullname: cleanField(user.fullname) || cleanField(user.nama),
        umur: cleanField(user.umur),
        jenis_kelamin: cleanField(user.jenis_kelamin),
        lokasi:
          cleanField(user.lokasi) ||
          cleanField(user.location),
        password: "",
        description:
          cleanField(user.description) || cleanField(user.deskripsi),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "description") {
          payload["deskripsi"] = value;
        }
        payload[key] = value;
      }
    });

    try {
      const result = await updateProfile(payload, null);
      alert(result.message || "Profile updated successfully");

      if (onUpdated) {
        onUpdated(result.user);
      }
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editProfileForm">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="editProfileFormInner">
        <div className="editGrid">
          <div className="editColumn">
            <label>
              Username
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Full Name
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Age
              <input
                type="number"
                name="umur"
                value={form.umur}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="editColumn">
            <label>
              Gender
              <select
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Location
              <input
                type="text"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </label>

            <label>
              New Password (optional)
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell something about yourself..."
                rows={3}
              />
            </label>
          </div>
        </div>

        <div className="editActions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================
   PROFILE PAGE
   ========================= */
function Profile() {
  const [user, setUserState] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUserState(stored);

    const load = async () => {
      try {
        const freshUser = await fetchUserProfile();
        setUserState(freshUser);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };
    load();
  }, []);

  const handleUpdated = (updatedUser) => {
    setUserState(updatedUser);
    setEditing(false);
  };

  const handleAvatarChange = async (file) => {
    try {
      const result = await updateProfile({}, file);
      alert(result.message || "Profile photo updated successfully");
      setUserState(result.user);
    } catch (err) {
      alert(err.message || "Failed to update profile photo");
    }
  };

  return (
    <div
      style={{ background: "linear-gradient(0deg, #ffffff 0%, #D9EFF7 100%)" }}
    >
      <Navbar />
      <div className="profile">
        <h1>Your Profile</h1>

        <YourProfile user={user} onAvatarChange={handleAvatarChange} />

        <h1 id="PDTitle">Profile Details</h1>
        <ProfileDetails
          user={user}
          showEditButton={!editing}
          onEdit={() => setEditing(true)}
        />

        {editing && (
          <EditProfileForm
            user={user}
            onUpdated={handleUpdated}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
