interface ScoreDisplayProps {
  score: number;
  label?: string;
  color?: "blue" | "pink" | "yellow";
}

const colorMap = {
  blue: {
    text: "#00FFFF",
    glow: "0 0 8px #00FFFF, 0 0 20px #00FFFF44",
    border: "#00FFFF",
  },
  pink: {
    text: "#FF1493",
    glow: "0 0 8px #FF1493, 0 0 20px #FF149344",
    border: "#FF1493",
  },
  yellow: {
    text: "#FFFF00",
    glow: "0 0 8px #FFFF00, 0 0 20px #FFFF0044",
    border: "#FFFF00",
  },
};

export function ScoreDisplay({
  score,
  label = "SCORE",
  color = "blue",
}: ScoreDisplayProps) {
  const c = colorMap[color];
  const formatted = String(score).padStart(6, "0");

  return (
    <div
      data-ocid="hud.score_display"
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border font-mono"
      style={{
        borderColor: c.border,
        background: "rgba(10,14,39,0.8)",
        boxShadow: c.glow,
      }}
    >
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: c.text }}
      >
        {label}:
      </span>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: c.text, textShadow: c.glow }}
      >
        {formatted}
      </span>
    </div>
  );
}
