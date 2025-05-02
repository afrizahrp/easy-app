import { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { debounce } from 'lodash';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'; // pastikan ini diimport sesuai dengan struktur proyekmu

type FloatingFilterButtonProps = {
  localStorageKey?: string;
  showFloatingButton?: boolean;
  children?: React.ReactNode; // Untuk konten dalam sheet (misalnya filter sidebar)
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

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setButtonPosition(parsed);
      } catch (error) {
        console.error('Failed to parse button position:', error);
        setButtonPosition({ x: 0, y: 0 });
      }
    }
  }, [localStorageKey]);

  useEffect(() => {
    const savePosition = debounce(() => {
      localStorage.setItem(localStorageKey, JSON.stringify(buttonPosition));
    }, 300);
    savePosition();
    return () => savePosition.cancel();
  }, [buttonPosition, localStorageKey]);

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setButtonPosition({ x: data.x, y: data.y });
  };

  if (!showFloatingButton) return null;

  return (
    <>
      {/* <Draggable position={buttonPosition} onDrag={handleDrag}> */}
      <Draggable
        position={buttonPosition}
        onDrag={handleDrag}
        handle='.drag-handle'
      >
        <div className='fixed bottom-4 right-4 z-50'>
          <Button
            size='sm'
            onClick={() => setIsSidebarOpen(true)}
            aria-label='Open filter options'
            className='px-3 h-8 flex items-center gap-1 bg-primary text-white hover:bg-secondary-dark rounded-full hover:scale-105 transition-transform cursor-grab active:cursor-grabbing shadow-md'
          >
            <Filter className='w-4 h-4' /> Filter
          </Button>
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
