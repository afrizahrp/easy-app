'use client';
import { useState, useEffect, useRef } from 'react';
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

interface FloatingFilterButtonProps {
  children: React.ReactNode;
}

export function FloatingFilterButton({ children }: FloatingFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<any>(null); // Ref untuk Draggable

  useEffect(() => {
    const savedPosition = localStorage.getItem('floatingFilterButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleDragStop = (e: any, data: any) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem(
      'floatingFilterButtonPosition',
      JSON.stringify(newPosition)
    );
  };

  return (
    <>
      <Draggable
        nodeRef={draggableRef} // Gunakan nodeRef untuk menghindari findDOMNode
        defaultPosition={{ x: position.x, y: position.y }}
        onStop={handleDragStop}
        bounds='parent'
      >
        <div
          ref={draggableRef}
          className='fixed bottom-6 right-6 z-50 cursor-move'
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className='flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all'
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
                  <span>Filter Period</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className='text-sm text-gray-700 dark:text-slate-100'>
                <p>Adjust the period for all charts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Draggable>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className='fixed inset-0 bg-black/50 z-40'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className='fixed bottom-20 right-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50'
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
              <Button
                variant='outline'
                className='mt-4 w-full'
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
