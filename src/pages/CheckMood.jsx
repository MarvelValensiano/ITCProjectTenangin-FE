import { useState } from "react"
import "../styles/CheckMood.css"
import NavbarAfterLogin from "../components/NavbarAfterLogin"

function Emoji({ onSelect }) {
  const moods = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😠", label: "Angry" },
    { emoji: "😩", label: "Stressed" },
    { emoji: "😍", label: "Excited" },
  ]

  const [selected, setSelected] = useState(null)

  const handleClick = (mood) => {
    setSelected(mood)
    onSelect(mood)
  }

  return (
    <div className="emojiSection">
      <h2>Select Your Current Mood</h2>
      <div className="emojiGrid">
        {moods.map((mood) => (
          <div key={mood.label} className={`emojiCard ${selected === mood.label ? "selected" : ""}`} onClick={() => handleClick(mood.label)}>
            <span className="emojiIcon">{mood.emoji}</span>
            <p>{mood.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckMoodText() {
  return (
    <div className="checkMoodText">
      <img src="/src/assets/check mood/checkMoodImg.svg" alt="Landing illustration" />
      <h2>How Are You Feeling ?</h2>
      <p>Take a moment to reflect and check your mood today.</p>
    </div>
  )
}

function TodaysFeeling({ mood }) {
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() && !mood) return

    try {
      const response = await fetch("http://localhost:5000/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, message }),
      })
      if (response.ok) {
        alert("Mood saved successfully!")
        setMessage("")
      } else {
        alert("Failed to save mood")
      }
    } catch (error) {
      alert("Error connecting to server")
    }
  }

  return (
    <div className="todaysFeeling">
      <form onSubmit={handleSubmit}>
        <div className="TFTextCont">
          <h2>Would you like to share more about your feelings today?</h2>
          <textarea placeholder="Write your thoughts here..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>          
        </div>
        <div className="TFButtonCont">
          <button type="submit" className="saveButton">Save My Mood</button>
          <button type="button" className="cancelButton" onClick={() => setMessage("")}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function CheckMood() {
  const [selectedMood, setSelectedMood] = useState(null)

  return (
    <div className="checkMood">
      <NavbarAfterLogin />
      <div className="checkMoodContent">
        <Emoji onSelect={setSelectedMood} />
        <CheckMoodText />
      </div>
      <TodaysFeeling mood={selectedMood} />
    </div>
  )
}

export default CheckMood
