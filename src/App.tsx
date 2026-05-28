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

const FADE_BEFORE = 8;
const FADE_DURATION = 3;

function App() {
  const [started, setStarted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceARef = useRef<AudioBufferSourceNode | null>(null);
  const sourceBRef = useRef<AudioBufferSourceNode | null>(null);
  const gainARef = useRef<GainNode | null>(null);
  const gainBRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const activeRef = useRef<"a" | "b">("a");
  const sourceStartTimeRef = useRef<number>(0);
  const scheduleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const yesButtonSize = noCount * 20 + 16;

  function createSource(
    ctx: AudioContext,
    buffer: AudioBuffer,
    gainNode: GainNode
  ): AudioBufferSourceNode {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(gainNode);
    return src;
  }

  function scheduleNext(ctx: AudioContext, buffer: AudioBuffer) {
    const elapsed = ctx.currentTime - sourceStartTimeRef.current;
    const timeUntilFade = Math.max(0, buffer.duration - elapsed - FADE_BEFORE);

    scheduleTimerRef.current = setTimeout(() => {
      if (!audioCtxRef.current) return;

      const isA = activeRef.current === "a";
      const outGain = isA ? gainARef.current! : gainBRef.current!;
      const inGain = isA ? gainBRef.current! : gainARef.current!;
      const oldSrc = isA ? sourceARef.current : sourceBRef.current;

      outGain.gain.setValueAtTime(1, ctx.currentTime);
      outGain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_DURATION);
      if (oldSrc) {
        try { oldSrc.stop(ctx.currentTime + FADE_DURATION + 0.05); } catch {}
      }

      const newSrc = createSource(ctx, buffer, inGain);
      inGain.gain.setValueAtTime(0, ctx.currentTime);
      inGain.gain.linearRampToValueAtTime(1, ctx.currentTime + FADE_DURATION);
      newSrc.start(0);

      sourceStartTimeRef.current = ctx.currentTime;

      if (isA) sourceBRef.current = newSrc;
      else sourceARef.current = newSrc;
      activeRef.current = isA ? "b" : "a";

      scheduleNext(ctx, buffer);
    }, timeUntilFade * 1000);
  }

  async function startAudio() {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const silentBuffer = ctx.createBuffer(1, 1, 22050);
    const silentSrc = ctx.createBufferSource();
    silentSrc.buffer = silentBuffer;
    silentSrc.connect(ctx.destination);
    silentSrc.start(0);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const gainA = ctx.createGain();
    const gainB = ctx.createGain();
    gainA.gain.setValueAtTime(1, ctx.currentTime);
    gainB.gain.setValueAtTime(0, ctx.currentTime);
    gainA.connect(analyser);
    gainB.connect(analyser);
    gainARef.current = gainA;
    gainBRef.current = gainB;

    const res = await fetch("/world-cup-audio.mp3");
    const arrayBuffer = await res.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    bufferRef.current = buffer;

    const src = createSource(ctx, buffer, gainA);
    src.start(0);
    sourceARef.current = src;
    sourceStartTimeRef.current = ctx.currentTime;
    activeRef.current = "a";

    scheduleNext(ctx, buffer);
    drawVisualizer();
  }

  function togglePlayPause() {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (isPlaying) {
      ctx.suspend();
      setIsPlaying(false);
    } else {
      ctx.resume();
      setIsPlaying(true);
    }
  }

  function drawVisualizer() {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d")!;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const localAnalyser = analyser;

    function draw() {
      animFrameRef.current = requestAnimationFrame(draw);
      localAnalyser.getByteFrequencyData(data);

      const W = canvas!.width;
      const H = canvas!.height;
      ctx.clearRect(0, 0, W, H);

      const bars = data.length;
      const barW = W / bars;

      for (let i = 0; i < bars; i++) {
        const val = data[i] / 255;
        const barH = val * H;
        const x = i * barW;

        const t = i / bars;
        let r, g, b;
        if (t < 0.33) {
          r = 0; g = 200; b = 120;
        } else if (t < 0.66) {
          r = 255; g = 255; b = 255;
        } else {
          r = 255; g = 40; b = 60;
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${0.85 + val * 0.15})`;
        ctx.beginPath();
        ctx.roundRect(x + 1, H - barH, barW - 2, barH, 3);
        ctx.fill();
      }
    }
    draw();
  }

  async function handleStart() {
    setStarted(true);
    await startAudio();
  }

  useEffect(() => {
    return () => {
      if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
      cancelAnimationFrame(animFrameRef.current);
      audioCtxRef.current?.close();
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
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { message: `She said YES after ${noCount} no's! 🎉` },
        EMAILJS_PUBLIC_KEY
      )
      .catch((err) => console.error("EmailJS error:", err));
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
      <div className="visualizer-row">
        <canvas ref={canvasRef} className="visualizer" width={600} height={80} />
        <button className="pauseButton" onClick={togglePlayPause}>
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="3" width="4" height="18" rx="1" />
              <rect x="15" y="3" width="4" height="18" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          )}
        </button>
      </div>

      {yesPressed ? (
        <>
          <div className="gif-wrapper">
            <img
              alt="celebration"
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmlzYWU4NnZjOWtyanVzYmQ3ang5eGo0ZXJyM2JneW5obDVhdzF2dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d0RRZHiz9QaSQ/giphy.gif"
            />
          </div>
          <div className="text">VAMMMOOOOS!</div>
        </>
      ) : (
        <>
          <div className="gifs-row">
            
              <a href="https://www.cosm.com/atlanta/events/wc-mexico-south-africa-atl-2026-06-11-1500"
              target="_blank"
              rel="noopener noreferrer"
              className="gif-link"
            >
              <div className="gif-wrapper">
                <img alt="match details" src="/match-details.jpeg" />
              </div>
            </a>
            <div className="gif-wrapper">
              <img
                alt="mexico gif"
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2dqMzVpYWx1MmhkOHUwbjM1ZWViZWdua25vMW5td2NzMnBpdWhobyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aH3P3coM2wjwH7onoN/giphy.gif"
              />
            </div>
          </div>
          <div className="question">do you wanna go watch mexico vs south africa?</div>
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