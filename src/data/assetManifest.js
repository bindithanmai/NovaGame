export const ASSETS = {
  // Nova — Golden Retriever sprite sheet
  // frameWidth / frameHeight: size of ONE frame cell in the sheet.
  // If animations look wrong, tweak these two numbers to match your image.
  nova: {
    key: 'nova', w: 64, h: 108, anchor: [0.5, 1.0], color: 0xd4952a,
    path: 'assets/nova/nova-sheet.png',
    frameWidth:  64,   // ← px per frame (512 ÷ 8 columns)
    frameHeight: 48,   // ← px per frame (432 ÷ 9 rows)
    frameCols:   8,    // frames per row in the sheet
    // Row indices → animation mapping (0-based)
    animRows: { idle: 0, run: 3, jump: 6, sneak: 2, gallop: 4, sprint: 5, sit: 7, sleep: 8 },
  },

  // Core catchable items
  'item-ball':    { key: 'item-ball',    w: 36, h: 36, anchor: [0.5, 0.5], color: 0xff4444, path: 'assets/items/ball.png' },
  'item-duck':    { key: 'item-duck',    w: 44, h: 36, anchor: [0.5, 0.5], color: 0xffdd44, path: 'assets/items/duck.png' },
  'item-frisbee': { key: 'item-frisbee', w: 48, h: 16, anchor: [0.5, 0.5], color: 0x44aaff, path: 'assets/items/frisbee.png' },

  // Level-specific items
  'item-butterfly': { key: 'item-butterfly', w: 40, h: 32, anchor: [0.5, 0.5], color: 0xff88cc, path: 'assets/items/butterfly.png' },
  'item-starfish':  { key: 'item-starfish',  w: 36, h: 36, anchor: [0.5, 0.5], color: 0xff9900, path: 'assets/items/starfish.png' },
  'item-pinecone':  { key: 'item-pinecone',  w: 28, h: 36, anchor: [0.5, 0.5], color: 0x885533, path: 'assets/items/pinecone.png' },
  'item-umbrella':  { key: 'item-umbrella',  w: 48, h: 40, anchor: [0.5, 0.5], color: 0x8844ff, path: 'assets/items/umbrella.png' },
  'item-egg':       { key: 'item-egg',       w: 28, h: 36, anchor: [0.5, 0.5], color: 0xffffee, path: 'assets/items/egg.png' },
  'item-newspaper': { key: 'item-newspaper', w: 44, h: 36, anchor: [0.5, 0.5], color: 0xddddcc, path: 'assets/items/newspaper.png' },
  'item-snowball':  { key: 'item-snowball',  w: 36, h: 36, anchor: [0.5, 0.5], color: 0xeeeeff, path: 'assets/items/snowball.png' },
  'item-coconut':   { key: 'item-coconut',   w: 32, h: 36, anchor: [0.5, 0.5], color: 0x885522, path: 'assets/items/coconut.png' },
  'item-fish':      { key: 'item-fish',      w: 44, h: 28, anchor: [0.5, 0.5], color: 0x44ddff, path: 'assets/items/fish.png' },
  'item-orb':       { key: 'item-orb',       w: 36, h: 36, anchor: [0.5, 0.5], color: 0xaaddff, path: 'assets/items/orb.png' },
  'item-bird':      { key: 'item-bird',      w: 40, h: 32, anchor: [0.5, 0.5], color: 0x88aaff, path: 'assets/items/bird.png' },

  // Backgrounds
  'bg-1':  { key: 'bg-1',  w: 800, h: 450, color: 0x87ceeb, path: 'assets/backgrounds/level1.png' },
  'bg-2':  { key: 'bg-2',  w: 800, h: 450, color: 0x4488ff, path: 'assets/backgrounds/level2.png' },
  'bg-3':  { key: 'bg-3',  w: 800, h: 450, color: 0x228833, path: 'assets/backgrounds/level3.png' },
  'bg-4':  { key: 'bg-4',  w: 800, h: 450, color: 0x556677, path: 'assets/backgrounds/level4.png' },
  'bg-5':  { key: 'bg-5',  w: 800, h: 450, color: 0x99cc66, path: 'assets/backgrounds/level5.png' },
  'bg-6':  { key: 'bg-6',  w: 800, h: 450, color: 0x334455, path: 'assets/backgrounds/level6.png' },
  'bg-7':  { key: 'bg-7',  w: 800, h: 450, color: 0xaaccee, path: 'assets/backgrounds/level7.png' },
  'bg-8':  { key: 'bg-8',  w: 800, h: 450, color: 0x336622, path: 'assets/backgrounds/level8.png' },
  'bg-9':  { key: 'bg-9',  w: 800, h: 450, color: 0x115577, path: 'assets/backgrounds/level9.png' },
  'bg-10': { key: 'bg-10', w: 800, h: 450, color: 0x110022, path: 'assets/backgrounds/level10.png' },

  // UI elements
  biscuit: { key: 'biscuit', w: 80, h: 80, anchor: [0.5, 0.5], color: 0xddaa55, path: 'assets/biscuit.png' },
  idli:    { key: 'idli',    w: 100, h: 80, anchor: [0.5, 0.5], color: 0xffffff, path: 'assets/idli.png' },
  heart:   { key: 'heart',   w: 28, h: 28, anchor: [0.5, 0.5], color: 0xff3366, path: 'assets/heart.png' },
  particle: { key: 'particle', w: 8, h: 8, anchor: [0.5, 0.5], color: 0xffffff, path: 'assets/particle.png' },
};
