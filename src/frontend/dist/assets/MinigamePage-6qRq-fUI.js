import { j as jsxRuntimeExports, r as reactExports, b as useParams, u as useNavigate } from "./index-B39rMSy_.js";
import { N as NeonButton, u as useGameStore } from "./gameStore-DCN8N4SW.js";
import { LEVELS } from "./MapPage-B7ZhEgd8.js";
const colorMap = {
  blue: {
    text: "#00FFFF",
    glow: "0 0 8px #00FFFF, 0 0 20px #00FFFF44",
    border: "#00FFFF"
  },
  pink: {
    text: "#FF1493",
    glow: "0 0 8px #FF1493, 0 0 20px #FF149344",
    border: "#FF1493"
  },
  yellow: {
    text: "#FFFF00",
    glow: "0 0 8px #FFFF00, 0 0 20px #FFFF0044",
    border: "#FFFF00"
  }
};
function ScoreDisplay({
  score,
  label = "SCORE",
  color = "blue"
}) {
  const c = colorMap[color];
  const formatted = String(score).padStart(6, "0");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "hud.score_display",
      className: "inline-flex items-center gap-1 px-3 py-1.5 rounded border font-mono",
      style: {
        borderColor: c.border,
        background: "rgba(10,14,39,0.8)",
        boxShadow: c.glow
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-xs font-bold uppercase tracking-widest",
            style: { color: c.text },
            children: [
              label,
              ":"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-sm font-bold tabular-nums",
            style: { color: c.text, textShadow: c.glow },
            children: formatted
          }
        )
      ]
    }
  );
}
const W = 480;
const H = 800;
const DESCENT_DURATION = 8;
const GREEN_CENTER = 0.65;
const GREEN_HALF = 0.75 / DESCENT_DURATION;
const YELLOW_HALF = (0.75 + 1) / DESCENT_DURATION;
function drawCityLights(ctx, y, width, seed) {
  for (let i = 0; i < 60; i++) {
    const lx = (seed * (i + 1) * 1237 + i * 997) % width;
    const lw = 2 + i % 4;
    const lh = 4 + i % 8;
    const hue = i % 3 === 0 ? "#FFFF88" : i % 3 === 1 ? "#FF8844" : "#88FFFF";
    ctx.fillStyle = hue;
    ctx.globalAlpha = 0.4 + i % 5 * 0.08;
    ctx.fillRect(lx, y - lh, lw, lh);
  }
  ctx.globalAlpha = 1;
}
function drawRunway(ctx, progress, greenFrac, _yellowFrac, tapFlash) {
  const vpX = W / 2;
  const vpY = 200 - progress * 160;
  const groundY = H - 80;
  const halfWidthAtBottom = 110;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#020510");
  sky.addColorStop(0.55, "#0a0e27");
  sky.addColorStop(1, "#050818");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 50; i++) {
    ctx.globalAlpha = 0.4 + i % 5 * 0.12;
    ctx.fillRect(
      (i * 3731 + 17) % W,
      (i * 2903 + 11) % (H * 0.5),
      i % 6 === 0 ? 2 : 1,
      1
    );
  }
  ctx.globalAlpha = 1;
  drawCityLights(ctx, groundY - 10, W, 42);
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
  groundGrad.addColorStop(0, "#0c1028");
  groundGrad.addColorStop(1, "#060810");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, W, H - groundY);
  const leftX = vpX - halfWidthAtBottom;
  const rightX = vpX + halfWidthAtBottom;
  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(leftX, groundY);
  ctx.lineTo(rightX, groundY);
  ctx.closePath();
  ctx.fillStyle = "#0e1428";
  ctx.fill();
  const yFromProgress = (p) => vpY + Math.max(0, Math.min(1, p)) * (groundY - vpY);
  const halfWidthAt = (y) => (y - vpY) / (groundY - vpY) * halfWidthAtBottom;
  const drawZoneBand = (p0, p1, color, alpha) => {
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
  drawZoneBand(
    Math.max(0, GREEN_CENTER - YELLOW_HALF),
    Math.min(1, GREEN_CENTER + YELLOW_HALF),
    "#FFFF00",
    0.18
  );
  const greenAlpha = tapFlash ? 0.55 : 0.28;
  drawZoneBand(
    Math.max(0, greenFrac[0]),
    Math.min(1, greenFrac[1]),
    "#00FF88",
    greenAlpha
  );
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
  ctx.strokeStyle = "#FFFFFF44";
  ctx.lineWidth = 1;
  ctx.setLineDash([12, 16]);
  ctx.beginPath();
  ctx.moveTo(vpX, vpY + 20);
  ctx.lineTo(vpX, groundY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
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
function drawPlane$1(ctx, cx, cy, scale) {
  const s = scale;
  ctx.fillStyle = "#EEEEEE";
  ctx.shadowColor = "#FF1493";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 7 * s, 22 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#DDDDFF";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 5 * s);
  ctx.lineTo(cx - 24 * s, cy + 4 * s);
  ctx.lineTo(cx - 18 * s, cy + 10 * s);
  ctx.lineTo(cx + 18 * s, cy + 10 * s);
  ctx.lineTo(cx + 24 * s, cy + 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#FF1493";
  ctx.beginPath();
  ctx.moveTo(cx, cy + 14 * s);
  ctx.lineTo(cx - 10 * s, cy + 22 * s);
  ctx.lineTo(cx + 10 * s, cy + 22 * s);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}
function drawAltitudeBar(ctx, progress) {
  const barX = 24;
  const barY = 80;
  const barW = 18;
  const barH = H - 200;
  const fillH = (1 - progress) * barH;
  ctx.fillStyle = "#111133";
  ctx.strokeStyle = "#333366";
  ctx.lineWidth = 1;
  ctx.fillRect(barX, barY, barW, barH);
  ctx.strokeRect(barX, barY, barW, barH);
  const altGrad = ctx.createLinearGradient(0, barY, 0, barY + barH);
  altGrad.addColorStop(0, "#00FFFF");
  altGrad.addColorStop(1, "#FF1493");
  ctx.fillStyle = altGrad;
  ctx.fillRect(barX, barY, barW, fillH);
  ctx.fillStyle = "#00FFFF";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("ALT", barX + barW / 2, barY - 6);
  const tickY = barY + (1 - GREEN_CENTER) * barH;
  ctx.strokeStyle = "#00FF88";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(barX - 4, tickY);
  ctx.lineTo(barX + barW + 4, tickY);
  ctx.stroke();
}
function EmergencyLandingGame({
  onComplete,
  onQuit
}) {
  const canvasRef = reactExports.useRef(null);
  const animRef = reactExports.useRef(0);
  const progressRef = reactExports.useRef(0);
  const tappedRef = reactExports.useRef(false);
  const tapProgressRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(null);
  const tapFlashRef = reactExports.useRef(false);
  const flickerRef = reactExports.useRef(null);
  const crashFlashRef = reactExports.useRef(0);
  const [phase, setPhase] = reactExports.useState("descending");
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [tapNowVisible, setTapNowVisible] = reactExports.useState(false);
  const greenLo = GREEN_CENTER - GREEN_HALF;
  const greenHi = GREEN_CENTER + GREEN_HALF;
  const yellowLo = GREEN_CENTER - YELLOW_HALF;
  const yellowHi = GREEN_CENTER + YELLOW_HALF;
  reactExports.useEffect(() => {
    return () => {
      if (flickerRef.current) clearInterval(flickerRef.current);
    };
  }, []);
  const startFlicker = reactExports.useCallback(() => {
    tapFlashRef.current = true;
    setTapNowVisible(true);
    if (flickerRef.current) clearInterval(flickerRef.current);
    flickerRef.current = setInterval(() => {
      tapFlashRef.current = !tapFlashRef.current;
    }, 280);
  }, []);
  const stopFlicker = reactExports.useCallback(() => {
    if (flickerRef.current) {
      clearInterval(flickerRef.current);
      flickerRef.current = null;
    }
    tapFlashRef.current = false;
    setTapNowVisible(false);
  }, []);
  const computeResult = reactExports.useCallback(
    (p) => {
      if (p >= greenLo && p <= greenHi)
        return { result: "perfect", score: 100 };
      if (p >= yellowLo && p <= yellowHi) return { result: "good", score: 50 };
      return { result: "bad", score: 0 };
    },
    [greenLo, greenHi, yellowLo, yellowHi]
  );
  const handleTap = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId = 0;
    const loop = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = (ts - startTimeRef.current) / 1e3;
      const prog = Math.min(1, elapsed / DESCENT_DURATION);
      progressRef.current = prog;
      if (prog >= greenLo && prog < greenHi && !tappedRef.current) {
        if (!tapFlashRef.current && !flickerRef.current) startFlicker();
      } else if ((prog >= greenHi || prog < greenLo) && flickerRef.current) ;
      if (prog > yellowHi && !tappedRef.current) {
        tappedRef.current = true;
        stopFlicker();
        setResult("missed");
        setScore(0);
        setPhase("missed");
        onComplete(0, "missed");
        return;
      }
      ctx.clearRect(0, 0, W, H);
      if (crashFlashRef.current > 0) {
        crashFlashRef.current--;
        ctx.fillStyle = "#FF000044";
        ctx.fillRect(0, 0, W, H);
      }
      const planeScale = 0.5 + prog * 0.9;
      const planeY = 120 + prog * (H - 340);
      const planeX = W / 2;
      const shakeProg = tapProgressRef.current !== null && (result === "good" || result === "perfect") ? Math.max(0, 1 - (prog - (tapProgressRef.current ?? 0)) * 20) : 0;
      const shake = shakeProg > 0 && result === "good" ? Math.sin(prog * 200) * 4 * shakeProg : 0;
      ctx.save();
      if (shake !== 0) ctx.translate(shake, shake * 0.5);
      drawRunway(
        ctx,
        prog,
        [greenLo, greenHi],
        [yellowLo, yellowHi],
        tapFlashRef.current
      );
      drawPlane$1(ctx, planeX, planeY, planeScale);
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
    result
  ]);
  const isOver = phase !== "descending";
  const won = phase === "landed";
  const ratingLabel = result === "perfect" ? "SMOOTH LANDING" : result === "good" ? "BUMPY LANDING" : result === "bad" ? "CRASH LANDING" : "MISSED WINDOW";
  const ratingColor = result === "perfect" ? "#00FF88" : result === "good" ? "#FFFF00" : "#FF3333";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "emergency.page",
      className: "relative flex flex-col w-full",
      style: { width: W, height: H, maxWidth: "100%", margin: "0 auto" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Tap to land",
            "data-ocid": "emergency.canvas_target",
            className: "absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer",
            style: { touchAction: "none" },
            onClick: handleTap,
            tabIndex: 0,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: canvasRef,
                width: W,
                height: H,
                className: "w-full h-full",
                style: { imageRendering: "pixelated", display: "block" }
              }
            )
          }
        ),
        !isOver && tapNowVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "emergency.tap_now_indicator",
            className: "absolute left-1/2 pointer-events-none",
            style: {
              top: "54%",
              transform: "translateX(-50%)",
              color: "#00FF88",
              fontFamily: "monospace",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 4,
              textShadow: "0 0 16px #00FF88, 0 0 32px #00FF88",
              animation: "neon-flicker 0.6s infinite",
              whiteSpace: "nowrap"
            },
            children: "▼ TAP NOW ▼"
          }
        ),
        !isOver && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1",
            style: { fontFamily: "monospace", fontSize: 10 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00FF88", textShadow: "0 0 6px #00FF88" }, children: "● PERFECT ZONE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FFFF00", textShadow: "0 0 6px #FFFF00" }, children: "● GOOD ZONE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FF3333", textShadow: "0 0 4px #FF3333" }, children: "● DANGER" })
            ]
          }
        ),
        !isOver && !tapNowVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-10 w-full text-center pointer-events-none",
            style: {
              fontFamily: "monospace",
              fontSize: 13,
              color: "#00FFFF88",
              letterSpacing: 2
            },
            children: "WATCH THE ALTITUDE · TAP IN THE GREEN ZONE"
          }
        ),
        isOver && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "emergency.dialog",
            className: "absolute inset-0 flex flex-col items-center justify-center gap-5",
            style: {
              background: "rgba(5,8,24,0.88)",
              backdropFilter: "blur(2px)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono font-black text-3xl tracking-widest",
                  style: {
                    color: won ? "#FF1493" : "#FF3333",
                    textShadow: `0 0 24px ${won ? "#FF1493" : "#FF3333"}`,
                    animation: "slide-in-up 0.4s ease-out both"
                  },
                  children: won ? "✓ LANDED!" : "✕ CRASHED!"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "emergency.rating_badge",
                  className: "px-5 py-2 border-2 rounded font-mono font-bold text-sm tracking-widest",
                  style: {
                    borderColor: ratingColor,
                    color: ratingColor,
                    boxShadow: `0 0 16px ${ratingColor}66`,
                    background: `${ratingColor}11`
                  },
                  children: ratingLabel
                }
              ),
              won && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "emergency.score_display",
                  className: "flex flex-col items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-xs",
                        style: { color: "#AAAACC", letterSpacing: 2 },
                        children: "LANDING SCORE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDisplay, { score })
                  ]
                }
              ),
              won && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-col gap-3 w-64 mt-2",
                  style: { animation: "slide-in-up 0.5s 0.15s ease-out both" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NeonButton,
                    {
                      variant: "pink",
                      size: "lg",
                      fullWidth: true,
                      "data-ocid": "emergency.confirm_button",
                      onClick: () => onComplete(score, result ?? "perfect"),
                      children: "► CONTINUE"
                    }
                  )
                }
              ),
              !won && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col gap-3 w-64 mt-2",
                  style: { animation: "slide-in-up 0.5s 0.15s ease-out both" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonButton,
                      {
                        variant: "yellow",
                        size: "md",
                        fullWidth: true,
                        "data-ocid": "emergency.retry_button",
                        onClick: () => {
                          progressRef.current = 0;
                          tappedRef.current = false;
                          tapProgressRef.current = null;
                          startTimeRef.current = null;
                          tapFlashRef.current = false;
                          crashFlashRef.current = 0;
                          stopFlicker();
                          setPhase("descending");
                          setResult(null);
                          setScore(0);
                          setTapNowVisible(false);
                          cancelAnimationFrame(animRef.current);
                          const canvas = canvasRef.current;
                          if (!canvas) return;
                          const ctx2 = canvas.getContext("2d");
                          if (!ctx2) return;
                          const newStartRef = { current: null };
                          const loop2 = (ts) => {
                            if (tappedRef.current) return;
                            if (!newStartRef.current) newStartRef.current = ts;
                            const elapsed2 = (ts - newStartRef.current) / 1e3;
                            const prog = Math.min(1, elapsed2 / DESCENT_DURATION);
                            progressRef.current = prog;
                            if (prog >= greenLo && prog < greenHi && !tappedRef.current) {
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
                              tapFlashRef.current
                            );
                            drawPlane$1(ctx2, W / 2, planeY, planeScale);
                            drawAltitudeBar(ctx2, prog);
                            ctx2.restore();
                            if (prog < 1 && !tappedRef.current) {
                              animRef.current = requestAnimationFrame(loop2);
                            }
                          };
                          animRef.current = requestAnimationFrame(loop2);
                        },
                        children: "↺ RETRY"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonButton,
                      {
                        variant: "ghost",
                        size: "sm",
                        fullWidth: true,
                        "data-ocid": "emergency.quit_button",
                        onClick: onQuit,
                        children: "← QUIT"
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const REQUEST_ICONS = {
  drink: { emoji: "🥤", label: "DRINK", color: "#00FFFF" },
  meal: { emoji: "🍱", label: "MEAL", color: "#FFFF00" },
  pillow: { emoji: "🛏", label: "PILLOW", color: "#FF69B4" }
};
const REQUESTS = ["drink", "meal", "pillow"];
const SLOT_COUNT = 6;
const ROUND_DURATION = 45;
const PATIENCE_DURATION = 10;
const WIN_THRESHOLD = 0.7;
function drawCabin(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0a0e27");
  bg.addColorStop(0.4, "#14183a");
  bg.addColorStop(1, "#0a0e27");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1a1e3f";
  ctx.fillRect(0, 0, w, 38);
  ctx.strokeStyle = "#FF149355";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 38);
  ctx.lineTo(w, 38);
  ctx.stroke();
  const aisleX = w / 2;
  ctx.strokeStyle = "#FF8C0022";
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(aisleX, 38);
  ctx.lineTo(aisleX, h);
  ctx.stroke();
  const rowH = 130;
  const rowStartY = 50;
  for (let row = 0; row < 3; row++) {
    const ry = rowStartY + row * rowH;
    ctx.fillStyle = row % 2 === 0 ? "#1e2248" : "#181c3c";
    ctx.fillRect(10, ry, w / 2 - 20, 110);
    ctx.strokeStyle = "#FF149322";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, ry, w / 2 - 20, 110);
    ctx.fillStyle = row % 2 === 0 ? "#1e2248" : "#181c3c";
    ctx.fillRect(w / 2 + 10, ry, w / 2 - 20, 110);
    ctx.strokeRect(w / 2 + 10, ry, w / 2 - 20, 110);
  }
}
function drawCarolSprite(ctx, x, y) {
  const s = 3;
  const pixels = [
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
    [null, "#f4c5a8", null, null, "#f4c5a8", null]
  ];
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      const color = pixels[row][col];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * s, y + row * s, s, s);
    }
  }
  ctx.fillStyle = "#888899";
  ctx.fillRect(x + 18, y + 24, 14, 3);
  ctx.fillStyle = "#FFFFFF44";
  ctx.fillRect(x + 19, y + 21, 12, 3);
}
function drawStarBurst(ctx, cx, cy, frame) {
  const progress = frame / 18;
  const radius = 30 * progress;
  const alpha = 1 - progress;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < 8; i++) {
    const angle = i / 8 * Math.PI * 2;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    ctx.fillStyle = "#FFFF00";
    ctx.shadowColor = "#FFFF00";
    ctx.shadowBlur = 6;
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }
  ctx.fillStyle = "#FF1493";
  ctx.shadowColor = "#FF1493";
  ctx.shadowBlur = 10;
  const starR = 8 * (1 - progress);
  ctx.beginPath();
  ctx.arc(cx, cy, starR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
const ROW_Y = [100, 230, 360];
const COL_X = [115, 355];
function slotCenter(slotId) {
  const col = slotId % 2;
  const row = Math.floor(slotId / 2);
  return { x: COL_X[col], y: ROW_Y[row] };
}
const HUD_Y = 16;
function drawHUD(ctx, score, timeLeft, satisfactionPct, w) {
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
  const pctColor = satisfactionPct >= 70 ? "#00FF88" : satisfactionPct >= 40 ? "#FFFF00" : "#FF4444";
  ctx.fillStyle = pctColor;
  ctx.shadowColor = pctColor;
  ctx.shadowBlur = 6;
  ctx.fillText(`${Math.round(satisfactionPct)}%`, w - 10, HUD_Y + 10);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#FF149322";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 28);
  ctx.lineTo(w, 28);
  ctx.stroke();
}
function drawPassengerSlot(ctx, p) {
  if (p.state === "empty") return;
  const { x, y } = slotCenter(p.slotId);
  if (p.state === "waiting") {
    ctx.fillStyle = "#f4c5a888";
    ctx.fillRect(x - 6, y - 18, 12, 12);
    ctx.fillStyle = "#4455aa88";
    ctx.fillRect(x - 8, y - 6, 16, 14);
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
    const barW = 50;
    ctx.fillStyle = "#111133";
    ctx.fillRect(x - barW / 2, y - 58, barW, 5);
    const patienceFill = p.patience / 100 * barW;
    const patienceColor = p.patience > 60 ? "#00FFFF" : p.patience > 30 ? "#FFFF00" : "#FF4444";
    ctx.fillStyle = patienceColor;
    ctx.shadowColor = patienceColor;
    ctx.shadowBlur = 4;
    ctx.fillRect(x - barW / 2, y - 58, patienceFill, 5);
    ctx.shadowBlur = 0;
  } else if (p.state === "satisfied") {
    ctx.fillStyle = "#44994488";
    ctx.fillRect(x - 6, y - 18, 12, 12);
    ctx.fillStyle = "#22663388";
    ctx.fillRect(x - 8, y - 6, 16, 14);
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓", x, y - 26);
  } else if (p.state === "left") {
    ctx.fillStyle = "#99222288";
    ctx.fillRect(x - 6, y - 18, 12, 12);
    ctx.fillStyle = "#66111188";
    ctx.fillRect(x - 8, y - 6, 16, 14);
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✗", x, y - 26);
  }
  if (p.burstFrame > 0) {
    drawStarBurst(ctx, x, y - 30, 18 - p.burstFrame);
  }
}
function PassengerServiceGame({
  onComplete,
  onContinue
}) {
  const canvasRef = reactExports.useRef(null);
  const animRef = reactExports.useRef(0);
  const lastTickRef = reactExports.useRef(0);
  const gameRef = reactExports.useRef({
    running: true,
    score: 0,
    timeLeft: ROUND_DURATION,
    passengers: [],
    totalServed: 0,
    totalFailed: 0,
    selectedItem: null,
    nextSlotTimer: 0,
    // seconds until next passenger spawns
    spawnInterval: 4,
    // start spawning every 4s, tightens over time
    roundStarted: false
  });
  const [_score, setScore] = reactExports.useState(0);
  const [_timeLeft, setTimeLeft] = reactExports.useState(ROUND_DURATION);
  const [satisfaction, setSatisfaction] = reactExports.useState(100);
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const [phase, setPhase] = reactExports.useState("playing");
  const [shakingSlot, setShakingSlot] = reactExports.useState(null);
  const [finalScore, setFinalScore] = reactExports.useState(0);
  const selectedItemRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);
  const spawnPassenger = reactExports.useCallback(() => {
    const gs = gameRef.current;
    const emptySlots = Array.from({ length: SLOT_COUNT }, (_, i) => i).filter(
      (i) => !gs.passengers.find((p) => p.slotId === i && p.state === "waiting")
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
      burstFrame: 0
    });
  }, []);
  const handleSlotTap = reactExports.useCallback((slotId) => {
    const gs = gameRef.current;
    const item = selectedItemRef.current;
    if (!item || gs.timeLeft <= 0) return;
    const passenger = gs.passengers.find(
      (p) => p.slotId === slotId && p.state === "waiting"
    );
    if (!passenger) return;
    if (passenger.request === item) {
      passenger.state = "satisfied";
      passenger.burstFrame = 18;
      gs.score += 50;
      gs.totalServed += 1;
      setScore(gs.score);
      const total = gs.totalServed + gs.totalFailed;
      setSatisfaction(total > 0 ? gs.totalServed / total * 100 : 100);
    } else {
      setShakingSlot(slotId);
      setTimeout(() => setShakingSlot(null), 500);
    }
  }, []);
  const handleCanvasTap = reactExports.useCallback(
    (e) => {
      var _a, _b, _c, _d;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = 480 / rect.width;
      const scaleY = 800 / rect.height;
      let clientX;
      let clientY;
      if ("touches" in e) {
        clientX = ((_a = e.touches[0]) == null ? void 0 : _a.clientX) ?? ((_b = e.changedTouches[0]) == null ? void 0 : _b.clientX) ?? 0;
        clientY = ((_c = e.touches[0]) == null ? void 0 : _c.clientY) ?? ((_d = e.changedTouches[0]) == null ? void 0 : _d.clientY) ?? 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const cx = (clientX - rect.left) * scaleX;
      const cy = (clientY - rect.top) * scaleY;
      for (let slotId = 0; slotId < SLOT_COUNT; slotId++) {
        const { x, y } = slotCenter(slotId);
        if (Math.abs(cx - x) < 50 && Math.abs(cy - y) < 40) {
          handleSlotTap(slotId);
          return;
        }
      }
    },
    [handleSlotTap]
  );
  reactExports.useEffect(() => {
    const gs = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    spawnPassenger();
    spawnPassenger();
    const tick = (ts) => {
      if (!gs.running) return;
      const elapsed = lastTickRef.current === 0 ? 0 : (ts - lastTickRef.current) / 1e3;
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
              return total > 0 ? gs.totalServed / total * 100 : 100;
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
        gs.totalServed + gs.totalFailed > 0 ? gs.totalServed / (gs.totalServed + gs.totalFailed) * 100 : 100,
        480
      );
      for (const p of gs.passengers) {
        drawPassengerSlot(ctx, p);
      }
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
    return () => {
      gs.running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [spawnPassenger, onComplete]);
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
    const tick = (ts) => {
      if (!gs.running) return;
      const elapsed = lastTickRef.current === 0 ? 0 : (ts - lastTickRef.current) / 1e3;
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
              return total > 0 ? gs.totalServed / total * 100 : 100;
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
        gs.totalServed + gs.totalFailed > 0 ? gs.totalServed / (gs.totalServed + gs.totalFailed) * 100 : 100,
        480
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "passenger.page",
      className: "relative flex flex-col",
      style: {
        width: "100%",
        aspectRatio: "480/800",
        maxHeight: "100dvh",
        margin: "0 auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: 480,
            height: 800,
            className: "w-full h-full block",
            style: { imageRendering: "pixelated", touchAction: "none" },
            onClick: handleCanvasTap,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ")
                handleCanvasTap(
                  e
                );
            },
            onTouchStart: handleCanvasTap,
            "aria-label": "Passenger service game canvas"
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 flex gap-2 p-3",
            style: {
              background: "rgba(10,14,39,0.92)",
              borderTop: "1px solid #FF149355"
            },
            children: REQUESTS.map((req) => {
              const info = REQUEST_ICONS[req];
              const isSelected = selectedItem === req;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `passenger.${req}_button`,
                  className: "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded border-2 font-mono text-xs font-bold uppercase tracking-wide tap-feedback transition-smooth",
                  style: {
                    borderColor: info.color,
                    background: isSelected ? `${info.color}22` : "rgba(10,14,39,0.8)",
                    color: info.color,
                    boxShadow: isSelected ? `0 0 12px ${info.color}88` : "none",
                    transform: isSelected ? "scale(1.05)" : "scale(1)"
                  },
                  onClick: () => setSelectedItem(isSelected ? null : req),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl leading-none", children: info.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.label })
                  ]
                },
                req
              );
            })
          }
        ),
        shakingSlot !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute pointer-events-none",
            style: {
              left: `${slotCenter(shakingSlot).x / 480 * 100}%`,
              top: `${slotCenter(shakingSlot).y / 800 * 100}%`,
              transform: "translate(-50%,-60%)",
              animation: "shake 0.4s ease",
              fontSize: "20px"
            },
            children: "✗"
          }
        ),
        phase === "win" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "passenger.success_state",
            className: "absolute inset-0 flex flex-col items-center justify-center gap-5 px-8",
            style: { background: "rgba(10,14,39,0.93)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-center",
                  style: {
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#FF1493",
                    textShadow: "0 0 16px #FF1493, 0 0 30px #FF149366",
                    lineHeight: 1.2
                  },
                  children: [
                    "✓ SERVICE",
                    "\n",
                    "COMPLETE!"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-sm text-center",
                  style: { color: "#AAAACC" },
                  children: [
                    "Satisfaction: ",
                    Math.round(satisfaction),
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDisplay, { score: finalScore, label: "SCORE", color: "pink" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-xs text-center",
                  style: { color: "#00FFFF", textShadow: "0 0 6px #00FFFF" },
                  children: "✦ Passengers satisfied"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                NeonButton,
                {
                  variant: "pink",
                  size: "lg",
                  fullWidth: true,
                  "data-ocid": "passenger.continue_button",
                  onClick: () => {
                    if (onContinue) onContinue();
                    else onComplete(finalScore);
                  },
                  children: "► CONTINUE STORY"
                }
              ) })
            ]
          }
        ),
        phase === "lose" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "passenger.error_state",
            className: "absolute inset-0 flex flex-col items-center justify-center gap-5 px-8",
            style: { background: "rgba(10,14,39,0.93)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-center",
                  style: {
                    fontSize: "26px",
                    fontWeight: 900,
                    color: "#FFFF00",
                    textShadow: "0 0 16px #FFFF00",
                    lineHeight: 1.2
                  },
                  children: [
                    "✕ TOO MANY",
                    "\n",
                    "UNHAPPY!"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "font-mono text-sm text-center",
                  style: { color: "#AAAACC" },
                  children: [
                    "Satisfaction: ",
                    Math.round(satisfaction),
                    "%",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "Need ≥70% to pass"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDisplay, { score: finalScore, label: "SCORE", color: "yellow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NeonButton,
                  {
                    variant: "pink",
                    size: "md",
                    fullWidth: true,
                    "data-ocid": "passenger.confirm_button",
                    onClick: handleRetry,
                    children: "↺ RETRY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NeonButton,
                  {
                    variant: "ghost",
                    size: "sm",
                    fullWidth: true,
                    "data-ocid": "passenger.cancel_button",
                    onClick: () => onComplete(Math.round(satisfaction)),
                    children: "✕ QUIT"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes shake {
          0%,100% { transform: translate(-50%,-60%) translateX(0); }
          20%      { transform: translate(-50%,-60%) translateX(-6px); }
          40%      { transform: translate(-50%,-60%) translateX(6px); }
          60%      { transform: translate(-50%,-60%) translateX(-4px); }
          80%      { transform: translate(-50%,-60%) translateX(4px); }
        }
      ` })
      ]
    }
  );
}
const colors = {
  pink: {
    fill: "#FF1493",
    glow: "0 0 8px #FF1493, 0 0 16px #FF149355",
    border: "#FF1493"
  },
  blue: {
    fill: "#00FFFF",
    glow: "0 0 8px #00FFFF, 0 0 16px #00FFFF55",
    border: "#00FFFF"
  },
  yellow: {
    fill: "#FFFF00",
    glow: "0 0 8px #FFFF00, 0 0 16px #FFFF0055",
    border: "#FFFF00"
  }
};
function HealthBar({
  value,
  max = 100,
  label = "STABILITY",
  color = "pink"
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const c = colors[color];
  const dangerColor = pct < 30 ? "#FFFF00" : c.fill;
  const dangerGlow = pct < 30 ? "0 0 8px #FFFF00, 0 0 16px #FFFF0055" : c.glow;
  const hearts = 5;
  const filledHearts = Math.round(pct / 100 * hearts);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "hud.health_bar", className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-mono text-xs font-bold uppercase tracking-widest",
          style: { color: c.border },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: Array.from({ length: hearts }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-base leading-none",
          style: {
            color: i < filledHearts ? dangerColor : "#333366",
            filter: i < filledHearts ? `drop-shadow(${dangerGlow})` : "none"
          },
          children: "♥"
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative h-3 w-full rounded-sm overflow-hidden",
        style: { border: `1px solid ${c.border}`, background: "#0a0e27" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-y-0 left-0 transition-all duration-300 rounded-sm",
              style: {
                width: `${pct}%`,
                background: dangerColor,
                boxShadow: dangerGlow
              }
            }
          ),
          [20, 40, 60, 80].map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-y-0 w-px",
              style: { left: `${seg}%`, background: "#0a0e2799" }
            },
            seg
          ))
        ]
      }
    )
  ] });
}
function drawStormBackground(ctx, frameCount) {
  const grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, "#020510");
  grad.addColorStop(0.4, "#050a1a");
  grad.addColorStop(1, "#0a0e27");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 480, 800);
  const t = frameCount * 0.5;
  ctx.globalAlpha = 0.12;
  for (let layer = 0; layer < 3; layer++) {
    const speed = (layer + 1) * 0.3;
    const yBase = 50 + layer * 80;
    ctx.fillStyle = layer === 0 ? "#6633aa" : layer === 1 ? "#220066" : "#330066";
    for (let c = 0; c < 5; c++) {
      const cx = (c * 137 + layer * 200 + t * speed) % 560 - 40;
      const cy = yBase + Math.sin((c + layer) * 0.8) * 30;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60 + c * 10, 30 + c * 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 30; i++) {
    const sx = (i * 3731 + 17) % 480;
    const sy = (i * 2903 + 11) % 300;
    const alpha = 0.2 + i % 5 * 0.1;
    ctx.globalAlpha = alpha;
    ctx.fillRect(sx, sy, 1, 1);
  }
  ctx.globalAlpha = 1;
  const horizGrad = ctx.createLinearGradient(0, 720, 0, 800);
  horizGrad.addColorStop(0, "rgba(255,20,147,0)");
  horizGrad.addColorStop(1, "rgba(255,20,147,0.15)");
  ctx.fillStyle = horizGrad;
  ctx.fillRect(0, 720, 480, 80);
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
function drawPlane(ctx, plane, planeY) {
  const px = plane.x;
  const py = planeY;
  const isHit = plane.hitFlash > 0;
  const trailGrad = ctx.createLinearGradient(px - 50, py, px - 5, py);
  trailGrad.addColorStop(0, "rgba(255,20,147,0)");
  trailGrad.addColorStop(
    1,
    isHit ? "rgba(255,80,0,0.6)" : "rgba(255,20,147,0.6)"
  );
  ctx.fillStyle = trailGrad;
  ctx.beginPath();
  ctx.ellipse(px - 28, py, 26, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = isHit ? "#FF4400" : "#FF1493";
  ctx.shadowBlur = isHit ? 20 : 12;
  ctx.fillStyle = isHit ? "#FF4400" : "#DDDDEE";
  ctx.beginPath();
  ctx.ellipse(px, py, 34, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isHit ? "#FF6600" : "#00FFFF";
  ctx.beginPath();
  ctx.moveTo(px + 34, py);
  ctx.lineTo(px + 50, py - 3);
  ctx.lineTo(px + 50, py + 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = isHit ? "#FF4400" : "#FF1493";
  ctx.beginPath();
  ctx.moveTo(px - 8, py);
  ctx.lineTo(px + 6, py);
  ctx.lineTo(px + 2, py - 26);
  ctx.lineTo(px - 16, py - 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = isHit ? "#FF4400" : "#FF1493";
  ctx.beginPath();
  ctx.moveTo(px - 8, py);
  ctx.lineTo(px + 6, py);
  ctx.lineTo(px + 2, py + 26);
  ctx.lineTo(px - 16, py + 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = isHit ? "#FF6600" : "#00FFFF";
  ctx.beginPath();
  ctx.moveTo(px - 28, py);
  ctx.lineTo(px - 34, py - 18);
  ctx.lineTo(px - 16, py);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = isHit ? "#FFAA00" : "#AAEEFF";
  ctx.globalAlpha = 0.9;
  for (let w = 0; w < 3; w++) {
    ctx.fillRect(px + 8 + w * 8, py - 3, 5, 6);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}
function drawRaindrop(ctx, o) {
  ctx.shadowColor = o.color;
  ctx.shadowBlur = 4;
  ctx.fillStyle = o.color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(
    o.x + o.w / 2,
    o.y + o.h / 2,
    o.w / 2,
    o.h / 2,
    -0.3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.ellipse(
    o.x + o.w / 2 - 1,
    o.y + 4,
    o.w / 6,
    o.h / 6,
    -0.3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}
function drawLightning(ctx, o) {
  ctx.shadowColor = "#FFFF00";
  ctx.shadowBlur = 16;
  ctx.strokeStyle = "#FFFF00";
  ctx.lineWidth = 3;
  const cx = o.x + o.w / 2;
  const ty = o.y;
  const by = o.y + o.h;
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  ctx.lineTo(cx + 8, ty + o.h * 0.25);
  ctx.lineTo(cx - 6, ty + o.h * 0.45);
  ctx.lineTo(cx + 10, ty + o.h * 0.65);
  ctx.lineTo(cx - 4, ty + o.h * 0.82);
  ctx.lineTo(cx, by);
  ctx.stroke();
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
function drawDebris(ctx, o) {
  ctx.save();
  ctx.translate(o.x + o.w / 2, o.y + o.h / 2);
  ctx.rotate(o.angle ?? 0);
  ctx.shadowColor = o.color;
  ctx.shadowBlur = 8;
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
    [-o.w * 0.5, o.h * 0.1]
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
function drawObstacle(ctx, o) {
  if (o.kind === "raindrop") drawRaindrop(ctx, o);
  else if (o.kind === "lightning") drawLightning(ctx, o);
  else drawDebris(ctx, o);
}
function TurbulenceDodgeGame({
  levelId: _levelId = 0,
  onComplete,
  onQuit
}) {
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const gsRef = reactExports.useRef({
    running: false,
    health: 100,
    score: 0,
    frameCount: 0,
    phase: "playing",
    obstacles: [],
    plane: { x: 240, targetX: 240, hitFlash: 0 },
    nextObstacleId: 0,
    lastSpawnTime: 0,
    spawnInterval: 1e3,
    // 1 per second initially
    difficultyTimer: 0
  });
  const rafRef = reactExports.useRef(0);
  const startTimeRef = reactExports.useRef(0);
  const lastFrameTimeRef = reactExports.useRef(0);
  const [health, setHealth] = reactExports.useState(100);
  const [score, setScore] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(60);
  const [phase, setPhase] = reactExports.useState(
    "playing"
  );
  const GAME_DURATION = 6e4;
  const PLANE_Y = 620;
  const PLANE_HALF_W = 50;
  const PLANE_HALF_H = 28;
  const spawnObstacle = reactExports.useCallback((now, baseSpeed) => {
    const gs = gsRef.current;
    const kinds = [
      "raindrop",
      "raindrop",
      "lightning",
      "debris"
    ];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    let w;
    let h;
    let color;
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
      angle: kind === "debris" ? Math.random() * Math.PI * 2 : 0
    });
    gs.lastSpawnTime = now;
  }, []);
  reactExports.useEffect(() => {
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
    gs.spawnInterval = 1e3;
    gs.difficultyTimer = 0;
    const t0 = performance.now();
    startTimeRef.current = t0;
    lastFrameTimeRef.current = t0;
    const loop = (now) => {
      if (!gs.running) return;
      const dt = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      gs.difficultyTimer += dt;
      if (gs.difficultyTimer >= 15e3) {
        gs.difficultyTimer -= 15e3;
        gs.spawnInterval = Math.max(250, gs.spawnInterval - 175);
      }
      const baseSpeed = 2 + (4 - gs.spawnInterval / 250) * 0.5 + elapsed / 2e4;
      if (now - gs.lastSpawnTime >= gs.spawnInterval) {
        spawnObstacle(now, baseSpeed);
      }
      gs.plane.x += (gs.plane.targetX - gs.plane.x) * 0.12;
      if (gs.plane.hitFlash > 0) gs.plane.hitFlash--;
      let hitThisFrame = false;
      gs.obstacles = gs.obstacles.filter((o) => {
        o.y += o.speed;
        if (o.kind === "debris") o.angle = (o.angle ?? 0) + 0.04;
        const px = gs.plane.x;
        const hitX = px + PLANE_HALF_W - 8 > o.x && px - PLANE_HALF_W + 8 < o.x + o.w;
        const hitY = PLANE_Y + PLANE_HALF_H - 8 > o.y && PLANE_Y - PLANE_HALF_H + 8 < o.y + o.h;
        if (hitX && hitY && !o.scored) {
          hitThisFrame = true;
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
      if (hitThisFrame) {
        gs.health = Math.max(0, gs.health - 20);
        gs.plane.hitFlash = 18;
        setHealth(gs.health);
      }
      gs.frameCount++;
      if (gs.frameCount % 6 === 0) {
        setScore(gs.score);
        setTimeLeft(Math.ceil(remaining / 1e3));
      }
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
      ctx.clearRect(0, 0, 480, 800);
      drawStormBackground(ctx, gs.frameCount);
      if (gs.health < 40) {
        const vAlpha = (1 - gs.health / 40) * 0.25 * (1 + Math.sin(gs.frameCount * 0.15));
        const vGrad = ctx.createRadialGradient(240, 400, 100, 240, 400, 400);
        vGrad.addColorStop(0, "rgba(255,0,0,0)");
        vGrad.addColorStop(1, `rgba(255,0,0,${vAlpha})`);
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, 480, 800);
      }
      for (const o of gs.obstacles) drawObstacle(ctx, o);
      drawPlane(ctx, gs.plane, PLANE_Y);
      if (gs.plane.hitFlash > 0) {
        const flashAlpha = gs.plane.hitFlash / 18 * 0.35;
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
  const handleInteraction = reactExports.useCallback(
    (clientX, containerWidth) => {
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
    []
  );
  const handleTouch = reactExports.useCallback(
    (e) => {
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
    [handleInteraction]
  );
  const handleMouseDown = reactExports.useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      handleInteraction(e.clientX - rect.left, rect.width);
    },
    [handleInteraction]
  );
  reactExports.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const fit = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const aspect = 480 / 800;
      let rw;
      let rh;
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
  const renderOverlay = () => {
    if (phase === "playing") return null;
    const isVictory = phase === "victory";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "turbulence.dialog",
        className: "absolute inset-0 flex flex-col items-center justify-center gap-6 px-8",
        style: {
          background: isVictory ? "rgba(0,10,30,0.88)" : "rgba(20,0,0,0.90)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono font-black text-3xl text-center leading-tight",
              style: {
                color: isVictory ? "#FF1493" : "#FF4400",
                textShadow: `0 0 24px ${isVictory ? "#FF1493" : "#FF4400"}, 0 0 48px ${isVictory ? "#FF149366" : "#FF440066"}`,
                letterSpacing: "0.1em"
              },
              children: isVictory ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "✦ STORM",
                "\n",
                "CLEARED! ✦"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "✕ FLIGHT",
                "\n",
                "ABORTED"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-sm text-center",
              style: { color: isVictory ? "#00FFFF" : "#FFFF00" },
              children: isVictory ? "Carol navigated the storm!" : "The turbulence was too strong…"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDisplay, { score, label: "FINAL SCORE", color: "blue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
            !isVictory && /* @__PURE__ */ jsxRuntimeExports.jsx(
              NeonButton,
              {
                variant: "yellow",
                size: "lg",
                fullWidth: true,
                "data-ocid": "turbulence.confirm_button",
                onClick: () => {
                  const gs = gsRef.current;
                  gs.running = false;
                  cancelAnimationFrame(rafRef.current);
                  setHealth(100);
                  setScore(0);
                  setTimeLeft(60);
                  setPhase("playing");
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
                    gs.spawnInterval = 1e3;
                    gs.difficultyTimer = 0;
                    const t0 = performance.now();
                    startTimeRef.current = t0;
                    lastFrameTimeRef.current = t0;
                    const loopFn = (now) => {
                      if (!gs.running) return;
                      const dt2 = now - lastFrameTimeRef.current;
                      lastFrameTimeRef.current = now;
                      const elapsed2 = now - startTimeRef.current;
                      const remaining2 = Math.max(0, GAME_DURATION - elapsed2);
                      gs.difficultyTimer += dt2;
                      if (gs.difficultyTimer >= 15e3) {
                        gs.difficultyTimer -= 15e3;
                        gs.spawnInterval = Math.max(250, gs.spawnInterval - 175);
                      }
                      const baseSpeed2 = 2 + (4 - gs.spawnInterval / 250) * 0.5 + elapsed2 / 2e4;
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
                        const hx = px2 + PLANE_HALF_W - 8 > o.x && px2 - PLANE_HALF_W + 8 < o.x + o.w;
                        const hy = PLANE_Y + PLANE_HALF_H - 8 > o.y && PLANE_Y - PLANE_HALF_H + 8 < o.y + o.h;
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
                        setTimeLeft(Math.ceil(remaining2 / 1e3));
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
                        const vA = (1 - gs.health / 40) * 0.25 * (1 + Math.sin(gs.frameCount * 0.15));
                        const vG = ctx2.createRadialGradient(
                          240,
                          400,
                          100,
                          240,
                          400,
                          400
                        );
                        vG.addColorStop(0, "rgba(255,0,0,0)");
                        vG.addColorStop(1, `rgba(255,0,0,${vA})`);
                        ctx2.fillStyle = vG;
                        ctx2.fillRect(0, 0, 480, 800);
                      }
                      for (const o of gs.obstacles) drawObstacle(ctx2, o);
                      drawPlane(ctx2, gs.plane, PLANE_Y);
                      if (gs.plane.hitFlash > 0) {
                        const fa = gs.plane.hitFlash / 18 * 0.35;
                        ctx2.fillStyle = `rgba(255,80,0,${fa})`;
                        ctx2.fillRect(0, 0, 480, 800);
                      }
                      rafRef.current = requestAnimationFrame(loopFn);
                    };
                    rafRef.current = requestAnimationFrame(loopFn);
                  }, 16);
                },
                children: "↺ RETRY"
              }
            ),
            isVictory && /* @__PURE__ */ jsxRuntimeExports.jsx(
              NeonButton,
              {
                variant: "pink",
                size: "lg",
                fullWidth: true,
                "data-ocid": "turbulence.confirm_button",
                onClick: () => onComplete(score),
                children: "► CONTINUE STORY"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NeonButton,
              {
                variant: "ghost",
                size: "sm",
                fullWidth: true,
                "data-ocid": "turbulence.cancel_button",
                onClick: onQuit,
                children: "← QUIT TO MAP"
              }
            )
          ] })
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      "data-ocid": "turbulence.canvas_target",
      className: "relative flex-1 flex items-center justify-center w-full",
      style: { background: "#020510", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: 480,
            height: 800,
            style: {
              imageRendering: "pixelated",
              touchAction: "none",
              display: "block"
            },
            onTouchStart: handleTouch,
            onMouseDown: handleMouseDown
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "turbulence.panel",
            className: "absolute top-0 left-0 right-0 pointer-events-none",
            style: {
              padding: "8px 12px",
              background: "linear-gradient(to bottom, rgba(2,5,16,0.85) 0%, rgba(2,5,16,0) 100%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBar, { value: health, max: 100, label: "HULL" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDisplay, { score, label: "SCORE", color: "blue" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "turbulence.loading_state",
                  className: "flex flex-col items-end gap-0.5 font-mono",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-xs font-bold uppercase tracking-widest",
                        style: { color: timeLeft <= 15 ? "#FFFF00" : "#00FFFF" },
                        children: "TIME"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-2xl font-black tabular-nums leading-none",
                        style: {
                          color: timeLeft <= 15 ? "#FFFF00" : "#FF1493",
                          textShadow: `0 0 10px ${timeLeft <= 15 ? "#FFFF00" : "#FF1493"}`
                        },
                        children: String(timeLeft).padStart(2, "0")
                      }
                    )
                  ]
                }
              )
            ] })
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 pointer-events-none flex font-mono text-xs",
            style: {
              paddingBottom: "10px",
              paddingLeft: "12px",
              paddingRight: "12px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 text-left",
                  style: { color: "rgba(0,255,255,0.35)" },
                  children: "◄ TAP LEFT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 text-right",
                  style: { color: "rgba(0,255,255,0.35)" },
                  children: "TAP RIGHT ►"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 bottom-0 pointer-events-none",
            style: {
              left: "50%",
              width: "1px",
              background: "linear-gradient(to bottom, rgba(0,255,255,0) 0%, rgba(0,255,255,0.08) 40%, rgba(0,255,255,0.08) 60%, rgba(0,255,255,0) 100%)"
            }
          }
        ),
        renderOverlay()
      ]
    }
  );
}
function MinigamePage() {
  const { type } = useParams({ from: "/minigame/$type" });
  const navigate = useNavigate();
  const { completeLevel } = useGameStore();
  const [completed, setCompleted] = reactExports.useState(false);
  const [finalScore, setFinalScore] = reactExports.useState(0);
  const parts = type.split("__");
  const minigameType = parts[0];
  const levelId = Number.parseInt(parts[1] ?? "0", 10);
  const level = LEVELS[levelId];
  const handleComplete = reactExports.useCallback(
    (score) => {
      setFinalScore(score);
      setCompleted(true);
      completeLevel(levelId, score);
    },
    [levelId, completeLevel]
  );
  const handleContinue = () => {
    if (level) {
      navigate({ to: "/dialogue/$id", params: { id: level.dialogueAfterId } });
    } else {
      navigate({ to: "/map" });
    }
  };
  const titleMap = {
    turbulence: "TURBULENCE DODGE",
    passenger: "PASSENGER SERVICE",
    emergency: "EMERGENCY PROTOCOL"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "minigame.page", className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-4 py-2 border-b font-mono text-xs",
        style: { borderColor: "#FF149333", background: "rgba(10,14,39,0.95)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "minigame.cancel_button",
              className: "tap-feedback font-mono text-xs",
              style: { color: "#FF1493" },
              onClick: () => navigate({ to: "/map" }),
              children: "← MAP"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00FFFF" }, children: titleMap[minigameType] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#888899" }, children: [
            "LVL ",
            String(levelId + 1).padStart(2, "0")
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col relative", children: !completed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      minigameType === "turbulence" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        TurbulenceDodgeGame,
        {
          onComplete: handleComplete,
          onQuit: () => navigate({ to: "/map" })
        }
      ),
      minigameType === "passenger" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        PassengerServiceGame,
        {
          onComplete: handleComplete,
          onContinue: handleContinue
        }
      ),
      minigameType === "emergency" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmergencyLandingGame,
        {
          onComplete: handleComplete,
          onQuit: () => navigate({ to: "/map" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center flex-1 gap-6 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "font-mono text-3xl font-black uppercase",
          style: {
            color: finalScore >= 50 ? "#FF1493" : "#FFFF00",
            textShadow: `0 0 20px ${finalScore >= 50 ? "#FF1493" : "#FFFF00"}`
          },
          children: finalScore >= 50 ? "MISSION\nCOMPLETE!" : "MISSION\nFAILED"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDisplay, { score: finalScore, label: "FINAL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NeonButton,
          {
            variant: "pink",
            size: "lg",
            fullWidth: true,
            "data-ocid": "minigame.confirm_button",
            onClick: handleContinue,
            children: "► CONTINUE STORY"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NeonButton,
          {
            variant: "ghost",
            size: "sm",
            fullWidth: true,
            "data-ocid": "minigame.secondary_button",
            onClick: () => navigate({ to: "/map" }),
            children: "← BACK TO MAP"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  MinigamePage as default
};
