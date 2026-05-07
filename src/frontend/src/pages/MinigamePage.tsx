import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { NeonButton } from "../components/NeonButton";
import { ScoreDisplay } from "../components/ScoreDisplay";
import { EmergencyLandingGame } from "../minigames/EmergencyLandingGame";
import { PassengerServiceGame } from "../minigames/PassengerServiceGame";
import { TurbulenceDodgeGame } from "../minigames/TurbulenceDodgeGame";
import { useGameStore } from "../store/gameStore";
import type { MiniGameType } from "../types/game";
import { LEVELS } from "./MapPage";

// ==================== MAIN MINIGAME PAGE ====================
export default function MinigamePage() {
  const { type } = useParams({ from: "/minigame/$type" });
  const navigate = useNavigate();
  const { completeLevel } = useGameStore();
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const parts = type.split("__");
  const minigameType = parts[0] as MiniGameType;
  const levelId = Number.parseInt(parts[1] ?? "0", 10);
  const level = LEVELS[levelId];

  const handleComplete = useCallback(
    (score: number) => {
      setFinalScore(score);
      setCompleted(true);
      completeLevel(levelId, score);
    },
    [levelId, completeLevel],
  );

  const handleContinue = () => {
    if (level) {
      navigate({ to: "/dialogue/$id", params: { id: level.dialogueAfterId } });
    } else {
      navigate({ to: "/map" });
    }
  };

  const titleMap: Record<MiniGameType, string> = {
    turbulence: "TURBULENCE DODGE",
    passenger: "PASSENGER SERVICE",
    emergency: "EMERGENCY PROTOCOL",
  };

  return (
    <div data-ocid="minigame.page" className="flex flex-col min-h-screen">
      {/* HUD header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b font-mono text-xs"
        style={{ borderColor: "#FF149333", background: "rgba(10,14,39,0.95)" }}
      >
        <button
          type="button"
          data-ocid="minigame.cancel_button"
          className="tap-feedback font-mono text-xs"
          style={{ color: "#FF1493" }}
          onClick={() => navigate({ to: "/map" })}
        >
          ← MAP
        </button>
        <span style={{ color: "#00FFFF" }}>{titleMap[minigameType]}</span>
        <span style={{ color: "#888899" }}>
          LVL {String(levelId + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col relative">
        {!completed ? (
          <>
            {minigameType === "turbulence" && (
              <TurbulenceDodgeGame
                onComplete={handleComplete}
                onQuit={() => navigate({ to: "/map" })}
              />
            )}
            {minigameType === "passenger" && (
              <PassengerServiceGame
                onComplete={handleComplete}
                onContinue={handleContinue}
              />
            )}
            {minigameType === "emergency" && (
              <EmergencyLandingGame
                onComplete={handleComplete}
                onQuit={() => navigate({ to: "/map" })}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
            <div
              className="font-mono text-3xl font-black uppercase"
              style={{
                color: finalScore >= 50 ? "#FF1493" : "#FFFF00",
                textShadow: `0 0 20px ${finalScore >= 50 ? "#FF1493" : "#FFFF00"}`,
              }}
            >
              {finalScore >= 50 ? "MISSION\nCOMPLETE!" : "MISSION\nFAILED"}
            </div>
            <ScoreDisplay score={finalScore} label="FINAL" />
            <div className="flex flex-col gap-3 w-full">
              <NeonButton
                variant="pink"
                size="lg"
                fullWidth
                data-ocid="minigame.confirm_button"
                onClick={handleContinue}
              >
                ► CONTINUE STORY
              </NeonButton>
              <NeonButton
                variant="ghost"
                size="sm"
                fullWidth
                data-ocid="minigame.secondary_button"
                onClick={() => navigate({ to: "/map" })}
              >
                ← BACK TO MAP
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
