import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NeonButton } from "../components/NeonButton";
import { useGameStore } from "../store/gameStore";
import { carolSprite, drawPixelSprite, joshuaSprite } from "../utils/sprites";

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function EndingPage() {
  const navigate = useNavigate();
  const { relationshipScore, resetGame, completedLevels } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [showCredits, setShowCredits] = useState(false);
  const [creditsAlpha, setCreditsAlpha] = useState(0);

  // Base score is 50. Each good dialogue choice adds 1 via addRelationshipPoint.
  // Romantic ending requires at least 2 good choices (score >= 52).
  const isRomantic = relationshipScore >= 52;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const particles: Particle[] = [];

    const spawnHeart = () => {
      if (!isRomantic) return;
      particles.push({
        x: 80 + Math.random() * 160,
        y: 160,
        vy: -(0.6 + Math.random() * 0.8),
        vx: (Math.random() - 0.5) * 0.6,
        life: 80 + Math.random() * 40,
        maxLife: 120,
        size: 8 + Math.random() * 8,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, 320, 240);

      // Sky
      const grad = ctx.createLinearGradient(0, 0, 0, 240);
      if (isRomantic) {
        grad.addColorStop(0, "#0a0e27");
        grad.addColorStop(0.4, "#1a0a3a");
        grad.addColorStop(0.8, "#2a0818");
        grad.addColorStop(1, "#1a0828");
      } else {
        grad.addColorStop(0, "#080c1a");
        grad.addColorStop(0.5, "#0e1828");
        grad.addColorStop(1, "#0a121a");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 240);

      // Stars
      for (let i = 0; i < 50; i++) {
        const blink = Math.sin(frame * 0.05 + i) > 0.5 ? 1 : 0.35;
        ctx.globalAlpha = blink * (isRomantic ? 0.9 : 0.45);
        ctx.fillStyle = isRomantic
          ? i % 3 === 0
            ? "#FF9999"
            : "#FFFFFF"
          : "#AAAACC";
        ctx.fillRect((i * 3731) % 320, (i * 2903) % 140, 1, 1);
      }
      ctx.globalAlpha = 1;

      // Ground
      ctx.fillStyle = "#0d1240";
      ctx.fillRect(0, 180, 320, 60);
      ctx.strokeStyle = isRomantic ? "#FF1493" : "#44668866";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 180);
      ctx.lineTo(320, 180);
      ctx.stroke();

      // Airport sign
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = isRomantic ? "#00FFFF" : "#446688";
      ctx.shadowColor = isRomantic ? "#00FFFF" : "#224466";
      ctx.shadowBlur = isRomantic ? 10 : 4;
      ctx.fillText("TOCUMEN INTERNATIONAL", 160, 175);
      ctx.shadowBlur = 0;

      // Romantic warm glow
      if (isRomantic) {
        const warmGlow = ctx.createRadialGradient(160, 180, 10, 160, 180, 90);
        warmGlow.addColorStop(0, "rgba(255,20,147,0.15)");
        warmGlow.addColorStop(1, "transparent");
        ctx.fillStyle = warmGlow;
        ctx.fillRect(0, 100, 320, 140);
      } else {
        // Bittersweet rain
        ctx.strokeStyle = "rgba(100,160,200,0.25)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
          const rx = (frame * 2 + i * 31) % 320;
          const ry = (frame * 3 + i * 23) % 170;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 1, ry + 7);
          ctx.stroke();
        }
      }

      // Characters converge
      const convergeFrames = 120;
      const t = Math.min(frame / convergeFrames, 1);
      const carolX = Math.round(40 + (110 - 40) * t);
      const joshuaX = Math.round(240 + (150 - 240) * t);
      const carolBob = Math.sin(frame * 0.12) * 2;
      const jBob = Math.sin(frame * 0.12 + 1) * 2;
      drawPixelSprite(ctx, carolSprite, carolX, 128 + carolBob, 3);
      drawPixelSprite(ctx, joshuaSprite, joshuaX, 128 + jBob, 3);

      // Meeting glow + symbol
      if (t >= 0.98) {
        const meetGlow = ctx.createRadialGradient(160, 150, 5, 160, 150, 40);
        meetGlow.addColorStop(
          0,
          isRomantic ? "rgba(255,20,147,0.4)" : "rgba(100,150,200,0.3)",
        );
        meetGlow.addColorStop(1, "transparent");
        ctx.fillStyle = meetGlow;
        ctx.fillRect(120, 110, 80, 80);

        const heartScale = 0.85 + Math.sin(frame * 0.12) * 0.2;
        ctx.font = `${Math.round(20 * heartScale)}px serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = isRomantic ? "#FF1493" : "#88AACC";
        ctx.shadowColor = isRomantic ? "#FF1493" : "#88AACC";
        ctx.shadowBlur = isRomantic ? 15 : 6;
        ctx.fillText(isRomantic ? "♥" : "♡", 163, 122);
        ctx.shadowBlur = 0;
      }

      // Heart particles
      if (frame % 20 === 0 && t >= 0.9) spawnHeart();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#FF1493";
        ctx.shadowColor = "#FF1493";
        ctx.shadowBlur = 8;
        ctx.fillText("♥", p.x, p.y);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      frame++;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRomantic]);

  // Credits fade in after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowCredits(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showCredits) return;
    let alpha = 0;
    const iv = setInterval(() => {
      alpha = Math.min(1, alpha + 0.04);
      setCreditsAlpha(alpha);
      if (alpha >= 1) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [showCredits]);

  const endingTitle = isRomantic ? "PERFECT REUNION" : "BITTERSWEET LANDING";
  const endingDesc = isRomantic
    ? "Six levels of turbulence, passengers, and emergencies — and you kept the love alive through every moment. He cleaned the apartment three times. He was right there waiting. Some things are worth every storm."
    : "The journey took its toll. Long miles. Late replies. But she arrived. And he was there — quietly, faithfully there. And sometimes, after everything, simply arriving is enough.";

  return (
    <div
      data-ocid="ending.page"
      className="flex flex-col min-h-screen items-center px-4 pt-8 pb-6 gap-5"
      style={{
        background: isRomantic
          ? "linear-gradient(180deg, #0a0e27 0%, #1a0a3a 100%)"
          : "linear-gradient(180deg, #080c1a 0%, #0e1828 100%)",
      }}
    >
      <div
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: isRomantic ? "#FF149388" : "#44668888" }}
      >
        — FINALE —
      </div>

      <h1
        className="font-mono text-2xl font-black uppercase text-center leading-tight"
        style={{
          color: isRomantic ? "#FF1493" : "#6688AA",
          textShadow: isRomantic
            ? "0 0 20px #FF1493, 0 0 40px #FF149366"
            : "0 0 12px #446688",
        }}
      >
        {endingTitle}
      </h1>

      {/* Reunion canvas */}
      <div
        className="w-full rounded border-2 overflow-hidden"
        style={{
          borderColor: isRomantic ? "#FF149455" : "#44668833",
          boxShadow: isRomantic ? "0 0 30px #FF149333" : "0 0 16px #44668822",
        }}
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="w-full"
          style={{ imageRendering: "pixelated", display: "block" }}
        />
      </div>

      {/* Description */}
      <div
        className="w-full rounded border p-4 font-mono text-sm leading-relaxed text-center"
        style={{
          borderColor: isRomantic ? "#FF149333" : "#33556644",
          background: isRomantic
            ? "rgba(255,20,147,0.05)"
            : "rgba(68,102,136,0.08)",
          color: isRomantic ? "#DDCCFF" : "#AABBCC",
        }}
      >
        {endingDesc}
      </div>

      {/* Stats */}
      <div
        className="w-full rounded border p-4 flex flex-col gap-2"
        style={{
          borderColor: isRomantic ? "#00FFFF33" : "#33556633",
          background: isRomantic
            ? "rgba(0,255,255,0.04)"
            : "rgba(68,100,130,0.06)",
        }}
      >
        <div className="flex justify-between font-mono text-xs">
          <span style={{ color: isRomantic ? "#00FFFF88" : "#66889988" }}>
            LEVELS COMPLETED:
          </span>
          <span style={{ color: isRomantic ? "#00FFFF" : "#6688AA" }}>
            {completedLevels.length}/6
          </span>
        </div>
        <div className="flex justify-between font-mono text-xs">
          <span style={{ color: isRomantic ? "#FF149388" : "#44668888" }}>
            BOND WITH JOSHUA:
          </span>
          <span style={{ color: isRomantic ? "#FF1493" : "#6688AA" }}>
            {Math.max(0, Math.min(100, relationshipScore))}%
          </span>
        </div>
        <div className="flex justify-between font-mono text-xs">
          <span style={{ color: "#FFFF0088" }}>ENDING:</span>
          <span style={{ color: isRomantic ? "#FFDD44" : "#AABBCC" }}>
            {endingTitle}
          </span>
        </div>
      </div>

      {/* Credits */}
      {showCredits && (
        <div
          className="w-full text-center flex flex-col gap-1 py-2"
          style={{ opacity: creditsAlpha }}
        >
          <div
            className="font-mono text-sm font-bold uppercase tracking-widest"
            style={{
              color: isRomantic ? "#FF1493" : "#6688AA",
              textShadow: isRomantic ? "0 0 10px #FF149366" : "none",
            }}
          >
            Carol's Adventures
          </div>
          <div className="font-mono text-xs" style={{ color: "#555577" }}>
            A story about love and flight
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full mt-auto">
        <NeonButton
          variant="pink"
          size="lg"
          fullWidth
          data-ocid="ending.primary_button"
          onClick={() => {
            resetGame();
            navigate({ to: "/" });
          }}
        >
          ♥ PLAY AGAIN
        </NeonButton>
        <NeonButton
          variant="blue"
          size="md"
          fullWidth
          data-ocid="ending.secondary_button"
          onClick={() => {
            const text = `I just played Carol's Adventures! Ending: ${endingTitle} — Bond: ${relationshipScore}% ✈♥`;
            if (navigator.share) {
              navigator
                .share({ title: "Carol's Adventures", text })
                .catch(() => {});
            } else {
              navigator.clipboard
                .writeText(text)
                .then(() => {
                  alert("Result copied to clipboard!");
                })
                .catch(() => {});
            }
          }}
        >
          📤 SHARE ENDING
        </NeonButton>
        <NeonButton
          variant="ghost"
          size="sm"
          fullWidth
          data-ocid="ending.tertiary_button"
          onClick={() => navigate({ to: "/map" })}
        >
          ← VIEW MAP
        </NeonButton>
      </div>

      <div
        className="font-mono text-xs text-center"
        style={{ color: "#333366" }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline"
          style={{ color: "#FF1493" }}
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
