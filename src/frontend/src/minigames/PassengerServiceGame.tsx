import { useCallback, useEffect, useRef, useState } from "react";
import { NeonButton } from "../components/NeonButton";
import { ScoreDisplay } from "../components/ScoreDisplay";

// ============================================================
// Types
// ============================================================
type RequestType = "drink" | "meal" | "pillow";
type PassengerState = "waiting" | "satisfied" | "left" | "empty";

interface Passenger {
  slotId: number;
  request: RequestType;
  state: PassengerState;
  patience: number; // 0–100 (100 = full)
  shaking: boolean;
  burstFrame: number; // >0 = show star burst
}

const REQUEST_ICONS: Record<
  RequestType,
  { emoji: string; label: string; color: string }
> = {
  drink: { emoji: "🥤", label: "DRINK", color: "#00FFFF" },
  meal: { emoji: "🍱", label: "MEAL", color: "#FFFF00" },
  pillow: { emoji: "🛏", label: "PILLOW", color: "#FF69B4" },
};

const REQUESTS: RequestType[] = ["drink", "meal", "pillow"];
const SLOT_COUNT = 6; // 3 rows × 2 seats
const ROUND_DURATION = 45; // seconds
const PATIENCE_DURATION = 10; // seconds per passenger
const WIN_THRESHOLD = 0.7; // ≥70% satisfaction

// ============================================================
// Aircraft interior canvas background
// ============================================================
function drawCabin(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Deep space-blue cabin wall
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0a0e27");
  bg.addColorStop(0.4, "#14183a");
  bg.addColorStop(1, "#0a0e27");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Overhead panel strip
  ctx.fillStyle = "#1a1e3f";
  ctx.fillRect(0, 0, w, 38);
  ctx.strokeStyle = "#FF149355";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 38);
  ctx.lineTo(w, 38);
  ctx.stroke();

  // Seat aisle — amber neon line
  const aisleX = w / 2;
  ctx.strokeStyle = "#FF8C0022";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(aisleX, 38);
  ctx.lineTo(aisleX, h);
  ctx.stroke();

  // Seat-row background blocks
  const rowH = 130;
  const rowStartY = 50;
  for (let row = 0; row < 3; row++) {
    const ry = rowStartY + row * rowH;
    // Left seat
    ctx.fillStyle = row % 2 === 0 ? "#1e2248" : "#181c3c";
    ctx.fillRect(10, ry, w / 2 - 20, 110);
    ctx.strokeStyle = "#FF149322";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, ry, w / 2 - 20, 110);
    // Right seat
    ctx.fillStyle = row % 2 === 0 ? "#1e2248" : "#181c3c";
    ctx.fillRect(w / 2 + 10, ry, w / 2 - 20, 110);
    ctx.strokeRect(w / 2 + 10, ry, w / 2 - 20, 110);
  }
}

// ============================================================
// Small Carol sprite on canvas (service position)
// ============================================================
function drawCarolSprite(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const s = 3;
  const pixels: (string | null)[][] = [
    [null, null, "#1a0a0a", "#1a0a0a", "#1a0a0a", null],
    [null, "#1a0a0a", "#2d1010", "#2d1010", "#2d1010", "#1a0a0a"],
    [null, "#f4c5a8", "#f4c5a8", "#f4c5a8", "#f4c5a8", null],
    ["#1a0a0a", "#f4c5a8", "#2d1b6b", "#f4c5a8", "#2d1b6b", "#f4c5a8"],
    [null, "#f4c5a8", "#f4c5a8", "#CC0055", "#f4c5a8", null],
    [null, null, "#f4c5a8", "#f4c5a8", null, null],
    [null, "#FF1493", "#FF1493", "#FF1493", "#FF1493", null],
    ["#FF1493", "#FF1493", "#FFFFFF", "#FFFFFF", "#FF1493", "#FF1493"],
    ["#FF1493", "#FF1493", "#FF1493", "#FF1493", "#FF1493", "#FF1493"],
    [null, "#FF1493", "#FF1493", "#FF1493", "#FF1493", null],
    [null, "#111133", "#111133", "#111133", "#111133", null],
    [null, "#111133", "#111133", "#111133", "#111133", null],
    [null, "#f4c5a8", null, null, "#f4c5a8", null],
  ];
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      const color = pixels[row][col];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * s, y + row * s, s, s);
    }
  }
  // Service tray
  ctx.fillStyle = "#888899";
  ctx.fillRect(x + 18, y + 24, 14, 3);
  ctx.fillStyle = "#FFFFFF44";
  ctx.fillRect(x + 19, y + 21, 12, 3);
}

