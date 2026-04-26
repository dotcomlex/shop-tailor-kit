export function GuaranteeBlock() {
  return (
    <div className="flex items-start gap-4">
      {/* Starburst medallion (pure SVG) */}
      <div className="relative h-[78px] w-[78px] shrink-0 drop-shadow-md">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="gbg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="hsl(0 100% 55%)" />
              <stop offset="100%" stopColor="hsl(0 100% 35%)" />
            </radialGradient>
          </defs>
          {/* starburst — 16 points */}
          <g transform="translate(50 50)">
            {Array.from({ length: 16 }).map((_, i) => (
              <rect
                key={i}
                x="-3"
                y="-50"
                width="6"
                height="14"
                fill="url(#gbg)"
                transform={`rotate(${i * 22.5})`}
              />
            ))}
            <circle r="40" fill="url(#gbg)" />
            <circle r="36" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <circle r="32" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          </g>
          {/* text */}
          <text
            x="50"
            y="46"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            letterSpacing="-0.5"
          >
            100
          </text>
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            letterSpacing="1"
          >
            DAY
          </text>
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fill="white"
            fontSize="6"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.8"
          >
            GUARANTEE
          </text>
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-relaxed text-[hsl(var(--text-body))]">
          <span className="font-bold text-[hsl(var(--text-strong))]">100 Day Money-Back Guarantee:</span>{" "}
          Feel safe knowing you are protected with a 100 day guarantee. Simply send the item(s) back in the
          original packaging to receive a full refund or replacement, less S&amp;H.
        </p>
      </div>
    </div>
  );
}
