import React from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { ListChecks, Target, Repeat, Clock, CalendarDays, Briefcase, Settings, Undo2, X } from 'lucide-react';
import { TaskType, RecurrenceType } from '../types';

interface FanMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: TaskType, recurrence?: RecurrenceType) => void;
  isDarkMode?: boolean;
  initialLevel?: 1 | 2;
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

interface AnimatedSliceProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  targetStart: number;
  targetEnd: number;
  color: string;
  label: string;
  icon: any;
  isDarkMode: boolean;
  onClick: (e: React.MouseEvent) => void;
  index: number;
}

const AnimatedSlice: React.FC<AnimatedSliceProps> = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  targetStart,
  targetEnd,
  color,
  label,
  icon: Icon,
  isDarkMode,
  onClick,
  index
}) => {
  const [startAngle, setStartAngle] = React.useState(targetStart);
  const [endAngle, setEndAngle] = React.useState(targetEnd);

  React.useEffect(() => {
    const controlsStart = animate(startAngle, targetStart, {
      type: 'spring',
      stiffness: 90,
      damping: 14,
      onUpdate: (latest) => setStartAngle(latest)
    });
    const controlsEnd = animate(endAngle, targetEnd, {
      type: 'spring',
      stiffness: 90,
      damping: 14,
      onUpdate: (latest) => setEndAngle(latest)
    });
    return () => {
      controlsStart.stop();
      controlsEnd.stop();
    };
  }, [targetStart, targetEnd]);

  const midAngle = (startAngle + endAngle) / 2;
  const midRadius = (innerRadius + outerRadius) / 2;
  const { x, y } = polarToCartesian(cx, cy, midRadius, midAngle);
  const size = 70;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.04 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      onClick={onClick}
      className="cursor-pointer group pointer-events-auto"
    >
      <path 
        d={describeAnnularSector(cx, cy, innerRadius, outerRadius, startAngle, endAngle)}
        fill={isDarkMode ? `rgba(15, 15, 35, 0.9)` : `rgba(255, 255, 255, 0.98)`}
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
        filter={`url(#glow-${color.replace('#', '')})`}
        className="transition-all duration-300"
        style={{ fillOpacity: 0.95 }}
      />
      <foreignObject x={x - size/2} y={y - size/2} width={size} height={size}>
        <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none px-1">
          <Icon size={26} color={color} className="mb-1.5 drop-shadow-md" />
          <span style={{ color }} className="text-[10px] font-black tracking-wider drop-shadow-md text-center leading-none">{label}</span>
        </div>
      </foreignObject>
    </motion.g>
  );
};

