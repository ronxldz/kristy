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
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTQyZjN5YzdlMTQ4cnc2dGI2NmNmd3ppemttOWJkZDViejdtejU4ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LsdO5RziEq4Zu5XVVn/giphy.gif"
          />
          <div className="text">YAYYY!</div>
        </>
      ) : (
        <>
          <img
            alt="kittycat2"
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG1seWQ0NThoMGxiY2RnZDcwNHp4ZWR0aWp3dHRseW92MzM5a3FreCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HvuMag5X3bt41jf4xY/giphy.gif"
          />
          <div className="question">wanna go to the usa vs portugal game?</div>
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

