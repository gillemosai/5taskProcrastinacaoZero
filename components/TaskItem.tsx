
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Check, Edit2, X, Save, GripVertical, KanbanSquare, Flag, Palette, AlertCircle, Repeat, ListChecks, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task, Priority, HighlightColor, RecurrenceType } from '../types';
import { RecurrenceSelector } from './RecurrenceSelector';
import { ChecklistDisplay } from './ChecklistDisplay';

interface TaskItemProps {
  task: Task;
  index: number;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onUpdateProps: (id: string, priority: Priority, color: HighlightColor) => void;
  onUpdateRecurrence: (id: string, recurrence: RecurrenceType, interval?: number) => void;
  onToggleChecklistItem?: (taskId: string, itemId: string) => void;
  onAddChecklistItem?: (taskId: string, text: string) => void;
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
  onUpdateRecurrence,
  onToggleChecklistItem,
  onAddChecklistItem,
  onOpenKanban,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [showConfig, setShowConfig] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const newItemRef = useRef<HTMLInputElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const isListTask = task.taskType === 'list';

  useEffect(() => {
    if (!isExpanded && textRef.current) {
      const el = textRef.current;
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    }
  }, [task.text, isExpanded]);

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

  useEffect(() => {
    if (showAddItem && newItemRef.current) {
      newItemRef.current.focus();
    }
  }, [showAddItem]);

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(task.id, editedText);
      setIsEditing(false);
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim() && onAddChecklistItem) {
      onAddChecklistItem(task.id, newItemText.trim());
      setNewItemText('');
      // keep the input open for adding more items
    }
  };

  const getPriorityInfo = (p?: Priority) => {
    switch (p) {
      case 'urgent': return { color: isDarkMode ? 'bg-red-500' : 'bg-red-700', label: 'URGENTE' };
      case 'attention': return { color: isDarkMode ? 'bg-yellow-500' : 'bg-amber-700', label: 'ATENÇÃO' };
      case 'critical': return { color: 'bg-black', label: 'CRÍTICO' };
      default: return null;
    }
  };

  const getHighlightStyle = (c?: HighlightColor) => {
    switch (c) {
      case 'blue': return 'border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.1)]';
      case 'purple': return 'border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.1)]';
      case 'pink': return 'border-neon-pink shadow-[0_0_15px_rgba(188,19,254,0.1)]';
      case 'yellow': return 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]';
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
      <div className="p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 md:gap-4">
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
            <div className="flex-1 min-w-0 flex flex-col items-start gap-1" onClick={() => {
              const next = !isExpanded;
              setIsExpanded(next);
              if (next) {
                setShowConfig(true);
                if (isListTask) setShowChecklist(true);
              } else {
                setShowConfig(false);
                setShowAddItem(false);
                if (isListTask) setShowChecklist(false);
              }
            }}>
              <div className="flex flex-wrap gap-2 mb-1">
                {priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase ${priority.color} text-white shadow-sm inline-block`}>
                    {priority.label}
                  </span>
                )}
                {task.rescueSource === 'completed' && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase ${isDarkMode ? 'bg-emerald-500 text-white' : 'bg-emerald-700 text-white'} shadow-sm inline-block`}>
                    FAZER NOVAMENTE!
                  </span>
                )}
                {task.rescueSource === 'expiration' && rescueLabel && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase ${isDarkMode ? 'bg-amber-500 text-white' : 'bg-amber-700 text-white'} shadow-sm inline-block`}>
                    {rescueLabel}
                  </span>
                )}
                {!task.rescueSource && rescueLabel && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase ${isDarkMode ? 'bg-amber-500 text-white' : 'bg-amber-700 text-white'} shadow-sm inline-block`}>
                    {rescueLabel}
                  </span>
                )}
                {task.isRecreatedRecurring && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase flex items-center gap-1 shadow-sm inline-block ${isDarkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-700 text-white'}`}>
                    <Repeat size={10} /> RECORRENTE
                  </span>
                )}
                {task.isRecurring && task.recurrence !== 'none' && !task.isRecreatedRecurring && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase flex items-center gap-1 shadow-sm inline-block ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                    <Repeat size={10} /> 
                    {task.recurrence === 'daily' ? 'Diária' : task.recurrence === 'weekdays' ? 'Dias Úteis' : task.recurrence === 'weekly' ? 'Semanal' : 'Custom'}
                  </span>
                )}
                {isListTask && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase flex items-center gap-1 shadow-sm inline-block ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-700 text-white'}`}>
                    <ListChecks size={10} /> LISTA
                  </span>
                )}
              </div>
              <span
                ref={textRef}
                className={`font-semibold leading-snug break-words text-sm md:text-base transition-colors cursor-pointer
                  ${task.completed ? 'line-through text-slate-500' : (isDarkMode ? 'text-slate-100 group-hover:text-primary' : 'text-slate-900')}
                  ${!isExpanded ? 'line-clamp-2' : ''}`}
              >
                {task.text}
              </span>
              {!isExpanded && isClamped && (
                <span className={`text-[11px] font-semibold cursor-pointer transition-colors mt-0.5 ${isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-600'}`}>
                  ver mais...
                </span>
              )}
              {isExpanded && (
                <span className={`text-[11px] font-semibold cursor-pointer transition-colors mt-0.5 ${isDarkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-500'}`}>
                  ver menos
                </span>
              )}
              {/* Kanban Entry Point for non-list tasks */}
              {!isListTask && !task.completed && (
                <div
                  className={`flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 w-fit
                    ${isDarkMode
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40'
                      : 'bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300'}`}
                  onClick={(e) => { e.stopPropagation(); onOpenKanban(task.id); }}
                >
                  <KanbanSquare size={13} className={isDarkMode ? 'text-purple-400' : 'text-purple-500'} />
                  {task.subTasks && task.subTasks.length > 0 ? (() => {
                    const total = task.subTasks!.length;
                    const done = task.subTasks!.filter(st => st.column === 'done').length;
                    const percent = Math.round((done / total) * 100);
                    const allDone = done === total;
                    return (
                      <>
                        <span className={`text-[11px] font-bold ${allDone ? 'text-emerald-400' : (isDarkMode ? 'text-purple-300' : 'text-purple-600')}`}>
                          Kanban
                        </span>
                        <span className={`text-[10px] font-bold tabular-nums ${allDone ? 'text-emerald-400' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                          {done}/{total}
                        </span>
                        <div className={`h-1.5 w-12 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${allDone ? 'bg-emerald-400' : 'bg-purple-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {allDone && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
                      </>
                    );
                  })() : (
                    <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                      Quebrar em etapas
                    </span>
                  )}
                </div>
              )}
              {/* List task mini progress */}
              {isListTask && task.checklistItems && task.checklistItems.length > 0 && (() => {
                const total = task.checklistItems!.length;
                const done = task.checklistItems!.filter(i => i.completed).length;
                const allDone = done === total;
                return (
                  <div className={`flex items-center gap-2 mt-1.5 ${allDone ? 'opacity-80' : ''}`}>
                    <ListChecks size={12} className={allDone ? 'text-emerald-400' : (isDarkMode ? 'text-purple-400' : 'text-purple-500')} />
                    <span className={`text-[11px] font-bold tabular-nums ${allDone ? 'text-emerald-400' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                      {done}/{total} itens
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          <div className={`gap-1 transition-all ${isExpanded ? 'flex flex-wrap mt-1' : 'hidden md:flex opacity-0 group-hover:opacity-100'}`}>
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

        {/* Inline Checklist for List tasks */}
        {isListTask && showChecklist && (
          <div className={`px-1 pb-1`} onClick={(e) => e.stopPropagation()}>
            {task.checklistItems && task.checklistItems.length > 0 && (
              <ChecklistDisplay
                items={task.checklistItems}
                onToggleItem={(itemId) => onToggleChecklistItem?.(task.id, itemId)}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Add item section */}
            {!task.completed && (
              <div className="mt-2">
                {showAddItem ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      ref={newItemRef}
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddItem();
                        if (e.key === 'Escape') { setShowAddItem(false); setNewItemText(''); }
                      }}
                      placeholder="Novo item..."
                      className={`flex-1 text-sm rounded-lg px-3 py-1.5 outline-none border ${isDarkMode ? 'bg-slate-900 text-white border-slate-700 focus:border-purple-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-purple-400'}`}
                    />
                    <button
                      onClick={handleAddItem}
                      disabled={!newItemText.trim()}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => { setShowAddItem(false); setNewItemText(''); }}
                      className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAddItem(true); }}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors w-fit mt-1 border border-dashed
                      ${isDarkMode ? 'text-purple-400 border-purple-500/40 hover:bg-purple-500/10' : 'text-purple-600 border-purple-300 hover:bg-purple-50'}`}
                  >
                    <Plus size={12} />
                    + item
                  </button>
                )}
              </div>
            )}
          </div>
        )}

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
            className={`flex flex-col gap-4 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
          >
            <div className="flex flex-wrap items-center gap-4">
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
              {(['blue', 'purple', 'pink', 'yellow', 'none'] as HighlightColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => onUpdateProps(task.id, task.priority || 'none', c)}
                  className={`w-7 h-7 rounded-full transition-all border-2 shadow-sm
                    ${c === 'blue' ? 'bg-neon-blue border-cyan-400' : c === 'purple' ? 'bg-neon-purple border-purple-400' : c === 'pink' ? 'bg-neon-pink border-pink-400' : c === 'yellow' ? 'bg-yellow-400 border-yellow-300' : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200')}
                    ${task.highlightColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                />
              ))}
            </div>
            </div>

            {/* Menu de Recorrência */}
            <div className={`pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <RecurrenceSelector 
                isDarkMode={isDarkMode}
                value={task.recurrence || 'none'}
                onChange={(rec) => onUpdateRecurrence(task.id, rec, task.recurrenceInterval)}
                intervalValue={task.recurrenceInterval || 2}
                onIntervalChange={(inv) => onUpdateRecurrence(task.id, task.recurrence || 'custom', inv)}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
