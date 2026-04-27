import { useEffect, useMemo, useState } from "react";

interface ActivityMessage {
  emoji: string;
  text: React.ReactNode;
}

const NAMES_CITIES = [
  ["Sarah", "Austin, TX"],
  ["Michael", "Denver, CO"],
  ["Jessica", "Tampa, FL"],
  ["David", "Seattle, WA"],
  ["Emma", "Toronto, ON"],
  ["James", "Manchester, UK"],
  ["Olivia", "Sydney, AU"],
  ["Robert", "Chicago, IL"],
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LiveActivity() {
  // Numbers are randomized once per session so it feels alive but stable.
  const messages = useMemo<ActivityMessage[]>(() => {
    const viewers = rand(18, 47);
    const sold24h = rand(112, 198);
    const [name, city] = NAMES_CITIES[rand(0, NAMES_CITIES.length - 1)];
    const pairs = rand(1, 3);
    return [
      {
        emoji: "👀",
        text: (
          <>
            <strong className="font-extrabold text-[hsl(var(--text-strong))]">{viewers} people</strong>{" "}
            are viewing this right now
          </>
        ),
      },
      {
        emoji: "🛒",
        text: (
          <>
            <strong className="font-extrabold text-[hsl(var(--text-strong))]">{name} from {city}</strong>{" "}
            just ordered {pairs} {pairs === 1 ? "pair" : "pairs"}
          </>
        ),
      },
      {
        emoji: "📦",
        text: (
          <>
            <strong className="font-extrabold text-[hsl(var(--text-strong))]">{sold24h} pairs</strong>{" "}
            sold in the last 24 hours
          </>
        ),
      },
    ];
  }, []);

  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % messages.length);
        setFading(false);
      }, 250);
    }, 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  const msg = messages[idx];

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-verified/25 bg-verified/5 px-3.5 py-2.5">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-verified" />
      </span>
      <span
        className={`flex-1 text-[12.5px] leading-tight text-[hsl(var(--text-body))] transition-opacity duration-200 sm:text-[13px] ${
          fading ? "opacity-0" : "opacity-100"
        }`}
        aria-live="polite"
      >
        <span className="mr-1" aria-hidden>{msg.emoji}</span>
        {msg.text}
      </span>
    </div>
  );
}
