import { u as useNavigate, j as jsxRuntimeExports } from "./index-B39rMSy_.js";
import { u as useGameStore, N as NeonButton } from "./gameStore-DCN8N4SW.js";
const LEVELS = [
  {
    id: 0,
    name: "KOLKATA",
    location: "Kolkata, India",
    subtitle: "Departure Gate 7 — Pre-dawn",
    minigameType: "turbulence",
    dialogueBeforeId: "kolkata_before",
    dialogueAfterId: "kolkata_after",
    background: "kolkata",
    unlockRequirement: -1
  },
  {
    id: 1,
    name: "DUBAI",
    location: "Dubai, UAE",
    subtitle: "Emirates Terminal — Night Layover",
    minigameType: "passenger",
    dialogueBeforeId: "dubai_before",
    dialogueAfterId: "dubai_after",
    background: "dubai",
    unlockRequirement: 0
  },
  {
    id: 2,
    name: "ATLANTIC",
    location: "Over Atlantic Ocean",
    subtitle: "Storm Zone — High Altitude",
    minigameType: "turbulence",
    dialogueBeforeId: "atlantic_before",
    dialogueAfterId: "atlantic_after",
    background: "atlantic",
    unlockRequirement: 1
  },
  {
    id: 3,
    name: "NIGHT FLIGHT",
    location: "Mid-Atlantic",
    subtitle: "Midnight — Phone Call With Joshua",
    minigameType: "passenger",
    dialogueBeforeId: "night_before",
    dialogueAfterId: "night_after",
    background: "night",
    unlockRequirement: 2
  },
  {
    id: 4,
    name: "EMERGENCY",
    location: "Caribbean Airspace",
    subtitle: "Emergency Descent Protocol",
    minigameType: "emergency",
    dialogueBeforeId: "emergency_before",
    dialogueAfterId: "emergency_after",
    background: "emergency",
    unlockRequirement: 3
  },
  {
    id: 5,
    name: "PANAMA CITY",
    location: "Panama City, Panama",
    subtitle: "Tocumen International — Arrival",
    minigameType: "emergency",
    dialogueBeforeId: "panama_before",
    dialogueAfterId: "ending",
    background: "panama",
    unlockRequirement: 4
  }
];
const NODE_POSITIONS = [
  { x: 82, y: 12 },
  // Kolkata (India, upper right)
  { x: 68, y: 22 },
  // Dubai (Middle East)
  { x: 35, y: 42 },
  // Atlantic (mid ocean)
  { x: 25, y: 50 },
  // Night Flight (mid-Atlantic)
  { x: 18, y: 66 },
  // Emergency (Caribbean)
  { x: 15, y: 78 }
  // Panama City (Central America)
];
const LEVEL_COLORS = [
  "#FF1493",
  "#00FFFF",
  "#8800FF",
  "#00FFFF",
  "#FFAA00",
  "#FF1493"
];
const LEVEL_ICONS = ["✈", "🌙", "⛈", "📞", "🚨", "❤"];
function MapPage() {
  const navigate = useNavigate();
  const { currentLevel, completedLevels, relationshipScore } = useGameStore();
  const handleLevelSelect = (level) => {
    const isUnlocked = level.id <= currentLevel;
    if (!isUnlocked) return;
    navigate({ to: "/level/$id", params: { id: String(level.id) } });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "map.page",
      className: "flex flex-col min-h-screen px-4 pt-6 pb-6 gap-4 relative overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanline pointer-events-none fixed inset-0 z-10 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-mono text-lg font-black uppercase tracking-widest",
              style: { color: "#FF1493", textShadow: "0 0 12px #FF1493" },
              children: "WORLD MAP"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs mt-1", style: { color: "#00FFFF88" }, children: "Carol's Journey — Kolkata to Panama City" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 flex items-center gap-2 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", style: { color: "#FF149388" }, children: "BOND" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 h-2 rounded border",
              style: { borderColor: "#FF149333", background: "#0a0e27" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded transition-all duration-700",
                  style: {
                    width: `${relationshipScore}%`,
                    background: "linear-gradient(90deg, #FF1493, #FF69B4)",
                    boxShadow: "0 0 6px #FF1493"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono text-xs w-8 text-right",
              style: { color: "#FF1493" },
              children: [
                relationshipScore,
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative z-20 w-full rounded border-2 overflow-hidden",
            style: {
              borderColor: "#00FFFF22",
              background: "#06091e",
              boxShadow: "0 0 20px #00FFFF11",
              aspectRatio: "9/10"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                viewBox: "0 0 100 100",
                className: "w-full h-full",
                style: { display: "block" },
                role: "img",
                "aria-label": "World map showing Carol's flight path from Kolkata to Panama City",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M42 10 L55 10 L58 25 L55 45 L48 55 L42 60 L38 50 L36 35 L38 20 Z",
                      fill: "#0d1a3a",
                      stroke: "#1a2550",
                      strokeWidth: "0.5"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M62 8 L90 8 L93 20 L90 30 L82 35 L75 28 L68 32 L64 25 L60 20 Z",
                      fill: "#0d1a3a",
                      stroke: "#1a2550",
                      strokeWidth: "0.5"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M5 25 L22 22 L28 30 L25 50 L22 65 L18 78 L12 80 L8 70 L6 50 L5 35 Z",
                      fill: "#0d1a3a",
                      stroke: "#1a2550",
                      strokeWidth: "0.5"
                    }
                  ),
                  NODE_POSITIONS.slice(0, -1).map((pos, idx) => {
                    const next = NODE_POSITIONS[idx + 1];
                    const isFlown = completedLevels.includes(idx);
                    const isActive = idx === currentLevel - 1;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: pos.x,
                        y1: pos.y,
                        x2: next.x,
                        y2: next.y,
                        stroke: isFlown ? LEVEL_COLORS[idx] : "#1a2550",
                        strokeWidth: isFlown ? "0.8" : "0.5",
                        strokeDasharray: isFlown ? "none" : "2,2",
                        opacity: isActive ? 1 : isFlown ? 0.8 : 0.4,
                        style: isFlown ? {
                          filter: `drop-shadow(0 0 2px ${LEVEL_COLORS[idx]})`
                        } : {}
                      },
                      `seg-${LEVELS[idx].id}-${LEVELS[idx + 1].id}`
                    );
                  }),
                  LEVELS.map((level, idx) => {
                    const pos = NODE_POSITIONS[idx];
                    const isCompleted = completedLevels.includes(level.id);
                    const isUnlocked = level.id <= currentLevel;
                    const isCurrent = level.id === currentLevel;
                    const color = LEVEL_COLORS[idx];
                    const icon = LEVEL_ICONS[idx];
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${pos.x}, ${pos.y})`, children: [
                      isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          r: "6",
                          fill: "none",
                          stroke: color,
                          strokeWidth: "0.8",
                          opacity: "0.6",
                          style: { animation: "svgPulse 2s ease-in-out infinite" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          r: "4",
                          fill: isCompleted ? color : isUnlocked ? "#0d1135" : "#0a0e27",
                          stroke: isUnlocked ? color : "#333366",
                          strokeWidth: isCurrent ? "1" : "0.7",
                          opacity: isUnlocked ? 1 : 0.4,
                          style: isUnlocked ? { filter: `drop-shadow(0 0 3px ${color})` } : {}
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "0",
                          y: "1.5",
                          textAnchor: "middle",
                          fontSize: "3.5",
                          style: { userSelect: "none" },
                          opacity: isUnlocked ? 1 : 0.3,
                          children: isCompleted ? "✓" : !isUnlocked ? "🔒" : icon
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: "0",
                          y: "-5.5",
                          textAnchor: "middle",
                          fontSize: "2.2",
                          fill: isUnlocked ? color : "#333366",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          style: { userSelect: "none" },
                          children: level.name
                        }
                      )
                    ] }, level.id);
                  })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-20 flex flex-col gap-2", children: LEVELS.map((level, idx) => {
          const isCompleted = completedLevels.includes(level.id);
          const isUnlocked = level.id <= currentLevel;
          const isCurrent = level.id === currentLevel;
          const color = LEVEL_COLORS[idx];
          const icon = LEVEL_ICONS[idx];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `map.item.${idx + 1}`,
              className: "relative flex items-center gap-3 px-3 py-2 rounded border tap-feedback text-left w-full",
              style: {
                borderColor: isCompleted ? "#FF1493" : isUnlocked ? color : "#1a2550",
                background: isUnlocked ? "linear-gradient(135deg, rgba(10,14,39,0.98), rgba(10,14,39,0.8))" : "rgba(10,14,39,0.4)",
                opacity: isUnlocked ? 1 : 0.4,
                boxShadow: isCurrent ? `0 0 12px ${color}44` : "none"
              },
              onClick: () => handleLevelSelect(level),
              disabled: !isUnlocked,
              children: [
                isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute left-0 top-0 bottom-0 w-0.5 rounded-l",
                    style: { background: color, boxShadow: `0 0 6px ${color}` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex-shrink-0 w-10 h-10 rounded border flex flex-col items-center justify-center",
                    style: {
                      borderColor: isUnlocked ? color : "#1a2550",
                      background: "#0a0e27"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: isCompleted ? "✓" : !isUnlocked ? "🔒" : icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-xs font-bold leading-none mt-0.5",
                          style: { color: isUnlocked ? color : "#333366" },
                          children: String(idx + 1).padStart(2, "0")
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-sm font-bold uppercase truncate",
                      style: { color: isUnlocked ? color : "#333366" },
                      children: level.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-xs truncate",
                      style: { color: "#8888aa" },
                      children: level.subtitle
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 font-mono text-xs font-bold", children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: { color: "#FF1493", textShadow: "0 0 8px #FF1493" },
                    children: "✓"
                  }
                ) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", style: { color: "#00FFFF" }, children: "► GO" }) : !isUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#333366" }, children: "LOCK" }) : null })
              ]
            },
            level.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-20 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NeonButton,
          {
            variant: "ghost",
            size: "sm",
            fullWidth: true,
            "data-ocid": "map.secondary_button",
            onClick: () => navigate({ to: "/" }),
            children: "← MAIN MENU"
          }
        ) })
      ]
    }
  );
}
export {
  LEVELS,
  MapPage as default
};
