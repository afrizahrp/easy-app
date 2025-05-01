import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

type FloatingFilterButtonProps = {
  onClick: () => void;
  localStorageKey?: string;
  showFloatingButton?: boolean; // opsional, default true
};

export const FloatingFilterButton = ({
  onClick,
  localStorageKey = 'filterButtonPosition',
  showFloatingButton = true,
}: FloatingFilterButtonProps) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setButtonPosition(parsed);
      } catch (error) {
        console.error('Failed to parse button position:', error);
      }
    }
  }, [localStorageKey]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(buttonPosition));
  }, [buttonPosition, localStorageKey]);

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    setButtonPosition({ x: data.x, y: data.y });
  };

  if (!showFloatingButton) return null;

  return (
    <Draggable position={buttonPosition} onDrag={handleDrag}>
      <div
        className='fixed bottom-4 right-4 z-50'
        style={{
          transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
        }}
      >
        <Button
          size='sm'
          onClick={onClick}
          className='px-3 h-8 flex items-center gap-1 bg-primary text-white hover:bg-secondary-dark rounded-full hover:scale-105 transition-transform cursor-move shadow-md'
        >
          <Filter className='w-4 h-4' />
          Filter
        </Button>
      </div>
    </Draggable>
  );
};
