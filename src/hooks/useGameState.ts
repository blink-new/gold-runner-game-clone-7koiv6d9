import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Enemy, Gold, Level, Position } from '../types/game';
import { getLevelById } from '../data/levels';

const INITIAL_GAME_STATE: GameState = {
  currentLevel: 1,
  score: 0,
  lives: 3,
  gameStatus: 'menu',
  timeRemaining: 300
};

const INITIAL_PLAYER: Player = {
  position: { x: 1, y: 12 },
  direction: 'right',
  isOnLadder: false,
  isDigging: false,
  isMoving: false
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [gold, setGold] = useState<Gold[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [levelLayout, setLevelLayout] = useState<any[][]>([]);

  // Load level data
  const loadLevel = useCallback((levelId: number) => {
    const level = getLevelById(levelId);
    if (!level) return;

    setCurrentLevel(level);
    setLevelLayout([...level.layout]);
    
    // Initialize player position
    setPlayer(prev => ({
      ...prev,
      position: { ...level.playerStart }
    }));

    // Initialize enemies
    const initialEnemies: Enemy[] = level.enemies.map((enemy, index) => ({
      ...enemy,
      id: `enemy-${index}`,
      position: { ...enemy.position }
    }));
    setEnemies(initialEnemies);

    // Initialize gold
    const initialGold: Gold[] = level.gold.map((goldItem, index) => ({
      ...goldItem,
      id: `gold-${index}`,
      position: { ...goldItem.position }
    }));
    setGold(initialGold);

    // Set game state
    setGameState(prev => ({
      ...prev,
      currentLevel: levelId,
      timeRemaining: level.timeLimit,
      gameStatus: 'playing'
    }));
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    setPlayer(INITIAL_PLAYER);
    loadLevel(1);
  }, [loadLevel]);

  // Helper function to check if a position is walkable
  const isWalkable = useCallback((x: number, y: number) => {
    if (!currentLevel || x < 0 || x >= currentLevel.width || y < 0 || y >= currentLevel.height) {
      return false;
    }
    const cell = levelLayout[y]?.[x];
    return cell === 'empty' || cell === 'ladder' || cell === 'rope' || cell === 'trap';
  }, [currentLevel, levelLayout]);

  // Helper function to check if player has ground support
  const hasGroundSupport = useCallback((x: number, y: number) => {
    if (!currentLevel || y >= currentLevel.height - 1) return true; // Bottom of level
    
    const cellBelow = levelLayout[y + 1]?.[x];
    const currentCell = levelLayout[y]?.[x];
    
    // Can stand on solid blocks, ladders, or ropes
    return cellBelow === 'brick' || 
           cellBelow === 'concrete' || 
           currentCell === 'ladder' || 
           currentCell === 'rope';
  }, [currentLevel, levelLayout]);

  // Move player
  const movePlayer = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameState.gameStatus !== 'playing') return;

    setPlayer(prev => {
      const newPosition = { ...prev.position };
      let newDirection = prev.direction;
      let isOnLadder = prev.isOnLadder;
      let canMove = false;

      const currentCell = levelLayout[prev.position.y]?.[prev.position.x];
      isOnLadder = currentCell === 'ladder';

      switch (direction) {
        case 'left':
          newPosition.x = prev.position.x - 1;
          newDirection = 'left';
          // Can move left if target is walkable and has ground support (or on ladder/rope)
          canMove = isWalkable(newPosition.x, newPosition.y) && 
                   (hasGroundSupport(newPosition.x, newPosition.y) || isOnLadder || currentCell === 'rope');
          break;
          
        case 'right':
          newPosition.x = prev.position.x + 1;
          newDirection = 'right';
          // Can move right if target is walkable and has ground support (or on ladder/rope)
          canMove = isWalkable(newPosition.x, newPosition.y) && 
                   (hasGroundSupport(newPosition.x, newPosition.y) || isOnLadder || currentCell === 'rope');
          break;
          
        case 'up':
          newPosition.y = prev.position.y - 1;
          // Can only move up on ladders
          canMove = isOnLadder && isWalkable(newPosition.x, newPosition.y);
          break;
          
        case 'down':
          newPosition.y = prev.position.y + 1;
          // Can move down on ladders or if there's a ladder below
          const cellBelow = levelLayout[newPosition.y]?.[newPosition.x];
          canMove = (isOnLadder || cellBelow === 'ladder') && isWalkable(newPosition.x, newPosition.y);
          break;
      }

      // Only update position if move is valid
      if (canMove) {
        return {
          ...prev,
          position: newPosition,
          direction: newDirection,
          isOnLadder,
          isMoving: true
        };
      } else {
        // Just update direction for left/right even if can't move
        return {
          ...prev,
          direction: newDirection,
          isMoving: false
        };
      }
    });
  }, [gameState.gameStatus, currentLevel, levelLayout, hasGroundSupport, isWalkable]);

  // Gravity system - make player fall if not supported
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || !currentLevel) return;

    const gravityInterval = setInterval(() => {
      setPlayer(prev => {
        const currentCell = levelLayout[prev.position.y]?.[prev.position.x];
        
        // Don't apply gravity if on ladder or rope
        if (currentCell === 'ladder' || currentCell === 'rope') {
          return prev;
        }

        // Check if player has ground support
        if (!hasGroundSupport(prev.position.x, prev.position.y)) {
          const newY = prev.position.y + 1;
          
          // Make sure we don't fall through the bottom or into solid blocks
          if (newY < currentLevel.height && isWalkable(prev.position.x, newY)) {
            return {
              ...prev,
              position: { ...prev.position, y: newY },
              isOnLadder: false,
              isMoving: true
            };
          }
        }

        return prev;
      });
    }, 200); // Apply gravity every 200ms

    return () => clearInterval(gravityInterval);
  }, [gameState.gameStatus, currentLevel, levelLayout, hasGroundSupport, isWalkable]);

  // Enemy AI movement
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || !currentLevel) return;

    const enemyInterval = setInterval(() => {
      setEnemies(prev => prev.map(enemy => {
        if (!enemy.isAlive) return enemy;

        const currentCell = levelLayout[enemy.position.y]?.[enemy.position.x];
        let newPosition = { ...enemy.position };
        let newDirection = enemy.direction;

        // Simple AI: move in current direction, turn around if blocked
        const nextX = enemy.direction === 'left' ? enemy.position.x - 1 : enemy.position.x + 1;
        
        // Check if can move in current direction
        const canMoveForward = isWalkable(nextX, enemy.position.y) && 
                              (hasGroundSupport(nextX, enemy.position.y) || currentCell === 'ladder' || currentCell === 'rope');

        if (canMoveForward) {
          newPosition.x = nextX;
        } else {
          // Turn around if blocked
          newDirection = enemy.direction === 'left' ? 'right' : 'left';
        }

        // Apply gravity to enemies too (unless on ladder/rope)
        if (currentCell !== 'ladder' && currentCell !== 'rope' && !hasGroundSupport(newPosition.x, newPosition.y)) {
          const fallY = newPosition.y + 1;
          if (fallY < currentLevel.height && isWalkable(newPosition.x, fallY)) {
            newPosition.y = fallY;
          }
        }

        return {
          ...enemy,
          position: newPosition,
          direction: newDirection
        };
      }));
    }, 300); // Move enemies every 300ms

    return () => clearInterval(enemyInterval);
  }, [gameState.gameStatus, currentLevel, levelLayout, hasGroundSupport, isWalkable]);

  // Check for player-enemy collisions
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const playerHitEnemy = enemies.some(enemy => 
      enemy.isAlive && 
      enemy.position.x === player.position.x && 
      enemy.position.y === player.position.y
    );

    if (playerHitEnemy) {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        gameStatus: prev.lives <= 1 ? 'gameOver' : 'playing'
      }));

      // Reset player position if still alive
      if (gameState.lives > 1) {
        setPlayer(prev => ({
          ...prev,
          position: { ...currentLevel?.playerStart || { x: 1, y: 12 } }
        }));
      }
    }
  }, [player.position, enemies, gameState.gameStatus, gameState.lives, currentLevel]);

  // Check for gold collection (updated to use current player position)
  useEffect(() => {
    setGold(prev => prev.map(goldItem => {
      if (!goldItem.collected && 
          goldItem.position.x === player.position.x && 
          goldItem.position.y === player.position.y) {
        setGameState(gs => ({ ...gs, score: gs.score + 100 }));
        return { ...goldItem, collected: true };
      }
      return goldItem;
    }));
  }, [player.position]);

  // Dig function
  const digBlock = useCallback((direction: 'left' | 'right') => {
    if (gameState.gameStatus !== 'playing' || !currentLevel) return;

    const digX = direction === 'left' ? player.position.x - 1 : player.position.x + 1;
    const digY = player.position.y + 1; // Dig below

    if (digX >= 0 && digX < currentLevel.width && 
        digY >= 0 && digY < currentLevel.height &&
        levelLayout[digY]?.[digX] === 'brick') {
      
      setLevelLayout(prev => {
        const newLayout = [...prev];
        newLayout[digY] = [...newLayout[digY]];
        newLayout[digY][digX] = 'trap';
        return newLayout;
      });

      setPlayer(prev => ({ ...prev, isDigging: true }));

      // Restore block after 5 seconds
      setTimeout(() => {
        setLevelLayout(prev => {
          const newLayout = [...prev];
          newLayout[digY] = [...newLayout[digY]];
          newLayout[digY][digX] = 'brick';
          return newLayout;
        });
      }, 5000);

      setTimeout(() => {
        setPlayer(prev => ({ ...prev, isDigging: false }));
      }, 500);
    }
  }, [gameState.gameStatus, currentLevel, player.position, levelLayout]);

  // Check win condition
  useEffect(() => {
    const allGoldCollected = gold.length > 0 && gold.every(g => g.collected);
    if (allGoldCollected && gameState.gameStatus === 'playing') {
      if (gameState.currentLevel >= 100) {
        setGameState(prev => ({ ...prev, gameStatus: 'victory' }));
      } else {
        setGameState(prev => ({ ...prev, gameStatus: 'levelComplete' }));
      }
    }
  }, [gold, gameState.gameStatus, gameState.currentLevel]);

  // Next level
  const nextLevel = useCallback(() => {
    if (gameState.currentLevel < 100) {
      loadLevel(gameState.currentLevel + 1);
    }
  }, [gameState.currentLevel, loadLevel]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
    }));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (gameState.timeRemaining <= 0 && gameState.gameStatus === 'playing') {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        gameStatus: prev.lives <= 1 ? 'gameOver' : 'playing',
        timeRemaining: currentLevel?.timeLimit || 300
      }));
    }
  }, [gameState.gameStatus, gameState.timeRemaining, currentLevel]);

  return {
    gameState,
    player,
    enemies,
    gold,
    currentLevel,
    levelLayout,
    startNewGame,
    movePlayer,
    digBlock,
    nextLevel,
    togglePause,
    loadLevel
  };
};