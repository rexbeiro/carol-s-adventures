import { useNavigate, useParams } from "@tanstack/react-router";
import { NeonButton } from "../components/NeonButton";
import { useGameStore } from "../store/gameStore";
import { LEVELS } from "./MapPage";

const BG_COLORS: Record<number, [string, string]> = {
  0: ["#0a0e27", "#1a0a3a"],
  1: ["#0a1a0a", "#1a2a1a"],
  2: ["#050a1a", "#0a1530"],
  3: ["#020408", "#0a0a1a"],
  4: ["#1a0505", "#0a0e27"],
  5: ["#0a0e27", "#1a0a2a"],
};

const LEVEL_EMOJIS = ["✈", "🌙", "⛈", "📞", "🚨", "❤"];
const LEVEL_ACCENT = [
  "#00FFFF",
  "#00FFFF",
  "#8844FF",
  "#00FFFF",
  "#FF4422",
  "#FF1493",
];

const ATMOSPHERIC: Record<number, string> = {
  0: "Pre-dawn. Kolkata airport is electric with departure energy. Carol's journey of a lifetime begins here.",
  1: "Dubai glitters like a circuit board at midnight. Thirty-eight passengers to serve before the transatlantic crossing.",
  2: "Category-3 turbulence over the North Atlantic. The storm doesn't care about your schedule.",
  3: "Midnight. The cabin is asleep. A satellite signal connects two hearts across 35,000 feet of sky.",
  4: "Hydraulic pressure failure over Caribbean airspace. Forty-two lives. One chance.",
  5: "Panama City. Final approach. He's waiting at Arrivals with a handwritten sign. Just land the plane.",
};

export default function LevelPage() {
  const { id } = useParams({ from: "/level/$id" });
  const navigate = useNavigate();
  const { completedLevels, scores } = useGameStore();

  const levelId = Number.parseInt(id, 10);
  const level = LEVELS[levelId];

  if (!level) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="font-mono text-sm" style={{ color: "#FF1493" }}>
          Level not found.
        </p>
        <NeonButton variant="pink" onClick={() => navigate({ to: "/map" })}>
          ← MAP
        </NeonButton>
      </div>
    );
  }

  const isCompleted = completedLevels.includes(levelId);
  const levelScore = scores.find((s) => s.levelIndex === levelId);
  const [bgTop, bgBottom] = BG_COLORS[levelId] ?? BG_COLORS[0];
  const accent = LEVEL_ACCENT[levelId] ?? "#00FFFF";
  const emoji = LEVEL_EMOJIS[levelId] ?? "✈";

  const minigameLabel =
    level.minigameType === "turbulence"
      ? "TURBULENCE DODGE"
      : level.minigameType === "passenger"
        ? "PASSENGER SERVICE"
        : "EMERGENCY LANDING";

  return (
    <div
      data-ocid="level.page"
      className="flex flex-col min-h-screen px-4 pt-8 pb-6 gap-5"
      style={{
        background: `linear-gradient(180deg, ${bgTop} 0%, ${bgBottom} 100%)`,
      }}
    >
      {/* Level badge */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded border font-mono text-xs uppercase tracking-widest mb-3"
          style={{
            borderColor: `${accent}44`,
            color: `${accent}88`,
            background: "rgba(10,14,39,0.6)",
          }}
        >
          <span>{emoji}</span>
          <span>LEVEL {String(levelId + 1).padStart(2, "0")}</span>
        </div>
        <h2
          className="font-mono text-2xl font-black uppercase leading-tight"
          style={{
            color: "#FF1493",
            textShadow: "0 0 16px #FF1493, 0 0 30px #FF149366",
          }}
        >
          {level.name}
        </h2>
        <p className="font-mono text-xs mt-1" style={{ color: "#AAAACC" }}>
          {level.location}
        </p>
        <p
          className="font-mono text-xs mt-3 px-2 leading-relaxed"
          style={{ color: "#888899" }}
        >
          {ATMOSPHERIC[levelId]}
        </p>
      </div>

      {/* Mission card */}
      <div
        className="rounded border-2 p-4 flex flex-col gap-3"
        style={{
          borderColor: `${accent}33`,
          background: "rgba(10,14,39,0.88)",
          boxShadow: `0 0 20px ${accent}18`,
        }}
      >
        <div
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: `${accent}77` }}
        >
          MISSION BRIEF
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs uppercase tracking-wide"
            style={{ color: `${accent}88` }}
          >
            MINI-GAME:
          </span>
          <span
            className="font-mono text-xs font-bold"
            style={{ color: accent }}
          >
            {minigameLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs uppercase tracking-wide"
            style={{ color: `${accent}88` }}
          >
            OBJECTIVE:
          </span>
          <span className="font-mono text-xs" style={{ color: "#CCCCFF" }}>
            {level.subtitle}
          </span>
        </div>

        {/* Score summary on completion */}
        {isCompleted && levelScore && (
          <div
            className="mt-1 pt-3 border-t flex flex-col gap-2"
            style={{ borderColor: "#FF149322" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-xs uppercase tracking-wide"
                style={{ color: "#FF149388" }}
              >
                STATUS:
              </span>
              <span
                className="font-mono text-xs font-bold"
                style={{ color: "#FF1493", textShadow: "0 0 8px #FF1493" }}
              >
                ✓ CHECKPOINT SAVED
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-xs uppercase tracking-wide"
                style={{ color: "#FF149388" }}
              >
                SCORE:
              </span>
              <span
                className="font-mono text-xs font-bold"
                style={{ color: "#FFFF00" }}
              >
                {levelScore.minigameScore} PTS
                {levelScore.passed ? " — PASSED" : " — RETRY?"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <NeonButton
          variant="pink"
          size="lg"
          fullWidth
          data-ocid="level.primary_button"
          onClick={() =>
            navigate({
              to: "/dialogue/$id",
              params: { id: level.dialogueBeforeId },
            })
          }
        >
          ► {isCompleted ? "REPLAY" : "BEGIN MISSION"}
        </NeonButton>

        {isCompleted && (
          <NeonButton
            variant="blue"
            size="md"
            fullWidth
            data-ocid="level.secondary_button"
            onClick={() =>
              navigate({
                to: "/minigame/$type",
                params: { type: `${level.minigameType}__${levelId}` },
              })
            }
          >
            ⚡ JUMP TO MINI-GAME
          </NeonButton>
        )}

        <NeonButton
          variant="ghost"
          size="sm"
          fullWidth
          data-ocid="level.cancel_button"
          onClick={() => navigate({ to: "/map" })}
        >
          ← BACK TO MAP
        </NeonButton>
      </div>
    </div>
  );
}
