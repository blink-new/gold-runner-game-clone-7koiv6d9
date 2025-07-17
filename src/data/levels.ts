import { Level, CellType } from '../types/game';

// Helper function to create level layouts
const createLevel = (
  id: number,
  name: string,
  layout: string[],
  timeLimit: number = 300
): Level => {
  const height = layout.length;
  const width = layout[0].length;
  const grid: CellType[][] = [];
  const enemies: any[] = [];
  const gold: any[] = [];
  let playerStart = { x: 1, y: height - 2 };

  // Convert string layout to grid
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      const char = layout[y][x];
      switch (char) {
        case '#':
          grid[y][x] = 'concrete';
          break;
        case 'B':
          grid[y][x] = 'brick';
          break;
        case 'L':
          grid[y][x] = 'ladder';
          break;
        case 'R':
          grid[y][x] = 'rope';
          break;
        case 'G':
          grid[y][x] = 'empty';
          gold.push({ position: { x, y }, collected: false });
          break;
        case 'E':
          grid[y][x] = 'empty';
          enemies.push({ 
            position: { x, y }, 
            direction: 'left', 
            type: 'guard', 
            isAlive: true, 
            respawnTimer: 0 
          });
          break;
        case 'P':
          grid[y][x] = 'empty';
          playerStart = { x, y };
          break;
        default:
          grid[y][x] = 'empty';
      }
    }
  }

  return {
    id,
    name,
    width,
    height,
    timeLimit,
    layout: grid,
    playerStart,
    enemies,
    gold
  };
};

export const levels: Level[] = [
  // Level 1 - Tutorial
  createLevel(1, "First Steps", [
    "######################",
    "#                    #",
    "#  G    G    G    G  #",
    "#BBBBBBBBBBBBBBBBBBBB#",
    "#                    #",
    "#  L              L  #",
    "#  L    BBBBBB    L  #",
    "#  L      G       L  #",
    "#  LBBBBBBBBBBBBBB L #",
    "#  L              L  #",
    "#  L    E    E    L  #",
    "#BBBBBBBBBBBBBBBBBBBB#",
    "#         P          #",
    "######################"
  ], 180),

  // Level 2 - Basic Challenge
  createLevel(2, "Gold Rush", [
    "######################",
    "#                    #",
    "#G  BBBB  G  BBBB  G #",
    "#L       BLB       L#",
    "#L   G   BLB   G   L#",
    "#LBBBBBBBBLBBBBBBBBL#",
    "#L       BLB       L#",
    "#L   E   BLB   E   L#",
    "#LBBBBBBBBLBBBBBBBBL#",
    "#L                 L#",
    "#L    G     G      L#",
    "#LBBBBBBBBBBBBBBBBBL#",
    "#         P          #",
    "######################"
  ], 240),

  // Level 3 - Rope Challenge
  createLevel(3, "Hanging Around", [
    "######################",
    "#                    #",
    "#  G  RRRRRRRR  G    #",
    "#  L           BL    #",
    "#  L     G     BL    #",
    "#  LBBBBBBBBBBBBL    #",
    "#  L             RRRR#",
    "#  L    E         G L#",
    "#  LBBBBBBBBBBBBBBBB #",
    "#  L                 #",
    "#  L    G     G      #",
    "#BBBBBBBBBBBBBBBBBBBB#",
    "#         P          #",
    "######################"
  ], 300),

  // Level 4 - Multiple Floors
  createLevel(4, "Tower Climb", [
    "######################",
    "#        G           #",
    "#BBBBBBBBBBBBBBBBBBBB#",
    "#L     E       E    L#",
    "#L  G         G     L#",
    "#LBBBBBBBBBBBBBBBBBBL#",
    "#L                  L#",
    "#L    G       G     L#",
    "#LBBBBBBBBBBBBBBBBBBL#",
    "#L     E       E    L#",
    "#L  G         G     L#",
    "#LBBBBBBBBBBBBBBBBBBL#",
    "#         P          #",
    "######################"
  ], 360),

  // Level 5 - Complex Layout
  createLevel(5, "Maze Runner", [
    "######################",
    "#G                  G#",
    "#BBBB  LRRRRRRL  BBBB#",
    "#   B  L       L  B  #",
    "#   B  L   G   L  B  #",
    "#   BBBLBBBBBBBBLBBB #",
    "#      L   E   L     #",
    "#   BBBLBBBBBBBBLBBB #",
    "#   B  L   G   L  B  #",
    "#   B  L       L  B  #",
    "#BBBB  LRRRRRRL  BBBB#",
    "#      L   P   L     #",
    "#BBBBBBBBBBBBBBBBBBBB#",
    "######################"
  ], 420)
];

// Generate additional levels programmatically for the remaining 95 levels
const generateLevel = (id: number): Level => {
  const patterns = [
    // Pattern 1: Horizontal layers
    [
      "######################",
      "#                    #",
      "#G G G G G G G G G G #",
      "#BBBBBBBBBBBBBBBBBBBB#",
      "#                    #",
      "#  E    L    L    E  #",
      "#BBBBBBBLBBBBBLBBBBBB#",
      "#       L    L       #",
      "#   G   L    L   G   #",
      "#BBBBBBBBBBBBBBBBBBB #",
      "#                    #",
      "#BBBBBBBBBBBBBBBBBBBB#",
      "#         P          #",
      "######################"
    ],
    // Pattern 2: Vertical towers
    [
      "######################",
      "#G  L    G    L    G#",
      "#B  L    B    L    B#",
      "#B  L    B    L    B#",
      "#B  LBBBBBBBBBL    B#",
      "#B  L    E    L    B#",
      "#B  LBBBBBBBBBL    B#",
      "#B  L         L    B#",
      "#B  L    G    L    B#",
      "#BBBLBBBBBBBBBBLBBBB#",
      "#   L         L     #",
      "#BBBBBBBBBBBBBBBBBBBB#",
      "#         P          #",
      "######################"
    ],
    // Pattern 3: Spiral design
    [
      "######################",
      "#GBBBBBBBBBBBBBBBBBBG#",
      "#L                  L#",
      "#L  BBBBBBBBBBBBBB  L#",
      "#L  B            B  L#",
      "#L  B  BBBBBBBB  B  L#",
      "#L  B  B  G E B  B  L#",
      "#L  B  BBBBBBBB  B  L#",
      "#L  B            B  L#",
      "#L  BBBBBBBBBBBBBB  L#",
      "#L                  L#",
      "#LBBBBBBBBBBBBBBBBBB #",
      "#         P          #",
      "######################"
    ]
  ];

  const pattern = patterns[id % patterns.length];
  const difficultyMultiplier = Math.floor(id / 10) + 1;
  const timeLimit = Math.max(180, 600 - (id * 3)); // Decrease time as levels progress

  return createLevel(id, `Level ${id}`, pattern, timeLimit);
};

// Generate all 100 levels
for (let i = 6; i <= 100; i++) {
  levels.push(generateLevel(i));
}

export const getLevelById = (id: number): Level | undefined => {
  return levels.find(level => level.id === id);
};

export const getTotalLevels = (): number => {
  return levels.length;
};