// ============================================================
// Star burst particle effect on canvas
// ============================================================
function drawStarBurst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  frame: number,
) {
  const progress = frame / 18; // 0→1
  const radius = 30 * progress;
  const alpha = 1 - progress;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    ctx.fillStyle = "#FFFF00";
    ctx.shadowColor = "#FFFF00";
    ctx.shadowBlur = 6;
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }
  // Center star
  ctx.fillStyle = "#FF1493";
  ctx.shadowColor = "#FF1493";
  ctx.shadowBlur = 10;
  const starR = 8 * (1 - progress);
  ctx.beginPath();
  ctx.arc(cx, cy, starR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ============================================================
// Slot center positions on the 480×800 canvas
// ============================================================
const ROW_Y = [100, 230, 360]; // y-center per row
const COL_X = [115, 355]; // x-center: left col, right col

function slotCenter(slotId: number): { x: number; y: number } {
  const col = slotId % 2;
  const row = Math.floor(slotId / 2);
  return { x: COL_X[col], y: ROW_Y[row] };
}

// ============================================================
// HUD positions
// ============================================================
const HUD_Y = 16;

function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  timeLeft: number,
  satisfactionPct: number,
  w: number,
) {
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = "#00FFFF";
  ctx.shadowColor = "#00FFFF";
  ctx.shadowBlur = 6;
  ctx.fillText(`${String(score).padStart(6, "0")}`, 10, HUD_Y + 10);

  ctx.textAlign = "center";
  ctx.fillStyle = timeLeft <= 10 ? "#FFFF00" : "#FF1493";
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 8;
  ctx.fillText(`${String(timeLeft).padStart(2, "0")}s`, w / 2, HUD_Y + 10);

  ctx.textAlign = "right";
  const pctColor =
    satisfactionPct >= 70
      ? "#00FF88"
      : satisfactionPct >= 40
        ? "#FFFF00"
        : "#FF4444";
  ctx.fillStyle = pctColor;
  ctx.shadowColor = pctColor;
  ctx.shadowBlur = 6;
  ctx.fillText(`${Math.round(satisfactionPct)}%`, w - 10, HUD_Y + 10);

  // underline
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#FF149322";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 28);
  ctx.lineTo(w, 28);
  ctx.stroke();
}

