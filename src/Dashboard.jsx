import { useEffect, useRef, useState, useCallback } from "react";

export default function Dashboard() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const flickerRef = useRef(null);
  const rippleRef = useRef(null);
  const flashRef = useRef(null);
  const textRef = useRef(null);

  const [time, setTime] = useState(new Date());
  const [intensity, setIntensity] = useState(0);
  const [degaussKey, setDegaussKey] = useState(0);

  // 1) Tick the clock every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 2) Canvas bloom-trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 960;
    canvas.height = 640;

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  // 3) Ramp intensity (0 → 1 over 30s), resets on degauss
  useEffect(() => {
    let start = null;
    const duration = 30000;
    function ramp(ts) {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      setIntensity(t);
      if (t < 1) requestAnimationFrame(ramp);
    }
    setIntensity(0);
    requestAnimationFrame(ramp);
  }, [degaussKey]);

  // 4) Subtle flicker α in [1%,2.5%] × intensity
  useEffect(() => {
    const minA = 0.01, maxA = 0.025;
    let raf;
    function loop() {
      if (flickerRef.current) {
        const rand = minA + Math.random() * (maxA - minA);
        flickerRef.current.style.backgroundColor = `rgba(0,255,0,${rand * intensity})`;
      }
      raf = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(raf);
  }, [intensity]);

  // 5) Click to degauss: radial flash → ripple + distortion → text shake → reset flicker
  const handleClick = useCallback(() => {
    // radial flash
    if (flashRef.current) {
      flashRef.current.classList.remove("play");
      void flashRef.current.offsetWidth;
      flashRef.current.classList.add("play");
    }
    // ripple circle
    if (rippleRef.current) {
      rippleRef.current.classList.remove("play");
      void rippleRef.current.offsetWidth;
      rippleRef.current.classList.add("play");
    }
    // container distortion + RGB shift
    if (containerRef.current) {
      containerRef.current.classList.remove("degauss-distort");
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add("degauss-distort");
    }
    // text shake
    if (textRef.current) {
      textRef.current.classList.remove("text-shake");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("text-shake");
    }
    // restart flicker ramp
    setDegaussKey(k => k + 1);
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: 960,
        height: 640,
        position: "fixed",
        top: 0,
        left: 0,
        background: "black",
        overflow: "hidden",
        cursor: "pointer"
      }}
    >
      {/* Radial flash */}
      <div
        ref={flashRef}
        className="flash"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 30,
          height: 30,
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 6,
          transform: "translate(-50%,-50%) scale(0)",
          opacity: 0
        }}
      />

      {/* CRT glow overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at center, rgba(0,255,0,0.05) 0%, transparent 60%, rgba(0,255,0,0.08) 100%)",
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 10
      }} />

      {/* Bloom-trail canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />

      {/* Time display */}
      <div
        ref={textRef}
        className="clock-text"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          color: "lime",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "6em",
          textShadow: "0 0 10px lime, 0 0 20px lime",
          zIndex: 2
        }}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>

      {/* Scanlines */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,255,0,0.2), rgba(0,255,0,0.2) 2px, transparent 2px, transparent 6px)",
        pointerEvents: "none",
        zIndex: 3
      }} />

      {/* Flicker overlay */}
      <div
        ref={flickerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 4,
          backgroundColor: "rgba(0,255,0,0)"
        }}
      />

      {/* Ripple circle */}
      <div
        ref={rippleRef}
        className="ripple"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 5,
          transform: "translate(-50%,-50%) scale(0)"
        }}
      />

      {/* Animations */}
      <style>{`
        @keyframes flash {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(20); opacity: 0; }
        }
        .flash.play { animation: flash 0.2s ease-out forwards; }

        @keyframes ripple {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 0.6; }
          50% { transform: translate(-50%,-50%) scale(1.2); opacity: 0.4; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0; }
        }
        .ripple.play { animation: ripple 1.5s ease-out forwards; }

        @keyframes degaussDistort {
          0% { transform: none; filter: none; }
          5% { transform: scale(1.15, 0.85) skew(4deg, 3deg); filter: hue-rotate(25deg) contrast(1.6) brightness(1.3); }
          20% { transform: scale(0.85, 1.15) skew(-4deg, -3deg); filter: hue-rotate(-25deg) contrast(0.7) brightness(0.7); }
          40% { transform: scale(1.1, 0.9) skew(2deg, -1deg); filter: hue-rotate(15deg) contrast(1.3); }
          60% { transform: scale(0.9, 1.1) skew(-2deg, 1deg); filter: hue-rotate(-15deg) contrast(0.85); }
          80% { transform: scale(1.03) skew(1deg, -0.5deg); filter: hue-rotate(8deg); }
          100% { transform: none; filter: none; }
        }
        .degauss-distort { animation: degaussDistort 1.2s ease-out forwards; }

        @keyframes text-shake {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          10% { transform: translate(-50%, -50%) rotate(8deg); }
          20% { transform: translate(-50%, -50%) rotate(-8deg); }
          30% { transform: translate(-50%, -50%) rotate(6deg); }
          40% { transform: translate(-50%, -50%) rotate(-6deg); }
          50% { transform: translate(-50%, -50%) rotate(4deg); }
          60% { transform: translate(-50%, -50%) rotate(-4deg); }
          70% { transform: translate(-50%, -50%) rotate(2deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .text-shake { animation: text-shake 1.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
