import { PRODUCT_IMAGES } from "./images";

export interface FeatureRow {
  trademark?: string;
  title: string;
  body: string[];
  highlights?: string[];
  image: string;
  imageAlt: string;
}

// Six feature rows — copy lifted verbatim from vitalwalk.store/products/swollen-feet
export const FEATURE_ROWS: FeatureRow[] = [
  {
    trademark: "DayFlex™ Adjustable Velcro System",
    title: "A Fit That Adjusts Instantly When Your Feet Swell",
    body: [
      "Your feet do not stay the same size throughout the day, so your shoes should not either.",
      "The DayFlex™ adjustable velcro system lets you loosen or tighten the fit in seconds for instant relief. Instead of tight laces cutting off circulation, you customize the pressure whenever you need.",
      "When your feet swell after walking, standing, or simply going through your day, you just adjust and keep moving. One pair that finally adapts to you from morning to night.",
    ],
    highlights: ["No taking your shoes off", "No struggling", "No pressure buildup"],
    image: PRODUCT_IMAGES.featAdjustVelcro,
    imageAlt: "VitalWalk shoes showing the adjustable velcro system",
  },
  {
    title: "Slide In Effortlessly Without Bending or Struggling",
    body: [
      "VitalWalk opens fully, giving swollen feet the space they need to slide in easily. No bending down. No forcing your heel in. No tugging on stiff openings.",
      "Just open the shoe, slide your foot in, secure the strap, and go. Getting dressed becomes simple again, even on your worst swelling days.",
    ],
    image: PRODUCT_IMAGES.featSlideIn,
    imageAlt: "Senior easily slipping on VitalWalk shoes",
  },
  {
    title: "Extra Room Where You Need It Most",
    body: [
      "VitalWalk gives your feet the space regular shoes don't. With a true extra-wide forefoot and roomy toe box, your toes can spread naturally without rubbing or pressure.",
      "Ideal for swollen feet, sensitive toes, bunions, or anyone who has felt cramped in regular footwear. No squeezing. No tightness. Just room to breathe.",
    ],
    image: PRODUCT_IMAGES.featExtraRoom,
    imageAlt: "Wide toe box of VitalWalk shoes",
  },
  {
    title: "Walk With Confidence On Any Surface",
    body: [
      "Swollen feet can affect your balance and make every step feel uncertain. VitalWalk solves this with a stable, non-slip rubber outsole that grips tile, concrete, grass, carpet, and even wet surfaces.",
      "This added stability helps prevent falls and gives you confidence to move freely. Just steady, confident steps everywhere you go.",
    ],
    image: PRODUCT_IMAGES.featNonSlip,
    imageAlt: "Non-slip rubber outsole of VitalWalk",
  },
  {
    title: "Lightweight Design That Won't Weigh You Down",
    body: [
      "Heavy shoes make every step harder, especially when your feet are already tired. VitalWalk uses ultra-light materials that take the weight off your feet immediately.",
      "Less weight means less strain on your legs, knees, and lower back. Many customers say they forget they're wearing shoes at all.",
    ],
    image: PRODUCT_IMAGES.featLightweight,
    imageAlt: "Lightweight VitalWalk shoe construction",
  },
  {
    title: "Cool, Cushioned Comfort For Sensitive Swollen Feet",
    body: [
      "Swollen feet overheat and get irritated fast. VitalWalk Shoes use a breathable mesh upper to keep your feet cooler and drier throughout the day.",
      "The air-cushioned sole absorbs shock and reduces pressure on sensitive areas, helping relieve discomfort in your feet, knees, and joints.",
    ],
    image: PRODUCT_IMAGES.featBreathable,
    imageAlt: "Breathable mesh upper close-up",
  },
];

// "Who they're for" — verbatim from vitalwalk.store
export const WHO_ITS_FOR = [
  { condition: "Diabetes & neuropathy", note: "burning, tingling, numbness" },
  { condition: "Edema & swelling", note: "feet and ankles that expand throughout the day" },
  { condition: "Plantar fasciitis & heel spurs", note: "stabbing morning pain, tender arches" },
  { condition: "Arthritis & stiffness", note: "joints that ache with every step" },
  { condition: "Bunions & hammertoes", note: "painful pressure points" },
] as const;
