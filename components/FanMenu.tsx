import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Target, Repeat, Clock, CalendarDays, Briefcase, Settings, Undo2, X } from 'lucide-react';
import { TaskType, RecurrenceType } from '../types';

interface FanMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: TaskType, recurrence?: RecurrenceType) => void;
  isDarkMode?: boolean;
}

const playMenuClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    if (!(window as any).sharedAudioCtx) {
      (window as any).sharedAudioCtx = new AudioContext();
    }
    const ctx = (window as any).sharedAudioCtx;

    const play = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play);
    } else {
      play();
    }
  } catch (e) {
    console.warn('Audio feedback failed', e);
  }
};

const level1Items = [
  {
    type: 'list' as TaskType,
    label: 'LISTA',
    icon: ListChecks,
    color: '#bc13fe',       // purple
    start: -80,
    end: -30,
  },
  {
    type: 'task' as TaskType,
    label: 'SIMPLES',
    icon: Target,
    color: '#00f2ff',       // cyan
    start: -25,
    end: 25,
  },
  {
    type: 'recurring' as TaskType,
    label: 'RECORRENTE',
    icon: Repeat,
    color: '#fbbf24',       // amber-400
    start: 30,
    end: 80,
  },
];

const level2Items = [
  {
    recurrence: 'daily' as RecurrenceType,
    label: 'DIÁRIA',
    icon: Clock,
    color: '#34d399',       // emerald-400
    start: -80,
    end: -42,
  },
  {
    recurrence: 'weekly' as RecurrenceType,
    label: 'SEMANAL',
    icon: CalendarDays,
    color: '#f472b6',       // pink-400
    start: -38,
    end: -2,
  },
  {
    recurrence: 'weekdays' as RecurrenceType,
    label: 'DIAS ÚTEIS',
    icon: Briefcase,
    color: '#00f2ff',       // cyan-400
    start: 2,
    end: 38,
  },
  {
    recurrence: 'custom' as RecurrenceType,
    label: 'CUSTOM',
    icon: Settings,
    color: '#a855f7',       // purple-500
    start: 42,
    end: 80,
  },
];

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeAnnularSector = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const p1 = polarToCartesian(x, y, outerRadius, endAngle);
  const p2 = polarToCartesian(x, y, outerRadius, startAngle);
  const p3 = polarToCartesian(x, y, innerRadius, startAngle);
  const p4 = polarToCartesian(x, y, innerRadius, endAngle);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", p1.x, p1.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, p2.x, p2.y,
    "L", p3.x, p3.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, p4.x, p4.y,
    "Z"
  ].join(" ");
};

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
    playMenuClickSound();
    if (type === 'recurring') {
      setLevel(2);
    } else {
      onSelectType(type);
    }
  };

  const handleLevel2Click = (e: React.MouseEvent, recurrence: RecurrenceType) => {
    e.stopPropagation();
    playMenuClickSound();
    onSelectType('recurring', recurrence);
  };

  const cx = 180;
  const cy = 180;
  const innerRadiusLevel1 = 60;
  const outerRadiusLevel1 = 160;
  const innerRadiusLevel2 = 55;
  const outerRadiusLevel2 = 165;

  // Extrair cores únicas para os filtros SVG
  const allColors = [...level1Items, ...level2Items].map(i => i.color);
  allColors.push('#fbbf24'); // para o botão voltar
  const uniqueColors = Array.from(new Set(allColors));

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
                ? 'rgba(5, 5, 20, 0.45)'
                : 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            onClick={onClose}
          />

          <div
            className="fixed z-[55] pointer-events-none"
            style={{
              bottom: 'calc(max(0.625rem, env(safe-area-inset-bottom)) + 24px)', // Alinhado com o FAB
              left: '50%',
            }}
          >
            <svg 
              width="360" height="220" viewBox="0 0 360 220" 
              className="absolute overflow-visible pointer-events-none"
              style={{ bottom: -40, left: -180 }}
            >
              <defs>
                {uniqueColors.map(color => (
                  <filter key={color} id={`glow-${color.replace('#', '')}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.7" />
                  </filter>
                ))}
              </defs>

              {/* Botão Central Permanente (FECHAR / VOLTAR) */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  playMenuClickSound();
                  if (level === 2) setLevel(1); 
                  else onClose(); 
                }}
                className="cursor-pointer group pointer-events-auto"
              >
                <circle 
                  cx={cx} cy={cy} r="32" 
                  fill={isDarkMode ? `rgba(20, 20, 45, 0.7)` : `rgba(255, 255, 255, 0.9)`}
                  stroke="#fbbf24" 
                  strokeWidth="3" 
                  filter="url(#glow-fbbf24)"
                  className="transition-all duration-300"
                  style={{ fillOpacity: 0.8 }}
                />
                <foreignObject x={cx - 30} y={cy - 30} width={60} height={60}>
                  <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none">
                    {level === 2 ? (
                      <>
                        <Undo2 size={20} color="#fbbf24" className="mb-0.5" />
                        <span className="text-[8px] font-black tracking-widest text-amber-400">VOLTAR</span>
                      </>
                    ) : (
                      <>
                        <X size={22} color="#fbbf24" className="mb-0.5" />
                        <span className="text-[8px] font-black tracking-widest text-amber-400">FECHAR</span>
                      </>
                    )}
                  </div>
                </foreignObject>
              </motion.g>

              <AnimatePresence mode="wait">
                {level === 1 && (
                  <motion.g key="level1" className="pointer-events-auto">
                    {level1Items.map((item, index) => {
                      const midAngle = (item.start + item.end) / 2;
                      const midRadius = (innerRadiusLevel1 + outerRadiusLevel1) / 2;
                      const { x, y } = polarToCartesian(cx, cy, midRadius, midAngle);
                      const size = 70;

                      return (
                        <motion.g
                          key={item.type}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.05 }}
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                          onClick={(e) => handleLevel1Click(e as any, item.type)}
                          className="cursor-pointer group"
                        >
                          <path 
                            d={describeAnnularSector(cx, cy, innerRadiusLevel1, outerRadiusLevel1, item.start, item.end)}
                            fill={isDarkMode ? `rgba(20, 20, 45, 0.7)` : `rgba(255, 255, 255, 0.9)`}
                            stroke={item.color}
                            strokeWidth="3"
                            strokeLinejoin="round"
                            filter={`url(#glow-${item.color.replace('#', '')})`}
                            className="transition-all duration-300"
                            style={{ fillOpacity: 0.8 }}
                          />
                          <foreignObject x={x - size/2} y={y - size/2} width={size} height={size}>
                            <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none">
                              <item.icon size={26} color={item.color} className="mb-1.5 drop-shadow-md" />
                              <span style={{ color: item.color }} className="text-[9px] font-black tracking-wider drop-shadow-md text-center">{item.label}</span>
                            </div>
                          </foreignObject>
                        </motion.g>
                      );
                    })}
                  </motion.g>
                )}

                {level === 2 && (
                  <motion.g key="level2" className="pointer-events-auto">
                    {/* As Fatias do Level 2 */}
                    {level2Items.map((item, index) => {
                      const midAngle = (item.start + item.end) / 2;
                      const midRadius = (innerRadiusLevel2 + outerRadiusLevel2) / 2;
                      const { x, y } = polarToCartesian(cx, cy, midRadius, midAngle);
                      const size = 60;

                      return (
                        <motion.g
                          key={item.recurrence}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.05 }}
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                          onClick={(e) => handleLevel2Click(e as any, item.recurrence)}
                          className="cursor-pointer group"
                        >
                          <path 
                            d={describeAnnularSector(cx, cy, innerRadiusLevel2, outerRadiusLevel2, item.start, item.end)}
                            fill={isDarkMode ? `rgba(20, 20, 45, 0.7)` : `rgba(255, 255, 255, 0.9)`}
                            stroke={item.color}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            filter={`url(#glow-${item.color.replace('#', '')})`}
                            className="transition-all duration-300"
                            style={{ fillOpacity: 0.8 }}
                          />
                          <foreignObject x={x - size/2} y={y - size/2} width={size} height={size}>
                            <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none px-1">
                              <item.icon size={22} color={item.color} className="mb-1 drop-shadow-md" />
                              <span style={{ color: item.color }} className="text-[8px] font-black tracking-wider drop-shadow-md leading-tight text-center">{item.label}</span>
                            </div>
                          </foreignObject>
                        </motion.g>
                      );
                    })}
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
