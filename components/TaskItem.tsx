
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Check, Edit2, X, Save, GripVertical, KanbanSquare, Flag, Palette, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task, Priority, HighlightColor } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onUpdateProps: (id: string, priority: Priority, color: HighlightColor) => void;
  onOpenKanban: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDarkMode?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onComplete,
  onDelete,
  onEdit,
  onUpdateProps,
  onOpenKanban,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [showConfig, setShowConfig] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setShowConfig(false);
      }
    };
    if (showConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConfig]);

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(task.id, editedText);
      setIsEditing(false);
    }
  };

  const getPriorityInfo = (p?: Priority) => {
    switch (p) {
      case 'urgent': return { color: 'bg-red-500', label: 'URGENTE' };
      case 'attention': return { color: 'bg-yellow-500', label: 'ATENÇÃO' };
      case 'critical': return { color: 'bg-black', label: 'CRÍTICO' };
      default: return null;
    }
  };

  const getHighlightStyle = (c?: HighlightColor) => {
    switch (c) {
      case 'blue': return 'border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.1)]';
      case 'purple': return 'border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.1)]';
      case 'pink': return 'border-neon-pink shadow-[0_0_15px_rgba(188,19,254,0.1)]';
      default: return isDarkMode ? 'border-slate-800' : 'border-slate-200';
    }
  };

  const priority = getPriorityInfo(task.priority);

  const rescueCount = task.rescueCount || 0;
  const getRescueLabel = (count: number) => {
    if (count === 1) return "RESGATADA";
    if (count === 2) return "RESGATADA NOVAMENTE";
    if (count >= 3) return "ÚLTIMO RESGATE";
    return null;
  };
  const rescueLabel = getRescueLabel(rescueCount);

  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [isAlertTime, setIsAlertTime] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (task.completed) {
      setIsAlertTime(false);
      setIsBlinking(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const age = now - task.createdAt;

      const HOURS_24 = 24 * 60 * 60 * 1000;
      const HOURS_27 = 27 * 60 * 60 * 1000;
      const HOUR_1 = 60 * 60 * 1000;

      if (age > HOURS_24 && age <= HOURS_27) {
        setIsAlertTime(true);
        const timeLeftMs = HOURS_27 - age;

        if (timeLeftMs <= HOUR_1) {
          setIsBlinking(true);
        } else {
          setIsBlinking(false);
        }

        const hrs = Math.floor(timeLeftMs / (1000 * 60 * 60));
        const mins = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

        setTimeLeftStr(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      } else {
        setIsAlertTime(false);
        setIsBlinking(false);
        setTimeLeftStr('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [task.createdAt, task.completed]);

  const alertClasses = isAlertTime && !task.completed
    ? `border-l-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] ${isBlinking ? 'animate-pulse bg-red-950/20' : ''}`
    : (priority ? `border-l-${priority.color.replace('bg-', '')}` : (isDarkMode ? 'border-l-primary' : 'border-l-slate-200'));

  return (
    <motion.div
      ref={itemRef}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: task.completed ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      draggable={!isEditing}
      onDragStart={(e: any) => onDragStart(e, index)}
      onDragEnter={(e: any) => onDragEnter(e, index)}
      onDragEnd={onDragEnd as any}
      onDragOver={(e: any) => e.preventDefault()}
      className={`relative group rounded-xl transition-colors duration-300 ease-in-out cursor-default overflow-hidden border-l-4 hover:bg-white/5
        ${alertClasses}
        ${task.highlightColor && task.highlightColor !== 'none' ? getHighlightStyle(task.highlightColor) + ' border-2' : ''}
        ${task.completed ? 'grayscale opacity-70 border-l-slate-600' : (isDarkMode ? 'glass-card' : 'bg-white shadow-xl shadow-slate-200/60')}
      `}
    >
      {/* Barra de Prioridade Lateral Substituída pela Borda Esquerda do Container */}

      <div className="p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-white transition-colors">
            <GripVertical size={20} />
          </div>

          <button
            onClick={() => onComplete(task.id)}
            className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer group-hover:bg-primary/10
              ${task.completed ? 'border-accent-cyan bg-transparent' : 'border-slate-700 hover:border-accent-cyan'}`}
          >
            {task.completed && <Check size={14} className="text-accent-cyan font-bold" />}
          </button>

          {isEditing ? (
            <input
              autoFocus
              className={`flex-1 border-none rounded-lg px-3 py-2 outline-none font-medium shadow-inner ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          ) : (
            <div className="flex-1 min-w-0 flex flex-col items-start gap-1" onClick={() => onOpenKanban(task.id)}>
              <div className="flex flex-wrap gap-2 mb-1">
                {priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase ${priority.color} text-white shadow-sm inline-block`}>
                    {priority.label}
                  </span>
                )}
                {rescueLabel && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase bg-amber-500 text-white shadow-sm inline-block`}>
                    {rescueLabel}
                  </span>
                )}
              </div>
              <span className={`font-semibold leading-snug break-words text-sm md:text-base transition-colors ${task.completed ? 'line-through text-slate-500' : (isDarkMode ? 'text-slate-100 group-hover:text-primary' : 'text-slate-900')}`}>
                {task.text}
              </span>
            </div>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {rescueCount === 0 && (
              <>
                <button onClick={() => setShowConfig(!showConfig)} className={`p-2 rounded-lg text-slate-400 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}>
                  <Palette size={16} />
                </button>
                <button onClick={() => setIsEditing(true)} className={`p-2 rounded-lg text-slate-400 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}>
                  <Edit2 size={16} />
                </button>
              </>
            )}
            <button onClick={() => onDelete(task.id)} className={`p-2 rounded-lg text-red-400 ${isDarkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-50'}`}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isAlertTime && !task.completed && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${isBlinking ? 'bg-red-600 text-white shadow-lg animate-pulse' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
            <AlertCircle size={18} className={isBlinking ? 'animate-bounce' : ''} />
            <span className="text-xs md:text-sm font-black font-mono tracking-widest uppercase">Tolerância: {timeLeftStr}</span>
          </div>
        )}

        {/* Menu de Configuração Rápida */}
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`flex flex-wrap items-center gap-4 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
          >
            <div className="flex gap-2">
              {(['urgent', 'attention', 'critical', 'none'] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => onUpdateProps(task.id, p, task.highlightColor || 'none')}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all shadow-sm
                    ${p === 'urgent' ? 'bg-red-500 border-red-600' : p === 'attention' ? 'bg-yellow-500 border-yellow-600' : p === 'critical' ? 'bg-black border-slate-700' : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200')}
                    ${task.priority === p ? 'ring-2 ring-neon-blue scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                  title={p.toUpperCase()}
                >
                  <Flag size={12} className={p === 'none' && !isDarkMode ? 'text-slate-400' : 'text-white'} />
                </button>
              ))}
            </div>
            <div className={`h-6 w-[2px] rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className="flex gap-2">
              {(['blue', 'purple', 'pink', 'none'] as HighlightColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => onUpdateProps(task.id, task.priority || 'none', c)}
                  className={`w-7 h-7 rounded-full transition-all border-2 shadow-sm
                    ${c === 'blue' ? 'bg-neon-blue border-cyan-400' : c === 'purple' ? 'bg-neon-purple border-purple-400' : c === 'pink' ? 'bg-neon-pink border-pink-400' : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200')}
                    ${task.highlightColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
