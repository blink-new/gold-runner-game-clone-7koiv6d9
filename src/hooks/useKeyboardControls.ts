import { useEffect, useCallback } from 'react';

interface KeyboardControlsProps {
  onMove: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onDig: (direction: 'left' | 'right') => void;
  onPause: () => void;
  enabled: boolean;
}

export const useKeyboardControls = ({
  onMove,
  onDig,
  onPause,
  enabled
}: KeyboardControlsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Prevent default behavior for game keys
    const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyS', 'KeyD', 'KeyW', 'KeyZ', 'KeyX', 'Space', 'Escape'];
    if (gameKeys.includes(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      // Movement - Arrow Keys
      case 'ArrowLeft':
        onMove('left');
        break;
      case 'ArrowRight':
        onMove('right');
        break;
      case 'ArrowUp':
        onMove('up');
        break;
      case 'ArrowDown':
        onMove('down');
        break;

      // Movement - WASD
      case 'KeyA':
        onMove('left');
        break;
      case 'KeyD':
        onMove('right');
        break;
      case 'KeyW':
        onMove('up');
        break;
      case 'KeyS':
        onMove('down');
        break;

      // Digging
      case 'KeyZ':
        onDig('left');
        break;
      case 'KeyX':
        onDig('right');
        break;

      // Pause
      case 'Space':
      case 'Escape':
        onPause();
        break;

      default:
        break;
    }
  }, [enabled, onMove, onDig, onPause]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  return null;
};