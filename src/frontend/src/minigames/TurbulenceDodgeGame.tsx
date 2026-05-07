import { useCallback, useEffect, useRef, useState } from "react";
import { HealthBar } from "../components/HealthBar";
import { NeonButton } from "../components/NeonButton";
import { ScoreDisplay } from "../components/ScoreDisplay";

// ─── Types ──────────────────────────────────────────────────────────────────

type ObstacleKind = "raindrop" | "lightning" | "debris";

interface Obstacle {
  id: number;
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  scored: boolean; // true once it exits bottom without hitting plane
  color: string;
  angle?: number; // for debris rotation
}

interface PlaneState {
  x: number; // centre-x in logical coords (0–480)
  targetX: number; // where we're lerping to
  hitFlash: number; // frames remaining for red flash
}

interface MutableGameState {
  running: boolean;
  health: number;
  score: number; // +10 per dodged obstacle
  frameCount: number; // total frames, used for timer
  phase: "playing" | "victory" | "defeat";
  obstacles: Obstacle[];
  plane: PlaneState;
  nextObstacleId: number;
  lastSpawnTime: number; // ms timestamp
  spawnInterval: number; // ms between spawns
  difficultyTimer: number; // ms since last difficulty ramp
}

// ─── Drawing Helpers ─────────────────────────────────────────────────────────

