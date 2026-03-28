import { useState } from "react";
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
  "can’t you just say yes already?",
  "is that your final answer pookie?",
  "i don't think you're thinking this through...",
  "just think about it for a second longer…",
  "i know you wanna say yes!",
  "last call! final answer?",
];
function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const yesButtonSize = noCount * 20 + 16;

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
      {yesPressed ? (
        <>
          <img
            alt="kittycat"
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjd1cWN2MXJnbDlwbjZsdWVzOTN2OWc2Nmh6NHJ5NG5xYzIwbzBubCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sNPeJFq6YNEvLZdcqX/giphy.gif"
          />
          <div className="text">YAYYY!</div>
        </>
      ) : (
        <>
          <img
            alt="kittycat2"
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTV0cWdoZWE4YmxkaDIzdjM5NXpsd2tvM3BjcWt6N3pqNXR5NXZlZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N71aciDX7O0hiQOZFt/giphy.gif"
          />
          <div className="question">I know the best matcha spot, wanna go grab matcha?</div>
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

