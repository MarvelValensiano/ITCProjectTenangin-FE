// src/pages/CheckMood.jsx
import { useState } from "react";
import "../styles/CheckMood.css";
import Navbar from "../components/Navbar";
import { saveUserMood, fetchUserQuote } from "../services/tenanginData";
// import { fetchUserVideos } from "../services/videos"; // DIHAPUS

function Emoji({ onSelect }) {
  const moods = [
    { emoji: "😄", label: "Happy", value: "happy" },
    { emoji: "😌", label: "Calm", value: "calm" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😔", label: "Sad", value: "sad" },
    { emoji: "😠", label: "Angry", value: "angry" },
    { emoji: "😩", label: "Stressed", value: "stressed" },
    { emoji: "😍", label: "Excited", value: "excited" },
  ];

  const [selected, setSelected] = useState(null);

  const handleClick = (mood) => {
    setSelected(mood.value);
    onSelect(mood.value);
  };

  return (
    <div className="emojiSection">
      <h2>Select Your Current Mood</h2>
      <div className="emojiGrid">
        {moods.map((mood) => (
          <div
            key={mood.label}
            className={`emojiCard ${
              selected === mood.value ? "selected" : ""
            }`}
            onClick={() => handleClick(mood)}
          >
            <span className="emojiIcon">{mood.emoji}</span>
            <p>{mood.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckMoodText() {
  return (
    <div className="checkMoodText">
      <img
        src="/src/assets/check mood/checkMoodImg.svg"
        alt="Landing illustration"
      />
      <h2>How Are You Feeling ?</h2>
      <p>Take a moment to reflect and check your mood today.</p>
    </div>
  );
}

function TodaysFeeling({ mood }) {
  const [message, setMessage] = useState("");
  // const [videos, setVideos] = useState([]); // DIHAPUS
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mood) {
      alert("Please select your mood first.");
      return;
    }
    if (!message.trim()) {
      alert("Please write a short note about your day.");
      return;
    }

    setLoading(true);

    try {
      // 1) Simpan mood user
      await saveUserMood({ mood, note: message });

      // 2) Ambil quote harian
      const quoteData = await fetchUserQuote();
      setQuote(quoteData);

      alert("Mood saved successfully!");
      setMessage("");
    } catch (error) {
      alert(error.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todaysFeeling">
      <form onSubmit={handleSubmit}>
        <div className="TFTextCont">
          <h2>Would you like to share more about your feelings today?</h2>
          <textarea
            placeholder="Write your thoughts here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="TFButtonCont">
          <button
            type="submit"
            className="saveButton"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save My Mood"}
          </button>
          <button
            type="button"
            className="cancelButton"
            onClick={() => setMessage("")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function CheckMood() {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div className="checkMood">
      <Navbar />
      <div className="checkMoodContent">
        <Emoji onSelect={setSelectedMood} />
        <CheckMoodText />
      </div>
      <TodaysFeeling mood={selectedMood} />
    </div>
  );
}

export default CheckMood;
