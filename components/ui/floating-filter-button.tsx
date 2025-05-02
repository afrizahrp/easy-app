import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { debounce } from 'lodash';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

type FloatingFilterButtonProps = {
  localStorageKey?: string;
  showFloatingButton?: boolean;
  children?: React.ReactNode;
  sheetTitle?: string;
};

export const FloatingFilterButton = ({
  localStorageKey = 'filterButtonPosition',
  showFloatingButton = true,
  children,
  sheetTitle = 'Filter Data',
}: FloatingFilterButtonProps) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load posisi dari localStorage
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

  // Save posisi
  useEffect(() => {
    const savePosition = debounce(() => {
      localStorage.setItem(localStorageKey, JSON.stringify(buttonPosition));
    }, 300);
    savePosition();
    return () => savePosition.cancel();
  }, [buttonPosition, localStorageKey]);

  const handleDrag = (_e: any, data: any) => {
    setButtonPosition({ x: data.x, y: data.y });
  };

  // Long press logic
  const handleMouseDown = () => {
    pressTimerRef.current = setTimeout(() => {
      setIsDraggable(true);
    }, 400); // 400ms untuk long press
  };

  const handleMouseUp = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (!isDraggable) {
      setIsSidebarOpen(true); // hanya buka sheet kalau bukan mode drag
    }
    setTimeout(() => setIsDraggable(false), 100); // reset
  };

  if (!showFloatingButton) return null;

  return (
    <>
      <Draggable
        position={buttonPosition}
        onDrag={handleDrag}
        disabled={!isDraggable}
      >
        <div className='fixed bottom-4 right-4 z-50'>
          <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={
              isDraggable
                ? 'cursor-grab active:cursor-grabbing'
                : 'cursor-pointer'
            }
          >
            <Button
              size='sm'
              aria-label='Open filter options'
              className='px-3 h-8 flex items-center gap-1 bg-primary text-white hover:bg-secondary-dark rounded-full hover:scale-105 transition-transform shadow-md'
            >
              <Filter className='w-4 h-4' /> Filter Data
            </Button>
          </div>
        </div>
      </Draggable>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='pt-5 w-80 sm:w-96'>
          <SheetTitle>{sheetTitle}</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
};
