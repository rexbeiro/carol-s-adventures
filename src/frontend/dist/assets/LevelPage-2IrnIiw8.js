import { b as useParams, u as useNavigate, j as jsxRuntimeExports } from "./index-B39rMSy_.js";
import { u as useGameStore, N as NeonButton } from "./gameStore-DCN8N4SW.js";
import { LEVELS } from "./MapPage-B7ZhEgd8.js";
const BG_COLORS = {
  0: ["#0a0e27", "#1a0a3a"],
  1: ["#0a1a0a", "#1a2a1a"],
  2: ["#050a1a", "#0a1530"],
  3: ["#020408", "#0a0a1a"],
  4: ["#1a0505", "#0a0e27"],
  5: ["#0a0e27", "#1a0a2a"]
};
const LEVEL_EMOJIS = ["✈", "🌙", "⛈", "📞", "🚨", "❤"];
const LEVEL_ACCENT = [
  "#00FFFF",
  "#00FFFF",
  "#8844FF",
  "#00FFFF",
  "#FF4422",
  "#FF1493"
];
const ATMOSPHERIC = {
  0: "Pre-dawn. Kolkata airport is electric with departure energy. Carol's journey of a lifetime begins here.",
  1: "Dubai glitters like a circuit board at midnight. Thirty-eight passengers to serve before the transatlantic crossing.",
  2: "Category-3 turbulence over the North Atlantic. The storm doesn't care about your schedule.",
  3: "Midnight. The cabin is asleep. A satellite signal connects two hearts across 35,000 feet of sky.",
  4: "Hydraulic pressure failure over Caribbean airspace. Forty-two lives. One chance.",
  5: "Panama City. Final approach. He's waiting at Arrivals with a handwritten sign. Just land the plane."
};
function LevelPage() {
  const { id } = useParams({ from: "/level/$id" });
  const navigate = useNavigate();
  const { completedLevels, scores } = useGameStore();
  const levelId = Number.parseInt(id, 10);
  const level = LEVELS[levelId];
  if (!level) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm", style: { color: "#FF1493" }, children: "Level not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NeonButton, { variant: "pink", onClick: () => navigate({ to: "/map" }), children: "← MAP" })
    ] });
  }
  const isCompleted = completedLevels.includes(levelId);
  const levelScore = scores.find((s) => s.levelIndex === levelId);
  const [bgTop, bgBottom] = BG_COLORS[levelId] ?? BG_COLORS[0];
  const accent = LEVEL_ACCENT[levelId] ?? "#00FFFF";
  const emoji = LEVEL_EMOJIS[levelId] ?? "✈";
  const minigameLabel = level.minigameType === "turbulence" ? "TURBULENCE DODGE" : level.minigameType === "passenger" ? "PASSENGER SERVICE" : "EMERGENCY LANDING";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "level.page",
      className: "flex flex-col min-h-screen px-4 pt-8 pb-6 gap-5",
      style: {
        background: `linear-gradient(180deg, ${bgTop} 0%, ${bgBottom} 100%)`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "inline-flex items-center gap-2 px-3 py-1 rounded border font-mono text-xs uppercase tracking-widest mb-3",
              style: {
                borderColor: `${accent}44`,
                color: `${accent}88`,
                background: "rgba(10,14,39,0.6)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "LEVEL ",
                  String(levelId + 1).padStart(2, "0")
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-mono text-2xl font-black uppercase leading-tight",
              style: {
                color: "#FF1493",
                textShadow: "0 0 16px #FF1493, 0 0 30px #FF149366"
              },
              children: level.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs mt-1", style: { color: "#AAAACC" }, children: level.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-xs mt-3 px-2 leading-relaxed",
              style: { color: "#888899" },
              children: ATMOSPHERIC[levelId]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded border-2 p-4 flex flex-col gap-3",
            style: {
              borderColor: `${accent}33`,
              background: "rgba(10,14,39,0.88)",
              boxShadow: `0 0 20px ${accent}18`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-xs uppercase tracking-widest",
                  style: { color: `${accent}77` },
                  children: "MISSION BRIEF"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-xs uppercase tracking-wide",
                    style: { color: `${accent}88` },
                    children: "MINI-GAME:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-xs font-bold",
                    style: { color: accent },
                    children: minigameLabel
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-xs uppercase tracking-wide",
                    style: { color: `${accent}88` },
                    children: "OBJECTIVE:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", style: { color: "#CCCCFF" }, children: level.subtitle })
              ] }),
              isCompleted && levelScore && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-1 pt-3 border-t flex flex-col gap-2",
                  style: { borderColor: "#FF149322" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-xs uppercase tracking-wide",
                          style: { color: "#FF149388" },
                          children: "STATUS:"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-xs font-bold",
                          style: { color: "#FF1493", textShadow: "0 0 8px #FF1493" },
                          children: "✓ CHECKPOINT SAVED"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-xs uppercase tracking-wide",
                          style: { color: "#FF149388" },
                          children: "SCORE:"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-xs font-bold",
                          style: { color: "#FFFF00" },
                          children: [
                            levelScore.minigameScore,
                            " PTS",
                            levelScore.passed ? " — PASSED" : " — RETRY?"
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            NeonButton,
            {
              variant: "pink",
              size: "lg",
              fullWidth: true,
              "data-ocid": "level.primary_button",
              onClick: () => navigate({
                to: "/dialogue/$id",
                params: { id: level.dialogueBeforeId }
              }),
              children: [
                "► ",
                isCompleted ? "REPLAY" : "BEGIN MISSION"
              ]
            }
          ),
          isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx(
            NeonButton,
            {
              variant: "blue",
              size: "md",
              fullWidth: true,
              "data-ocid": "level.secondary_button",
              onClick: () => navigate({
                to: "/minigame/$type",
                params: { type: `${level.minigameType}__${levelId}` }
              }),
              children: "⚡ JUMP TO MINI-GAME"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NeonButton,
            {
              variant: "ghost",
              size: "sm",
              fullWidth: true,
              "data-ocid": "level.cancel_button",
              onClick: () => navigate({ to: "/map" }),
              children: "← BACK TO MAP"
            }
          )
        ] })
      ]
    }
  );
}
export {
  LevelPage as default
};
