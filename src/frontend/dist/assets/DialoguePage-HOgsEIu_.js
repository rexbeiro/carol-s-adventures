import { r as reactExports, j as jsxRuntimeExports, b as useParams, u as useNavigate, d as drawPixelSprite, c as carolSprite, a as joshuaSprite } from "./index-B39rMSy_.js";
import { N as NeonButton, u as useGameStore } from "./gameStore-DCN8N4SW.js";
const TYPEWRITER_SPEED = 28;
function DialogueBox({
  line,
  onNext,
  onChoice,
  speakerLabel
}) {
  const [displayedText, setDisplayedText] = reactExports.useState("");
  const [done, setDone] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setDisplayedText("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(line.text.slice(0, i));
      if (i >= line.text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, TYPEWRITER_SPEED);
    return () => clearInterval(interval);
  }, [line.text]);
  const skipOrNext = reactExports.useCallback(() => {
    var _a;
    if (!done) {
      setDisplayedText(line.text);
      setDone(true);
    } else if (!((_a = line.choices) == null ? void 0 : _a.length)) {
      onNext();
    }
  }, [done, line, onNext]);
  const speakerColors = {
    carol: "#FF1493",
    joshua: "#00FFFF",
    narrator: "#FFFF00",
    system: "#AAAAAA"
  };
  const speakerColor = speakerColors[line.speaker] ?? "#FFFFFF";
  const name = speakerLabel ?? (line.speaker === "carol" ? "Carol" : line.speaker === "joshua" ? "Joshua" : line.speaker === "narrator" ? "— Narrator —" : "SYSTEM");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "data-ocid": "dialogue.dialog",
      className: "w-full px-3 pb-3 text-left",
      onClick: skipOrNext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative border-2 rounded p-3",
          style: {
            borderColor: speakerColor,
            background: "rgba(10,14,39,0.93)",
            boxShadow: `0 0 16px ${speakerColor}55, inset 0 0 12px rgba(0,0,0,0.6)`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute -top-3 left-4 px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-widest rounded-sm",
                style: {
                  color: speakerColor,
                  background: "#0a0e27",
                  border: `1px solid ${speakerColor}`
                },
                children: name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm leading-relaxed text-foreground pt-1 min-h-[56px]", children: [
              displayedText,
              !done && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-4 ml-0.5 bg-foreground animate-pulse" })
            ] }),
            done && line.choices && line.choices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-col gap-2", children: line.choices.map((choice) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              NeonButton,
              {
                variant: choice.relationshipDelta > 0 ? "pink" : "blue",
                size: "sm",
                fullWidth: true,
                "data-ocid": `dialogue.choice.${choice.id}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onChoice == null ? void 0 : onChoice(choice);
                },
                children: choice.text
              },
              choice.id
            )) }),
            done && (!line.choices || line.choices.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute bottom-2 right-3 font-mono text-xs animate-pulse",
                style: { color: speakerColor },
                children: "»"
              }
            )
          ]
        }
      )
    }
  );
}
const scenes = {
  intro: {
    id: "intro",
    backgroundType: "airport",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "Kolkata, India. 4:23 AM. Gate 7. Neon lights flicker against rain-slicked concrete. An Akasa Air 737 waits on the tarmac."
      },
      {
        speaker: "carol",
        text: "I'm Carol. Cabin Crew, Akasa Air. Tonight's route takes me from Kolkata to Dubai, across the Atlantic storm bands, through the Caribbean — to Panama City."
      },
      {
        speaker: "carol",
        text: "Six legs. Eighteen hours. Every bump, every passenger, every emergency. I face them all with one thought: get to Joshua."
      },
      {
        speaker: "carol",
        text: "He's been waiting three months for me to make it there. Tonight, finally, I fly to him."
      },
      {
        speaker: "carol",
        text: "Ready to begin?",
        choices: [
          {
            id: "yes",
            text: "♥ Let's go, Carol.",
            relationshipDelta: 1,
            nextDialogueId: "kolkata_before"
          },
          {
            id: "nervous",
            text: "... I'm nervous for you.",
            relationshipDelta: 1,
            nextDialogueId: "kolkata_before"
          }
        ]
      }
    ],
    nextRoute: "/dialogue/kolkata_before"
  },
  kolkata_before: {
    id: "kolkata_before",
    backgroundType: "airport",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 01 — KOLKATA DEPARTURE — NSC Bose International"
      },
      {
        speaker: "carol",
        text: "Pre-flight checks: ✓ Seatbelt demos rehearsed. ✓ Emergency equipment inspected. ✓ Trolleys secured."
      },
      {
        speaker: "carol",
        text: "Passengers are boarding. The gate agent waves me forward. My phone buzzes one last time before I have to switch to flight mode."
      },
      {
        speaker: "joshua",
        text: `"Hey. I know you're boarding soon. Just — be safe up there, okay? I'll be at Arrivals when you land. I promise." ♥`
      },
      {
        speaker: "carol",
        text: "What do I reply?",
        choices: [
          {
            id: "love",
            text: '"I love you, Joshua. See you in Panama City."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          },
          {
            id: "strong",
            text: `"I've got this. Save me a seat at the reunion."`,
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          }
        ]
      }
    ],
    nextRoute: "/minigame/turbulence__0"
  },
  kolkata_after: {
    id: "kolkata_after",
    backgroundType: "aircraft",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "Takeoff successful. The runway lights blur and vanish. Kolkata fades beneath the monsoon clouds."
      },
      {
        speaker: "carol",
        text: "First leg complete. Seat belt signs off. I walk the aisle, checking on passengers. Smiling even when I'm tired."
      },
      {
        speaker: "narrator",
        text: "Carol marks Kolkata on the in-flight route map. One city down. Five to go. ✈"
      }
    ],
    nextRoute: "/map"
  },
  dubai_before: {
    id: "dubai_before",
    backgroundType: "phone",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 02 — DUBAI LAYOVER — Emirates Terminal — 11:45 PM"
      },
      {
        speaker: "carol",
        text: "Thirty-eight passengers. Meal service above a desert night sky. The trolley rocks with every air pocket."
      },
      { speaker: "carol", text: "I can do this. Smile. Serve. Survive." },
      {
        speaker: "joshua",
        text: `"(Text message) Thinking of you up there somewhere. Eat something, Carol — you always forget when you're focused. Also: I bought a new duvet for when you arrive 😊"`
      },
      {
        speaker: "carol",
        text: "That man. He knows me completely. Quick reply — then back to work.",
        choices: [
          {
            id: "warm",
            text: '"Already had noodles AND a croissant. Stop worrying 😊 The duvet better be pink."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          },
          {
            id: "focus",
            text: '"Working! Talk later ✈" (then focus on the service cart)',
            relationshipDelta: 0,
            nextDialogueId: "__minigame__"
          }
        ]
      }
    ],
    nextRoute: "/minigame/passenger__1"
  },
  dubai_after: {
    id: "dubai_after",
    backgroundType: "aircraft",
    showJoshua: false,
    lines: [
      {
        speaker: "carol",
        text: "Every passenger served. The elderly couple in row 12 thanked me by name. Small moments that make this real."
      },
      {
        speaker: "narrator",
        text: "Dubai layover: three hours in a terminal that never sleeps. Neon signs. Duty-free perfume. Arabic coffee."
      },
      {
        speaker: "carol",
        text: "I find a quiet corner, take off my heels, and send Joshua a voice note. He replies with a photo of the apartment — a candle lit, pasta simmering. Waiting."
      }
    ],
    nextRoute: "/map"
  },
  atlantic_before: {
    id: "atlantic_before",
    backgroundType: "rainy",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 03 — STORM OVER ATLANTIC — 35,000 ft — North Atlantic Track Foxtrot"
      },
      {
        speaker: "system",
        text: "⚠ WEATHER ALERT: Severe turbulence band ahead. Category 3. Duration: unknown. Fasten seatbelts."
      },
      {
        speaker: "carol",
        text: "The captain's voice is calm. His knuckles on the intercom button aren't. I know the difference — five years of flying teaches you that."
      },
      {
        speaker: "joshua",
        text: `"(Voicemail, recorded two hours ago) Hey... you're crossing the Atlantic now. The weather app says there's a big one out there. I'm not sleeping until you're through it. I love you."`
      },
      {
        speaker: "carol",
        text: "Deep breath. Shoulders back. Strap in, Carol.",
        choices: [
          {
            id: "brave",
            text: '"For you, Joshua — I fly through every storm."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          },
          {
            id: "pro",
            text: "(Professional mode: activate. This is what I trained for.)",
            relationshipDelta: 0,
            nextDialogueId: "__minigame__"
          }
        ]
      }
    ],
    nextRoute: "/minigame/turbulence__2"
  },
  atlantic_after: {
    id: "atlantic_after",
    backgroundType: "night-sky",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "The storm breaks. Stars reappear, vast and silent. The Atlantic stretches silver and infinite below the wingtip."
      },
      {
        speaker: "carol",
        text: "Through the worst of it. Halfway across the world now. Every mile a mile closer to him."
      }
    ],
    nextRoute: "/map"
  },
  night_before: {
    id: "night_before",
    backgroundType: "phone",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 04 — NIGHT FLIGHT — 02:17 AM — Mid-Atlantic — Satellite link active"
      },
      {
        speaker: "carol",
        text: "The cabin is dark. Most passengers are asleep. I steal five minutes in the galley and call Joshua via satellite."
      },
      {
        speaker: "joshua",
        text: `"Carol! You're calling from 35,000 feet? That's actually the most romantic thing you've ever done and I don't know how to feel about it."`
      },
      {
        speaker: "carol",
        text: '"Only for you. Tell me something. Anything. I miss the sound of your voice."'
      },
      {
        speaker: "joshua",
        text: `"I cleaned the apartment three times. Made your favourite pasta twice — the first batch was bad, don't ask. I bought flowers and then felt embarrassed buying flowers and now there are flowers. Also I may have rehearsed what I'm going to say when I see you."`
      },
      {
        speaker: "carol",
        text: "My heart does something complicated and warm and completely overwhelming.",
        choices: [
          {
            id: "soft",
            text: '"Save me a plate. And a very long hug. And tell me what you rehearsed."',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          },
          {
            id: "tease",
            text: `"You cleaned THREE times?? Joshua, I'm scared to see the receipts."`,
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          }
        ]
      }
    ],
    nextRoute: "/minigame/passenger__3"
  },
  night_after: {
    id: "night_after",
    backgroundType: "night-sky",
    showJoshua: false,
    lines: [
      {
        speaker: "narrator",
        text: "Dawn breaks somewhere over the Caribbean. Pink and gold light floods the cabin portholes."
      },
      { speaker: "carol", text: "One more leg. Almost there. I can feel it." }
    ],
    nextRoute: "/map"
  },
  emergency_before: {
    id: "emergency_before",
    backgroundType: "emergency",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 05 — EMERGENCY DESCENT — Caribbean Airspace — 22,000 ft and falling"
      },
      {
        speaker: "system",
        text: "🚨 HYDRAULIC PRESSURE WARNING. CABIN CREW: BRACE POSITIONS. EMERGENCY PROTOCOL ALPHA INITIATED."
      },
      {
        speaker: "carol",
        text: "This is what five years of training is for. Forty-two lives. Stay calm. Be the calm they need."
      },
      {
        speaker: "joshua",
        text: `"(Text, urgent) Carol — why is there a news alert about an Akasa flight diverting near Panama? That ISN'T your flight, right?? Please text me back right now."`
      },
      {
        speaker: "carol",
        text: "No time. Lives are in my hands right now.",
        choices: [
          {
            id: "quick",
            text: `(Send: "All good. Don't panic. Working.") [then emergency protocol]`,
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          },
          {
            id: "focus_only",
            text: "(No reply — full focus on the emergency. He'll understand.)",
            relationshipDelta: 0,
            nextDialogueId: "__minigame__"
          }
        ]
      }
    ],
    nextRoute: "/minigame/emergency__4"
  },
  emergency_after: {
    id: "emergency_after",
    backgroundType: "aircraft",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "Emergency averted. The plane descends safely through Caribbean clouds. Forty-two passengers applaud. Carol smiles and her hands are still shaking."
      },
      {
        speaker: "carol",
        text: "All safe. Every single one of them."
      },
      {
        speaker: "joshua",
        text: `"Carol I've been staring at FlightRadar for forty minutes. Please tell me you're okay. PLEASE."`
      },
      {
        speaker: "carol",
        text: `"I'm okay. I promise. All passengers are safe. Twenty minutes to Panama City. I'll see you soon." ♥`
      }
    ],
    nextRoute: "/map"
  },
  panama_before: {
    id: "panama_before",
    backgroundType: "sunset",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "LEVEL 06 — PANAMA CITY ARRIVAL — Tocumen International Airport — Final Approach"
      },
      {
        speaker: "carol",
        text: "The lights of Panama City glitter below. After everything — the storms, the emergency, the sleepless Atlantic crossing — we're finally here."
      },
      {
        speaker: "joshua",
        text: `"I'm at Arrivals. I've been here for two hours. I can see your plane on FlightRadar. It just turned onto final approach. Carol I'm — " (message cuts off)`
      },
      { speaker: "carol", text: `"Joshua... don't cry before I even land."` },
      { speaker: "joshua", text: '"...Too late."' },
      {
        speaker: "carol",
        text: "Final approach. Land this plane. Then run to him.",
        choices: [
          {
            id: "smile",
            text: '(Smile through everything) "Here we go. Last one." ♥',
            relationshipDelta: 1,
            nextDialogueId: "__minigame__"
          },
          {
            id: "captain",
            text: `"Professional Carol. One final time. Then it's over."`,
            relationshipDelta: 0,
            nextDialogueId: "__minigame__"
          }
        ]
      }
    ],
    nextRoute: "/minigame/emergency__5"
  },
  ending: {
    id: "ending",
    backgroundType: "arrivals",
    showJoshua: true,
    lines: [
      {
        speaker: "narrator",
        text: "Wheels touch tarmac. Tocumen International Airport. 14:47 local time. The intercom chimes."
      },
      {
        speaker: "carol",
        text: "Gate secured. Passengers disembarking. I thank each one as they pass. Hands finally still."
      },
      {
        speaker: "narrator",
        text: "She walks through arrivals in her pink Akasa uniform — slightly wrinkled, heart completely full."
      },
      { speaker: "narrator", text: "And there he is." },
      { speaker: "joshua", text: '"Carol."' },
      { speaker: "carol", text: '"Joshua."' },
      {
        speaker: "narrator",
        text: `He's holding a paper sign. It says: "Welcome Home, Carol ♥" — written in red marker, slightly crooked.`
      },
      {
        speaker: "carol",
        text: "Six levels. Three oceans. A storm, an emergency, forty-two passengers, and eighteen hours of sky."
      },
      { speaker: "carol", text: "All of it — all of it — for this." }
    ],
    nextRoute: "/ending"
  }
};
const BG_GRADIENTS = {
  airport: "linear-gradient(180deg, #0a0e27 0%, #0d1048 40%, #1a0a3a 100%)",
  aircraft: "linear-gradient(180deg, #050820 0%, #0a1040 50%, #0a0e27 100%)",
  phone: "linear-gradient(180deg, #0a0e27 0%, #150530 60%, #0a0820 100%)",
  "night-sky": "linear-gradient(180deg, #020408 0%, #040818 50%, #0a0e27 100%)",
  rainy: "linear-gradient(180deg, #080c1a 0%, #0e1828 50%, #0a1214 100%)",
  emergency: "linear-gradient(180deg, #1a0508 0%, #250808 40%, #1a0e1a 100%)",
  sunset: "linear-gradient(180deg, #0a0e27 0%, #1a0830 50%, #2a0a1a 100%)",
  arrivals: "linear-gradient(180deg, #0a0e27 0%, #0a1640 60%, #0a1830 100%)"
};
const BG_ACCENT = {
  airport: "#00FFFF",
  aircraft: "#4488FF",
  phone: "#FF1493",
  "night-sky": "#8844FF",
  rainy: "#44AACC",
  emergency: "#FF4422",
  sunset: "#FF9944",
  arrivals: "#FF1493"
};
const SCENE_LABELS = {
  airport: "✈ AIRPORT — GATE 7",
  aircraft: "✈ IN-FLIGHT",
  phone: "📱 PHONE / TEXT SCENE",
  "night-sky": "🌌 NIGHT FLIGHT",
  rainy: "⛈ STORM ZONE",
  emergency: "🚨 EMERGENCY PROTOCOL",
  sunset: "🌅 FINAL APPROACH",
  arrivals: "❤ ARRIVALS HALL"
};
const CHARACTER_W = 320;
const CHARACTER_H = 120;
function SceneDisplay({
  bgType,
  speaker,
  showJoshua
}) {
  const canvasRef = reactExports.useRef(null);
  const frameRef = reactExports.useRef(0);
  const animRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      ctx.clearRect(0, 0, CHARACTER_W, CHARACTER_H);
      const bg = ctx.createLinearGradient(0, 0, 0, CHARACTER_H);
      const bgMap = {
        airport: ["#0a0e27", "#1a0a3a"],
        aircraft: ["#050820", "#0a1040"],
        phone: ["#0a0e27", "#150530"],
        "night-sky": ["#020408", "#040818"],
        rainy: ["#080c1a", "#0e1828"],
        emergency: ["#1a0508", "#250808"],
        sunset: ["#0a0e27", "#2a0a1a"],
        arrivals: ["#0a0e27", "#0a1640"]
      };
      const [c0, c1] = bgMap[bgType];
      bg.addColorStop(0, c0);
      bg.addColorStop(1, c1);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      for (let i = 0; i < 30; i++) {
        const blink = Math.sin(f * 0.04 + i * 1.3) > 0.4 ? 1 : 0.3;
        ctx.globalAlpha = blink * 0.8;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect((i * 3731 + 17) % CHARACTER_W, (i * 2903 + 11) % 60, 1, 1);
      }
      ctx.globalAlpha = 1;
      if (bgType === "rainy") {
        ctx.strokeStyle = "#4488AA44";
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
          const rx = (f * 2 + i * 29) % CHARACTER_W;
          const ry = (f * 3 + i * 17) % CHARACTER_H;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 8);
          ctx.stroke();
        }
      }
      if (bgType === "emergency") {
        const alertAlpha = 0.15 + Math.sin(f * 0.15) * 0.1;
        ctx.fillStyle = `rgba(255,40,0,${alertAlpha})`;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }
      if (bgType === "sunset") {
        const glowGrad = ctx.createRadialGradient(
          CHARACTER_W / 2,
          CHARACTER_H + 20,
          10,
          CHARACTER_W / 2,
          CHARACTER_H + 20,
          100
        );
        glowGrad.addColorStop(0, "rgba(255,100,50,0.3)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }
      if (bgType === "phone") {
        const phoneGrad = ctx.createRadialGradient(
          CHARACTER_W - 60,
          CHARACTER_H / 2,
          5,
          CHARACTER_W - 60,
          CHARACTER_H / 2,
          50
        );
        phoneGrad.addColorStop(0, "rgba(0,255,255,0.12)");
        phoneGrad.addColorStop(1, "transparent");
        ctx.fillStyle = phoneGrad;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }
      if (bgType === "arrivals") {
        const arrGlow = ctx.createRadialGradient(160, 100, 5, 160, 100, 80);
        arrGlow.addColorStop(0, "rgba(255,20,147,0.12)");
        arrGlow.addColorStop(1, "transparent");
        ctx.fillStyle = arrGlow;
        ctx.fillRect(0, 0, CHARACTER_W, CHARACTER_H);
      }
      const carolBob = Math.sin(f * 0.08) * 2;
      const carolX = showJoshua ? CHARACTER_W / 2 - 60 : CHARACTER_W / 2 - 20;
      drawPixelSprite(ctx, carolSprite, carolX, 25 + carolBob, 4);
      if (showJoshua) {
        const jBob = Math.sin(f * 0.08 + 1.1) * 2;
        const joshuaX = CHARACTER_W / 2 + 20;
        drawPixelSprite(ctx, joshuaSprite, joshuaX, 25 + jBob, 4);
        if (bgType === "phone") {
          ctx.strokeStyle = `rgba(0,255,255,${0.3 + Math.sin(f * 0.1) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(carolX + 24, 50);
          ctx.lineTo(joshuaX + 4, 50);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "#00FFFF";
          ctx.fillText("📱", CHARACTER_W / 2, 42);
        }
        if (bgType === "arrivals") {
          ctx.font = "bold 7px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "#FF1493";
          ctx.shadowColor = "#FF1493";
          ctx.shadowBlur = 6;
          ctx.fillText("Welcome Home ♥", CHARACTER_W / 2 + 32, 18);
          ctx.shadowBlur = 0;
        }
      }
      if (speaker === "carol" || speaker === "narrator") {
        ctx.strokeStyle = "rgba(255,20,147,0.18)";
        ctx.lineWidth = 2;
        ctx.strokeRect(carolX - 4, 20, 36, 64);
      } else if (speaker === "joshua" && showJoshua) {
        const joshuaX = CHARACTER_W / 2 + 20;
        ctx.strokeStyle = "rgba(0,255,255,0.22)";
        ctx.lineWidth = 2;
        ctx.strokeRect(joshuaX - 4, 20, 36, 64);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [bgType, speaker, showJoshua]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: CHARACTER_W,
      height: CHARACTER_H,
      className: "w-full",
      style: { imageRendering: "pixelated", display: "block" }
    }
  );
}
function DialoguePage() {
  const { id } = useParams({ from: "/dialogue/$id" });
  const navigate = useNavigate();
  const { addRelationshipPoint } = useGameStore();
  const scene = scenes[id];
  const [lineIndex, setLineIndex] = reactExports.useState(0);
  const handleNext = reactExports.useCallback(() => {
    if (!scene) return;
    if (lineIndex < scene.lines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      if (scene.nextRoute) {
        navigate({ to: scene.nextRoute });
      } else {
        navigate({ to: "/map" });
      }
    }
  }, [scene, lineIndex, navigate]);
  const handleChoice = reactExports.useCallback(
    (choice) => {
      addRelationshipPoint(choice.relationshipDelta);
      if (choice.nextDialogueId === "__minigame__") {
        if (scene == null ? void 0 : scene.nextRoute) {
          navigate({ to: scene.nextRoute });
        } else {
          navigate({ to: "/map" });
        }
      } else if (choice.nextDialogueId) {
        navigate({
          to: "/dialogue/$id",
          params: { id: choice.nextDialogueId }
        });
      } else {
        handleNext();
      }
    },
    [addRelationshipPoint, scene, navigate, handleNext]
  );
  if (!scene) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen gap-4 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm", style: { color: "#FF1493" }, children: [
        "Scene not found: ",
        id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "font-mono text-xs tap-feedback",
          style: { color: "#00FFFF" },
          onClick: () => navigate({ to: "/map" }),
          children: "← BACK TO MAP"
        }
      )
    ] });
  }
  const currentLine = scene.lines[lineIndex];
  const accent = BG_ACCENT[scene.backgroundType];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "dialogue.page",
      className: "flex flex-col min-h-screen",
      style: { background: BG_GRADIENTS[scene.backgroundType] },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2 border-b",
            style: {
              borderColor: `${accent}22`,
              background: "rgba(10,14,39,0.88)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "dialogue.cancel_button",
                  className: "font-mono text-xs tap-feedback",
                  style: { color: "#555577" },
                  onClick: () => navigate({ to: "/map" }),
                  children: "← SKIP"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-xs uppercase tracking-widest",
                  style: { color: `${accent}99` },
                  children: id.replace(/_/g, " ").toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", style: { color: "#333366" }, children: [
                lineIndex + 1,
                "/",
                scene.lines.length
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b", style: { borderColor: `${accent}22` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SceneDisplay,
          {
            bgType: scene.backgroundType,
            speaker: currentLine.speaker,
            showJoshua: scene.showJoshua ?? false
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 py-1 font-mono text-xs uppercase tracking-widest text-center scanline",
            style: {
              color: `${accent}88`,
              background: "rgba(10,14,39,0.6)",
              borderBottom: `1px solid ${accent}22`
            },
            children: SCENE_LABELS[scene.backgroundType]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-end pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogueBox,
            {
              line: currentLine,
              onNext: handleNext,
              onChoice: handleChoice
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 px-4 pt-1", children: scene.lines.map((_line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-full transition-all duration-300",
              style: {
                width: i === lineIndex ? "12px" : "6px",
                height: "6px",
                background: i <= lineIndex ? accent : "#333366",
                boxShadow: i === lineIndex ? `0 0 6px ${accent}` : "none"
              }
            },
            `prog-${scene.id}-${scene.lines.length}-${i}`
          )) })
        ] })
      ]
    }
  );
}
export {
  DialoguePage as default
};
