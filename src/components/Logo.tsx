import React from "react";

/**
 * MUHAFIZ AI brand mark — a shield built from a hexagonal "M" monogram.
 * Rendered as inline SVG so it stays crisp at any size and can be recolored via CSS.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="muhafizShield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="muhafizM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 L44 10 V22 C44 33.5 36 41.5 24 46 C12 41.5 4 33.5 4 22 V10 Z"
        fill="url(#muhafizShield)"
      />
      <path
        d="M24 2 L44 10 V22 C44 33.5 36 41.5 24 46 C12 41.5 4 33.5 4 22 V10 Z"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />
      <path
        d="M15 32 V17.5 L24 27 L33 17.5 V32"
        fill="none"
        stroke="url(#muhafizM)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({
  size = "md",
  showTagline = false,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const markSize = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-2.5">
      <LogoMark className={`${markSize} shrink-0 drop-shadow-sm`} />
      <div className="leading-none">
        <span className={`font-display font-bold text-slate-800 tracking-wide ${textSize}`}>
          MUHAFIZ <span className="gradient-text">AI</span>
        </span>
        {showTagline && <p className="text-xs text-slate-400 mt-1">Developer Security Platform</p>}
      </div>
    </div>
  );
}
