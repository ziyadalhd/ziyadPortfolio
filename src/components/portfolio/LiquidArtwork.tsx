import { useId } from "react";

const silhouettes = {
  flow: "M37 86C22 55 50 23 83 32c24 7 30 18 54 7 41-20 82 7 70 45-8 25-34 24-35 53-2 45-48 74-77 45-22-22-26-32-49-44-21-11-26-30-9-52Z",
  loop: "M41 58C75 13 143 14 184 44c47 35 43 108 4 143-42 38-99 19-129-13C28 141 10 100 41 58Zm54 26c-17 15-15 40 0 56 16 18 42 19 56 1 17-21 9-47-10-58-16-10-32-11-46 1Z",
  ribbon:
    "M38 54c21-29 50-27 78-7 22 15 18 36 38 45 20 8 47-4 58 19 20 43-30 90-72 80-27-7-23-32-43-42-24-12-44 7-65-12-23-20-15-55 6-83Z",
  drop: "M123 24c25 27 70 65 76 107 7 45-29 78-71 78-47 0-80-30-77-68 3-45 47-87 72-117Z",
};

export type LiquidShape = keyof typeof silhouettes;

export function LiquidArtwork({ shape }: { shape: LiquidShape }) {
  const id = useId().replaceAll(":", "");
  const path = silhouettes[shape];

  return (
    <svg
      className={`liquid-art liquid-${shape}`}
      viewBox="0 0 240 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38e5f5" />
          <stop offset=".36" stopColor="#7281ff" />
          <stop offset=".7" stopColor="#9b38f5" />
          <stop offset="1" stopColor="#fa6cb4" />
        </linearGradient>
        <radialGradient id={`${id}-light`}>
          <stop stopColor="#d1fff3" />
          <stop offset=".35" stopColor="#44eedb" />
          <stop offset="1" stopColor="#43a2f7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-warm`}>
          <stop stopColor="#fff398" />
          <stop offset=".3" stopColor="#ff9d9f" />
          <stop offset=".68" stopColor="#f263ca" />
          <stop offset="1" stopColor="#f263ca" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efffff" stopOpacity=".85" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#612fe2" stopOpacity=".7" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={path} clipRule="evenodd" />
        </clipPath>
      </defs>
      <path d={path} fill={`url(#${id}-base)`} fillRule="evenodd" />
      <g clipPath={`url(#${id}-clip)`}>
        <g className="liquid-current">
          <ellipse
            cx="60"
            cy="72"
            rx="120"
            ry="130"
            fill={`url(#${id}-light)`}
          />
          <ellipse
            cx="184"
            cy="188"
            rx="128"
            ry="140"
            fill={`url(#${id}-warm)`}
          />
        </g>
        <g className="liquid-shift">
          <ellipse
            cx="150"
            cy="58"
            rx="150"
            ry="112"
            fill={`url(#${id}-warm)`}
          />
          <ellipse
            cx="85"
            cy="200"
            rx="145"
            ry="130"
            fill={`url(#${id}-light)`}
          />
        </g>
      </g>
      <path
        d={path}
        fill="none"
        fillRule="evenodd"
        stroke={`url(#${id}-edge)`}
        strokeWidth="2"
      />
    </svg>
  );
}
