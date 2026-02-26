
import React, { useState, useEffect } from 'react';
import { Trash2, Check, Edit2, X, Save, GripVertical, KanbanSquare, Flag, Palette, AlertCircle } from 'lucide-react';
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
    ? `border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] ${isBlinking ? 'animate-pulse bg-red-950/20' : ''}`
    : getHighlightStyle(task.highlightColor);

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`relative group rounded-2xl border-2 transition-all duration-500 ease-in-out cursor-default overflow-hidden
        ${alertClasses}
        ${task.completed ? 'opacity-50 grayscale' : (isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm')}
        hover:translate-x-1`}
    >
      {/* Barra de Prioridade Lateral */}
      {priority && <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priority.color}`} />}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-neon-blue transition-colors">
            <GripVertical size={20} />
          </div>

          <button
            onClick={() => onComplete(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
              ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-600 hover:border-neon-blue'}`}
          >
            {task.completed && <Check size={14} className="text-white" />}
          </button>

          {isEditing ? (
            <input
              autoFocus
              className={`flex-1 border-none rounded px-2 py-1 outline-none font-medium ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          ) : (
            <div className="flex-1 min-w-0" onClick={() => onOpenKanban(task.id)}>
              <div className="flex items-center gap-2">
                <span className={`font-bold truncate text-sm md:text-base ${task.completed ? 'line-through text-slate-600' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                  {task.text}
                </span>
                {priority && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black text-white ${priority.color}`}>
                    {priority.label}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setShowConfig(!showConfig)} className={`p-2 rounded-lg text-slate-400 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}>
              <Palette size={16} />
            </button>
            <button onClick={() => setIsEditing(true)} className={`p-2 rounded-lg text-slate-400 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}>
              <Edit2 size={16} />
            </button>
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
          <div className={`flex flex-wrap items-center gap-4 pt-3 border-t animate-fadeIn ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex gap-2">
              {(['urgent', 'attention', 'critical', 'none'] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => onUpdateProps(task.id, p, task.highlightColor || 'none')}
                  className={`w-6 h-6 rounded flex items-center justify-center border transition-all
                    ${p === 'urgent' ? 'bg-red-500 border-red-600' : p === 'attention' ? 'bg-yellow-500 border-yellow-600' : p === 'critical' ? 'bg-black border-slate-700' : (isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300')}
                    ${task.priority === p ? 'ring-2 ring-neon-blue scale-110' : 'opacity-60 hover:opacity-100'}`}
                  title={p.toUpperCase()}
                >
                  <Flag size={10} className="text-white" />
                </button>
              ))}
            </div>
            <div className={`h-4 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className="flex gap-2">
              {(['blue', 'purple', 'pink', 'none'] as HighlightColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => onUpdateProps(task.id, task.priority || 'none', c)}
                  className={`w-6 h-6 rounded-full transition-all border-2
                    ${c === 'blue' ? 'bg-neon-blue border-cyan-400' : c === 'purple' ? 'bg-neon-purple border-purple-400' : c === 'pink' ? 'bg-neon-pink border-pink-400' : (isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300')}
                    ${task.highlightColor === c ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
