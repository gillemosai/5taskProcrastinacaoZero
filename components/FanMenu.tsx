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
    type: 'task' as TaskType,
    label: 'TAREFA',
    icon: Target,
    color: '#00f2ff',       // cyan
    bgGlow: 'rgba(0, 242, 255, 0.20)',
    shadowGlow: '0 0 20px rgba(0, 242, 255, 0.35), 0 0 40px rgba(0, 242, 255, 0.10)',
    borderColor: 'rgba(0, 242, 255, 0.55)',
  },
  {
    type: 'list' as TaskType,
    label: 'LISTA',
    icon: ListChecks,
    color: '#bc13fe',       // purple
    bgGlow: 'rgba(188, 19, 254, 0.20)',
    shadowGlow: '0 0 20px rgba(188, 19, 254, 0.35), 0 0 40px rgba(188, 19, 254, 0.10)',
    borderColor: 'rgba(188, 19, 254, 0.55)',
  },
  {
    type: 'recurring' as TaskType,
    label: 'RECORRENTE',
    icon: Repeat,
    color: '#fbbf24',       // amber-400
    bgGlow: 'rgba(251, 191, 36, 0.20)',
    shadowGlow: '0 0 20px rgba(251, 191, 36, 0.35), 0 0 40px rgba(251, 191, 36, 0.10)',
    borderColor: 'rgba(251, 191, 36, 0.55)',
  },
];

export const FanMenu: React.FC<FanMenuProps> = ({ isOpen, onClose, onSelectType, isDarkMode = true }) => {
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
                ? 'rgba(5, 5, 20, 0.80)'
                : 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            onClick={onClose}
          />

          {/* Fan items - vertically stacked above the FAB */}
          <div
            className="fixed z-[55] flex flex-col items-center gap-3"
            style={{
              bottom: 'calc(max(0.625rem, env(safe-area-inset-bottom)) + 70px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {fanItems.map((item, index) => (
              <motion.button
                key={item.type}
                initial={{ opacity: 0, y: 40, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0, y: 30, scale: 0.5 }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 22,
                  delay: (fanItems.length - 1 - index) * 0.06,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectType(item.type);
                }}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.15em] cursor-pointer active:scale-90 transition-transform whitespace-nowrap min-w-[170px]"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, rgba(12, 12, 28, 0.92), rgba(20, 20, 45, 0.92))`
                    : `rgba(255, 255, 255, 0.95)`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `2px solid ${item.borderColor}`,
                  boxShadow: item.shadowGlow,
                  color: item.color,
                }}
              >
                <item.icon size={20} strokeWidth={2.5} />
                {item.label}
              </motion.button>
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
