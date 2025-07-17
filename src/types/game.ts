export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete' | 'victory';
  timeRemaining: number;
}

export interface Player {
  position: Position;
  direction: 'left' | 'right';
  isOnLadder: boolean;
  isDigging: boolean;
  isMoving: boolean;
}

export interface Enemy {
  id: string;
  position: Position;
  direction: 'left' | 'right';
  type: 'guard' | 'robot';
  isAlive: boolean;
  respawnTimer: number;
}

export interface Gold {
  id: string;
  position: Position;
  collected: boolean;
}

export interface Level {
  id: number;
  name: string;
  width: number;
  height: number;
  timeLimit: number;
  layout: CellType[][];
  playerStart: Position;
  enemies: Omit<Enemy, 'id'>[];
  gold: Omit<Gold, 'id'>[];
}

export type CellType = 
  | 'empty'      // Air/walkable space
  | 'brick'      // Destructible blocks
  | 'concrete'   // Indestructible blocks
  | 'ladder'     // Climbable ladders
  | 'rope'       // Horizontal ropes to hang from
  | 'trap'       // Temporary holes from digging
  | 'gold'       // Gold collectibles
  | 'enemy'      // Enemy spawn points
  | 'player';    // Player spawn point

export interface GameConfig {
  cellSize: number;
  gameSpeed: number;
  digDuration: number;
  trapDuration: number;
  enemySpeed: number;
  playerSpeed: number;
}