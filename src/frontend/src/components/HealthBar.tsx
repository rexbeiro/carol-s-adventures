interface HealthBarProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  color?: "pink" | "blue" | "yellow";
}

const colors = {
  pink: {
    fill: "#FF1493",
    glow: "0 0 8px #FF1493, 0 0 16px #FF149355",
    border: "#FF1493",
  },
  blue: {
    fill: "#00FFFF",
    glow: "0 0 8px #00FFFF, 0 0 16px #00FFFF55",
    border: "#00FFFF",
  },
  yellow: {
    fill: "#FFFF00",
    glow: "0 0 8px #FFFF00, 0 0 16px #FFFF0055",
    border: "#FFFF00",
  },
};

export function HealthBar({
  value,
  max = 100,
  label = "STABILITY",
  color = "pink",
}: HealthBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const c = colors[color];
  const dangerColor = pct < 30 ? "#FFFF00" : c.fill;
  const dangerGlow = pct < 30 ? "0 0 8px #FFFF00, 0 0 16px #FFFF0055" : c.glow;

  // Hearts: show up to 5 filled/empty
  const hearts = 5;
  const filledHearts = Math.round((pct / 100) * hearts);

  return (
    <div data-ocid="hud.health_bar" className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-xs font-bold uppercase tracking-widest"
          style={{ color: c.border }}
        >
          {label}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: hearts }, (_, i) => i).map((i) => (
            <span
              key={i}
              className="text-base leading-none"
              style={{
                color: i < filledHearts ? dangerColor : "#333366",
                filter:
                  i < filledHearts ? `drop-shadow(${dangerGlow})` : "none",
              }}
            >
              ♥
            </span>
          ))}
        </div>
      </div>
      <div
        className="relative h-3 w-full rounded-sm overflow-hidden"
        style={{ border: `1px solid ${c.border}`, background: "#0a0e27" }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300 rounded-sm"
          style={{
            width: `${pct}%`,
            background: dangerColor,
            boxShadow: dangerGlow,
          }}
        />
        {/* Segment lines */}
        {[20, 40, 60, 80].map((seg) => (
          <div
            key={seg}
            className="absolute inset-y-0 w-px"
            style={{ left: `${seg}%`, background: "#0a0e2799" }}
          />
        ))}
      </div>
    </div>
  );
}
