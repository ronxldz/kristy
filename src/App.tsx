import { useState, useRef, useEffect } from "react";
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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const yesButtonSize = noCount * 20 + 16;

  // useEffect(() => {
  //   // Preload the audio buffer
  //   fetch("/apocalypse.mp3")
  //     .then((res) => res.arrayBuffer())
  //     .then((arrayBuffer) => {
  //       const ctx = new AudioContext();
  //       audioCtxRef.current = ctx;
  //       return ctx.decodeAudioData(arrayBuffer);
  //     })
  //     .then((decoded) => {
  //       audioBufferRef.current = decoded;
  //     })
  //     .catch((err) => console.error("Audio load error:", err));
  // }, []);

  // function playLoop() {
  //   if (!audioCtxRef.current || !audioBufferRef.current) return;
  //   const ctx = audioCtxRef.current;

  //   // Resume context (needed on mobile after user gesture)
  //   if (ctx.state === "suspended") ctx.resume();

  //   const source = ctx.createBufferSource();
  //   source.buffer = audioBufferRef.current;
  //   source.connect(ctx.destination);
  //   source.loop = true;
  //   source.start(0);
  //   sourceRef.current = source;
  // }

  function handleStart() {
  setStarted(true);
  
  const ctx = new AudioContext();
  audioCtxRef.current = ctx;

  fetch("/apocalypse.mp3")
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
    .then((decoded) => {
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.loop = true;
      source.start(0);
      sourceRef.current = source;
    })
    .catch((err) => console.error("Audio error:", err));
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

  if (!started) {
    return (
      <div className="valentine-container">
        <div className="splash">
          <button className="startButton" onClick={handleStart}>
            tap to open
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="valentine-container">
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