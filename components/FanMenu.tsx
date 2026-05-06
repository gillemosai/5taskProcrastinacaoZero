import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Target, Repeat } from 'lucide-react';
import { TaskType } from '../types';

interface FanMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: TaskType) => void;
  isDarkMode?: boolean;
}

const fanItems = [
  {
    type: 'list' as TaskType,
    label: 'LISTA',
    icon: ListChecks,
    color: '#bc13fe',       // purple
    bgGlow: 'rgba(188, 19, 254, 0.25)',
    shadowGlow: '0 0 24px rgba(188, 19, 254, 0.4)',
    borderColor: 'rgba(188, 19, 254, 0.5)',
    angle: -50,  // left arc
  },
  {
    type: 'task' as TaskType,
    label: 'TAREFA',
    icon: Target,
    color: '#00f2ff',       // cyan
    bgGlow: 'rgba(0, 242, 255, 0.25)',
    shadowGlow: '0 0 24px rgba(0, 242, 255, 0.4)',
    borderColor: 'rgba(0, 242, 255, 0.5)',
    angle: -90,  // center top
  },
  {
    type: 'recurring' as TaskType,
    label: 'RECORRENTE',
    icon: Repeat,
    color: '#fbbf24',       // amber-400 (same as "Visão" nav)
    bgGlow: 'rgba(251, 191, 36, 0.25)',
    shadowGlow: '0 0 24px rgba(251, 191, 36, 0.4)',
    borderColor: 'rgba(251, 191, 36, 0.5)',
    angle: -130, // right arc
  },
];

export const FanMenu: React.FC<FanMenuProps> = ({ isOpen, onClose, onSelectType, isDarkMode = true }) => {
  const radius = 110; // distance from center

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45]"
            style={{
              background: isDarkMode
                ? 'rgba(5, 5, 20, 0.75)'
                : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
          />

          {/* Fan items - positioned relative to the FAB center */}
          <div
            className="fixed z-[55] pointer-events-none"
            style={{
              bottom: 'calc(max(0.625rem, env(safe-area-inset-bottom)) + 28px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {fanItems.map((item, index) => {
              const angleRad = (item.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.button
                  key={item.type}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                  animate={{
                    opacity: 1,
                    x: x,
                    y: y,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 22,
                    delay: index * 0.06,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectType(item.type);
                  }}
                  className="absolute pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest cursor-pointer active:scale-90 transition-transform whitespace-nowrap"
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(135deg, rgba(15, 15, 30, 0.85), rgba(25, 25, 50, 0.85))`
                      : `rgba(255, 255, 255, 0.92)`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1.5px solid ${item.borderColor}`,
                    boxShadow: item.shadowGlow,
                    color: item.color,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-60px',
                    marginTop: '-20px',
                  }}
                >
                  <item.icon size={16} strokeWidth={2.5} />
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
