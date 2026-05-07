import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { DialogueBox } from "../components/DialogueBox";
import scenes from "../data/dialogues";
import type { SceneBg } from "../data/dialogues";
import { useGameStore } from "../store/gameStore";
import type { DialogueChoice } from "../types/game";
import { carolSprite, drawPixelSprite, joshuaSprite } from "../utils/sprites";

const BG_GRADIENTS: Record<SceneBg, string> = {
  airport: "linear-gradient(180deg, #0a0e27 0%, #0d1048 40%, #1a0a3a 100%)",
  aircraft: "linear-gradient(180deg, #050820 0%, #0a1040 50%, #0a0e27 100%)",
  phone: "linear-gradient(180deg, #0a0e27 0%, #150530 60%, #0a0820 100%)",
  "night-sky": "linear-gradient(180deg, #020408 0%, #040818 50%, #0a0e27 100%)",
  rainy: "linear-gradient(180deg, #080c1a 0%, #0e1828 50%, #0a1214 100%)",
  emergency: "linear-gradient(180deg, #1a0508 0%, #250808 40%, #1a0e1a 100%)",
  sunset: "linear-gradient(180deg, #0a0e27 0%, #1a0830 50%, #2a0a1a 100%)",
  arrivals: "linear-gradient(180deg, #0a0e27 0%, #0a1640 60%, #0a1830 100%)",
};

const BG_ACCENT: Record<SceneBg, string> = {
  airport: "#00FFFF",
  aircraft: "#4488FF",
  phone: "#FF1493",
  "night-sky": "#8844FF",
  rainy: "#44AACC",
  emergency: "#FF4422",
  sunset: "#FF9944",
  arrivals: "#FF1493",
};

const SCENE_LABELS: Record<SceneBg, string> = {
  airport: "✈ AIRPORT — GATE 7",
  aircraft: "✈ IN-FLIGHT",
  phone: "📱 PHONE / TEXT SCENE",
  "night-sky": "🌌 NIGHT FLIGHT",
  rainy: "⛈ STORM ZONE",
  emergency: "🚨 EMERGENCY PROTOCOL",
  sunset: "🌅 FINAL APPROACH",
  arrivals: "❤ ARRIVALS HALL",
};

const CHARACTER_W = 320;
const CHARACTER_H = 120;

