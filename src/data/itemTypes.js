export const ITEM_TYPES = {
  ball: {
    textureKey: 'item-ball',
    motion: 'fall',
    baseSpeed: 126,   // reduced by 0.3× from 180
    points: 10,
  },
  duck: {
    textureKey: 'item-duck',
    motion: 'fly',    // horizontal sine-wave flight, same as bird
    baseSpeed: 112,   // reduced by 0.3× from 160
    points: 15,
  },
  frisbee: {
    textureKey: 'item-frisbee',
    motion: 'fly',
    baseSpeed: 200,
    points: 12,
  },
  butterfly: {
    textureKey: 'item-butterfly',
    motion: 'fly',
    baseSpeed: 120,
    points: 20,
  },
  starfish: {
    textureKey: 'item-starfish',
    motion: 'fly',
    baseSpeed: 200,
    points: 15,
  },
  pinecone: {
    textureKey: 'item-pinecone',
    motion: 'fall',
    baseSpeed: 220,
    points: 12,
  },
  newspaper: {
    textureKey: 'item-newspaper',
    motion: 'arc',
    baseSpeed: 170,
    points: 12,
  },
  snowball: {
    textureKey: 'item-snowball',
    motion: 'fall',
    baseSpeed: 240,
    points: 10,
  },
  coconut: {
    textureKey: 'item-coconut',
    motion: 'fall',
    baseSpeed: 260,
    points: 12,
  },
  bird: {
    textureKey: 'item-bird',
    motion: 'fly',          // sine-wave horizontal flight
    baseSpeed: 155,
    points: 18,
  },
};
