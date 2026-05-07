import { useEffect, useRef, useState } from "react";
import { carolSprite, drawBackground, drawPixelSprite } from "../utils/sprites";

interface LoadingScreenProps {
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({
  message = "LOADING...",
  onComplete,
  duration = 2000,
}: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : `${d}.`));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = -60;
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, 480, 120);
      drawBackground(ctx, 5, 480, 120);

      // Plane trail
      ctx.fillStyle = "#00FFFF33";
      for (let i = 1; i <= 5; i++) {
        ctx.fillRect(x - i * 12, 48, 8, 2);
      }

      // Animated Carol walking
      const bobY = Math.sin(frame * 0.25) * 2;
      drawPixelSprite(ctx, carolSprite, x, 30 + bobY, 3);

      x += 2.5;
      frame++;
      if (x > 520) x = -60;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (!onComplete) return;
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div
      data-ocid="loading.loading_state"
      className="flex flex-col items-center justify-center min-h-screen gap-6"
      style={{ background: "#0a0e27" }}
    >
      {/* Title */}
      <div
        className="font-mono text-2xl font-bold uppercase tracking-widest text-center"
        style={{
          color: "#FF1493",
          textShadow: "0 0 12px #FF1493, 0 0 24px #FF149366",
        }}
      >
        CAROL'S ADVENTURES
      </div>

      {/* Animated canvas strip */}
      <div
        className="w-full border-t border-b"
        style={{ borderColor: "#FF149333" }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={120}
          className="w-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Loading text */}
      <div
        className="font-mono text-sm uppercase tracking-widest"
        style={{ color: "#00FFFF" }}
      >
        {message}
        {dots}
      </div>

      {/* Neon progress bar */}
      <div
        className="w-48 h-2 rounded border"
        style={{ borderColor: "#00FFFF33", background: "#0a0e27" }}
      >
        <div
          className="h-full rounded animate-pulse"
          style={{
            background: "linear-gradient(90deg, #FF1493, #00FFFF)",
            boxShadow: "0 0 8px #FF1493",
            width: "60%",
          }}
        />
      </div>
    </div>
  );
}
