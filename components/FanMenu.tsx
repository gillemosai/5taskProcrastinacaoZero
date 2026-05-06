import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Target, Repeat } from 'lucide-react';
import { TaskType, RecurrenceType } from '../types';

interface FanMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: TaskType, recurrence?: RecurrenceType) => void;
  isDarkMode?: boolean;
}

import { Clock, Calendar, CalendarDays, Settings } from 'lucide-react';

const level1Items = [
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
    type: 'task' as TaskType,
    label: 'TAREFA',
    icon: Target,
    color: '#00f2ff',       // cyan
    bgGlow: 'rgba(0, 242, 255, 0.20)',
    shadowGlow: '0 0 20px rgba(0, 242, 255, 0.35), 0 0 40px rgba(0, 242, 255, 0.10)',
    borderColor: 'rgba(0, 242, 255, 0.55)',
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

const level2Items = [
  {
    recurrence: 'daily' as RecurrenceType,
    label: 'DIÁRIA',
    icon: Clock,
    color: '#34d399',       // emerald-400
    shadowGlow: '0 0 20px rgba(52, 211, 153, 0.35)',
    borderColor: 'rgba(52, 211, 153, 0.55)',
  },
  {
    recurrence: 'weekly' as RecurrenceType,
    label: 'SEMANAL',
    icon: CalendarDays,
    color: '#f472b6',       // pink-400
    shadowGlow: '0 0 20px rgba(244, 114, 182, 0.35)',
    borderColor: 'rgba(244, 114, 182, 0.55)',
  },
  {
    recurrence: 'weekdays' as RecurrenceType,
    label: 'DIAS ÚTEIS',
    icon: Calendar,
    color: '#60a5fa',       // blue-400
    shadowGlow: '0 0 20px rgba(96, 165, 250, 0.35)',
    borderColor: 'rgba(96, 165, 250, 0.55)',
  },
  {
    recurrence: 'custom' as RecurrenceType,
    label: 'CUSTOM',
    icon: Settings,
    color: '#94a3b8',       // slate-400
    shadowGlow: '0 0 20px rgba(148, 163, 184, 0.35)',
    borderColor: 'rgba(148, 163, 184, 0.55)',
  },
];

export const FanMenu: React.FC<FanMenuProps> = ({ isOpen, onClose, onSelectType, isDarkMode = true }) => {
  const [level, setLevel] = React.useState<1 | 2>(1);

  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setLevel(1), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLevel1Click = (e: React.MouseEvent, type: TaskType) => {
    e.stopPropagation();
    if (type === 'recurring') {
      setLevel(2);
    } else {
      onSelectType(type);
    }
  };

  const handleLevel2Click = (e: React.MouseEvent, recurrence: RecurrenceType) => {
    e.stopPropagation();
    onSelectType('recurring', recurrence);
  };

  const getCoordinates = (angleDegrees: number, radius: number) => {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    return {
      x: radius * Math.cos(angleRadians),
      y: radius * Math.sin(angleRadians)
    };
  };

  const anglesLevel1 = [
    { angle: -165, radius: 100 }, // LISTA
    { angle: -90, radius: 115 },  // TAREFA
    { angle: -15, radius: 100 },  // RECORRENTE
  ];
  
  const anglesLevel2 = [
    { angle: -160, radius: 115 }, // DIÁRIA
    { angle: -115, radius: 115 }, // SEMANAL
    { angle: -65, radius: 115 },  // DIAS ÚTEIS
    { angle: -20, radius: 115 },  // CUSTOM
  ];
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

          <div
            className="fixed z-[55] pointer-events-none"
            style={{
              bottom: 'calc(max(0.625rem, env(safe-area-inset-bottom)) + 24px)', // Aligned to the center of the FAB in the bottom nav
              left: '50%',
            }}
          >
            <AnimatePresence>
              {level === 1 && level1Items.map((item, index) => {
                const itemAngle = anglesLevel1[index].angle;
                const { x, y } = getCoordinates(itemAngle, anglesLevel1[index].radius);
                let rotateAngle = itemAngle < -90 ? itemAngle + 180 : itemAngle;
                
                // Force TAREFA to be horizontal as requested
                if (item.type === 'task') {
                  rotateAngle = 0;
                }

                return (
                  <motion.button
                    key={item.type}
                    initial={{ opacity: 0, x: '-50%', y: '10px', scale: 0.3, rotate: rotateAngle }}
                    animate={{
                      opacity: 1,
                      x: `calc(-50% + ${x}px)`,
                      y: `calc(-50% + ${y}px)`,
                      scale: 1,
                      rotate: rotateAngle,
                    }}
                    exit={{ opacity: 0, x: '-50%', y: '10px', scale: 0.3, rotate: rotateAngle }}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 22,
                      delay: index * 0.05,
                    }}
                    onClick={(e) => handleLevel1Click(e, item.type)}
                    className="absolute pointer-events-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.15em] cursor-pointer active:scale-90 transition-transform whitespace-nowrap min-w-[130px]"
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
                    <item.icon size={18} strokeWidth={2.5} />
                    {item.label}
                  </motion.button>
                );
              })}
            </AnimatePresence>

            <AnimatePresence>
              {level === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: '-50%', y: '10px', scale: 0.3 }}
                  animate={{ opacity: 1, x: '-50%', y: `calc(-50% - 70px)`, scale: 1 }}
                  exit={{ opacity: 0, x: '-50%', y: '10px', scale: 0.3 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="absolute pointer-events-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.15em] cursor-pointer active:scale-90 transition-transform whitespace-nowrap min-w-[130px]"
                  style={{
                    background: isDarkMode ? `linear-gradient(135deg, rgba(12, 12, 28, 0.92), rgba(20, 20, 45, 0.92))` : `rgba(255, 255, 255, 0.95)`,
                    border: `2px solid rgba(251, 191, 36, 0.55)`,
                    boxShadow: '0 0 20px rgba(251, 191, 36, 0.35)',
                    color: '#fbbf24',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                  onClick={(e) => { e.stopPropagation(); setLevel(1); }}
                >
                  <Repeat size={18} strokeWidth={2.5} />
                  VOLTAR
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {level === 2 && level2Items.map((item, index) => {
                const itemAngle = anglesLevel2[index].angle;
                const { x, y } = getCoordinates(itemAngle, anglesLevel2[index].radius);
                return (
                  <motion.button
                    key={item.recurrence}
                    initial={{ opacity: 0, x: '-50%', y: '10px', scale: 0.3 }} 
                    animate={{ opacity: 1, x: `calc(-50% + ${x}px)`, y: `calc(-50% - 70px + ${y}px)`, scale: 1 }}
                    exit={{ opacity: 0, x: '-50%', y: '10px', scale: 0.3 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.05 }}
                    onClick={(e) => handleLevel2Click(e, item.recurrence)}
                    className="absolute pointer-events-auto flex flex-col items-center justify-center gap-1.5 w-[85px] h-[85px] rounded-full font-black text-[9px] uppercase tracking-wider cursor-pointer active:scale-90 transition-transform text-center leading-tight"
                    style={{
                      background: isDarkMode ? `linear-gradient(135deg, rgba(12, 12, 28, 0.92), rgba(20, 20, 45, 0.92))` : `rgba(255, 255, 255, 0.95)`,
                      border: `2px solid ${item.borderColor}`,
                      boxShadow: item.shadowGlow,
                      color: item.color,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    <item.icon size={22} strokeWidth={2.5} />
                    {item.label}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