// ============================================================
// Draw a single passenger slot on canvas
// ============================================================
function drawPassengerSlot(ctx: CanvasRenderingContext2D, p: Passenger) {
  if (p.state === "empty") return;
  const { x, y } = slotCenter(p.slotId);

  if (p.state === "waiting") {
    // Pixel passenger silhouette
    ctx.fillStyle = "#f4c5a888";
    ctx.fillRect(x - 6, y - 18, 12, 12); // head
    ctx.fillStyle = "#4455aa88";
    ctx.fillRect(x - 8, y - 6, 16, 14); // body

    // Request icon background bubble
    const req = REQUEST_ICONS[p.request];
    ctx.fillStyle = "rgba(10,14,39,0.9)";
    ctx.strokeStyle = req.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = req.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 46, 28, 22, 4);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(req.emoji, x, y - 30);

    // Patience bar (thin, neon, above bubble)
    const barW = 50;
    ctx.fillStyle = "#111133";
    ctx.fillRect(x - barW / 2, y - 58, barW, 5);
    const patienceFill = (p.patience / 100) * barW;
    const patienceColor =
      p.patience > 60 ? "#00FFFF" : p.patience > 30 ? "#FFFF00" : "#FF4444";
    ctx.fillStyle = patienceColor;
    ctx.shadowColor = patienceColor;
    ctx.shadowBlur = 4;
    ctx.fillRect(x - barW / 2, y - 58, patienceFill, 5);
    ctx.shadowBlur = 0;
  } else if (p.state === "satisfied") {
    // Greyed-out satisfied passenger
    ctx.fillStyle = "#44994488";
    ctx.fillRect(x - 6, y - 18, 12, 12);
    ctx.fillStyle = "#22663388";
    ctx.fillRect(x - 8, y - 6, 16, 14);
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓", x, y - 26);
  } else if (p.state === "left") {
    // Dissatisfied silhouette (red tint)
    ctx.fillStyle = "#99222288";
    ctx.fillRect(x - 6, y - 18, 12, 12);
    ctx.fillStyle = "#66111188";
    ctx.fillRect(x - 8, y - 6, 16, 14);
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✗", x, y - 26);
  }

  // Burst effect
  if (p.burstFrame > 0) {
    drawStarBurst(ctx, x, y - 30, 18 - p.burstFrame);
  }
}

// ============================================================
// Main Component
// ============================================================
interface PassengerServiceGameProps {
  onComplete: (score: number) => void;
  onContinue?: () => void;
}

