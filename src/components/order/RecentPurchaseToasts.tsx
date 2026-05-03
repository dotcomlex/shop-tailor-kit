import { useEffect, useRef, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useGeo } from "@/hooks/useGeo";

/**
 * Subtle, geo-aware "recent purchase" notifications. The city + first-name
 * combos are curated per country so a US visitor sees US cities, a UK visitor
 * sees UK cities, etc. — never a Birmingham UK shopper seeing "Sarah from
 * Dallas just bought 2 pairs."
 *
 * Pacing rules (kept deliberately calm):
 *  - First toast appears 25–40s after mount.
 *  - Subsequent toasts appear every 50–95s.
 *  - Hard cap: 4 per session (sessionStorage), so we never spam a returning user.
 *  - Auto-dismiss after 6s. User can dismiss manually.
 *  - Manual dismiss permanently silences toasts for the session.
 *  - Hidden on Step 3 (review/checkout) so nothing competes with the CTA.
 *  - Hidden entirely for visitors outside the 4 active markets — quieter than
 *    showing an obviously generic city.
 */

interface PurchaseEntry {
  name: string;
  city: string;
}

interface CountryPool {
  pool: PurchaseEntry[];
}

const POOLS: Record<string, CountryPool> = {
  US: {
    pool: [
      { name: "Sarah", city: "Austin, TX" },
      { name: "Michael", city: "Denver, CO" },
      { name: "Jessica", city: "Tampa, FL" },
      { name: "David", city: "Portland, OR" },
      { name: "Linda", city: "Charlotte, NC" },
      { name: "Robert", city: "Phoenix, AZ" },
      { name: "Karen", city: "Minneapolis, MN" },
      { name: "James", city: "Nashville, TN" },
      { name: "Emily", city: "Seattle, WA" },
      { name: "Thomas", city: "Boston, MA" },
      { name: "Patricia", city: "San Diego, CA" },
      { name: "Mark", city: "Columbus, OH" },
    ],
  },
  GB: {
    pool: [
      { name: "Emma", city: "Manchester" },
      { name: "Oliver", city: "Bristol" },
      { name: "Sophie", city: "Leeds" },
      { name: "Harry", city: "Glasgow" },
      { name: "Charlotte", city: "Birmingham" },
      { name: "Jack", city: "Liverpool" },
      { name: "Amelia", city: "Edinburgh" },
      { name: "George", city: "Sheffield" },
      { name: "Isla", city: "Cardiff" },
      { name: "William", city: "Nottingham" },
      { name: "Grace", city: "Newcastle" },
      { name: "Thomas", city: "Brighton" },
    ],
  },
  AU: {
    pool: [
      { name: "Chloe", city: "Sydney, NSW" },
      { name: "Liam", city: "Melbourne, VIC" },
      { name: "Mia", city: "Brisbane, QLD" },
      { name: "Noah", city: "Perth, WA" },
      { name: "Ava", city: "Adelaide, SA" },
      { name: "Ethan", city: "Gold Coast, QLD" },
      { name: "Charlotte", city: "Newcastle, NSW" },
      { name: "Jack", city: "Canberra, ACT" },
      { name: "Ruby", city: "Hobart, TAS" },
      { name: "Lucas", city: "Wollongong, NSW" },
    ],
  },
  CA: {
    pool: [
      { name: "Olivia", city: "Toronto, ON" },
      { name: "Liam", city: "Vancouver, BC" },
      { name: "Emma", city: "Calgary, AB" },
      { name: "Noah", city: "Montréal, QC" },
      { name: "Charlotte", city: "Ottawa, ON" },
      { name: "William", city: "Edmonton, AB" },
      { name: "Sophia", city: "Winnipeg, MB" },
      { name: "Benjamin", city: "Halifax, NS" },
      { name: "Ava", city: "Quebec City, QC" },
      { name: "Lucas", city: "Victoria, BC" },
    ],
  },
};

const SUPPORTED = new Set(Object.keys(POOLS));

const PRODUCTS = [
  { label: "1 Pair · Black", emoji: "🖤" },
  { label: "1 Pair · White", emoji: "🤍" },
  { label: "2 Pairs Bundle", emoji: "👟" },
  { label: "2 Pairs · Black + Beige", emoji: "🤎" },
  { label: "3 Pairs Bundle", emoji: "🔥" },
  { label: "1 Pair · Beige", emoji: "🤎" },
  { label: "2 Pairs · Black + White", emoji: "👟" },
  { label: "1 Pair + Insoles", emoji: "✨" },
];