function drawStormBackground(
  ctx: CanvasRenderingContext2D,
  frameCount: number,
) {
  // Deep storm gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, "#020510");
  grad.addColorStop(0.4, "#050a1a");
  grad.addColorStop(1, "#0a0e27");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 480, 800);

  // Animated parallax cloud layers
  const t = frameCount * 0.5;
  ctx.globalAlpha = 0.12;
  for (let layer = 0; layer < 3; layer++) {
    const speed = (layer + 1) * 0.3;
    const yBase = 50 + layer * 80;
    ctx.fillStyle =
      layer === 0 ? "#6633aa" : layer === 1 ? "#220066" : "#330066";
    for (let c = 0; c < 5; c++) {
      const cx = ((c * 137 + layer * 200 + t * speed) % 560) - 40;
      const cy = yBase + Math.sin((c + layer) * 0.8) * 30;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60 + c * 10, 30 + c * 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Distant stars (static)
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 30; i++) {
    const sx = (i * 3731 + 17) % 480;
    const sy = (i * 2903 + 11) % 300;
    const alpha = 0.2 + (i % 5) * 0.1;
    ctx.globalAlpha = alpha;
    ctx.fillRect(sx, sy, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Neon horizon glow at bottom
  const horizGrad = ctx.createLinearGradient(0, 720, 0, 800);
  horizGrad.addColorStop(0, "rgba(255,20,147,0)");
  horizGrad.addColorStop(1, "rgba(255,20,147,0.15)");
  ctx.fillStyle = horizGrad;
  ctx.fillRect(0, 720, 480, 80);

  // Grid lines (synthwave floor)
  ctx.strokeStyle = "rgba(0,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= 480; gx += 48) {
    ctx.beginPath();
    ctx.moveTo(gx, 720);
    ctx.lineTo(240, 800);
    ctx.stroke();
  }
  for (let gy = 720; gy <= 800; gy += 20) {
    const pct = (gy - 720) / 80;
    ctx.globalAlpha = pct * 0.12;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(480, gy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawPlane(
  ctx: CanvasRenderingContext2D,
  plane: PlaneState,
  planeY: number,
) {
  const px = plane.x;
  const py = planeY;
  const isHit = plane.hitFlash > 0;

  // Engine glow trail
  const trailGrad = ctx.createLinearGradient(px - 50, py, px - 5, py);
  trailGrad.addColorStop(0, "rgba(255,20,147,0)");
  trailGrad.addColorStop(
    1,
    isHit ? "rgba(255,80,0,0.6)" : "rgba(255,20,147,0.6)",
  );
  ctx.fillStyle = trailGrad;
  ctx.beginPath();
  ctx.ellipse(px - 28, py, 26, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing glow
  ctx.shadowColor = isHit ? "#FF4400" : "#FF1493";
  ctx.shadowBlur = isHit ? 20 : 12;

  // Fuselage (main body)
  ctx.fillStyle = isHit ? "#FF4400" : "#DDDDEE";
  ctx.beginPath();
  ctx.ellipse(px, py, 34, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose cone
  ctx.fillStyle = isHit ? "#FF6600" : "#00FFFF";
  ctx.beginPath();
  ctx.moveTo(px + 34, py);
  ctx.lineTo(px + 50, py - 3);
  ctx.lineTo(px + 50, py + 3);
  ctx.closePath();
  ctx.fill();

  // Left wing
  ctx.fillStyle = isHit ? "#FF4400" : "#FF1493";
  ctx.beginPath();
  ctx.moveTo(px - 8, py);
  ctx.lineTo(px + 6, py);
  ctx.lineTo(px + 2, py - 26);
  ctx.lineTo(px - 16, py - 22);
  ctx.closePath();
  ctx.fill();

  // Right wing (mirrored down)
  ctx.fillStyle = isHit ? "#FF4400" : "#FF1493";
  ctx.beginPath();
  ctx.moveTo(px - 8, py);
  ctx.lineTo(px + 6, py);
  ctx.lineTo(px + 2, py + 26);
  ctx.lineTo(px - 16, py + 22);
  ctx.closePath();
  ctx.fill();

  // Tail fin
  ctx.fillStyle = isHit ? "#FF6600" : "#00FFFF";
  ctx.beginPath();
  ctx.moveTo(px - 28, py);
  ctx.lineTo(px - 34, py - 18);
  ctx.lineTo(px - 16, py);
  ctx.closePath();
  ctx.fill();

  // Cockpit windows
  ctx.fillStyle = isHit ? "#FFAA00" : "#AAEEFF";
  ctx.globalAlpha = 0.9;
  for (let w = 0; w < 3; w++) {
    ctx.fillRect(px + 8 + w * 8, py - 3, 5, 6);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawRaindrop(ctx: CanvasRenderingContext2D, o: Obstacle) {
  ctx.shadowColor = o.color;
  ctx.shadowBlur = 4;
  ctx.fillStyle = o.color;
  ctx.globalAlpha = 0.85;
  // Elongated drop
  ctx.beginPath();
  ctx.ellipse(
    o.x + o.w / 2,
    o.y + o.h / 2,
    o.w / 2,
    o.h / 2,
    -0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.ellipse(
    o.x + o.w / 2 - 1,
    o.y + 4,
    o.w / 6,
    o.h / 6,
    -0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawLightning(ctx: CanvasRenderingContext2D, o: Obstacle) {
  ctx.shadowColor = "#FFFF00";
  ctx.shadowBlur = 16;
  ctx.strokeStyle = "#FFFF00";
  ctx.lineWidth = 3;
  const cx = o.x + o.w / 2;
  const ty = o.y;
  const by = o.y + o.h;
  // Zigzag bolt
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  ctx.lineTo(cx + 8, ty + o.h * 0.25);
  ctx.lineTo(cx - 6, ty + o.h * 0.45);
  ctx.lineTo(cx + 10, ty + o.h * 0.65);
  ctx.lineTo(cx - 4, ty + o.h * 0.82);
  ctx.lineTo(cx, by);
  ctx.stroke();
  // Inner bright core
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  ctx.lineTo(cx + 8, ty + o.h * 0.25);
  ctx.lineTo(cx - 6, ty + o.h * 0.45);
  ctx.lineTo(cx + 10, ty + o.h * 0.65);
  ctx.lineTo(cx - 4, ty + o.h * 0.82);
  ctx.lineTo(cx, by);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawDebris(ctx: CanvasRenderingContext2D, o: Obstacle) {
  ctx.save();
  ctx.translate(o.x + o.w / 2, o.y + o.h / 2);
  ctx.rotate(o.angle ?? 0);
  ctx.shadowColor = o.color;
  ctx.shadowBlur = 8;
  // Jagged chunk
  ctx.fillStyle = o.color;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  const pts = [
    [-o.w * 0.5, -o.h * 0.3],
    [-o.w * 0.1, -o.h * 0.5],
    [o.w * 0.4, -o.h * 0.4],
    [o.w * 0.5, o.h * 0.1],
    [o.w * 0.2, o.h * 0.5],
    [-o.w * 0.4, o.h * 0.4],
    [-o.w * 0.5, o.h * 0.1],
  ];
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle) {
  if (o.kind === "raindrop") drawRaindrop(ctx, o);
  else if (o.kind === "lightning") drawLightning(ctx, o);
  else drawDebris(ctx, o);
}

// ─── Component ───────────────────────────────────────────────────────────────

interface TurbulenceDodgeGameProps {
  levelId?: number;
  onComplete: (score: number) => void;
  onQuit: () => void;
}

export function TurbulenceDodgeGame({
  levelId: _levelId = 0,
  onComplete,
  onQuit,
}: TurbulenceDodgeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gsRef = useRef<MutableGameState>({
    running: false,
    health: 100,
    score: 0,
    frameCount: 0,
    phase: "playing",
    obstacles: [],
    plane: { x: 240, targetX: 240, hitFlash: 0 },
    nextObstacleId: 0,
    lastSpawnTime: 0,
    spawnInterval: 1000, // 1 per second initially
    difficultyTimer: 0,
  });
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // React state for HUD (updated every ~10 frames to reduce re-renders)
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<"playing" | "victory" | "defeat">(
    "playing",
  );

  const GAME_DURATION = 60_000; // ms
  const PLANE_Y = 620; // logical Y of plane centre
  const PLANE_HALF_W = 50;
  const PLANE_HALF_H = 28;

  // ── Spawn helpers ──────────────────────────────────────────────────────────
  const spawnObstacle = useCallback((now: number, baseSpeed: number) => {
    const gs = gsRef.current;
    const kinds: ObstacleKind[] = [
      "raindrop",
      "raindrop",
      "lightning",
      "debris",
    ];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    let w: number;
    let h: number;
    let color: string;
    if (kind === "raindrop") {
      w = 8 + Math.random() * 6;
      h = 24 + Math.random() * 16;
      color = "#00CCFF";
    } else if (kind === "lightning") {
      w = 24;
      h = 60 + Math.random() * 40;
      color = "#FFFF00";
    } else {
      w = 20 + Math.random() * 20;
      h = 20 + Math.random() * 20;
      color = "#AA4400";
    }
    const margin = 20;
    const x = margin + Math.random() * (480 - w - margin * 2);
    gs.obstacles.push({
      id: gs.nextObstacleId++,
      kind,
      x,
      y: -h,
      w,
      h,
      speed: baseSpeed + Math.random() * 1.5,
      scored: false,
      color,
      angle: kind === "debris" ? Math.random() * Math.PI * 2 : 0,
    });
    gs.lastSpawnTime = now;
  }, []);

  // ── Main game loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gs = gsRef.current;
    gs.running = true;
    gs.phase = "playing";
    gs.health = 100;
    gs.score = 0;
    gs.frameCount = 0;
    gs.obstacles = [];
    gs.plane = { x: 240, targetX: 240, hitFlash: 0 };
    gs.nextObstacleId = 0;
    gs.lastSpawnTime = 0;
    gs.spawnInterval = 1000;
    gs.difficultyTimer = 0;

    const t0 = performance.now();
    startTimeRef.current = t0;
    lastFrameTimeRef.current = t0;

    const loop = (now: number) => {
      if (!gs.running) return;

      const dt = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);

      // ── Difficulty ramp every 15s ────────────────────────────────────────
      gs.difficultyTimer += dt;
      if (gs.difficultyTimer >= 15_000) {
        gs.difficultyTimer -= 15_000;
        gs.spawnInterval = Math.max(250, gs.spawnInterval - 175); // 1/s → 4/s over 4 ramps
      }

      const baseSpeed =
        2 + (4 - gs.spawnInterval / 250) * 0.5 + elapsed / 20_000;

      // ── Spawn obstacles ──────────────────────────────────────────────────
      if (now - gs.lastSpawnTime >= gs.spawnInterval) {
        spawnObstacle(now, baseSpeed);
      }

      // ── Lerp plane ───────────────────────────────────────────────────────
      gs.plane.x += (gs.plane.targetX - gs.plane.x) * 0.12;
      if (gs.plane.hitFlash > 0) gs.plane.hitFlash--;

      // ── Move obstacles + collision ───────────────────────────────────────
      let hitThisFrame = false;
      gs.obstacles = gs.obstacles.filter((o) => {
        o.y += o.speed;
        if (o.kind === "debris") o.angle = (o.angle ?? 0) + 0.04;

        // Collision AABB (with a bit of forgiveness)
        const px = gs.plane.x;
        const hitX =
          px + PLANE_HALF_W - 8 > o.x && px - PLANE_HALF_W + 8 < o.x + o.w;
        const hitY =
          PLANE_Y + PLANE_HALF_H - 8 > o.y &&
          PLANE_Y - PLANE_HALF_H + 8 < o.y + o.h;

        if (hitX && hitY && !o.scored) {
          hitThisFrame = true;
          return false; // remove obstacle on hit
        }

        // Score if it exits bottom without hitting
        if (o.y > 800 + o.h) {
          if (!o.scored) {
            gs.score += 10;
            o.scored = true;
          }
          return false;
        }
        return true;
      });

      if (hitThisFrame) {
        gs.health = Math.max(0, gs.health - 20);
        gs.plane.hitFlash = 18;
        setHealth(gs.health);
      }

      // ── HUD state sync (throttled) ───────────────────────────────────────
      gs.frameCount++;
      if (gs.frameCount % 6 === 0) {
        setScore(gs.score);
        setTimeLeft(Math.ceil(remaining / 1000));
      }

      // ── Terminal conditions ──────────────────────────────────────────────
      if (gs.health <= 0) {
        gs.running = false;
        gs.phase = "defeat";
        setPhase("defeat");
        setHealth(0);
        onComplete(gs.score);
        return;
      }
      if (elapsed >= GAME_DURATION) {
        gs.running = false;
        gs.phase = "victory";
        setPhase("victory");
        setScore(gs.score);
        setTimeLeft(0);
        onComplete(gs.score);
        return;
      }

      // ── Draw ─────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, 480, 800);
      drawStormBackground(ctx, gs.frameCount);

      // Danger vignette when low health
      if (gs.health < 40) {
        const vAlpha =
          (1 - gs.health / 40) * 0.25 * (1 + Math.sin(gs.frameCount * 0.15));
        const vGrad = ctx.createRadialGradient(240, 400, 100, 240, 400, 400);
        vGrad.addColorStop(0, "rgba(255,0,0,0)");
        vGrad.addColorStop(1, `rgba(255,0,0,${vAlpha})`);
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, 480, 800);
      }

      for (const o of gs.obstacles) drawObstacle(ctx, o);
      drawPlane(ctx, gs.plane, PLANE_Y);

      // Hit flash overlay
      if (gs.plane.hitFlash > 0) {
        const flashAlpha = (gs.plane.hitFlash / 18) * 0.35;
        ctx.fillStyle = `rgba(255,80,0,${flashAlpha})`;
        ctx.fillRect(0, 0, 480, 800);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      gs.running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete, spawnObstacle]);

  // ── Touch / mouse input ────────────────────────────────────────────────────
  const handleInteraction = useCallback(
    (clientX: number, containerWidth: number) => {
      const gs = gsRef.current;
      if (!gs.running || gs.phase !== "playing") return;
      const isLeftHalf = clientX < containerWidth / 2;
      const margin = 60;
      if (isLeftHalf) {
        gs.plane.targetX = Math.max(margin, gs.plane.targetX - 64);
      } else {
        gs.plane.targetX = Math.min(480 - margin, gs.plane.targetX + 64);
      }
    },
    [],
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const relX = touch.clientX - rect.left;
        handleInteraction(relX, rect.width);
      }
    },
    [handleInteraction],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      handleInteraction(e.clientX - rect.left, rect.width);
    },
    [handleInteraction],
  );

  // ── Canvas scaling (maintain 480×800 aspect) ───────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const fit = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const aspect = 480 / 800;
      let rw: number;
      let rh: number;
      if (cw / ch < aspect) {
        rw = cw;
        rh = cw / aspect;
      } else {
        rh = ch;
        rw = ch * aspect;
      }
      canvas.style.width = `${rw}px`;
      canvas.style.height = `${rh}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── Overlay screens ────────────────────────────────────────────────────────
  const renderOverlay = () => {
    if (phase === "playing") return null;
    const isVictory = phase === "victory";
    return (
      <div
        data-ocid="turbulence.dialog"
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
        style={{
          background: isVictory ? "rgba(0,10,30,0.88)" : "rgba(20,0,0,0.90)",
        }}
      >
        {/* Title */}
        <div
          className="font-mono font-black text-3xl text-center leading-tight"
          style={{
            color: isVictory ? "#FF1493" : "#FF4400",
            textShadow: `0 0 24px ${isVictory ? "#FF1493" : "#FF4400"}, 0 0 48px ${isVictory ? "#FF149366" : "#FF440066"}`,
            letterSpacing: "0.1em",
          }}
        >
          {isVictory ? (
            <>✦ STORM{"\n"}CLEARED! ✦</>
          ) : (
            <>✕ FLIGHT{"\n"}ABORTED</>
          )}
        </div>

        {/* Result line */}
        <div
          className="font-mono text-sm text-center"
          style={{ color: isVictory ? "#00FFFF" : "#FFFF00" }}
        >
          {isVictory
            ? "Carol navigated the storm!"
            : "The turbulence was too strong…"}
        </div>

        {/* Score */}
        <ScoreDisplay score={score} label="FINAL SCORE" color="blue" />

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {!isVictory && (
            <NeonButton
              variant="yellow"
              size="lg"
              fullWidth
              data-ocid="turbulence.confirm_button"
              onClick={() => {
                // Reset all mutable state and restart
                const gs = gsRef.current;
                gs.running = false;
                cancelAnimationFrame(rafRef.current);
                setHealth(100);
                setScore(0);
                setTimeLeft(60);
                setPhase("playing");
                // Re-mount the canvas loop by resetting key mutable fields
                // We trigger by scheduling a micro-restart:
                setTimeout(() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx2 = canvas.getContext("2d");
                  if (!ctx2) return;
                  gs.running = true;
                  gs.phase = "playing";
                  gs.health = 100;
                  gs.score = 0;
                  gs.frameCount = 0;
                  gs.obstacles = [];
                  gs.plane = { x: 240, targetX: 240, hitFlash: 0 };
                  gs.nextObstacleId = 0;
                  gs.lastSpawnTime = 0;
                  gs.spawnInterval = 1000;
                  gs.difficultyTimer = 0;
                  const t0 = performance.now();
                  startTimeRef.current = t0;
                  lastFrameTimeRef.current = t0;

                  const loopFn = (now: number) => {
                    if (!gs.running) return;
                    const dt2 = now - lastFrameTimeRef.current;
                    lastFrameTimeRef.current = now;
                    const elapsed2 = now - startTimeRef.current;
                    const remaining2 = Math.max(0, GAME_DURATION - elapsed2);

                    gs.difficultyTimer += dt2;
                    if (gs.difficultyTimer >= 15_000) {
                      gs.difficultyTimer -= 15_000;
                      gs.spawnInterval = Math.max(250, gs.spawnInterval - 175);
                    }

                    const baseSpeed2 =
                      2 +
                      (4 - gs.spawnInterval / 250) * 0.5 +
                      elapsed2 / 20_000;
                    if (now - gs.lastSpawnTime >= gs.spawnInterval) {
                      spawnObstacle(now, baseSpeed2);
                    }

                    gs.plane.x += (gs.plane.targetX - gs.plane.x) * 0.12;
                    if (gs.plane.hitFlash > 0) gs.plane.hitFlash--;

                    let hitF = false;
                    gs.obstacles = gs.obstacles.filter((o) => {
                      o.y += o.speed;
                      if (o.kind === "debris") o.angle = (o.angle ?? 0) + 0.04;
                      const px2 = gs.plane.x;
                      const hx =
                        px2 + PLANE_HALF_W - 8 > o.x &&
                        px2 - PLANE_HALF_W + 8 < o.x + o.w;
                      const hy =
                        PLANE_Y + PLANE_HALF_H - 8 > o.y &&
                        PLANE_Y - PLANE_HALF_H + 8 < o.y + o.h;
                      if (hx && hy && !o.scored) {
                        hitF = true;
                        return false;
                      }
                      if (o.y > 800 + o.h) {
                        if (!o.scored) {
                          gs.score += 10;
                          o.scored = true;
                        }
                        return false;
                      }
                      return true;
                    });

                    if (hitF) {
                      gs.health = Math.max(0, gs.health - 20);
                      gs.plane.hitFlash = 18;
                      setHealth(gs.health);
                    }

                    gs.frameCount++;
                    if (gs.frameCount % 6 === 0) {
                      setScore(gs.score);
                      setTimeLeft(Math.ceil(remaining2 / 1000));
                    }

                    if (gs.health <= 0) {
                      gs.running = false;
                      gs.phase = "defeat";
                      setPhase("defeat");
                      setHealth(0);
                      onComplete(gs.score);
                      return;
                    }
                    if (elapsed2 >= GAME_DURATION) {
                      gs.running = false;
                      gs.phase = "victory";
                      setPhase("victory");
                      setScore(gs.score);
                      setTimeLeft(0);
                      onComplete(gs.score);
                      return;
                    }

                    ctx2.clearRect(0, 0, 480, 800);
                    drawStormBackground(ctx2, gs.frameCount);
                    if (gs.health < 40) {
                      const vA =
                        (1 - gs.health / 40) *
                        0.25 *
                        (1 + Math.sin(gs.frameCount * 0.15));
                      const vG = ctx2.createRadialGradient(
                        240,
                        400,
                        100,
                        240,
                        400,
                        400,
                      );
                      vG.addColorStop(0, "rgba(255,0,0,0)");
                      vG.addColorStop(1, `rgba(255,0,0,${vA})`);
                      ctx2.fillStyle = vG;
                      ctx2.fillRect(0, 0, 480, 800);
                    }
                    for (const o of gs.obstacles) drawObstacle(ctx2, o);
                    drawPlane(ctx2, gs.plane, PLANE_Y);
                    if (gs.plane.hitFlash > 0) {
                      const fa = (gs.plane.hitFlash / 18) * 0.35;
                      ctx2.fillStyle = `rgba(255,80,0,${fa})`;
                      ctx2.fillRect(0, 0, 480, 800);
                    }
                    rafRef.current = requestAnimationFrame(loopFn);
                  };
                  rafRef.current = requestAnimationFrame(loopFn);
                }, 16);
              }}
            >
              ↺ RETRY
            </NeonButton>
          )}
          {isVictory && (
            <NeonButton
              variant="pink"
              size="lg"
              fullWidth
              data-ocid="turbulence.confirm_button"
              onClick={() => onComplete(score)}
            >
              ► CONTINUE STORY
            </NeonButton>
          )}
          <NeonButton
            variant="ghost"
            size="sm"
            fullWidth
            data-ocid="turbulence.cancel_button"
            onClick={onQuit}
          >
            ← QUIT TO MAP
          </NeonButton>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      data-ocid="turbulence.canvas_target"
      className="relative flex-1 flex items-center justify-center w-full"
      style={{ background: "#020510", minHeight: 0 }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={480}
        height={800}
        style={{
          imageRendering: "pixelated",
          touchAction: "none",
          display: "block",
        }}
        onTouchStart={handleTouch}
        onMouseDown={handleMouseDown}
      />

      {/* HUD overlay — rendered as React DOM on top of canvas */}
      {phase === "playing" && (
        <div
          data-ocid="turbulence.panel"
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            padding: "8px 12px",
            background:
              "linear-gradient(to bottom, rgba(2,5,16,0.85) 0%, rgba(2,5,16,0) 100%)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            {/* Health bar — top left */}
            <div className="w-40">
              <HealthBar value={health} max={100} label="HULL" />
            </div>

            {/* Score — top centre */}
            <div className="flex flex-col items-center gap-0.5">
              <ScoreDisplay score={score} label="SCORE" color="blue" />
            </div>

            {/* Timer — top right */}
            <div
              data-ocid="turbulence.loading_state"
              className="flex flex-col items-end gap-0.5 font-mono"
            >
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: timeLeft <= 15 ? "#FFFF00" : "#00FFFF" }}
              >
                TIME
              </div>
              <div
                className="text-2xl font-black tabular-nums leading-none"
                style={{
                  color: timeLeft <= 15 ? "#FFFF00" : "#FF1493",
                  textShadow: `0 0 10px ${timeLeft <= 15 ? "#FFFF00" : "#FF1493"}`,
                }}
              >
                {String(timeLeft).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tap zone hint — bottom of canvas */}
      {phase === "playing" && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none flex font-mono text-xs"
          style={{
            paddingBottom: "10px",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          <div
            className="flex-1 text-left"
            style={{ color: "rgba(0,255,255,0.35)" }}
          >
            ◄ TAP LEFT
          </div>
          <div
            className="flex-1 text-right"
            style={{ color: "rgba(0,255,255,0.35)" }}
          >
            TAP RIGHT ►
          </div>
        </div>
      )}

      {/* Centre divider line (subtle, while playing) */}
      {phase === "playing" && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "50%",
            width: "1px",
            background:
              "linear-gradient(to bottom, rgba(0,255,255,0) 0%, rgba(0,255,255,0.08) 40%, rgba(0,255,255,0.08) 60%, rgba(0,255,255,0) 100%)",
          }}
        />
      )}

      {/* Overlay (victory / defeat) */}
      {renderOverlay()}
    </div>
  );
}
