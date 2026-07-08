function FloatingSparkles({ colors = ["#ffffff", "#ffc93c", "#ff5d8f", "#38b6ff"] }) {
  const sparkles = [
    { x: 90, y: 140, size: 14, color: colors[0], delay: "0s" },
    { x: 340, y: 70, size: 10, color: colors[1], delay: "0.6s" },
    { x: 760, y: 120, size: 12, color: colors[2], delay: "1s" },
    { x: 1140, y: 90, size: 9, color: colors[3], delay: "1.4s" },
    { x: 1460, y: 150, size: 13, color: colors[1], delay: "1.8s" },
  ];

  return sparkles.map((sparkle, index) => (
    <div
      key={index}
      className="absolute animate-glow-pulse rounded-full"
      style={{
        left: `${sparkle.x}px`,
        top: `${sparkle.y}px`,
        width: `${sparkle.size}px`,
        height: `${sparkle.size}px`,
        background: sparkle.color,
        opacity: 0.6,
        animationDelay: sparkle.delay,
        boxShadow: `0 0 18px ${sparkle.color}`,
      }}
    />
  ));
}

function SceneBackdrop({ variant }) {
  const palettes = {
    home: {
      top: "#dff4ff",
      middle: "#bfe7ff",
      ground: "#ffe2a7",
      blobA: "rgba(255,255,255,0.62)",
      blobB: "rgba(255,201,60,0.18)",
      blobC: "rgba(56,182,255,0.16)",
    },
    mission: {
      top: "#fff1c7",
      middle: "#ffd78d",
      ground: "#7ad271",
      blobA: "rgba(255,255,255,0.55)",
      blobB: "rgba(255,107,87,0.16)",
      blobC: "rgba(255,201,60,0.18)",
    },
    market: {
      top: "#ffe8bb",
      middle: "#ffc979",
      ground: "#ffdca8",
      blobA: "rgba(255,255,255,0.45)",
      blobB: "rgba(255,93,143,0.12)",
      blobC: "rgba(76,194,106,0.16)",
    },
    checkout: {
      top: "#ffe8df",
      middle: "#ffc7b3",
      ground: "#f9d0bf",
      blobA: "rgba(255,255,255,0.48)",
      blobB: "rgba(255,201,60,0.12)",
      blobC: "rgba(56,182,255,0.12)",
    },
    result: {
      top: "#e6ffd8",
      middle: "#c4f0a5",
      ground: "#e8f7d8",
      blobA: "rgba(255,255,255,0.58)",
      blobB: "rgba(255,93,143,0.14)",
      blobC: "rgba(255,201,60,0.15)",
    },
  };

  const palette = palettes[variant] ?? palettes.home;

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 12%, ${palette.blobA} 0%, transparent 18%), radial-gradient(circle at 82% 18%, ${palette.blobB} 0%, transparent 16%), radial-gradient(circle at 55% 34%, ${palette.blobC} 0%, transparent 20%), linear-gradient(180deg, ${palette.top} 0%, ${palette.middle} 58%, ${palette.ground} 100%)`,
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`dots-${variant}`} width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="4" fill="#ffffff" opacity="0.35" />
            <circle cx="88" cy="46" r="3" fill="#ffffff" opacity="0.28" />
            <circle cx="62" cy="96" r="5" fill="#ffffff" opacity="0.22" />
          </pattern>
        </defs>
        <rect width="1600" height="1000" fill={`url(#dots-${variant})`} />
      </svg>
      <svg className="absolute inset-x-0 bottom-[8%] h-24 w-full opacity-55 sm:h-28" viewBox="0 0 1600 180" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,120 C170,90 330,150 520,120 C700,90 900,152 1110,112 C1310,76 1470,132 1600,102"
          fill="none"
          stroke="#fff9ef"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M0,122 C170,92 330,152 520,122 C700,92 900,154 1110,114 C1310,78 1470,134 1600,104"
          fill="none"
          stroke="#d6c18c"
          strokeWidth="5"
          strokeOpacity="0.35"
          strokeDasharray="10 14"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-white/18 blur-3xl" />
      <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-white/14 blur-3xl" />
      <FloatingSparkles />
    </>
  );
}