function SceneDisplay({
  bgType,
  speaker,
  showJoshua,
}: {
  bgType: SceneBg;
  speaker: "carol" | "joshua" | "narrator" | "system";
  showJoshua: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      ctx.clearRect(0, 0, CHARACTER_W, CHARACTER_H);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, CHARACTER_H);
      const bgMap: Record<SceneBg, [string, string]> = {
        airport: ["#0a0e27", "#1a0a3a"],
        aircraft: ["#050820", "#0a1040"],
        phone: ["#0a0e27", "#150530"],
        "night-sky": ["#020408", "#040818"],
        rainy: ["#080c1a", "#0e1828"],
        emergency: ["#1a0508", "#250808"],
        sunset: ["#0a0e27", "#2a0a1a"],
        arrivals: ["#0a0e27", "#0a1640"],
      };
      const [c0, c1] = bgMap[bgType];
      bg.addColorStop(0, c0);
      bg.addColorStop(1, c1);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);

      // Stars
      for (let i = 0; i < 30; i++) {
        const blink = Math.sin(f * 0.04 + i * 1.3) > 0.4 ? 1 : 0.3;
        ctx.globalAlpha = blink * 0.8;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect((i * 3731 + 17) % CHARACTER_W, (i * 2903 + 11) % 60, 1, 1);
      }
      ctx.globalAlpha = 1;

      // Rainy streaks
      if (bgType === "rainy") {
        ctx.strokeStyle = "#4488AA44";
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
          const rx = (f * 2 + i * 29) % CHARACTER_W;
          const ry = (f * 3 + i * 17) % CHARACTER_H;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 8);
          ctx.stroke();
        }
      }

      // Emergency red pulse
      if (bgType === "emergency") {
        const alertAlpha = 0.15 + Math.sin(f * 0.15) * 0.1;
        ctx.fillStyle = `rgba(255,40,0,${alertAlpha})`;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }

      // Sunset glow
      if (bgType === "sunset") {
        const glowGrad = ctx.createRadialGradient(
          CHARACTER_W / 2,
          CHARACTER_H + 20,
          10,
          CHARACTER_W / 2,
          CHARACTER_H + 20,
          100,
        );
        glowGrad.addColorStop(0, "rgba(255,100,50,0.3)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }

      // Phone glow
      if (bgType === "phone") {
        const phoneGrad = ctx.createRadialGradient(
          CHARACTER_W - 60,
          CHARACTER_H / 2,
          5,
          CHARACTER_W - 60,
          CHARACTER_H / 2,
          50,
        );
        phoneGrad.addColorStop(0, "rgba(0,255,255,0.12)");
        phoneGrad.addColorStop(1, "transparent");
        ctx.fillStyle = phoneGrad;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }

      // Arrivals warm glow
      if (bgType === "arrivals") {
        const arrGlow = ctx.createRadialGradient(160, 100, 5, 160, 100, 80);
        arrGlow.addColorStop(0, "rgba(255,20,147,0.12)");
        arrGlow.addColorStop(1, "transparent");
        ctx.fillStyle = arrGlow;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }

      // Carol: left or center
      const carolBob = Math.sin(f * 0.08) * 2;
      const carolX = showJoshua ? CHARACTER_W / 2 - 60 : CHARACTER_W / 2 - 20;
      drawPixelSprite(ctx, carolSprite, carolX, 25 + carolBob, 4);

      // Joshua when relevant
      if (showJoshua) {
        const jBob = Math.sin(f * 0.08 + 1.1) * 2;
        const joshuaX = CHARACTER_W / 2 + 20;
        drawPixelSprite(ctx, joshuaSprite, joshuaX, 25 + jBob, 4);

        // Dashed connection line for phone scenes
        if (bgType === "phone") {
          ctx.strokeStyle = `rgba(0,255,255,${0.3 + Math.sin(f * 0.1) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(carolX + 24, 50);
          ctx.lineTo(joshuaX + 4, 50);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "#00FFFF";
          ctx.fillText("📱", CHARACTER_W / 2, 42);
        }

        // Arrivals: paper sign above Joshua
        if (bgType === "arrivals") {
          ctx.font = "bold 7px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "#FF1493";
          ctx.shadowColor = "#FF1493";
          ctx.shadowBlur = 6;
          ctx.fillText("Welcome Home ♥", CHARACTER_W / 2 + 32, 18);
          ctx.shadowBlur = 0;
        }
      }

      // Speaker highlight
      if (speaker === "carol" || speaker === "narrator") {
        ctx.strokeStyle = "rgba(255,20,147,0.18)";
        ctx.lineWidth = 2;
        ctx.strokeRect(carolX - 4, 20, 36, 64);
      } else if (speaker === "joshua" && showJoshua) {
        const joshuaX = CHARACTER_W / 2 + 20;
        ctx.strokeStyle = "rgba(0,255,255,0.22)";
        ctx.lineWidth = 2;
        ctx.strokeRect(joshuaX - 4, 20, 36, 64);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [bgType, speaker, showJoshua]);

  return (
    <canvas
      ref={canvasRef}
      width={CHARACTER_W}
      height={CHARACTER_H}
      className="w-full"
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}

export default function DialoguePage() {
  const { id } = useParams({ from: "/dialogue/$id" });
  const navigate = useNavigate();
  const { addRelationshipPoint } = useGameStore();

  const scene = scenes[id];
  const [lineIndex, setLineIndex] = useState(0);

  const handleNext = useCallback(() => {
    if (!scene) return;
    if (lineIndex < scene.lines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      if (scene.nextRoute) {
        navigate({ to: scene.nextRoute as "/" });
      } else {
        navigate({ to: "/map" });
      }
    }
  }, [scene, lineIndex, navigate]);

  const handleChoice = useCallback(
    (choice: DialogueChoice) => {
      addRelationshipPoint(choice.relationshipDelta);
      if (choice.nextDialogueId === "__minigame__") {
        if (scene?.nextRoute) {
          navigate({ to: scene.nextRoute as "/" });
        } else {
          navigate({ to: "/map" });
        }
      } else if (choice.nextDialogueId) {
        navigate({
          to: "/dialogue/$id",
          params: { id: choice.nextDialogueId },
        });
      } else {
        handleNext();
      }
    },
    [addRelationshipPoint, scene, navigate, handleNext],
  );

  if (!scene) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <p className="font-mono text-sm" style={{ color: "#FF1493" }}>
          Scene not found: {id}
        </p>
        <button
          type="button"
          className="font-mono text-xs tap-feedback"
          style={{ color: "#00FFFF" }}
          onClick={() => navigate({ to: "/map" })}
        >
          ← BACK TO MAP
        </button>
      </div>
    );
  }

  const currentLine = scene.lines[lineIndex];
  const accent = BG_ACCENT[scene.backgroundType];

  return (
    <div
      data-ocid="dialogue.page"
      className="flex flex-col min-h-screen"
      style={{ background: BG_GRADIENTS[scene.backgroundType] }}
    >
      {/* Top nav */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          borderColor: `${accent}22`,
          background: "rgba(10,14,39,0.88)",
        }}
      >
        <button
          type="button"
          data-ocid="dialogue.cancel_button"
          className="font-mono text-xs tap-feedback"
          style={{ color: "#555577" }}
          onClick={() => navigate({ to: "/map" })}
        >
          ← SKIP
        </button>
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: `${accent}99` }}
        >
          {id.replace(/_/g, " ").toUpperCase()}
        </span>
        <span className="font-mono text-xs" style={{ color: "#333366" }}>
          {lineIndex + 1}/{scene.lines.length}
        </span>
      </div>

      {/* Animated character canvas */}
      <div className="border-b" style={{ borderColor: `${accent}22` }}>
        <SceneDisplay
          bgType={scene.backgroundType}
          speaker={currentLine.speaker}
          showJoshua={scene.showJoshua ?? false}
        />
      </div>

      {/* Scene type label */}
      <div
        className="px-4 py-1 font-mono text-xs uppercase tracking-widest text-center scanline"
        style={{
          color: `${accent}88`,
          background: "rgba(10,14,39,0.6)",
          borderBottom: `1px solid ${accent}22`,
        }}
      >
        {SCENE_LABELS[scene.backgroundType]}
      </div>

      {/* Dialogue + progress */}
      <div className="flex-1 flex flex-col justify-end pb-4">
        <DialogueBox
          line={currentLine}
          onNext={handleNext}
          onChoice={handleChoice}
        />
        <div className="flex justify-center gap-1.5 px-4 pt-1">
          {scene.lines.map((_line, i) => (
            <div
              key={`prog-${scene.id}-${scene.lines.length}-${i}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === lineIndex ? "12px" : "6px",
                height: "6px",
                background: i <= lineIndex ? accent : "#333366",
                boxShadow: i === lineIndex ? `0 0 6px ${accent}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