export function PassengerServiceGame({
  onComplete,
  onContinue,
}: PassengerServiceGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  // Mutable game state (lives in refs for rAF loop)
  const gameRef = useRef({
    running: true,
    score: 0,
    timeLeft: ROUND_DURATION,
    passengers: [] as Passenger[],
    totalServed: 0,
    totalFailed: 0,
    selectedItem: null as RequestType | null,
    nextSlotTimer: 0, // seconds until next passenger spawns
    spawnInterval: 4, // start spawning every 4s, tightens over time
    roundStarted: false,
  });

  // React state for HUD overlays and buttons
  const [_score, setScore] = useState(0);
  const [_timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [satisfaction, setSatisfaction] = useState(100);
  const [selectedItem, setSelectedItem] = useState<RequestType | null>(null);
  const [phase, setPhase] = useState<"playing" | "win" | "lose">("playing");
  const [shakingSlot, setShakingSlot] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  // Sync selectedItem into ref so rAF sees it
  const selectedItemRef = useRef<RequestType | null>(null);
  useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);

  // ---- Spawn helper ----
  const spawnPassenger = useCallback(() => {
    const gs = gameRef.current;
    const emptySlots = Array.from({ length: SLOT_COUNT }, (_, i) => i).filter(
      (i) =>
        !gs.passengers.find((p) => p.slotId === i && p.state === "waiting"),
    );
    if (emptySlots.length === 0) return;
    const slotId = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    const request = REQUESTS[Math.floor(Math.random() * REQUESTS.length)];
    gs.passengers.push({
      slotId,
      request,
      state: "waiting",
      patience: 100,
      shaking: false,
      burstFrame: 0,
    });
  }, []);

  // ---- Serve tap handler ----
  const handleSlotTap = useCallback((slotId: number) => {
    const gs = gameRef.current;
    const item = selectedItemRef.current;
    if (!item || gs.timeLeft <= 0) return;

    const passenger = gs.passengers.find(
      (p) => p.slotId === slotId && p.state === "waiting",
    );
    if (!passenger) return;

    if (passenger.request === item) {
      // Correct!
      passenger.state = "satisfied";
      passenger.burstFrame = 18;
      gs.score += 50;
      gs.totalServed += 1;
      setScore(gs.score);
      const total = gs.totalServed + gs.totalFailed;
      setSatisfaction(total > 0 ? (gs.totalServed / total) * 100 : 100);
    } else {
      // Wrong — shake
      setShakingSlot(slotId);
      setTimeout(() => setShakingSlot(null), 500);
    }
  }, []);

  // ---- Canvas hit test for slot taps ----
  const handleCanvasTap = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = 480 / rect.width;
      const scaleY = 800 / rect.height;
      let clientX: number;
      let clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0;
        clientY = e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY ?? 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const cx = (clientX - rect.left) * scaleX;
      const cy = (clientY - rect.top) * scaleY;

      // Check each slot hit region
      for (let slotId = 0; slotId < SLOT_COUNT; slotId++) {
        const { x, y } = slotCenter(slotId);
        if (Math.abs(cx - x) < 50 && Math.abs(cy - y) < 40) {
          handleSlotTap(slotId);
          return;
        }
      }
    },
    [handleSlotTap],
  );

  // ---- Game loop ----
  useEffect(() => {
    const gs = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial spawn burst
    spawnPassenger();
    spawnPassenger();

    const tick = (ts: number) => {
      if (!gs.running) return;
      const elapsed =
        lastTickRef.current === 0 ? 0 : (ts - lastTickRef.current) / 1000;
      lastTickRef.current = ts;

      // ---- Time step ----
      if (elapsed > 0 && elapsed < 0.5) {
        gs.timeLeft = Math.max(0, gs.timeLeft - elapsed);
        setTimeLeft(Math.ceil(gs.timeLeft));

        // Patience decay
        for (const p of gs.passengers) {
          if (p.state !== "waiting") continue;
          const decayRate = 100 / PATIENCE_DURATION;
          p.patience -= decayRate * elapsed;
          if (p.patience <= 0) {
            p.patience = 0;
            p.state = "left";
            gs.totalFailed += 1;
            setSatisfaction(() => {
              const total = gs.totalServed + gs.totalFailed;
              return total > 0 ? (gs.totalServed / total) * 100 : 100;
            });
          }
        }

        // Burst animation tick
        for (const p of gs.passengers) {
          if (p.burstFrame > 0) p.burstFrame -= 1;
        }

        // Spawn new passengers
        gs.nextSlotTimer -= elapsed;
        if (gs.nextSlotTimer <= 0) {
          spawnPassenger();
          gs.spawnInterval = Math.max(2, gs.spawnInterval - 0.05);
          gs.nextSlotTimer = gs.spawnInterval;
        }

        // Time up — end game
        if (gs.timeLeft <= 0) {
          gs.running = false;
          const total = gs.totalServed + gs.totalFailed;
          const satPct = total > 0 ? gs.totalServed / total : 1;
          const fScore = gs.score;
          setFinalScore(fScore);
          setPhase(satPct >= WIN_THRESHOLD ? "win" : "lose");
          onComplete(Math.round(satPct * 100));
          return;
        }
      }

      // ---- Draw ----
      drawCabin(ctx, 480, 800);
      drawHUD(
        ctx,
        gs.score,
        Math.ceil(gs.timeLeft),
        gs.totalServed + gs.totalFailed > 0
          ? (gs.totalServed / (gs.totalServed + gs.totalFailed)) * 100
          : 100,
        480,
      );

      // Draw passengers
      for (const p of gs.passengers) {
        drawPassengerSlot(ctx, p);
      }

      // Carol on right edge
      drawCarolSprite(ctx, 420, 490);

      // Selected item highlight indicator on canvas
      if (selectedItemRef.current) {
        const req = REQUEST_ICONS[selectedItemRef.current];
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = req.color;
        ctx.shadowColor = req.color;
        ctx.shadowBlur = 8;
        ctx.fillText(`✦ ${req.label} SELECTED`, 240, 490);
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      gs.running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [spawnPassenger, onComplete]);

  // ---- Retry ----
  const handleRetry = () => {
    const gs = gameRef.current;
    gs.running = true;
    gs.score = 0;
    gs.timeLeft = ROUND_DURATION;
    gs.passengers = [];
    gs.totalServed = 0;
    gs.totalFailed = 0;
    gs.selectedItem = null;
    gs.nextSlotTimer = 0;
    gs.spawnInterval = 4;
    lastTickRef.current = 0;
    setScore(0);
    setTimeLeft(ROUND_DURATION);
    setSatisfaction(100);
    setSelectedItem(null);
    setPhase("playing");
    setFinalScore(0);
    spawnPassenger();
    spawnPassenger();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const tick = (ts: number) => {
      if (!gs.running) return;
      const elapsed =
        lastTickRef.current === 0 ? 0 : (ts - lastTickRef.current) / 1000;
      lastTickRef.current = ts;
      if (elapsed > 0 && elapsed < 0.5) {
        gs.timeLeft = Math.max(0, gs.timeLeft - elapsed);
        setTimeLeft(Math.ceil(gs.timeLeft));
        for (const p of gs.passengers) {
          if (p.state !== "waiting") continue;
          const decayRate = 100 / PATIENCE_DURATION;
          p.patience -= decayRate * elapsed;
          if (p.patience <= 0) {
            p.patience = 0;
            p.state = "left";
            gs.totalFailed += 1;
            setSatisfaction(() => {
              const total = gs.totalServed + gs.totalFailed;
              return total > 0 ? (gs.totalServed / total) * 100 : 100;
            });
          }
        }
        for (const p of gs.passengers) {
          if (p.burstFrame > 0) p.burstFrame -= 1;
        }
        gs.nextSlotTimer -= elapsed;
        if (gs.nextSlotTimer <= 0) {
          spawnPassenger();
          gs.spawnInterval = Math.max(2, gs.spawnInterval - 0.05);
          gs.nextSlotTimer = gs.spawnInterval;
        }
        if (gs.timeLeft <= 0) {
          gs.running = false;
          const total = gs.totalServed + gs.totalFailed;
          const satPct = total > 0 ? gs.totalServed / total : 1;
          const fScore = gs.score;
          setFinalScore(fScore);
          setPhase(satPct >= WIN_THRESHOLD ? "win" : "lose");
          onComplete(Math.round(satPct * 100));
          return;
        }
      }
      drawCabin(ctx, 480, 800);
      drawHUD(
        ctx,
        gs.score,
        Math.ceil(gs.timeLeft),
        gs.totalServed + gs.totalFailed > 0
          ? (gs.totalServed / (gs.totalServed + gs.totalFailed)) * 100
          : 100,
        480,
      );
      for (const p of gs.passengers) drawPassengerSlot(ctx, p);
      drawCarolSprite(ctx, 420, 490);
      if (selectedItemRef.current) {
        const req = REQUEST_ICONS[selectedItemRef.current];
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = req.color;
        ctx.shadowColor = req.color;
        ctx.shadowBlur = 8;
        ctx.fillText(`✦ ${req.label} SELECTED`, 240, 490);
        ctx.shadowBlur = 0;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  // ---- Render ----
  return (
    <div
      data-ocid="passenger.page"
      className="relative flex flex-col"
      style={{
        width: "100%",
        aspectRatio: "480/800",
        maxHeight: "100dvh",
        margin: "0 auto",
      }}
    >
      {/* Canvas — full game rendering */}
      <canvas
        ref={canvasRef}
        width={480}
        height={800}
        className="w-full h-full block"
        style={{ imageRendering: "pixelated", touchAction: "none" }}
        onClick={handleCanvasTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            handleCanvasTap(
              e as unknown as React.MouseEvent<HTMLCanvasElement>,
            );
        }}
        onTouchStart={handleCanvasTap}
        aria-label="Passenger service game canvas"
      />

      {/* ---- Service Buttons (bottom overlay) ---- */}
      {phase === "playing" && (
        <div
          className="absolute bottom-0 left-0 right-0 flex gap-2 p-3"
          style={{
            background: "rgba(10,14,39,0.92)",
            borderTop: "1px solid #FF149355",
          }}
        >
          {REQUESTS.map((req) => {
            const info = REQUEST_ICONS[req];
            const isSelected = selectedItem === req;
            return (
              <button
                key={req}
                type="button"
                data-ocid={`passenger.${req}_button`}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded border-2 font-mono text-xs font-bold uppercase tracking-wide tap-feedback transition-smooth"
                style={{
                  borderColor: info.color,
                  background: isSelected
                    ? `${info.color}22`
                    : "rgba(10,14,39,0.8)",
                  color: info.color,
                  boxShadow: isSelected ? `0 0 12px ${info.color}88` : "none",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
                onClick={() => setSelectedItem(isSelected ? null : req)}
              >
                <span className="text-xl leading-none">{info.emoji}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ---- Shaking slot overlay (CSS shake) ---- */}
      {shakingSlot !== null && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(slotCenter(shakingSlot).x / 480) * 100}%`,
            top: `${(slotCenter(shakingSlot).y / 800) * 100}%`,
            transform: "translate(-50%,-60%)",
            animation: "shake 0.4s ease",
            fontSize: "20px",
          }}
        >
          ✗
        </div>
      )}

      {/* ---- Win Overlay ---- */}
      {phase === "win" && (
        <div
          data-ocid="passenger.success_state"
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8"
          style={{ background: "rgba(10,14,39,0.93)" }}
        >
          <div
            className="font-mono text-center"
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: "#FF1493",
              textShadow: "0 0 16px #FF1493, 0 0 30px #FF149366",
              lineHeight: 1.2,
            }}
          >
            ✓ SERVICE{"\n"}COMPLETE!
          </div>
          <div
            className="font-mono text-sm text-center"
            style={{ color: "#AAAACC" }}
          >
            Satisfaction: {Math.round(satisfaction)}%
          </div>
          <ScoreDisplay score={finalScore} label="SCORE" color="pink" />
          <div
            className="font-mono text-xs text-center"
            style={{ color: "#00FFFF", textShadow: "0 0 6px #00FFFF" }}
          >
            ✦ Passengers satisfied
          </div>
          <div className="flex flex-col gap-3 w-full">
            <NeonButton
              variant="pink"
              size="lg"
              fullWidth
              data-ocid="passenger.continue_button"
              onClick={() => {
                if (onContinue) onContinue();
                else onComplete(finalScore);
              }}
            >
              ► CONTINUE STORY
            </NeonButton>
          </div>
        </div>
      )}

      {/* ---- Lose Overlay ---- */}
      {phase === "lose" && (
        <div
          data-ocid="passenger.error_state"
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8"
          style={{ background: "rgba(10,14,39,0.93)" }}
        >
          <div
            className="font-mono text-center"
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "#FFFF00",
              textShadow: "0 0 16px #FFFF00",
              lineHeight: 1.2,
            }}
          >
            ✕ TOO MANY{"\n"}UNHAPPY!
          </div>
          <div
            className="font-mono text-sm text-center"
            style={{ color: "#AAAACC" }}
          >
            Satisfaction: {Math.round(satisfaction)}%
            <br />
            Need ≥70% to pass
          </div>
          <ScoreDisplay score={finalScore} label="SCORE" color="yellow" />
          <div className="flex flex-col gap-3 w-full">
            <NeonButton
              variant="pink"
              size="md"
              fullWidth
              data-ocid="passenger.confirm_button"
              onClick={handleRetry}
            >
              ↺ RETRY
            </NeonButton>
            <NeonButton
              variant="ghost"
              size="sm"
              fullWidth
              data-ocid="passenger.cancel_button"
              onClick={() => onComplete(Math.round(satisfaction))}
            >
              ✕ QUIT
            </NeonButton>
          </div>
        </div>
      )}

      {/* Inline shake keyframe */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translate(-50%,-60%) translateX(0); }
          20%      { transform: translate(-50%,-60%) translateX(-6px); }
          40%      { transform: translate(-50%,-60%) translateX(6px); }
          60%      { transform: translate(-50%,-60%) translateX(-4px); }
          80%      { transform: translate(-50%,-60%) translateX(4px); }
        }
      `}</style>
    </div>
  );
}
