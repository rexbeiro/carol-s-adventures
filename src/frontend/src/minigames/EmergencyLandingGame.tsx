import { useCallback, useEffect, useRef, useState } from "react";
import { NeonButton } from "../components/NeonButton";
import { ScoreDisplay } from "../components/ScoreDisplay";

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 480;
const H = 800;

// Total descent duration in seconds
const DESCENT_DURATION = 8;
// Green zone: centered at 65% of descent, ±0.75 s either side
const GREEN_CENTER = 0.65;
const GREEN_HALF = 0.75 / DESCENT_DURATION;
// Yellow zone: extends ±1.0 s further around green
const YELLOW_HALF = (0.75 + 1.0) / DESCENT_DURATION;

type LandingResult = "perfect" | "good" | "bad" | "missed";

export interface EmergencyLandingGameProps {
  onComplete: (score: number, result: LandingResult) => void;
  onQuit: () => void;
}

// ── Helper: draw city-light pixel row ────────────────────────────────────────
function drawCityLights(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  seed: number,
) {
  for (let i = 0; i < 60; i++) {
    const lx = (seed * (i + 1) * 1237 + i * 997) % width;
    const lw = 2 + (i % 4);
    const lh = 4 + (i % 8);
    const hue = i % 3 === 0 ? "#FFFF88" : i % 3 === 1 ? "#FF8844" : "#88FFFF";
    ctx.fillStyle = hue;
    ctx.globalAlpha = 0.4 + (i % 5) * 0.08;
    ctx.fillRect(lx, y - lh, lw, lh);
  }
  ctx.globalAlpha = 1;
}

