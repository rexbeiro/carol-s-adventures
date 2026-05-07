import type { DialogueScene } from "../types/game";

// Extended with backgroundType for scene-specific rendering
export type SceneBg =
  | "airport"
  | "aircraft"
  | "phone"
  | "night-sky"
  | "rainy"
  | "emergency"
  | "sunset"
  | "arrivals";

export interface ExtendedScene extends DialogueScene {
  backgroundType: SceneBg;
  showJoshua?: boolean;
}

const scenes: Record<string, ExtendedScene> = {
  intro: {
    id: "intro",
    backgroundType: "airport",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "Kolkata, India. 4:23 AM. Gate 7. Neon lights flicker against rain-slicked concrete. An Akasa Air 737 waits on the tarmac.",
      },
      {
        speaker: "carol",
        text: "I'm Carol. Cabin Crew, Akasa Air. Tonight's route takes me from Kolkata to Dubai, across the Atlantic storm bands, through the Caribbean — to Panama City.",
      },
      {
        speaker: "carol",
        text: "Six legs. Eighteen hours. Every bump, every passenger, every emergency. I face them all with one thought: get to Joshua.",
      },
      {
        speaker: "carol",
        text: "He's been waiting three months for me to make it there. Tonight, finally, I fly to him.",
      },
      {
        speaker: "carol",
        text: "Ready to begin?",
        choices: [
          {
            id: "yes",
            text: "♥ Let's go, Carol.",
            relationshipDelta: 1,
            nextDialogueId: "kolkata_before",
          },
          {
            id: "nervous",
            text: "... I'm nervous for you.",
            relationshipDelta: 1,
            nextDialogueId: "kolkata_before",
          },
        ],
      },
    ],
    nextRoute: "/dialogue/kolkata_before",
  },

  kolkata_before: {
    id: "kolkata_before",
    backgroundType: "airport",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 01 — KOLKATA DEPARTURE — NSC Bose International",
      },
      {
        speaker: "carol",
        text: "Pre-flight checks: ✓ Seatbelt demos rehearsed. ✓ Emergency equipment inspected. ✓ Trolleys secured.",
      },
      {
        speaker: "carol",
        text: "Passengers are boarding. The gate agent waves me forward. My phone buzzes one last time before I have to switch to flight mode.",
      },
      {
        speaker: "joshua",
        text: "\"Hey. I know you're boarding soon. Just — be safe up there, okay? I'll be at Arrivals when you land. I promise.\" ♥",
      },
      {
        speaker: "carol",
        text: "What do I reply?",
        choices: [
          {
            id: "love",
            text: '"I love you, Joshua. See you in Panama City."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
          {
            id: "strong",
            text: '"I\'ve got this. Save me a seat at the reunion."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
        ],
      },
    ],
    nextRoute: "/minigame/turbulence__0",
  },

  kolkata_after: {
    id: "kolkata_after",
    backgroundType: "aircraft",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "Takeoff successful. The runway lights blur and vanish. Kolkata fades beneath the monsoon clouds.",
      },
      {
        speaker: "carol",
        text: "First leg complete. Seat belt signs off. I walk the aisle, checking on passengers. Smiling even when I'm tired.",
      },
      {
        speaker: "narrator",
        text: "Carol marks Kolkata on the in-flight route map. One city down. Five to go. ✈",
      },
    ],
    nextRoute: "/map",
  },

  dubai_before: {
    id: "dubai_before",
    backgroundType: "phone",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 02 — DUBAI LAYOVER — Emirates Terminal — 11:45 PM",
      },
      {
        speaker: "carol",
        text: "Thirty-eight passengers. Meal service above a desert night sky. The trolley rocks with every air pocket.",
      },
      { speaker: "carol", text: "I can do this. Smile. Serve. Survive." },
      {
        speaker: "joshua",
        text: '"(Text message) Thinking of you up there somewhere. Eat something, Carol — you always forget when you\'re focused. Also: I bought a new duvet for when you arrive 😊"',
      },
      {
        speaker: "carol",
        text: "That man. He knows me completely. Quick reply — then back to work.",
        choices: [
          {
            id: "warm",
            text: '"Already had noodles AND a croissant. Stop worrying 😊 The duvet better be pink."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
          {
            id: "focus",
            text: '"Working! Talk later ✈" (then focus on the service cart)',
            relationshipDelta: 0,
            nextDialogueId: "__minigame__",
          },
        ],
      },
    ],
    nextRoute: "/minigame/passenger__1",
  },

  dubai_after: {
    id: "dubai_after",
    backgroundType: "aircraft",
    showJoshua: false,
    lines: [
      {
        speaker: "carol",
        text: "Every passenger served. The elderly couple in row 12 thanked me by name. Small moments that make this real.",
      },
      {
        speaker: "narrator",
        text: "Dubai layover: three hours in a terminal that never sleeps. Neon signs. Duty-free perfume. Arabic coffee.",
      },
      {
        speaker: "carol",
        text: "I find a quiet corner, take off my heels, and send Joshua a voice note. He replies with a photo of the apartment — a candle lit, pasta simmering. Waiting.",
      },
    ],
    nextRoute: "/map",
  },

  atlantic_before: {
    id: "atlantic_before",
    backgroundType: "rainy",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 03 — STORM OVER ATLANTIC — 35,000 ft — North Atlantic Track Foxtrot",
      },
      {
        speaker: "system",
        text: "⚠ WEATHER ALERT: Severe turbulence band ahead. Category 3. Duration: unknown. Fasten seatbelts.",
      },
      {
        speaker: "carol",
        text: "The captain's voice is calm. His knuckles on the intercom button aren't. I know the difference — five years of flying teaches you that.",
      },
      {
        speaker: "joshua",
        text: "\"(Voicemail, recorded two hours ago) Hey... you're crossing the Atlantic now. The weather app says there's a big one out there. I'm not sleeping until you're through it. I love you.\"",
      },
      {
        speaker: "carol",
        text: "Deep breath. Shoulders back. Strap in, Carol.",
        choices: [
          {
            id: "brave",
            text: '"For you, Joshua — I fly through every storm."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
          {
            id: "pro",
            text: "(Professional mode: activate. This is what I trained for.)",
            relationshipDelta: 0,
            nextDialogueId: "__minigame__",
          },
        ],
      },
    ],
    nextRoute: "/minigame/turbulence__2",
  },

  atlantic_after: {
    id: "atlantic_after",
    backgroundType: "night-sky",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "The storm breaks. Stars reappear, vast and silent. The Atlantic stretches silver and infinite below the wingtip.",
      },
      {
        speaker: "carol",
        text: "Through the worst of it. Halfway across the world now. Every mile a mile closer to him.",
      },
    ],
    nextRoute: "/map",
  },

  night_before: {
    id: "night_before",
    backgroundType: "phone",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 04 — NIGHT FLIGHT — 02:17 AM — Mid-Atlantic — Satellite link active",
      },
      {
        speaker: "carol",
        text: "The cabin is dark. Most passengers are asleep. I steal five minutes in the galley and call Joshua via satellite.",
      },
      {
        speaker: "joshua",
        text: "\"Carol! You're calling from 35,000 feet? That's actually the most romantic thing you've ever done and I don't know how to feel about it.\"",
      },
      {
        speaker: "carol",
        text: '"Only for you. Tell me something. Anything. I miss the sound of your voice."',
      },
      {
        speaker: "joshua",
        text: "\"I cleaned the apartment three times. Made your favourite pasta twice — the first batch was bad, don't ask. I bought flowers and then felt embarrassed buying flowers and now there are flowers. Also I may have rehearsed what I'm going to say when I see you.\"",
      },
      {
        speaker: "carol",
        text: "My heart does something complicated and warm and completely overwhelming.",
        choices: [
          {
            id: "soft",
            text: '"Save me a plate. And a very long hug. And tell me what you rehearsed."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
          {
            id: "tease",
            text: '"You cleaned THREE times?? Joshua, I\'m scared to see the receipts."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
        ],
      },
    ],
    nextRoute: "/minigame/passenger__3",
  },

  night_after: {
    id: "night_after",
    backgroundType: "night-sky",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "Dawn breaks somewhere over the Caribbean. Pink and gold light floods the cabin portholes.",
      },
      { speaker: "carol", text: "One more leg. Almost there. I can feel it." },
    ],
    nextRoute: "/map",
  },

  emergency_before: {
    id: "emergency_before",
    backgroundType: "emergency",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 05 — EMERGENCY DESCENT — Caribbean Airspace — 22,000 ft and falling",
      },
      {
        speaker: "system",
        text: "🚨 HYDRAULIC PRESSURE WARNING. CABIN CREW: BRACE POSITIONS. EMERGENCY PROTOCOL ALPHA INITIATED.",
      },
      {
        speaker: "carol",
        text: "This is what five years of training is for. Forty-two lives. Stay calm. Be the calm they need.",
      },
      {
        speaker: "joshua",
        text: '"(Text, urgent) Carol — why is there a news alert about an Akasa flight diverting near Panama? That ISN\'T your flight, right?? Please text me back right now."',
      },
      {
        speaker: "carol",
        text: "No time. Lives are in my hands right now.",
        choices: [
          {
            id: "quick",
            text: '(Send: "All good. Don\'t panic. Working.") [then emergency protocol]',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
          {
            id: "focus_only",
            text: "(No reply — full focus on the emergency. He'll understand.)",
            relationshipDelta: 0,
            nextDialogueId: "__minigame__",
          },
        ],
      },
    ],
    nextRoute: "/minigame/emergency__4",
  },

  emergency_after: {
    id: "emergency_after",
    backgroundType: "aircraft",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "Emergency averted. The plane descends safely through Caribbean clouds. Forty-two passengers applaud. Carol smiles and her hands are still shaking.",
      },
      {
        speaker: "carol",
        text: "All safe. Every single one of them.",
      },
      {
        speaker: "joshua",
        text: "\"Carol I've been staring at FlightRadar for forty minutes. Please tell me you're okay. PLEASE.\"",
      },
      {
        speaker: "carol",
        text: "\"I'm okay. I promise. All passengers are safe. Twenty minutes to Panama City. I'll see you soon.\" ♥",
      },
    ],
    nextRoute: "/map",
  },

  panama_before: {
    id: "panama_before",
    backgroundType: "sunset",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 06 — PANAMA CITY ARRIVAL — Tocumen International Airport — Final Approach",
      },
      {
        speaker: "carol",
        text: "The lights of Panama City glitter below. After everything — the storms, the emergency, the sleepless Atlantic crossing — we're finally here.",
      },
      {
        speaker: "joshua",
        text: "\"I'm at Arrivals. I've been here for two hours. I can see your plane on FlightRadar. It just turned onto final approach. Carol I'm — \" (message cuts off)",
      },
      { speaker: "carol", text: '"Joshua... don\'t cry before I even land."' },
      { speaker: "joshua", text: '"...Too late."' },
      {
        speaker: "carol",
        text: "Final approach. Land this plane. Then run to him.",
        choices: [
          {
            id: "smile",
            text: '(Smile through everything) "Here we go. Last one." ♥',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__",
          },
          {
            id: "captain",
            text: '"Professional Carol. One final time. Then it\'s over."',
            relationshipDelta: 0,
            nextDialogueId: "__minigame__",
          },
        ],
      },
    ],
    nextRoute: "/minigame/emergency__5",
  },

  ending: {
    id: "ending",
    backgroundType: "arrivals",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "Wheels touch tarmac. Tocumen International Airport. 14:47 local time. The intercom chimes.",
      },
      {
        speaker: "carol",
        text: "Gate secured. Passengers disembarking. I thank each one as they pass. Hands finally still.",
      },
      {
        speaker: "narrator",
        text: "She walks through arrivals in her pink Akasa uniform — slightly wrinkled, heart completely full.",
      },
      { speaker: "narrator", text: "And there he is." },
      { speaker: "joshua", text: '"Carol."' },
      { speaker: "carol", text: '"Joshua."' },
      {
        speaker: "narrator",
        text: 'He\'s holding a paper sign. It says: "Welcome Home, Carol ♥" — written in red marker, slightly crooked.',
      },
      {
        speaker: "carol",
        text: "Six levels. Three oceans. A storm, an emergency, forty-two passengers, and eighteen hours of sky.",
      },
      { speaker: "carol", text: "All of it — all of it — for this." },
    ],
    nextRoute: "/ending",
  },
};

export default scenes;
