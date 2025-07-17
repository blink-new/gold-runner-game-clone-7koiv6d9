import React from 'react';
import { Button } from './ui/button';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface GameOverScreenProps {
  gameStatus: 'gameOver' | 'levelComplete' | 'victory';
  score: number;
  level: number;
  isNewHighScore?: boolean;
  onRestart: () => void;
  onNextLevel?: () => void;
  onMainMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameStatus,
  score,
  level,
  isNewHighScore = false,
  onRestart,
  onNextLevel,
  onMainMenu
}) => {
  const getTitle = () => {
    switch (gameStatus) {
      case 'victory':
        return 'VICTORY!';
      case 'levelComplete':
        return 'LEVEL COMPLETE!';
      case 'gameOver':
        return 'GAME OVER';
      default:
        return '';
    }
  };

  const getTitleColor = () => {
    switch (gameStatus) {
      case 'victory':
        return 'text-primary animate-pixel-glow';
      case 'levelComplete':
        return 'text-secondary';
      case 'gameOver':
        return 'text-red-400';
      default:
        return 'text-primary';
    }
  };

  const getMessage = () => {
    switch (gameStatus) {
      case 'victory':
        return 'CONGRATULATIONS! YOU HAVE COMPLETED ALL 100 LEVELS!';
      case 'levelComplete':
        return `LEVEL ${level} COMPLETED! READY FOR THE NEXT CHALLENGE?`;
      case 'gameOver':
        return 'BETTER LUCK NEXT TIME!';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-card border-2 border-border rounded-lg p-8 text-center space-y-6">
        {/* Title */}
        <h1 className={`text-3xl font-retro ${getTitleColor()}`}>
          {getTitle()}
        </h1>

        {/* Message */}
        <p className="text-sm font-retro text-muted-foreground leading-relaxed">
          {getMessage()}
        </p>

        {/* Stats */}
        <div className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-retro text-muted-foreground">LEVEL</span>
            <span className="text-sm font-retro text-primary">
              {level.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs font-retro text-muted-foreground">SCORE</span>
            <span className="text-sm font-retro text-primary">
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          {isNewHighScore && (
            <div className="text-xs font-retro text-secondary animate-pulse">
              NEW HIGH SCORE!
            </div>
          )}
        </div>

        {/* Victory Animation */}
        {gameStatus === 'victory' && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-primary rounded-full animate-bounce-gold"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {gameStatus === 'levelComplete' && onNextLevel && (
            <Button
              onClick={onNextLevel}
              className="w-full font-retro text-sm py-4 bg-primary hover:bg-primary/90"
            >
              <Trophy className="w-4 h-4 mr-2" />
              NEXT LEVEL
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onRestart}
              variant="outline"
              className="font-retro text-xs py-4"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {gameStatus === 'levelComplete' ? 'REPLAY' : 'RESTART'}
            </Button>

            <Button
              onClick={onMainMenu}
              variant="outline"
              className="font-retro text-xs py-4"
            >
              <Home className="w-4 h-4 mr-2" />
              MENU
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        {gameStatus === 'victory' && (
          <div className="text-xs font-retro text-muted-foreground">
            THANK YOU FOR PLAYING!
          </div>
        )}
      </div>
    </div>
  );
};

export default GameOverScreen;