function MissionScene() {
  return (
    <>
      <svg
        className="absolute inset-x-0 top-0 h-28 w-full sm:h-36"
        viewBox="0 0 1600 240"
        preserveAspectRatio="xMidYMin meet"
        aria-hidden="true"
      >
        <g fill="#ffffff" opacity="0.88">
          <ellipse cx="160" cy="86" rx="76" ry="32" />
          <ellipse cx="222" cy="68" rx="54" ry="26" />
          <ellipse cx="96" cy="78" rx="48" ry="22" />
        </g>
        <g fill="#ffffff" opacity="0.72">
          <ellipse cx="1220" cy="60" rx="66" ry="26" />
          <ellipse cx="1276" cy="48" rx="42" ry="20" />
        </g>
        <circle cx="1410" cy="94" r="78" fill="#ffc93c" opacity="0.18" />
        <circle cx="1410" cy="94" r="48" fill="#ffc93c" />
      </svg>

      <svg className="absolute inset-x-0 bottom-0 h-44 w-full sm:h-56" viewBox="0 0 1600 320" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,160 C220,110 380,206 610,150 C820,102 980,198 1210,142 C1380,104 1510,138 1600,126 L1600,320 L0,320 Z" fill="#c8f0a4" />
        <path d="M0,220 C220,180 402,242 622,208 C842,172 1034,240 1240,192 C1404,154 1514,194 1600,180 L1600,320 L0,320 Z" fill="#72cf6a" />
        <path d="M0,258 C200,232 420,292 640,256 C840,222 1020,290 1232,244 C1416,210 1528,232 1600,226 L1600,320 L0,320 Z" fill="#4ab85d" opacity="0.9" />
      </svg>
    </>
  );
}

function MarketScene() {
  const flagColors = ["#ff6b57", "#ffc93c", "#38b6ff", "#4cc26a", "#ff5d8f", "#ffc93c", "#ff6b57", "#38b6ff"];
  const stalls = [
    { x: 60, color: "#ff6b57" },
    { x: 360, color: "#38b6ff" },
    { x: 660, color: "#4cc26a" },
    { x: 960, color: "#ff5d8f" },
    { x: 1260, color: "#ffc93c" },
  ];

  return (
    <>
      <svg className="absolute inset-x-0 top-0 h-20 w-full sm:h-24" viewBox="0 0 1600 120" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="18" x2="1600" y2="18" stroke="#24225a" strokeOpacity="0.18" strokeWidth="3" />
        {flagColors.map((color, i) => {
          const x = 70 + i * 186;
          return <path key={i} d={`M${x - 28},18 L${x + 28},18 L${x},82 Z`} fill={color} opacity="0.9" />;
        })}
      </svg>

      <svg className="absolute inset-x-0 bottom-0 h-44 w-full sm:h-52" viewBox="0 0 1600 300" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="236" width="1600" height="64" fill="#f6d9a8" opacity="0.62" />
        {stalls.map((stall, i) => (
          <g key={i} opacity="0.98">
            <rect x={stall.x} y="178" width="214" height="94" rx="14" fill="#fff9ef" />
            <path d={`M${stall.x - 18},178 L${stall.x + 232},178 L${stall.x + 214},114 L${stall.x},114 Z`} fill={stall.color} />
            <rect x={stall.x} y="114" width="214" height="16" fill="#ffffff" opacity="0.36" />
            <rect x={stall.x + 84} y="206" width="48" height="66" rx="8" fill={stall.color} opacity="0.12" />
          </g>
        ))}
      </svg>
    </>
  );
}

function CheckoutScene() {
  return (
    <>
      <svg className="absolute inset-x-0 top-0 h-20 w-full sm:h-24" viewBox="0 0 1600 120" preserveAspectRatio="none" aria-hidden="true">
        <g fill="#ffffff" opacity="0.68">
          <path d="M120,44 l10,-26 l10,26 l-10,-9 Z" />
          <path d="M480,64 l9,-24 l9,24 l-9,-8 Z" />
          <path d="M980,38 l10,-26 l10,26 l-10,-9 Z" />
          <path d="M1380,58 l9,-24 l9,24 l-9,-8 Z" />
        </g>
      </svg>

      <svg className="absolute inset-x-0 bottom-0 h-44 w-full sm:h-52" viewBox="0 0 1600 320" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="checkoutAwning" width="80" height="60" patternUnits="userSpaceOnUse" patternTransform="skewX(-12)">
            <rect width="40" height="60" fill="#ff5d8f" />
            <rect x="40" width="40" height="60" fill="#ffffff" />
          </pattern>
        </defs>
        <rect x="0" y="248" width="1600" height="72" fill="#f6c9b8" opacity="0.58" />
        <path d="M420,166 L1180,166 L1156,96 L444,96 Z" fill="url(#checkoutAwning)" />
        <rect x="466" y="166" width="668" height="114" rx="16" fill="#fffaf4" opacity="0.96" />
        <rect x="742" y="194" width="116" height="62" rx="10" fill="#24225a" opacity="0.12" />
        <circle cx="800" cy="208" r="8" fill="#ffc93c" />
      </svg>
    </>
  );
}

