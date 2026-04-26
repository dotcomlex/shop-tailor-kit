import { useEffect, useState } from "react";
import { detectCountry, type DetectedCountry } from "@/lib/geo";

export function useGeo() {
  const [country, setCountry] = useState<DetectedCountry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    detectCountry().then((c) => {
      if (!mounted) return;
      setCountry(c);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { country, loading };
}