// ── Helper: draw runway in perspective ───────────────────────────────────────
function drawRunway(
  ctx: CanvasRenderingContext2D,
  progress: number, // 0=top of sky, 1=landed
  greenFrac: [number, number], // [lo, hi] in progress space
  _yellowFrac: [number, number],
  tapFlash: boolean,
) {
  // Runway spans from a vanishing point near top to full width at bottom.
  // As progress increases, runway gets "closer" (taller section visible).
  const vpX = W / 2;
  const vpY = 200 - progress * 160; // vanishing point rises as we descend
  const groundY = H - 80;
  const halfWidthAtBottom = 110;

  // ─ Sky/city background ───────────────────────────────────────────────────
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#020510");
  sky.addColorStop(0.55, "#0a0e27");
  sky.addColorStop(1, "#050818");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Stars
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 50; i++) {
    ctx.globalAlpha = 0.4 + (i % 5) * 0.12;
    ctx.fillRect(
      (i * 3731 + 17) % W,
      (i * 2903 + 11) % (H * 0.5),
      i % 6 === 0 ? 2 : 1,
      1,
    );
  }
  ctx.globalAlpha = 1;

  // City lights strip
  drawCityLights(ctx, groundY - 10, W, 42);

  // Ground
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
  groundGrad.addColorStop(0, "#0c1028");
  groundGrad.addColorStop(1, "#060810");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, W, H - groundY);

  // ─ Runway tarmac ─────────────────────────────────────────────────────────
  // Left and right edges from vanishing point to ground corners
  const leftX = vpX - halfWidthAtBottom;
  const rightX = vpX + halfWidthAtBottom;

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(leftX, groundY);
  ctx.lineTo(rightX, groundY);
  ctx.closePath();
  ctx.fillStyle = "#0e1428";
  ctx.fill();

  // ─ Zone bands (drawn before runway lines) ────────────────────────────────
  // We interpolate y positions: at progress p, bottom edge is at groundY,
  // and p fraction maps linearly between vpY and groundY.
  const yFromProgress = (p: number) =>
    vpY + Math.max(0, Math.min(1, p)) * (groundY - vpY);

  // Width at y: lerp 0..halfWidthAtBottom
  const halfWidthAt = (y: number) =>
    ((y - vpY) / (groundY - vpY)) * halfWidthAtBottom;

  const drawZoneBand = (
    p0: number,
    p1: number,
    color: string,
    alpha: number,
  ) => {
    const y0 = yFromProgress(p0);
    const y1 = yFromProgress(p1);
    const hw0 = halfWidthAt(y0);
    const hw1 = halfWidthAt(y1);
    ctx.beginPath();
    ctx.moveTo(vpX - hw0, y0);
    ctx.lineTo(vpX + hw0, y0);
    ctx.lineTo(vpX + hw1, y1);
    ctx.lineTo(vpX - hw1, y1);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  // Yellow zone
  drawZoneBand(
    Math.max(0, GREEN_CENTER - YELLOW_HALF),
    Math.min(1, GREEN_CENTER + YELLOW_HALF),
    "#FFFF00",
    0.18,
  );

  // Green zone
  const greenAlpha = tapFlash ? 0.55 : 0.28;
  drawZoneBand(
    Math.max(0, greenFrac[0]),
    Math.min(1, greenFrac[1]),
    "#00FF88",
    greenAlpha,
  );

  // ─ Runway edge lines (neon white) ────────────────────────────────────────
  ctx.shadowColor = "#FFFFFF";
  ctx.shadowBlur = 6;
  ctx.strokeStyle = "#DDDDFF";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(leftX, groundY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(rightX, groundY);
  ctx.stroke();

  // Center dashed line
  ctx.strokeStyle = "#FFFFFF44";
  ctx.lineWidth = 1;
  ctx.setLineDash([12, 16]);
  ctx.beginPath();
  ctx.moveTo(vpX, vpY + 20);
  ctx.lineTo(vpX, groundY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  // Pulsing green centerline in landing zone
  if (tapFlash) {
    ctx.shadowColor = "#00FF88";
    ctx.shadowBlur = 14;
    ctx.strokeStyle = "#00FF88";
    ctx.lineWidth = 2;
    const yG0 = yFromProgress(greenFrac[0]);
    const yG1 = yFromProgress(greenFrac[1]);
    ctx.beginPath();
    ctx.moveTo(vpX - halfWidthAt(yG0) + 8, yG0);
    ctx.lineTo(vpX + halfWidthAt(yG0) - 8, yG0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(vpX - halfWidthAt(yG1) + 8, yG1);
    ctx.lineTo(vpX + halfWidthAt(yG1) - 8, yG1);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

// ── Helper: draw the plane from above ────────────────────────────────────────
function drawPlane(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
) {
  const s = scale;
  // Body
  ctx.fillStyle = "#EEEEEE";
  ctx.shadowColor = "#FF1493";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 7 * s, 22 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wings
  ctx.fillStyle = "#DDDDFF";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 5 * s);
  ctx.lineTo(cx - 24 * s, cy + 4 * s);
  ctx.lineTo(cx - 18 * s, cy + 10 * s);
  ctx.lineTo(cx + 18 * s, cy + 10 * s);
  ctx.lineTo(cx + 24 * s, cy + 4 * s);
  ctx.closePath();
  ctx.fill();
  // Tail fins
  ctx.fillStyle = "#FF1493";
  ctx.beginPath();
  ctx.moveTo(cx, cy + 14 * s);
  ctx.lineTo(cx - 10 * s, cy + 22 * s);
  ctx.lineTo(cx + 10 * s, cy + 22 * s);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

// ── Helper: draw altitude bar ─────────────────────────────────────────────────
function drawAltitudeBar(ctx: CanvasRenderingContext2D, progress: number) {
  const barX = 24;
  const barY = 80;
  const barW = 18;
  const barH = H - 200;
  const fillH = (1 - progress) * barH;

  // Background
  ctx.fillStyle = "#111133";
  ctx.strokeStyle = "#333366";
  ctx.lineWidth = 1;
  ctx.fillRect(barX, barY, barW, barH);
  ctx.strokeRect(barX, barY, barW, barH);

  // Fill (shrinks as we descend)
  const altGrad = ctx.createLinearGradient(0, barY, 0, barY + barH);
  altGrad.addColorStop(0, "#00FFFF");
  altGrad.addColorStop(1, "#FF1493");
  ctx.fillStyle = altGrad;
  ctx.fillRect(barX, barY, barW, fillH);

  // Label
  ctx.fillStyle = "#00FFFF";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("ALT", barX + barW / 2, barY - 6);

  // Tick for landing zone (green center)
  const tickY = barY + (1 - GREEN_CENTER) * barH;
  ctx.strokeStyle = "#00FF88";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(barX - 4, tickY);
  ctx.lineTo(barX + barW + 4, tickY);
  ctx.stroke();
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function EmergencyLandingGame({
  onComplete,
  onQuit,
}: EmergencyLandingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Progress: 0 at top of descent, 1 at touchdown
  const progressRef = useRef(0);
  const tappedRef = useRef(false);
  const tapProgressRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const tapFlashRef = useRef(false); // flicker state
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crashFlashRef = useRef(0);

  const [phase, setPhase] = useState<
    "descending" | "landed" | "crashed" | "missed"
  >("descending");
  const [result, setResult] = useState<LandingResult | null>(null);
  const [score, setScore] = useState(0);
  const [tapNowVisible, setTapNowVisible] = useState(false);

  // Zone boundaries in progress space
  const greenLo = GREEN_CENTER - GREEN_HALF;
  const greenHi = GREEN_CENTER + GREEN_HALF;
  const yellowLo = GREEN_CENTER - YELLOW_HALF;
  const yellowHi = GREEN_CENTER + YELLOW_HALF;

  // ── Flicker TAP NOW indicator ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (flickerRef.current) clearInterval(flickerRef.current);
    };
  }, []);

  const startFlicker = useCallback(() => {
    tapFlashRef.current = true;
    setTapNowVisible(true);
    if (flickerRef.current) clearInterval(flickerRef.current);
    flickerRef.current = setInterval(() => {
      tapFlashRef.current = !tapFlashRef.current;
    }, 280);
  }, []);

  const stopFlicker = useCallback(() => {
    if (flickerRef.current) {
      clearInterval(flickerRef.current);
      flickerRef.current = null;
    }
    tapFlashRef.current = false;
    setTapNowVisible(false);
  }, []);

  // ── Determine result from tap progress ────────────────────────────────────
  const computeResult = useCallback(
    (p: number): { result: LandingResult; score: number } => {
      if (p >= greenLo && p <= greenHi)
        return { result: "perfect", score: 100 };
      if (p >= yellowLo && p <= yellowHi) return { result: "good", score: 50 };
      return { result: "bad", score: 0 };
    },
    [greenLo, greenHi, yellowLo, yellowHi],
  );

  // ── Handle tap ─────────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    if (tappedRef.current || phase !== "descending") return;
    tappedRef.current = true;
    tapProgressRef.current = progressRef.current;
    stopFlicker();
    const { result: res, score: s } = computeResult(progressRef.current);
    setResult(res);
    setScore(s);
    if (res === "perfect" || res === "good") {
      setPhase("landed");
    } else {
      setPhase("crashed");
      crashFlashRef.current = 8;
    }
    cancelAnimationFrame(animRef.current);
    onComplete(s, res);
  }, [phase, stopFlicker, computeResult, onComplete]);

  // ── Game loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;

    const loop = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = (ts - startTimeRef.current) / 1000;
      const prog = Math.min(1, elapsed / DESCENT_DURATION);
      progressRef.current = prog;

      // Enter green zone → start flicker
      if (prog >= greenLo && prog < greenHi && !tappedRef.current) {
        if (!tapFlashRef.current && !flickerRef.current) startFlicker();
      } else if ((prog >= greenHi || prog < greenLo) && flickerRef.current) {
        // Exited green zone without tap
      }

      // Past yellow zone without tapping → missed
      if (prog > yellowHi && !tappedRef.current) {
        tappedRef.current = true;
        stopFlicker();
        setResult("missed");
        setScore(0);
        setPhase("missed");
        onComplete(0, "missed");
        return;
      }

      // ─ Canvas drawing ────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Crash flash (red overlay)
      if (crashFlashRef.current > 0) {
        crashFlashRef.current--;
        ctx.fillStyle = "#FF000044";
        ctx.fillRect(0, 0, W, H);
      }

      // Plane scale grows as it approaches (perspective)
      const planeScale = 0.5 + prog * 0.9;
      // Plane Y: starts at 120, ends at H-200 area (runway touch)
      const planeY = 120 + prog * (H - 340);
      const planeX = W / 2;

      // Screen shake on good landing
      const shakeProg =
        tapProgressRef.current !== null &&
        (result === "good" || result === "perfect")
          ? Math.max(0, 1 - (prog - (tapProgressRef.current ?? 0)) * 20)
          : 0;
      const shake =
        shakeProg > 0 && result === "good"
          ? Math.sin(prog * 200) * 4 * shakeProg
          : 0;

      ctx.save();
      if (shake !== 0) ctx.translate(shake, shake * 0.5);

      drawRunway(
        ctx,
        prog,
        [greenLo, greenHi],
        [yellowLo, yellowHi],
        tapFlashRef.current,
      );
      drawPlane(ctx, planeX, planeY, planeScale);
      drawAltitudeBar(ctx, prog);

      ctx.restore();

      if (prog < 1 && !tappedRef.current) {
        frameId = requestAnimationFrame(loop);
      }
    };

    frameId = requestAnimationFrame(loop);
    animRef.current = frameId;

    return () => {
      cancelAnimationFrame(frameId);
      stopFlicker();
    };
  }, [
    greenLo,
    greenHi,
    yellowLo,
    yellowHi,
    startFlicker,
    stopFlicker,
    onComplete,
    result,
  ]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const isOver = phase !== "descending";
  const won = phase === "landed";

  const ratingLabel =
    result === "perfect"
      ? "SMOOTH LANDING"
      : result === "good"
        ? "BUMPY LANDING"
        : result === "bad"
          ? "CRASH LANDING"
          : "MISSED WINDOW";

  const ratingColor =
    result === "perfect"
      ? "#00FF88"
      : result === "good"
        ? "#FFFF00"
        : "#FF3333";

  return (
    <div
      data-ocid="emergency.page"
      className="relative flex flex-col w-full"
      style={{ width: W, height: H, maxWidth: "100%", margin: "0 auto" }}
    >
      {/* Canvas */}
      <button
        type="button"
        aria-label="Tap to land"
        data-ocid="emergency.canvas_target"
        className="absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer"
        style={{ touchAction: "none" }}
        onClick={handleTap}
        tabIndex={0}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-full"
          style={{ imageRendering: "pixelated", display: "block" }}
        />
      </button>

      {/* TAP NOW indicator */}
      {!isOver && tapNowVisible && (
        <div
          data-ocid="emergency.tap_now_indicator"
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: "54%",
            transform: "translateX(-50%)",
            color: "#00FF88",
            fontFamily: "monospace",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 4,
            textShadow: "0 0 16px #00FF88, 0 0 32px #00FF88",
            animation: "neon-flicker 0.6s infinite",
            whiteSpace: "nowrap",
          }}
        >
          ▼ TAP NOW ▼
        </div>
      )}

      {/* Zone legend (HUD top-right) */}
      {!isOver && (
        <div
          className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1"
          style={{ fontFamily: "monospace", fontSize: 10 }}
        >
          <span style={{ color: "#00FF88", textShadow: "0 0 6px #00FF88" }}>
            ● PERFECT ZONE
          </span>
          <span style={{ color: "#FFFF00", textShadow: "0 0 6px #FFFF00" }}>
            ● GOOD ZONE
          </span>
          <span style={{ color: "#FF3333", textShadow: "0 0 4px #FF3333" }}>
            ● DANGER
          </span>
        </div>
      )}

      {/* Instruction (descending, before green zone) */}
      {!isOver && !tapNowVisible && (
        <div
          className="absolute bottom-10 w-full text-center pointer-events-none"
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: "#00FFFF88",
            letterSpacing: 2,
          }}
        >
          WATCH THE ALTITUDE · TAP IN THE GREEN ZONE
        </div>
      )}

      {/* ── RESULT OVERLAYS ── */}
      {isOver && (
        <div
          data-ocid="emergency.dialog"
          className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          style={{
            background: "rgba(5,8,24,0.88)",
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Title */}
          <div
            className="font-mono font-black text-3xl tracking-widest"
            style={{
              color: won ? "#FF1493" : "#FF3333",
              textShadow: `0 0 24px ${won ? "#FF1493" : "#FF3333"}`,
              animation: "slide-in-up 0.4s ease-out both",
            }}
          >
            {won ? "✓ LANDED!" : "✕ CRASHED!"}
          </div>

          {/* Rating badge */}
          <div
            data-ocid="emergency.rating_badge"
            className="px-5 py-2 border-2 rounded font-mono font-bold text-sm tracking-widest"
            style={{
              borderColor: ratingColor,
              color: ratingColor,
              boxShadow: `0 0 16px ${ratingColor}66`,
              background: `${ratingColor}11`,
            }}
          >
            {ratingLabel}
          </div>

          {/* Score */}
          {won && (
            <div
              data-ocid="emergency.score_display"
              className="flex flex-col items-center gap-1"
            >
              <span
                className="font-mono text-xs"
                style={{ color: "#AAAACC", letterSpacing: 2 }}
              >
                LANDING SCORE
              </span>
              <ScoreDisplay score={score} />
            </div>
          )}

          {/* Win buttons */}
          {won && (
            <div
              className="flex flex-col gap-3 w-64 mt-2"
              style={{ animation: "slide-in-up 0.5s 0.15s ease-out both" }}
            >
              <NeonButton
                variant="pink"
                size="lg"
                fullWidth
                data-ocid="emergency.confirm_button"
                onClick={() => onComplete(score, result ?? "perfect")}
              >
                ► CONTINUE
              </NeonButton>
            </div>
          )}

          {/* Lose buttons */}
          {!won && (
            <div
              className="flex flex-col gap-3 w-64 mt-2"
              style={{ animation: "slide-in-up 0.5s 0.15s ease-out both" }}
            >
              <NeonButton
                variant="yellow"
                size="md"
                fullWidth
                data-ocid="emergency.retry_button"
                onClick={() => {
                  // Reset all mutable refs
                  progressRef.current = 0;
                  tappedRef.current = false;
                  tapProgressRef.current = null;
                  startTimeRef.current = null;
                  tapFlashRef.current = false;
                  crashFlashRef.current = 0;
                  stopFlicker();
                  // Reset React state
                  setPhase("descending");
                  setResult(null);
                  setScore(0);
                  setTapNowVisible(false);
                  // Cancel any lingering rAF
                  cancelAnimationFrame(animRef.current);
                  // Restart the rAF loop via a tiny force-remount trick:
                  // we schedule a new frame manually since the useEffect
                  // will re-run when the dependency array stays stable;
                  // the simplest safe approach is to re-trigger via key change.
                  // We achieve it by resetting state above — the useEffect
                  // for the game loop uses stable deps so we restart it here.
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx2 = canvas.getContext("2d");
                  if (!ctx2) return;
                  const newStartRef = { current: null as number | null };
                  const loop2 = (ts: number) => {
                    if (tappedRef.current) return;
                    if (!newStartRef.current) newStartRef.current = ts;
                    const elapsed2 = (ts - newStartRef.current) / 1000;
                    const prog = Math.min(1, elapsed2 / DESCENT_DURATION);
                    progressRef.current = prog;
                    if (
                      prog >= greenLo &&
                      prog < greenHi &&
                      !tappedRef.current
                    ) {
                      if (!tapFlashRef.current && !flickerRef.current)
                        startFlicker();
                    }
                    if (prog > yellowHi && !tappedRef.current) {
                      tappedRef.current = true;
                      stopFlicker();
                      setResult("missed");
                      setScore(0);
                      setPhase("missed");
                      onComplete(0, "missed");
                      return;
                    }
                    ctx2.clearRect(0, 0, W, H);
                    if (crashFlashRef.current > 0) {
                      crashFlashRef.current--;
                      ctx2.fillStyle = "#FF000044";
                      ctx2.fillRect(0, 0, W, H);
                    }
                    const planeScale = 0.5 + prog * 0.9;
                    const planeY = 120 + prog * (H - 340);
                    ctx2.save();
                    drawRunway(
                      ctx2,
                      prog,
                      [greenLo, greenHi],
                      [yellowLo, yellowHi],
                      tapFlashRef.current,
                    );
                    drawPlane(ctx2, W / 2, planeY, planeScale);
                    drawAltitudeBar(ctx2, prog);
                    ctx2.restore();
                    if (prog < 1 && !tappedRef.current) {
                      animRef.current = requestAnimationFrame(loop2);
                    }
                  };
                  animRef.current = requestAnimationFrame(loop2);
                }}
              >
                ↺ RETRY
              </NeonButton>
              <NeonButton
                variant="ghost"
                size="sm"
                fullWidth
                data-ocid="emergency.quit_button"
                onClick={onQuit}
              >
                ← QUIT
              </NeonButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