export const FanMenu: React.FC<FanMenuProps> = ({ isOpen, onClose, onSelectType, isDarkMode = true, initialLevel = 1 }) => {
  const [level, setLevel] = React.useState<1 | 2>(initialLevel);
  const [isSwapped, setIsSwapped] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setLevel(initialLevel);
      setIsSwapped(initialLevel === 2);
    } else {
      const timer = setTimeout(() => {
        setLevel(1);
        setIsSwapped(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialLevel]);

  const handleLevel1Click = (e: React.MouseEvent, type: TaskType) => {
    e.stopPropagation();
    playMenuClickSound();
    if (type === 'recurring') {
      setIsSwapped(true);
      setTimeout(() => {
        setLevel(2);
      }, 450); // Sincronizado com o tempo de spring do AnimatedSlice
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

  // Mapeamento de Cores WCAG para Acessibilidade
  // Purple (LISTA): isDarkMode ? '#bc13fe' : '#9333ea'
  // Cyan (SIMPLES / DIAS ÚTEIS): isDarkMode ? '#00f2ff' : '#0e7490'
  // Amber (RECORRENTE / BOTÕES): isDarkMode ? '#fbbf24' : '#b45309'
  // Emerald (DIÁRIA): isDarkMode ? '#34d399' : '#047857'
  // Pink (SEMANAL): isDarkMode ? '#f472b6' : '#be185d'
  // Custom: isDarkMode ? '#a855f7' : '#7c3aed'

  const level1Items = [
    {
      type: 'list' as TaskType,
      label: 'LISTA',
      icon: ListChecks,
      color: isDarkMode ? '#bc13fe' : '#9333ea',
    },
    {
      type: 'task' as TaskType,
      label: 'SIMPLES',
      icon: Target,
      color: isDarkMode ? '#00f2ff' : '#0e7490',
    },
    {
      type: 'recurring' as TaskType,
      label: 'RECORRENTE',
      icon: Repeat,
      color: isDarkMode ? '#fbbf24' : '#b45309',
    },
  ];

  const getLevel1ItemAngles = (type: TaskType, swapped: boolean) => {
    if (type === 'list') {
      return { start: -80, end: -30 };
    }
    if (type === 'task') { // SIMPLES
      return swapped ? { start: 30, end: 80 } : { start: -25, end: 25 };
    }
    if (type === 'recurring') { // RECORRENTE
      return swapped ? { start: -25, end: 25 } : { start: 30, end: 80 };
    }
    return { start: 0, end: 0 };
  };

  const level2Items = [
    {
      recurrence: 'daily' as RecurrenceType,
      label: 'DIÁRIA',
      icon: Clock,
      color: isDarkMode ? '#34d399' : '#047857',
      start: -80,
      end: -42,
    },
    {
      recurrence: 'weekly' as RecurrenceType,
      label: 'SEMANAL',
      icon: CalendarDays,
      color: isDarkMode ? '#f472b6' : '#be185d',
      start: -38,
      end: -2,
    },
    {
      recurrence: 'weekdays' as RecurrenceType,
      label: 'DIAS ÚTEIS',
      icon: Briefcase,
      color: isDarkMode ? '#00f2ff' : '#0e7490',
      start: 2,
      end: 38,
    },
    {
      recurrence: 'custom' as RecurrenceType,
      label: 'CUSTOM',
      icon: Settings,
      color: isDarkMode ? '#a855f7' : '#7c3aed',
      start: 42,
      end: 80,
    },
  ];

  const centralColor = isDarkMode ? '#fbbf24' : '#b45309';

  // Extrair cores únicas para os filtros SVG
  const allColors = [...level1Items, ...level2Items].map(i => i.color);
  allColors.push(centralColor);
  const uniqueColors = Array.from(new Set(allColors));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay (Sem blur, opacidade aumentada para destaque) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45]"
            style={{
              background: isDarkMode
                ? 'rgba(5, 5, 20, 0.65)'
                : 'rgba(0, 0, 0, 0.4)',
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
                  if (level === 2) {
                    setLevel(1); 
                    setIsSwapped(false);
                  } else {
                    onClose(); 
                  }
                }}
                className="cursor-pointer group pointer-events-auto"
              >
                <circle 
                  cx={cx} cy={cy} r="32" 
                  fill={isDarkMode ? `rgba(20, 20, 45, 0.95)` : `rgba(255, 255, 255, 0.98)`}
                  stroke={centralColor} 
                  strokeWidth="3.5" 
                  filter={`url(#glow-${centralColor.replace('#', '')})`}
                  className="transition-all duration-300"
                  style={{ fillOpacity: 0.9 }}
                />
                <foreignObject x={cx - 30} y={cy - 30} width={60} height={60}>
                  <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none">
                    {level === 2 ? (
                      <>
                        <Undo2 size={20} color={centralColor} className="mb-0.5" />
                        <span style={{ color: centralColor }} className="text-[8px] font-black tracking-widest leading-none">VOLTAR</span>
                      </>
                    ) : (
                      <>
                        <X size={22} color={centralColor} className="mb-0.5" />
                        <span style={{ color: centralColor }} className="text-[8px] font-black tracking-widest leading-none">FECHAR</span>
                      </>
                    )}
                  </div>
                </foreignObject>
              </motion.g>

              <AnimatePresence mode="wait">
                {level === 1 && (
                  <motion.g key="level1" className="pointer-events-auto">
                    {level1Items.map((item, index) => {
                      const { start, end } = getLevel1ItemAngles(item.type, isSwapped);
                      return (
                        <AnimatedSlice
                          key={item.type}
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadiusLevel1}
                          outerRadius={outerRadiusLevel1}
                          targetStart={start}
                          targetEnd={end}
                          color={item.color}
                          label={item.label}
                          icon={item.icon}
                          isDarkMode={isDarkMode}
                          onClick={(e) => handleLevel1Click(e, item.type)}
                          index={index}
                        />
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
                          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.04 }}
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                          onClick={(e) => handleLevel2Click(e as any, item.recurrence)}
                          className="cursor-pointer group"
                        >
                          <path 
                            d={describeAnnularSector(cx, cy, innerRadiusLevel2, outerRadiusLevel2, item.start, item.end)}
                            fill={isDarkMode ? `rgba(15, 15, 35, 0.9)` : `rgba(255, 255, 255, 0.98)`}
                            stroke={item.color}
                            strokeWidth="3.5"
                            strokeLinejoin="round"
                            filter={`url(#glow-${item.color.replace('#', '')})`}
                            className="transition-all duration-300"
                            style={{ fillOpacity: 0.95 }}
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

