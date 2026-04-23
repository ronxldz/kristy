import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

const EMAILJS_SERVICE_ID = "service_e8zr8xa";
const EMAILJS_TEMPLATE_ID = "template_nsge0hp";
const EMAILJS_PUBLIC_KEY = "k1lGdOJDBuTioX8_V";

const phrases = [
  "no",
  "are you sure??",
  "maybe think again...",
  "pleaseeee?",
  "cmon bae be fr",
  "you're being silly",
  "reconsider?",
  "ugh still no???",
  "can't you just say yes already?",
  "is that your final answer pookie?",
  "i don't think you're thinking this through...",
  "just think about it for a second longer…",
  "i know you wanna say yes!",
  "last call! final answer?",
];

function App() {
  const [started, setStarted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const activeRef = useRef<1 | 2>(1);
  const yesButtonSize = noCount * 20 + 16;

  function handleStart() {
    setStarted(true);
    if (audioRef1.current) {
      audioRef1.current.currentTime = 0;
      audioRef1.current.play();
    }
  }

  function handleNoClick() {
    setNoCount(noCount + 1);
  }

  function getNoButtonText() {
    return phrases[Math.min(noCount, phrases.length - 1)];
  }

  function handleYesClick() {
    setYesPressed(true);
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        message: `She said YES after ${noCount} no's! 🎉`,
      },
      EMAILJS_PUBLIC_KEY
    ).catch((err) => console.error("EmailJS error:", err));
  }

  const audioElement = (
  <>
    <audio
      ref={audioRef1}
      src="/apocalypse.mp3"
      onTimeUpdate={() => {
        if (audioRef1.current && audioRef2.current) {
          const timeLeft = audioRef1.current.duration - audioRef1.current.currentTime;
          if (timeLeft <= 2 && activeRef.current === 1) {
            activeRef.current = 2;
            audioRef2.current.currentTime = 0;
            audioRef2.current.play();
          }
        }
      }}
    />
    <audio
      ref={audioRef2}
      src="/apocalypse.mp3"
      onTimeUpdate={() => {
        if (audioRef1.current && audioRef2.current) {
          const timeLeft = audioRef2.current.duration - audioRef2.current.currentTime;
          if (timeLeft <= 2 && activeRef.current === 2) {
            activeRef.current = 1;
            audioRef1.current.currentTime = 0;
            audioRef1.current.play();
          }
        }
      }}
    />
  </>
);

  if (!started) {
    return (
      <div className="valentine-container">
        {audioElement}
        <div className="splash">
          <div className="splash-emoji">🌿🍓</div>
          <div className="splash-text">i made you something...</div>
          <button className="startButton" onClick={handleStart}>
            tap to open ♡
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="valentine-container">
      {audioElement}
      {yesPressed ? (
        <>
          <div className="gif-wrapper">
            <img
              alt="kittycat"
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3ZxbmNpdjVpY3RiYWoxbXAxNDFkaDhrcGJuMjE3dm9qbTZ0NTF2bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5GCBTYTjqzdXhWCeah/giphy.gif"
            />
          </div>
          <div className="text">YAYYY!</div>
        </>
      ) : (
        <>
          <div className="gif-wrapper">
            <img
              alt="kittycat2"
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTlyajdkNHpyNDNvcjBxYjkweHFuaXdvMTZldzVyMmxyMTIyb3V4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vaKohy1RFW3zTTXWP2/giphy.gif"
            />
          </div>
          <div className="question">wanna go grab matcha?</div>
          <div>
            <button
              className="yesButton"
              style={{ fontSize: yesButtonSize }}
              onClick={handleYesClick}
            >
              YES
            </button>
            <button onClick={handleNoClick} className="noButton">
              {getNoButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;