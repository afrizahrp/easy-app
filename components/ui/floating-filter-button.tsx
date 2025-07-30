'use client';
import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingFilterButtonProps {
  title: string;
  description: string;
  children: React.ReactNode;
  modalPosition?: 'above' | 'default';
  className?: string;
  'aria-label'?: string;
}

export function FloatingFilterButton({
  title,
  description,
  children,
  modalPosition = 'default',
  className,
  'aria-label': ariaLabel = 'Open filter',
}: FloatingFilterButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const draggableRef = useRef<HTMLDivElement>(null);

  // Handle drag stop
  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  // Reset position to initial (bottom-6 right-6)
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Calculate modal position
  const calculateModalPosition = () => {
    const buttonWidth = 150;
    const modalWidth = 300;
    const modalHeight = 400;
    const offsetY = 10;
    const offsetX = 10;

    const buttonRight = 24; // right-6 = 24px
    const buttonBottom = 24; // bottom-6 = 24px

    const buttonX = window.innerWidth - buttonRight - buttonWidth + position.x;
    const buttonY = window.innerHeight - buttonBottom - 40 + position.y;

    let modalX: number;
    let modalY: number;

    if (modalPosition === 'above') {
      modalX = buttonX - modalWidth - offsetX;
      modalY = buttonY - modalHeight - offsetY - 40;
    } else {
      modalX = buttonX;
      modalY = buttonY + 40 + offsetY;
    }

    if (modalX + modalWidth > window.innerWidth) {
      modalX = window.innerWidth - modalWidth - 10;
    }
    if (modalX < 0) {
      modalX = 10;
    }
    if (modalY < 0) {
      modalY = buttonY + 40 + offsetY;
    }
    if (modalY + modalHeight > window.innerHeight) {
      modalY = window.innerHeight - modalHeight - 10;
    }

    return { left: modalX, top: modalY };
  };

  return (
    <>
      <Draggable
        nodeRef={draggableRef}
        position={position}
        onStop={handleDragStop}
      >
        <div
          ref={draggableRef}
          className={cn('fixed bottom-16 right-6 z-50 cursor-move', className)}
          aria-label={ariaLabel}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 text-white hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-900 transition-all duration-300',
                    className
                  )}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Filter className='w-5 h-5' />
                  </motion.div>
                  <span>{title}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className='text-sm bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100'>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Draggable>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className='fixed inset-0 bg-black/50 dark:bg-black/60 z-40'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className='fixed bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50 transition-colors duration-300'
              style={calculateModalPosition()}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
              <div className='flex gap-2 mt-4'>
                <Button
                  variant='outline'
                  className='w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant='default'
                  className='w-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                  onClick={resetPosition}
                >
                  Reset Position
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
