import { useCallback, useEffect, useState } from "react";
import type { DialogueChoice, DialogueLine } from "../types/game";
import { NeonButton } from "./NeonButton";

interface DialogueBoxProps {
  line: DialogueLine;
  onNext: () => void;
  onChoice?: (choice: DialogueChoice) => void;
  speakerLabel?: string;
}

const TYPEWRITER_SPEED = 28; // ms per char

export function DialogueBox({
  line,
  onNext,
  onChoice,
  speakerLabel,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(line.text.slice(0, i));
      if (i >= line.text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, TYPEWRITER_SPEED);
    return () => clearInterval(interval);
  }, [line.text]);

  const skipOrNext = useCallback(() => {
    if (!done) {
      setDisplayedText(line.text);
      setDone(true);
    } else if (!line.choices?.length) {
      onNext();
    }
  }, [done, line, onNext]);

  const speakerColors: Record<string, string> = {
    carol: "#FF1493",
    joshua: "#00FFFF",
    narrator: "#FFFF00",
    system: "#AAAAAA",
  };
  const speakerColor = speakerColors[line.speaker] ?? "#FFFFFF";
  const name =
    speakerLabel ??
    (line.speaker === "carol"
      ? "Carol"
      : line.speaker === "joshua"
        ? "Joshua"
        : line.speaker === "narrator"
          ? "— Narrator —"
          : "SYSTEM");

  return (
    <button
      type="button"
      data-ocid="dialogue.dialog"
      className="w-full px-3 pb-3 text-left"
      onClick={skipOrNext}
    >
      {/* Outer neon border box */}
      <div
        className="relative border-2 rounded p-3"
        style={{
          borderColor: speakerColor,
          background: "rgba(10,14,39,0.93)",
          boxShadow: `0 0 16px ${speakerColor}55, inset 0 0 12px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Speaker name badge */}
        <div
          className="absolute -top-3 left-4 px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-widest rounded-sm"
          style={{
            color: speakerColor,
            background: "#0a0e27",
            border: `1px solid ${speakerColor}`,
          }}
        >
          {name}
        </div>

        {/* Dialogue text */}
        <p className="font-mono text-sm leading-relaxed text-foreground pt-1 min-h-[56px]">
          {displayedText}
          {!done && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-foreground animate-pulse" />
          )}
        </p>

        {/* Choices */}
        {done && line.choices && line.choices.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {line.choices.map((choice) => (
              <NeonButton
                key={choice.id}
                variant={choice.relationshipDelta > 0 ? "pink" : "blue"}
                size="sm"
                fullWidth
                data-ocid={`dialogue.choice.${choice.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChoice?.(choice);
                }}
              >
                {choice.text}
              </NeonButton>
            ))}
          </div>
        )}

        {/* Continue arrow — show when done and no choices */}
        {done && (!line.choices || line.choices.length === 0) && (
          <div
            className="absolute bottom-2 right-3 font-mono text-xs animate-pulse"
            style={{ color: speakerColor }}
          >
            »
          </div>
        )}
      </div>
    </button>
  );
}
