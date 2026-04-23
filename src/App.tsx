import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

const EMAILJS_SERVICE_ID = "service_e8zr8xa";
const EMAILJS_TEMPLATE_ID = "template_nsge0hp";
const EMAILJS_PUBLIC_KEY = "k1lGdOJDBuTioX8_X";

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

const START_TIME = 12;
const END_TIME = 33;

function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const yesButtonSize = noCount * 20 + 16;

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("yt-player", {
        videoId: "sElE_BfQ67s",
        playerVars: {
          autoplay: 1,
          controls: 0,
          start: START_TIME,
          end: END_TIME,
          mute: 0,
        },
        events: {
          onStateChange: (event: any) => {
            // When video ends (state = 0), seek back to start and play
            if (event.data === 0) {
              playerRef.current.seekTo(START_TIME);
              playerRef.current.playVideo();
            }
          },
        },
      });
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  return (
    <div className="valentine-container">
      <div id="yt-player" style={{ display: "none" }} />
      {yesPressed ? (
        <>
          <div className="gif-wrapper">
            <img
              alt="kittycat"
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm1jMW0zcnpxbHgyZHphZm9ybWF0MGQ1bmg0cHQydHlkNmg1M3dkcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pH6N2NokrrEyiJJSNm/giphy.gif"
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
          <div className="question">do you wanna go grab matcha?</div>
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