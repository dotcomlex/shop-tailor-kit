import { PRODUCT_IMAGES } from "./images";

// Three Reddit/Facebook-style social cards — real customer copy + photos
// from your existing vitalwalk.store product page.
export interface SocialCard {
  name: string;
  avatar: string;
  timeAgo: string;
  body: string;
  image: string;
  likes: number;
  comments: number;
}

export const SOCIAL_CARDS: SocialCard[] = [
  {
    name: "Margaret S.",
    avatar: PRODUCT_IMAGES.avatarMargaret,
    timeAgo: "2 days ago",
    body: "What I love most is nobody asks about them. They look normal. I don't have to explain why I'm wearing medical shoes. I don't have to talk about my feet. They're just shoes. That matters more than people realize.",
    image: PRODUCT_IMAGES.socialMargaret,
    likes: 178,
    comments: 21,
  },
  {
    name: "Catherine M.",
    avatar: PRODUCT_IMAGES.avatarCatherine,
    timeAgo: "1 day ago",
    body: "My granddaughter's dance recital was two hours. I haven't sat through a two-hour anything in years. But I wore my VitalWalk shoes, adjusted once during intermission, and stayed until the final bow. She ran off stage and hugged me. That's what these shoes gave me—being there for the moments that matter.",
    image: PRODUCT_IMAGES.socialCatherine,
    likes: 79,
    comments: 10,
  },
  {
    name: "Diane L.",
    avatar: PRODUCT_IMAGES.avatarDiane,
    timeAgo: "3 days ago",
    body: "I used to have a rotation of reasons why I couldn't go places. Not feeling well. Too tired. Maybe next time. I ran out of excuses that people believed. Now I just say yes. My friends have noticed. My daughter has noticed. I'm back.",
    image: PRODUCT_IMAGES.socialDiane,
    likes: 29,
    comments: 3,
  },
];

// Trustpilot-style review wall — real customer copy from vitalwalk.store
export interface Review {
  title: string;
  body: string;
  name: string;
}

export const REVIEWS: Review[] = [
  {
    title: "No More Sitting in the Parking Lot",
    body: "I used to have to sit in the car at every store because my feet would hurt so bad. Wore these to Costco last week and walked the entire store with my wife. First time in over a year. These shoes changed my life.",
    name: "Barbara M.",
  },
  {
    title: "First Morning Without Dread",
    body: "For the first time in 3 years, I don't dread putting my shoes on in the morning. They slide on easily and I don't need my wife's help anymore. That alone was worth the purchase.",
    name: "Dorothy W.",
  },
  {
    title: "The Adjustable Strap Actually Works",
    body: "Skeptical at first but the adjustable strap really does make a difference. I adjust them 2-3 times during the day and stay comfortable. No more taking my shoes off at my desk or in the car.",
    name: "Margaret R.",
  },
  {
    title: "I Can Go to My Grandson's Games Again",
    body: "Stopped going to my grandson's baseball games because I couldn't stand that long. These adjust when my feet swell so I can stay comfortable the whole game. He was so happy to see me there last weekend.",
    name: "Nancy S.",
  },
  {
    title: "Saved Me Hundreds on Podiatrist Visits",
    body: "Spent over $300 on custom orthotics that my swollen feet just pushed out of. These cost a fraction of that and actually work. Wish I'd found them years ago before wasting all that money.",
    name: "Betty L.",
  },
  {
    title: "Look Normal But Work Like Medical Shoes",
    body: "I refused to wear those ugly diabetic shoes my doctor recommended. These look like regular sneakers but actually accommodate my swelling. Nobody knows I'm wearing 'special' shoes and that matters to me.",
    name: "Karen K.",
  },
  {
    title: "They Adjust for Swelling",
    body: "I used to keep 3 different pairs by the door. Now I wear these all day and adjust when I need to. Game changer.",
    name: "Diane M.",
  },
  {
    title: "Two Years of Pain—Gone",
    body: "Within the first week, the constant throbbing was gone. I'm walking my grandson to school now.",
    name: "Joyce D.",
  },
  {
    title: "Goodbye Stiffness, Hello Comfort",
    body: "My ankles and knees used to ache after even short errands. Since switching to VitalWalk®, the stiffness is gone, and I move so much easier.",
    name: "Mary B.",
  },
  {
    title: "Walking Feels Effortless Again",
    body: "At 67, I thought foot pain was just something I had to live with. These shoes feel like walking on clouds. I can do my daily 2-mile walk with no issues now.",
    name: "Ruth T.",
  },
  {
    title: "Wish I Bought Them Years Ago",
    body: "I've wasted money on insoles and 'supportive' sneakers that did nothing. VitalWalk® is the first shoe that truly fixed my heel and arch pain.",
    name: "Elizabeth C.",
  },
  {
    title: "Comfort From the First Step",
    body: "No break-in period needed. These felt soft and supportive right away, almost like they were made for my feet.",
    name: "Carol L.",
  },
];
