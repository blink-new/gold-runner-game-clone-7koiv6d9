import React from 'react';
import { Player, Enemy, Gold, CellType } from '../types/game';

interface GameCanvasProps {
  layout: CellType[][];
  player: Player;
  enemies: Enemy[];
  gold: Gold[];
  cellSize?: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  layout,
  player,
  enemies,
  gold,
  cellSize = 24
}) => {
  const renderCell = (cellType: CellType, x: number, y: number) => {
    const baseClasses = "absolute border-[0.5px] border-gray-600/30";
    const style = {
      left: x * cellSize,
      top: y * cellSize,
      width: cellSize,
      height: cellSize
    };

    switch (cellType) {
      case 'concrete':
        return (
          <div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-gray-700 border-gray-500`}
            style={style}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 border border-gray-500" />
          </div>
        );
      
      case 'brick':
        return (
          <div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-orange-600 border-orange-500`}
            style={style}
          >
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-700 border border-orange-400" />
          </div>
        );
      
      case 'ladder':
        return (
          <div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-amber-700`}
            style={style}
          >
            <div className="w-full h-full flex flex-col justify-between py-1">
              <div className="h-0.5 bg-amber-600 mx-1" />
              <div className="h-0.5 bg-amber-600 mx-1" />
              <div className="h-0.5 bg-amber-600 mx-1" />
            </div>
            <div className="absolute left-1 top-0 w-0.5 h-full bg-amber-500" />
            <div className="absolute right-1 top-0 w-0.5 h-full bg-amber-500" />
          </div>
        );
      
      case 'rope':
        return (
          <div
            key={`${x}-${y}`}
            className={`${baseClasses}`}
            style={style}
          >
            <div className="absolute top-2 left-0 w-full h-0.5 bg-amber-600" />
          </div>
        );
      
      case 'trap':
        return (
          <div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-black border-gray-700`}
            style={style}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderPlayer = () => {
    const style = {
      left: player.position.x * cellSize + 2,
      top: player.position.y * cellSize + 2,
      width: cellSize - 4,
      height: cellSize - 4
    };

    return (
      <div
        className={`absolute z-20 transition-all duration-150 ${
          player.isDigging ? 'animate-pulse' : ''
        }`}
        style={style}
      >
        <div className={`w-full h-full bg-primary rounded-sm border-2 border-primary-foreground ${
          player.direction === 'left' ? 'scale-x-[-1]' : ''
        }`}>
          {/* Simple pixel character */}
          <div className="w-full h-full relative">
            {/* Head */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-primary-foreground rounded-sm" />
            {/* Body */}
            <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 bg-primary-foreground" />
            {/* Legs */}
            <div className="absolute bottom-0 left-1/4 w-1/4 h-1/3 bg-primary-foreground" />
            <div className="absolute bottom-0 right-1/4 w-1/4 h-1/3 bg-primary-foreground" />
          </div>
        </div>
      </div>
    );
  };

  const renderEnemies = () => {
    return enemies.map((enemy) => {
      if (!enemy.isAlive) return null;

      const style = {
        left: enemy.position.x * cellSize + 2,
        top: enemy.position.y * cellSize + 2,
        width: cellSize - 4,
        height: cellSize - 4
      };

      return (
        <div
          key={enemy.id}
          className="absolute z-15 transition-all duration-200"
          style={style}
        >
          <div className={`w-full h-full bg-red-600 rounded-sm border-2 border-red-400 ${
            enemy.direction === 'left' ? 'scale-x-[-1]' : ''
          }`}>
            {/* Simple enemy character */}
            <div className="w-full h-full relative">
              {/* Head */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-red-300 rounded-sm" />
              {/* Body */}
              <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 bg-red-300" />
              {/* Legs */}
              <div className="absolute bottom-0 left-1/4 w-1/4 h-1/3 bg-red-300" />
              <div className="absolute bottom-0 right-1/4 w-1/4 h-1/3 bg-red-300" />
            </div>
          </div>
        </div>
      );
    });
  };

  const renderGold = () => {
    return gold.map((goldItem) => {
      if (goldItem.collected) return null;

      const style = {
        left: goldItem.position.x * cellSize + 4,
        top: goldItem.position.y * cellSize + 4,
        width: cellSize - 8,
        height: cellSize - 8
      };

      return (
        <div
          key={goldItem.id}
          className="absolute z-10 animate-bounce-gold"
          style={style}
        >
          <div className="w-full h-full bg-primary rounded-full border-2 border-yellow-300 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-primary rounded-full" />
          </div>
        </div>
      );
    });
  };

  const canvasWidth = layout[0]?.length * cellSize || 0;
  const canvasHeight = layout.length * cellSize || 0;

  return (
    <div 
      className="relative bg-background border-2 border-border overflow-hidden"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      {/* Render level layout */}
      {layout.map((row, y) =>
        row.map((cell, x) => renderCell(cell, x, y))
      )}
      
      {/* Render game objects */}
      {renderGold()}
      {renderEnemies()}
      {renderPlayer()}
    </div>
  );
};

export default GameCanvas;