// Pixel art sprite renderer — no external images needed

export type PixelColor = string | null; // null = transparent

export interface PixelSprite {
  pixels: PixelColor[][];
  scale?: number;
}

export function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  sprite: PixelSprite,
  x: number,
  y: number,
  scale = 4,
) {
  const s = sprite.scale ?? scale;
  for (let row = 0; row < sprite.pixels.length; row++) {
    for (let col = 0; col < sprite.pixels[row].length; col++) {
      const color = sprite.pixels[row][col];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * s, y + row * s, s, s);
    }
  }
}

// Carol sprite — Akasa Air hostess: dark hair bun, pink uniform, red lips
export const carolSprite: PixelSprite = {
  pixels: [
    // Row 0–1: hair bun
    [null, null, "#1a0a0a", "#1a0a0a", "#1a0a0a", null],
    [null, "#1a0a0a", "#2d1010", "#2d1010", "#2d1010", "#1a0a0a"],
    // Row 2–4: face
    [null, "#f4c5a8", "#f4c5a8", "#f4c5a8", "#f4c5a8", null],
    ["#1a0a0a", "#f4c5a8", "#2d1b6b", "#f4c5a8", "#2d1b6b", "#f4c5a8"],
    [null, "#f4c5a8", "#f4c5a8", "#CC0055", "#f4c5a8", null],
    // Row 5: neck
    [null, null, "#f4c5a8", "#f4c5a8", null, null],
    // Row 6–9: pink uniform
    [null, "#FF1493", "#FF1493", "#FF1493", "#FF1493", null],
    ["#FF1493", "#FF1493", "#FFFFFF", "#FFFFFF", "#FF1493", "#FF1493"],
    ["#FF1493", "#FF1493", "#FF1493", "#FF1493", "#FF1493", "#FF1493"],
    [null, "#FF1493", "#FF1493", "#FF1493", "#FF1493", null],
    // Row 10–11: skirt
    [null, "#111133", "#111133", "#111133", "#111133", null],
    [null, "#111133", "#111133", "#111133", "#111133", null],
    // Row 12: legs
    [null, "#f4c5a8", null, null, "#f4c5a8", null],
  ],
};

// Joshua sprite — tall, beard, glasses, red flannel
export const joshuaSprite: PixelSprite = {
  pixels: [
    // Row 0–1: dark hair
    [null, "#3d2700", "#3d2700", "#3d2700", "#3d2700", null],
    ["#3d2700", "#4a3000", "#4a3000", "#4a3000", "#4a3000", "#3d2700"],
    // Row 2–4: face with beard
    [null, "#d4956a", "#d4956a", "#d4956a", "#d4956a", null],
    [null, "#d4956a", "#333333", "#d4956a", "#333333", null], // glasses
    ["#5c3317", "#d4956a", "#5c3317", "#5c3317", "#d4956a", "#5c3317"], // beard
    // Row 5: neck
    [null, null, "#d4956a", "#d4956a", null, null],
    // Row 6–9: red flannel
    [null, "#CC2200", "#CC2200", "#CC2200", "#CC2200", null],
    ["#CC2200", "#CC2200", "#DDDDDD", "#DDDDDD", "#CC2200", "#CC2200"],
    ["#CC2200", "#881100", "#CC2200", "#CC2200", "#881100", "#CC2200"],
    [null, "#CC2200", "#CC2200", "#CC2200", "#CC2200", null],
    // Row 10–11: jeans
    [null, "#1a3a6a", "#1a3a6a", "#1a3a6a", "#1a3a6a", null],
    [null, "#1a3a6a", "#1a3a6a", "#1a3a6a", "#1a3a6a", null],
    // Row 12: feet
    [null, "#333333", null, null, "#333333", null],
  ],
};

// Plane sprite
export const planeSprite: PixelSprite = {
  pixels: [
    [null, null, null, "#00FFFF", "#00FFFF", null, null, null, null, null],
    [
      null,
      null,
      "#00FFFF",
      "#DDDDDD",
      "#DDDDDD",
      "#00FFFF",
      null,
      null,
      null,
      null,
    ],
    [
      "#00FFFF",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#00FFFF",
      null,
      null,
    ],
    [
      null,
      "#DDDDDD",
      "#AAAAAA",
      "#AAAAAA",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
      "#DDDDDD",
    ],
    [
      null,
      null,
      "#00FFFF",
      "#DDDDDD",
      "#DDDDDD",
      "#00FFFF",
      null,
      "#00FFFF",
      null,
      null,
    ],
    [null, null, null, null, "#00FFFF", null, null, null, null, null],
  ],
};

// Heart icon for health bar
export const heartSprite: PixelSprite = {
  pixels: [
    [null, "#FF1493", null, "#FF1493", null],
    ["#FF1493", "#FF1493", "#FF1493", "#FF1493", "#FF1493"],
    ["#FF1493", "#FF1493", "#FF1493", "#FF1493", "#FF1493"],
    [null, "#FF1493", "#FF1493", "#FF1493", null],
    [null, null, "#FF1493", null, null],
  ],
  scale: 3,
};

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  levelId: number,
  width: number,
  height: number,
) {
  const gradients: Record<number, [string, string]> = {
    0: ["#0a0e27", "#1a0a3a"], // Kolkata night
    1: ["#0a1a0a", "#1a2a0a"], // Dubai desert night
    2: ["#050a1a", "#0a1530"], // Storm over Atlantic
    3: ["#020408", "#0a0a1a"], // Deep night flight
    4: ["#1a0505", "#0a0e27"], // Emergency red
    5: ["#0a0e27", "#1a0a2a"], // Panama city
  };
  const [top, bottom] = gradients[levelId] ?? ["#0a0e27", "#1a0a3a"];
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Stars
  ctx.fillStyle = "#FFFFFF";
  const seed = levelId * 137;
  for (let i = 0; i < 60; i++) {
    const sx = (seed * (i + 7) * 3731) % width;
    const sy = (seed * (i + 3) * 2903) % (height * 0.6);
    const size = i % 5 === 0 ? 2 : 1;
    ctx.fillRect(sx, sy, size, size);
  }

  // Ground strip at bottom
  ctx.fillStyle = "#0d1240";
  ctx.fillRect(0, height - 60, width, 60);

  // Neon ground line
  ctx.strokeStyle = "#FF1493";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height - 60);
  ctx.lineTo(width, height - 60);
  ctx.stroke();
}
