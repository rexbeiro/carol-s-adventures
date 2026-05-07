import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  showScanlines?: boolean;
}

export function Layout({ children, showScanlines = true }: LayoutProps) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#0a0e27" }}
    >
      {/* Neon background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.56 0.26 330 / 0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.91 0.26 200 / 0.10) 0%, transparent 60%)",
        }}
      />

      {/* Scanline overlay */}
      {showScanlines && (
        <div className="absolute inset-0 pointer-events-none z-10 scanline opacity-40" />
      )}

      {/* Main content — portrait-locked max-width for mobile feel */}
      <div className="relative z-20 flex flex-col items-center min-h-screen w-full">
        <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
