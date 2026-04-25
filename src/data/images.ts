// All product imagery — real assets from your existing vitalwalk.store CDN.
// These render directly from Shopify's CDN so they always match your store.

const CDN = "https://cdn.shopify.com/s/files/1/0843/7143/9902/files";

export const PRODUCT_IMAGES = {
  heroMain: `${CDN}/23b406cd-224c-430b-8e83-8fcc7b918934.png?v=1767493057&width=1600`,
  hero2: `${CDN}/vitalwalk_compressed.jpg?v=1767493057&width=1600`,
  animatedDemo: `${CDN}/1729799689-WCSLPGIFSmp4-ezgif.com-crop.webp?v=1767493057`,
  doctor: `${CDN}/vitalwalk_doctor_compressed.jpg?v=1767493057&width=1600`,
  adjust: `${CDN}/vitalwalk_adjust_compressed.jpg?v=1767493057&width=1600`,
  finalShot: `${CDN}/vitalwalk_final_compressed.jpg?v=1767493057&width=1600`,
  sole: `${CDN}/dcdb9fae-67c4-4a52-9ea4-356f5446d72d.png?v=1767493057&width=1600`,
  cushioning: `${CDN}/vitalwalk_cushioning_compressed.jpg?v=1767493057&width=1600`,
  gentleSkin: `${CDN}/vitalwalk_gentle_skin_compressed.jpg?v=1767493057&width=1600`,
  colorBeige: `${CDN}/vitalwalk_color_1_compressed.jpg?v=1767493057&width=600`,
  colorBlack: `${CDN}/vitalwalk_color_2_compressed.jpg?v=1767493057&width=600`,
  colorGray: `${CDN}/vitalwalk_color_3_compressed.jpg?v=1767493057&width=600`,
  colorBlue: `${CDN}/vitalwalk_color_4_compressed.jpg?v=1767493057&width=600`,
  // Editorial / lifestyle images from vitalwalk.store theme assets
  legMassage: `${CDN}/Copy_of_The_perfect_leg_massage_after_long_runs_1.webp?v=1731092399&width=1500`,
  bRollWalk: `${CDN}/broll6_v150_2684e266-c71b-43a5-acd7-53932f786140_2.webp?v=1731094388&width=1500`,
  featAdjustVelcro: `${CDN}/ChatGPT_Image_Dec_16_2025_03_41_32_PM.png?v=1765924914&width=1500`,
  featSlideIn: `${CDN}/ChatGPT_Image_Dec_16_2025_03_09_25_PM.png?v=1765922977&width=1500`,
  featExtraRoom: `${CDN}/ChatGPT_Image_Dec_16_2025_03_43_30_PM.png?v=1767492528&width=1500`,
  featNonSlip: `${CDN}/ChatGPT_Image_Dec_16_2025_03_38_44_PM.png?v=1765924752&width=1500`,
  featLightweight: `${CDN}/ChatGPT_Image_Dec_16_2025_03_48_09_PM.png?v=1765925302&width=1500`,
  featBreathable: `${CDN}/accessory_column_image-03_2.webp?v=1731092457&width=1500`,
  doctorLifestyle: `${CDN}/accessory_column_image-03_2.webp?v=1731092457&width=1500`,
  podiatristEditorial: `${CDN}/fefegegeg_2_1.webp?v=1731094547&width=1500`,
  // Press logos
  press1: `${CDN}/Group_1000003006.avif?v=1765753394`,
  press2: `${CDN}/Group_1000003005.avif?v=1765753380`,
  press3: `${CDN}/Group_1000003003.avif?v=1765753345`,
  press4: `${CDN}/Group_1000003002.avif?v=1765753318`,
  // Social-proof avatars + their attached photos
  avatarMargaret: `${CDN}/Screenshot_2025-12-04_at_7.43.57_PM.png?v=1764902642&width=200`,
  avatarCatherine: `${CDN}/qr68knyzpm0e1.jpg?v=1764291492&width=200`,
  avatarDiane: `${CDN}/idosos-abracados-sorrindo.webp?v=1720045821&width=200`,
  socialMargaret: `${CDN}/adv2_7.webp?v=1764099691&width=1420`,
  socialCatherine: `${CDN}/1_e3923e3c-016c-4c18-9b37-252fe14d566b.jpg?v=1764290383&width=1420`,
  socialDiane: `${CDN}/2_fd419914-57d9-4a21-b9ee-ee61c36a0a50.jpg?v=1764290445&width=1420`,
} as const;

// Animated GIF benefit grid — from orthorestshoes.com CDN, same product family
export const BENEFIT_GIFS = [
  {
    src: "https://orthorestshoes.com/cdn/shop/files/Diabetic_Feet.gif?v=1706689333&width=400",
    title: "Swelling Relief",
    subtitle: "Adjusts as your feet expand",
  },
  {
    src: "https://orthorestshoes.com/cdn/shop/files/Sport_shoes_2.gif?v=1706772795&width=400",
    title: "Walking Bliss",
    subtitle: "Cloud-soft cushioning, every step",
  },
  {
    src: "https://orthorestshoes.com/cdn/shop/files/5.gif?v=1706774819&width=400",
    title: "Cushioned Insole",
    subtitle: "Supports arches & relieves pressure",
  },
  {
    src: "https://orthorestshoes.com/cdn/shop/files/12_hours.GIF_3.gif?v=1706669832&width=400",
    title: "All-Day Rating",
    subtitle: "Comfortable from morning to night",
  },
] as const;
