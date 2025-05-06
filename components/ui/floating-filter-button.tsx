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

interface FloatingFilterButtonProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FloatingFilterButton({
  title,
  description,
  children,
}: FloatingFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posisi awal
  const draggableRef = useRef<HTMLDivElement>(null); // Ref untuk Draggable

  // Simpan posisi saat drag
  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  // Reset posisi ke awal (bottom-6 right-6)
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Hitung posisi modal berdasarkan posisi tombol
  const calculateModalPosition = () => {
    const buttonWidth = 150; // Perkiraan lebar tombol (sesuaikan jika perlu)
    const modalWidth = 300; // Perkiraan lebar modal (sesuaikan jika perlu)
    const modalHeight = 400; // Perkiraan tinggi modal (sesuaikan jika perlu)
    const offsetY = 10; // Jarak vertikal dari tombol

    // Posisi tombol relatif terhadap kanan bawah (bottom-6 right-6)
    const buttonRight = 24; // right-6 = 24px
    const buttonBottom = 24; // bottom-6 = 24px

    // Posisi absolut tombol di layar
    const buttonX = window.innerWidth - buttonRight - buttonWidth + position.x;
    const buttonY = window.innerHeight - buttonBottom - 40 + position.y; // 40px = tinggi tombol (perkiraan)

    // Posisi modal
    let modalX = buttonX;
    let modalY = buttonY - modalHeight - offsetY; // Modal muncul di atas tombol

    // Pastikan modal tetap dalam batas layar
    if (modalX + modalWidth > window.innerWidth) {
      modalX = window.innerWidth - modalWidth - 10; // Jaga jarak 10px dari tepi
    }
    if (modalX < 0) {
      modalX = 10; // Jaga jarak 10px dari tepi kiri
    }
    if (modalY < 0) {
      modalY = buttonY + 40 + offsetY; // Jika tidak cukup ruang di atas, muncul di bawah tombol
    }

    return { left: modalX, top: modalY };
  };

  return (
    <>
      <Draggable
        nodeRef={draggableRef}
        position={position}
        onStop={handleDragStop}
        // Tanpa bounds, tombol dapat di-drag ke mana saja
      >
        <div
          ref={draggableRef}
          className='fixed bottom-6 right-6 z-50 cursor-move'
          aria-label='Draggable filter button'
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
                  <span>{title}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className='text-sm text-slate-100 dark:text-slate-100'>
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
              className='fixed inset-0 bg-black/50 z-40'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className='fixed bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50'
              style={calculateModalPosition()} // Posisi dinamis
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
              <div className='flex gap-2 mt-4'>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant='default'
                  className='w-full'
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
