/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Clock, Plus, Trash2, Edit, Check } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { CATEGORIES, PRIORITIES } from '../constants';
import { resolveTaskOverlaps, timeToMinutes, formatDateKey, minutesToTime } from '../utils';

interface TimelineViewProps {
  selectedDate: string;
  tasks: Task[];
  filteredCategories: Set<TaskCategory>;
  onAddTask: (startTime?: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const HOUR_HEIGHT = 68;

export default function TimelineView({
  selectedDate,
  tasks,
  filteredCategories,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete
}: TimelineViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number | null>(null);

  const scheduledTasks = tasks.filter(
    t => t.date === selectedDate && t.startTime !== undefined && filteredCategories.has(t.category)
  );

  const layoutTasks = resolveTaskOverlaps(scheduledTasks);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const todayStr = formatDateKey(new Date());
    const isToday = selectedDate === todayStr;

    if (isToday) {
      const updateTime = () => {
        const now = new Date();
        setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
      };
      
      updateTime();
      const interval = setInterval(updateTime, 30000);
      return () => clearInterval(interval);
    } else {
      setCurrentTimeMinutes(null);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 7 * HOUR_HEIGHT - 30;
    }
  }, [selectedDate]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top + e.currentTarget.scrollTop;
    
    const totalMinutes = Math.floor((clickY / HOUR_HEIGHT) * 60);
    const roundedMinutes = Math.round(totalMinutes / 15) * 15;
    
    const startHour = minutesToTime(roundedMinutes);
    onAddTask(startHour);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs overflow-hidden">
      
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/85">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-semibold text-slate-950 dark:text-white text-base">Grade de Horários</h3>
        </div>
        <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg">
          {scheduledTasks.length} compromissos agendados
        </span>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative select-none scrollbar-thin dark:scrollbar-thumb-slate-800 scroll-smooth"
        style={{ height: 'calc(100% - 60px)' }}
      >
        <div 
          onClick={handleTimelineClick}
          className="relative w-full cursor-cell"
          style={{ height: `${24 * HOUR_HEIGHT}px` }}
        >
          {hours.map((hour) => (
            <div 
              key={hour}
              className="absolute left-0 right-0 border-b border-slate-50 dark:border-slate-800/35 flex group"
              style={{ 
                top: `${hour * HOUR_HEIGHT}px`, 
                height: `${HOUR_HEIGHT}px` 
              }}
            >
              <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800/70 p-2.5 text-center flex flex-col justify-start">
                <span className="text-[11px] font-bold text-slate-450 dark:text-slate-500 font-mono">
                  {String(hour).padStart(2, '0')}:00
                </span>
                <span className="text-[9px] font-semibold text-slate-300 dark:text-slate-600 font-mono tracking-tight hidden group-hover:inline transition-opacity duration-200">
                  {String(hour).padStart(2, '0')}:30
                </span>
              </div>

              <div className="flex-1 h-full relative group-hover:bg-slate-50/20 dark:group-hover:bg-slate-955/20 transition-colors">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs font-semibold text-slate-400 dark:text-slate-550 pointer-events-none flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Adicionar às {String(hour).padStart(2, '0')}:00
                </div>
              </div>
            </div>
          ))}

          {layoutTasks.map((task) => {
            const startMin = timeToMinutes(task.startTime!);
            const duration = task.durationMinutes || 60;
            const endMin = startMin + duration;
            
            const topOffset = (startMin / 60) * HOUR_HEIGHT;
            const blockHeight = (duration / 60) * HOUR_HEIGHT;
            
            const catStyle = CATEGORIES[task.category];
            const priorityStyle = PRIORITIES[task.priority];

            const widthPct = 100 / task.totalColumns;
            const leftOffsetPct = task.column * widthPct;

            return (
              <div
                key={task.id}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`absolute rounded-xl border p-2.5 shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-200 group/task cursor-pointer hover:shadow-md hover:scale-[1.01] ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                style={{
                  top: `${topOffset}px`,
                  height: `${blockHeight}px`,
                  left: `calc(64px + ${leftOffsetPct}% * 0.95)`, 
                  width: `calc(${widthPct}% * 0.93)`,
                  minHeight: '40px',
                  zIndex: 20 + task.column
                }}
              >
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${catStyle.accent}`}
                  title={`Categoria: ${catStyle.label}`}
                />

                <div className="flex-1 min-w-0 pl-1">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold font-mono py-0.5 px-1.5 rounded-md bg-white/70 dark:bg-slate-955/65 flex items-center gap-1 select-none leading-none shrink-0">
                      {task.startTime} - {minutesToTime(endMin)}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity ml-auto duration-200 select-none bg-white/80 dark:bg-slate-900/90 rounded-md p-0.5 shadow-2xs">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                          task.completed ? 'text-emerald-505' : 'text-slate-500'
                        }`}
                        title={task.completed ? "Desmarcar como concluída" : "Marcar como concluída"}
                      >
                        <Check className="h-3 w-3 hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1 rounded-sm text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="h-3 w-3 hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 rounded-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="h-3 w-3 hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <h4 className={`text-xs font-bold truncate leading-tight flex items-center gap-1.5 ${
                    task.completed ? 'line-through opacity-60 text-slate-500' : ''
                  }`}>
                    {task.title}
                  </h4>

                  {blockHeight > 55 && task.description && (
                    <p className="text-[10px] font-medium leading-normal mt-1 opacity-80 line-clamp-2 truncate">
                      {task.description}
                    </p>
                  )}
                </div>

                {blockHeight > 75 && (
                  <div className="flex items-center gap-2 mt-1.5 border-t border-slate-200/40 dark:border-slate-800/30 pt-1 select-none text-[9px] font-bold uppercase">
                    <span>
                      Prioridade: <b className="font-extrabold">{priorityStyle.label}</b>
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {currentTimeMinutes !== null && (
            <div 
              className="absolute left-[64px] right-0 z-40 pointer-events-none flex items-center"
              style={{ 
                top: `${(currentTimeMinutes / 60) * HOUR_HEIGHT}px` 
              }}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 -ml-[5px] ring-2 ring-white dark:ring-slate-900 shadow-sm" />
              <div className="h-0.5 flex-1 bg-red-500 " />
              <div className="bg-red-500 text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded-l-md mr-1 select-none leading-none shadow-xs">
                {minutesToTime(currentTimeMinutes)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
