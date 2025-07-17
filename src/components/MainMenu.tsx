import React from 'react';
import { Button } from './ui/button';
import { Play, Trophy, Settings, Info } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  onLevelSelect: () => void;
  highScore: number;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onLevelSelect,
  highScore
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Game Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-retro text-primary animate-pixel-glow">
            GOLD
          </h1>
          <h2 className="text-3xl font-retro text-secondary">
            RUNNER
          </h2>
          <div className="text-sm font-retro text-muted-foreground">
            CLASSIC ARCADE ADVENTURE
          </div>
        </div>

        {/* Animated Gold Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-full animate-bounce-gold border-4 border-yellow-300 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-primary rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="bg-card border-2 border-border rounded-lg p-4">
            <div className="text-xs font-retro text-muted-foreground mb-1">HIGH SCORE</div>
            <div className="text-2xl font-retro text-primary">
              {highScore.toString().padStart(6, '0')}
            </div>
          </div>
        )}

        {/* Menu Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onStartGame}
            className="w-full font-retro text-sm py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            START GAME
          </Button>

          <Button
            onClick={onLevelSelect}
            variant="outline"
            className="w-full font-retro text-sm py-6"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            LEVEL SELECT
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="font-retro text-xs py-4"
            >
              <Settings className="w-4 h-4 mr-2" />
              OPTIONS
            </Button>

            <Button
              variant="outline"
              className="font-retro text-xs py-4"
            >
              <Info className="w-4 h-4 mr-2" />
              HELP
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-xs font-retro text-muted-foreground space-y-2">
          <div>100 CHALLENGING LEVELS</div>
          <div>COLLECT ALL GOLD TO WIN</div>
          <div>USE ARROW KEYS TO MOVE</div>
          <div>PRESS Z/X TO DIG LEFT/RIGHT</div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-muted-foreground">
          © 2024 GOLD RUNNER CLONE
        </div>
      </div>
    </div>
  );
};

export default MainMenu;