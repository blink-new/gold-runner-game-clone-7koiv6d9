import React from 'react';
import { GameState } from '../types/game';
import { Button } from './ui/button';
import { Pause, Play, RotateCcw, Home } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  onPause: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  goldCollected: number;
  totalGold: number;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  onPause,
  onRestart,
  onMainMenu,
  goldCollected,
  totalGold
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (gameState.timeRemaining <= 30) return 'text-red-400';
    if (gameState.timeRemaining <= 60) return 'text-yellow-400';
    return 'text-primary';
  };

  return (
    <div className="bg-card border-2 border-border p-4 rounded-lg">
      {/* Top Stats Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-6">
          {/* Level */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-retro">LEVEL</div>
            <div className="text-lg font-retro text-primary">
              {gameState.currentLevel.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-retro">SCORE</div>
            <div className="text-lg font-retro text-primary">
              {gameState.score.toString().padStart(6, '0')}
            </div>
          </div>

          {/* Lives */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-retro">LIVES</div>
            <div className="flex space-x-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${
                    i < gameState.lives ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="font-retro text-xs"
          >
            {gameState.gameStatus === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="font-retro text-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMainMenu}
            className="font-retro text-xs"
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="flex justify-between items-center">
        {/* Gold Progress */}
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-retro">GOLD</div>
            <div className="text-sm font-retro text-primary">
              {goldCollected}/{totalGold}
            </div>
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${totalGold > 0 ? (goldCollected / totalGold) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-retro">TIME</div>
          <div className={`text-lg font-retro ${getTimeColor()}`}>
            {formatTime(gameState.timeRemaining)}
          </div>
        </div>
      </div>

      {/* Game Status Messages */}
      {gameState.gameStatus === 'paused' && (
        <div className="mt-4 text-center">
          <div className="text-primary font-retro text-sm animate-pulse">
            GAME PAUSED
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;