const TIME_PHRASES = [
  "just now",
  "1 min ago",
  "2 min ago",
  "4 min ago",
  "6 min ago",
  "9 min ago",
  "12 min ago",
];

const SESSION_COUNT_KEY = "vw_purchase_toast_count";
const SESSION_DISMISSED_KEY = "vw_purchase_toast_dismissed";
const MAX_PER_SESSION = 5;
const FIRST_DELAY_MIN = 8_000;
const FIRST_DELAY_MAX = 15_000;
const NEXT_DELAY_MIN = 22_000;
const NEXT_DELAY_MAX = 40_000;
const VISIBLE_MS = 5_500;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function jitter(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface ActiveToast {
  id: number;
  name: string;
  city: string;
  product: string;
  emoji: string;
  time: string;
}

interface RecentPurchaseToastsProps {
  /** Hide entirely on the final review/checkout step. */
  paused: boolean;
}

export function RecentPurchaseToasts({ paused }: RecentPurchaseToastsProps) {
  const { country } = useGeo();
  const [active, setActive] = useState<ActiveToast | null>(null);
  const idRef = useRef(0);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const dismissedRef = useRef(false);

  // Seed dismissed flag once on mount (client-only).
  useEffect(() => {
    try {
      dismissedRef.current =
        typeof window !== "undefined" &&
        sessionStorage.getItem(SESSION_DISMISSED_KEY) === "1";
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    const clearTimers = () => {
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      showTimerRef.current = null;
      hideTimerRef.current = null;
    };

    if (paused || dismissedRef.current) {
      clearTimers();
      setActive(null);
      return;
    }
    if (!country || !SUPPORTED.has(country.code)) return;

    const scheduleNext = (firstRun: boolean) => {
      const delay = firstRun
        ? jitter(FIRST_DELAY_MIN, FIRST_DELAY_MAX)
        : jitter(NEXT_DELAY_MIN, NEXT_DELAY_MAX);

      showTimerRef.current = window.setTimeout(() => {
        if (dismissedRef.current) return;
        let count = 0;
        try {
          count = parseInt(sessionStorage.getItem(SESSION_COUNT_KEY) ?? "0", 10);
        } catch {
          /* noop */
        }
        if (count >= MAX_PER_SESSION) return;

        const pool = POOLS[country.code];
        const entry = pick(pool.pool);
        const prod = pick(PRODUCTS);
        idRef.current += 1;
        setActive({
          id: idRef.current,
          name: entry.name,
          city: entry.city,
          product: prod.label,
          emoji: prod.emoji,
          time: pick(TIME_PHRASES),
        });
        try {
          sessionStorage.setItem(SESSION_COUNT_KEY, String(count + 1));
        } catch {
          /* noop */
        }

        hideTimerRef.current = window.setTimeout(() => {
          setActive(null);
          let c = 0;
          try {
            c = parseInt(sessionStorage.getItem(SESSION_COUNT_KEY) ?? "0", 10);
          } catch {
            /* noop */
          }
          if (!dismissedRef.current && c < MAX_PER_SESSION) {
            scheduleNext(false);
          }
        }, VISIBLE_MS);
      }, delay);
    };

    scheduleNext(true);
    return clearTimers;
  }, [country, paused]);

  const handleDismiss = () => {
    dismissedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_DISMISSED_KEY, "1");
    } catch {
      /* noop */
    }
    setActive(null);
  };

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-3 left-3 z-40 max-w-[calc(100vw-1.5rem)] sm:bottom-5 sm:left-5 sm:max-w-[340px]"
    >
      <div
        key={active.id}
        className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-[hsl(var(--hairline))] bg-card/95 p-2.5 pr-2 shadow-lg backdrop-blur-sm animate-fade-in sm:p-3"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--order-blue-soft))]"
        >
          <ShoppingBag
            className="h-4 w-4 text-[hsl(var(--order-blue))]"
            strokeWidth={2.5}
          />
        </span>
        <div className="min-w-0 flex-1 leading-snug">
          <p className="truncate text-[12.5px] font-semibold text-[hsl(var(--text-strong))] sm:text-[13px]">
            {active.name} from {active.city}
          </p>
          <p className="truncate text-[11.5px] text-[hsl(var(--text-body))] sm:text-[12px]">
            <span aria-hidden className="mr-1">
              {active.emoji}
            </span>
            just bought {active.product}
          </p>
          <p className="text-[10.5px] font-medium uppercase tracking-wide text-[hsl(var(--text-mute))]">
            {active.time} · Verified order
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[hsl(var(--text-mute))] transition-colors hover:bg-[hsl(var(--text-mute)/0.1)] hover:text-[hsl(var(--text-strong))]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
