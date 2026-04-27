import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { detectCountry } from "./lib/geo";

// Kick off geo detection before React mounts so the round-trip overlaps
// with hydration and the first Shopify query can fire with the right country.
void detectCountry();

createRoot(document.getElementById("root")!).render(<App />);