function HomeScene() {
  const flagColors = ["#ff6b57", "#ffc93c", "#38b6ff", "#4cc26a", "#ff5d8f", "#ffc93c", "#ff6b57", "#38b6ff", "#4cc26a", "#38b6ff"];

  return (
    <>
      <svg
        className="absolute inset-x-0 top-0 h-32 w-full sm:h-40"
        viewBox="0 0 1600 240"
        preserveAspectRatio="xMidYMin meet"
        aria-hidden="true"
      >
        <g fill="#ffffff" opacity="0.86">
          <ellipse cx="150" cy="84" rx="72" ry="30" />
          <ellipse cx="206" cy="66" rx="54" ry="24" />
        </g>
        <g fill="#ffffff" opacity="0.78">
          <ellipse cx="1244" cy="62" rx="62" ry="26" />
          <ellipse cx="1298" cy="48" rx="42" ry="20" />
        </g>
        <circle cx="800" cy="74" r="76" fill="#ffc93c" opacity="0.22" />
        <circle cx="800" cy="74" r="48" fill="#ffc93c" />

        <line x1="0" y1="140" x2="1600" y2="140" stroke="#24225a" strokeOpacity="0.15" strokeWidth="3" />
        {flagColors.map((color, i) => {
          const x = 56 + i * 158;
          return <path key={i} d={`M${x - 24},140 L${x + 24},140 L${x},192 Z`} fill={color} opacity="0.88" />;
        })}
      </svg>

      <svg className="absolute inset-x-0 bottom-0 h-24 w-full sm:h-32" viewBox="0 0 1600 190" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,72 C220,42 380,96 600,68 C820,42 1000,88 1220,62 C1400,44 1520,68 1600,62 L1600,190 L0,190 Z" fill="#f6d9a8" opacity="0.82" />
      </svg>
    </>
  );
}

function ResultScene() {
  return (
    <>
      <svg className="absolute inset-x-0 top-0 h-28 w-full sm:h-36" viewBox="0 0 1600 220" preserveAspectRatio="none" aria-hidden="true">
        <g fill="#ffffff" opacity="0.78">
          <ellipse cx="190" cy="64" rx="68" ry="28" />
          <ellipse cx="246" cy="50" rx="48" ry="22" />
          <ellipse cx="1320" cy="82" rx="74" ry="30" />
          <ellipse cx="1384" cy="66" rx="54" ry="24" />
        </g>
        <circle cx="812" cy="84" r="84" fill="#ffffff" opacity="0.18" />
        <circle cx="812" cy="84" r="42" fill="#ffc93c" opacity="0.35" />
      </svg>

      <svg className="absolute inset-x-0 bottom-0 h-44 w-full sm:h-52" viewBox="0 0 1600 320" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,220 C180,184 390,258 626,208 C846,164 1016,246 1226,194 C1406,150 1526,182 1600,172 L1600,320 L0,320 Z" fill="#dff3bf" />
        <path d="M0,252 C216,226 404,286 622,248 C852,206 1052,282 1254,232 C1414,194 1524,214 1600,208 L1600,320 L0,320 Z" fill="#b5e67f" opacity="0.75" />
      </svg>
    </>
  );
}

const scenes = {
  home: HomeScene,
  mission: MissionScene,
  market: MarketScene,
  checkout: CheckoutScene,
  result: ResultScene,
};

export function SceneDecorations({ variant }) {
  const Scene = scenes[variant];

  if (!Scene) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <SceneBackdrop variant={variant} />
      <Scene />
    </div>
  );
}
