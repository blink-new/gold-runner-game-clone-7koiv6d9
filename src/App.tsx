import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import MainMenu from './components/MainMenu';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const {
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
  } = useGameState();

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('goldrunner-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [showLevelSelect, setShowLevelSelect] = useState(false);

  // Update high score
  useEffect(() => {
    if (gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem('goldrunner-highscore', gameState.score.toString());
    }
  }, [gameState.score, highScore]);

  // Keyboard controls
  useKeyboardControls({
    onMove: movePlayer,
    onDig: digBlock,
    onPause: togglePause,
    enabled: gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused'
  });

  const handleStartGame = () => {
    startNewGame();
  };

  const handleLevelSelect = () => {
    setShowLevelSelect(true);
  };

  const handleMainMenu = () => {
    setShowLevelSelect(false);
  };

  const handleRestart = () => {
    if (gameState.gameStatus === 'levelComplete') {
      loadLevel(gameState.currentLevel);
    } else {
      startNewGame();
    }
  };

  const goldCollected = gold.filter(g => g.collected).length;
  const totalGold = gold.length;

  // Level Select Screen
  if (showLevelSelect) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-retro text-primary mb-4">LEVEL SELECT</h1>
            <button
              onClick={handleMainMenu}
              className="text-sm font-retro text-muted-foreground hover:text-primary"
            >
              ← BACK TO MENU
            </button>
          </div>
          
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 100 }, (_, i) => i + 1).map((levelNum) => (
              <button
                key={levelNum}
                onClick={() => {
                  loadLevel(levelNum);
                  setShowLevelSelect(false);
                }}
                className="aspect-square bg-card border border-border hover:border-primary rounded text-xs font-retro text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {levelNum}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  if (gameState.gameStatus === 'menu') {
    return (
      <MainMenu
        onStartGame={handleStartGame}
        onLevelSelect={handleLevelSelect}
        highScore={highScore}
      />
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Game UI */}
        <GameUI
          gameState={gameState}
          onPause={togglePause}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
          goldCollected={goldCollected}
          totalGold={totalGold}
        />

        {/* Game Canvas */}
        <div className="flex justify-center">
          <div className="relative">
            <GameCanvas
              layout={levelLayout}
              player={player}
              enemies={enemies}
              gold={gold}
              cellSize={28}
            />
            
            {/* Pause Overlay */}
            {gameState.gameStatus === 'paused' && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-retro text-primary animate-pulse">
                    PAUSED
                  </div>
                  <div className="text-sm font-retro text-muted-foreground">
                    PRESS SPACE TO CONTINUE
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Help */}
        <div className="text-center text-xs font-retro text-muted-foreground space-y-1">
          <div>ARROW KEYS OR WASD: MOVE • Z/X: DIG LEFT/RIGHT • SPACE: PAUSE</div>
          <div>COLLECT ALL GOLD TO COMPLETE THE LEVEL</div>
        </div>
      </div>

      {/* Game Over Screens */}
      {(gameState.gameStatus === 'gameOver' || 
        gameState.gameStatus === 'levelComplete' || 
        gameState.gameStatus === 'victory') && (
        <GameOverScreen
          gameStatus={gameState.gameStatus}
          score={gameState.score}
          level={gameState.currentLevel}
          isNewHighScore={gameState.score === highScore && gameState.score > 0}
          onRestart={handleRestart}
          onNextLevel={gameState.gameStatus === 'levelComplete' ? nextLevel : undefined}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}

export default App;