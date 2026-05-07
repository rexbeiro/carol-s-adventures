import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, d as drawPixelSprite, p as planeSprite, c as carolSprite, a as joshuaSprite } from "./index-B39rMSy_.js";
import { u as useGameStore, N as NeonButton } from "./gameStore-DCN8N4SW.js";
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (i * 479 + 13) % 100,
  size: 2 + i % 3,
  duration: 4 + i % 5,
  delay: i * 0.37 % 4,
  color: i % 3 === 0 ? "#FF1493" : i % 3 === 1 ? "#00FFFF" : "#8800FF"
}));
function StartPage() {
  const navigate = useNavigate();
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const resetGame = useGameStore((s) => s.resetGame);
  const canvasRef = reactExports.useRef(null);
  const animRef = reactExports.useRef(0);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [showResetConfirm, setShowResetConfirm] = reactExports.useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = reactExports.useState(false);
  const [volumeOn, setVolumeOn] = reactExports.useState(true);
  const [fading, setFading] = reactExports.useState(false);
  const hasSave = completedLevels.length > 0 || currentLevel > 0;
  const navigateWithFade = (to, params) => {
    setFading(true);
    setTimeout(() => {
      navigate({ to, ...params ? { params } : {} });
    }, 300);
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, 320, 180);
      const grad = ctx.createLinearGradient(0, 0, 0, 180);
      grad.addColorStop(0, "#0a0e27");
      grad.addColorStop(1, "#1a0a3a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 180);
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 3731 + 7) % 320, (i * 2903 + 3) % 100, 1, 1);
      }
      ctx.strokeStyle = "#FF149322";
      ctx.lineWidth = 1;
      for (let x = 0; x < 320; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 120);
        ctx.lineTo(x, 180);
        ctx.stroke();
      }
      for (let y = 120; y < 180; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(320, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "#FF1493";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 120);
      ctx.lineTo(320, 120);
      ctx.stroke();
      const px = frame * 1.2 % 400 - 60;
      drawPixelSprite(ctx, planeSprite, px, 60, 4);
      const carolBob = Math.sin(frame * 0.1) * 2;
      drawPixelSprite(ctx, carolSprite, 70, 78 + carolBob, 3);
      const jBob = Math.sin(frame * 0.1 + 1) * 2;
      drawPixelSprite(ctx, joshuaSprite, 210, 78 + jBob, 3);
      const heartPulse = 0.9 + Math.sin(frame * 0.08) * 0.15;
      ctx.font = `${Math.round(16 * heartPulse)}px serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF1493";
      ctx.shadowColor = "#FF1493";
      ctx.shadowBlur = 10;
      ctx.fillText("♥", 160, 100);
      ctx.shadowBlur = 0;
      frame++;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "start.page",
      className: "relative flex flex-col items-center min-h-screen px-4 pt-8 pb-6 gap-6 overflow-hidden",
      style: {
        opacity: fading ? 0 : 1,
        transition: "opacity 0.3s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanline pointer-events-none fixed inset-0 z-10 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 z-0 overflow-hidden", children: PARTICLES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute rounded-full",
            style: {
              left: `${p.x}%`,
              bottom: "-8px",
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animation: `floatUp ${p.duration}s ${p.delay}s ease-in infinite`,
              opacity: 0.7
            }
          },
          p.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-xs uppercase tracking-widest mb-2",
              style: { color: "#00FFFF" },
              children: "✈ Akasa Air Presents"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h1",
            {
              className: "font-mono text-3xl font-black uppercase leading-tight",
              style: {
                color: "#FF1493",
                textShadow: "0 0 20px #FF1493, 0 0 40px #FF149366",
                animation: "neon-flicker 6s ease-in-out infinite"
              },
              children: [
                "Carol's",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Adventures"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-xs uppercase tracking-widest mt-2",
              style: { color: "#00FFFF88" },
              children: "A love story across the skies"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative z-20 w-full rounded border-2 overflow-hidden",
            style: { borderColor: "#FF149344", boxShadow: "0 0 20px #FF149322" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: canvasRef,
                width: 320,
                height: 180,
                className: "w-full",
                style: { imageRendering: "pixelated", display: "block" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative z-20 w-full rounded border p-3 font-mono text-xs leading-relaxed",
            style: {
              borderColor: "#00FFFF33",
              background: "rgba(0,255,255,0.04)",
              color: "#CCCCFF"
            },
            children: "Carol is an Akasa Air hostess. Joshua waits in Panama City. Six levels. Three oceans. One reunion. Can you get her home?"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 w-full flex flex-col gap-3 mt-auto", children: [
          hasSave ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NeonButton,
              {
                variant: "pink",
                size: "lg",
                fullWidth: true,
                "data-ocid": "start.primary_button",
                onClick: () => navigateWithFade("/map"),
                children: "► CONTINUE"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NeonButton,
              {
                variant: "blue",
                size: "md",
                fullWidth: true,
                "data-ocid": "start.secondary_button",
                onClick: () => setShowNewGameConfirm(true),
                children: "✦ NEW GAME"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            NeonButton,
            {
              variant: "pink",
              size: "lg",
              fullWidth: true,
              "data-ocid": "start.primary_button",
              onClick: () => navigateWithFade("/dialogue/$id", { id: "intro" }),
              children: "► NEW GAME"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NeonButton,
            {
              variant: "ghost",
              size: "sm",
              fullWidth: true,
              "data-ocid": "start.settings_button",
              onClick: () => setShowSettings(true),
              children: "⚙ SETTINGS"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative z-20 font-mono text-xs text-center",
            style: { color: "#333366" },
            children: [
              "© ",
              (/* @__PURE__ */ new Date()).getFullYear(),
              " Built with love using",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
                  className: "underline",
                  style: { color: "#FF1493" },
                  target: "_blank",
                  rel: "noreferrer",
                  children: "caffeine.ai"
                }
              )
            ]
          }
        ),
        showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "start.dialog",
            className: "fixed inset-0 z-50 flex items-center justify-center p-4",
            style: { background: "rgba(10,14,39,0.92)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-full max-w-xs rounded border-2 p-5 flex flex-col gap-4",
                style: {
                  borderColor: "#00FFFF44",
                  background: "#0d1135",
                  boxShadow: "0 0 30px #00FFFF22"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "font-mono text-sm font-bold uppercase tracking-widest text-center",
                      style: { color: "#00FFFF" },
                      children: "⚙ SETTINGS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-xs uppercase",
                        style: { color: "#AAAACC" },
                        children: "SOUND"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "start.toggle",
                        className: "tap-feedback px-4 py-2 border-2 rounded font-mono text-xs font-bold uppercase tracking-wider transition-smooth",
                        style: {
                          borderColor: volumeOn ? "#00FFFF" : "#333366",
                          color: volumeOn ? "#00FFFF" : "#555577",
                          background: volumeOn ? "rgba(0,255,255,0.08)" : "transparent"
                        },
                        onClick: () => setVolumeOn((v) => !v),
                        children: volumeOn ? "🔊 ON" : "🔇 OFF"
                      }
                    )
                  ] }),
                  hasSave && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs", style: { color: "#888899" }, children: "SAVE DATA" }),
                    !showResetConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonButton,
                      {
                        variant: "ghost",
                        size: "sm",
                        fullWidth: true,
                        "data-ocid": "start.delete_button",
                        onClick: () => setShowResetConfirm(true),
                        children: "✕ DELETE SAVE"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-xs text-center",
                          style: { color: "#FF1493" },
                          children: "Really delete all progress?"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          NeonButton,
                          {
                            variant: "pink",
                            size: "sm",
                            fullWidth: true,
                            "data-ocid": "start.confirm_button",
                            onClick: () => {
                              resetGame();
                              setShowSettings(false);
                              setShowResetConfirm(false);
                            },
                            children: "YES"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          NeonButton,
                          {
                            variant: "blue",
                            size: "sm",
                            fullWidth: true,
                            "data-ocid": "start.cancel_button",
                            onClick: () => setShowResetConfirm(false),
                            children: "NO"
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NeonButton,
                    {
                      variant: "ghost",
                      size: "sm",
                      fullWidth: true,
                      "data-ocid": "start.close_button",
                      onClick: () => {
                        setShowSettings(false);
                        setShowResetConfirm(false);
                      },
                      children: "✕ CLOSE"
                    }
                  )
                ]
              }
            )
          }
        ),
        showNewGameConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "start.modal",
            className: "fixed inset-0 z-50 flex items-center justify-center p-4",
            style: { background: "rgba(10,14,39,0.92)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-full max-w-xs rounded border-2 p-5 flex flex-col gap-4",
                style: {
                  borderColor: "#FF149344",
                  background: "#0d1135",
                  boxShadow: "0 0 30px #FF149322"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "font-mono text-sm font-bold uppercase tracking-widest text-center",
                      style: { color: "#FF1493" },
                      children: "START OVER?"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-xs text-center",
                      style: { color: "#CCCCFF" },
                      children: "Your current save will be lost."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonButton,
                      {
                        variant: "pink",
                        size: "sm",
                        fullWidth: true,
                        "data-ocid": "start.confirm_button",
                        onClick: () => {
                          resetGame();
                          setShowNewGameConfirm(false);
                          navigateWithFade("/dialogue/$id", { id: "intro" });
                        },
                        children: "YES"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonButton,
                      {
                        variant: "blue",
                        size: "sm",
                        fullWidth: true,
                        "data-ocid": "start.cancel_button",
                        onClick: () => setShowNewGameConfirm(false),
                        children: "NO"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  StartPage as default
};
