/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Edit2, Plus, Calendar, AlertTriangle, Pin, Sparkles, Filter } from 'lucide-react';
import { Task, TaskCategory, TaskPriority } from '../types';
import { CATEGORIES, PRIORITIES } from '../constants';

interface TaskListProps {
  selectedDate: string;
  tasks: Task[];
  filteredCategories: Set<TaskCategory>;
  onAddTask: (title: string, isAllDay: boolean) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TaskList({
  selectedDate,
  tasks,
  filteredCategories,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete
}: TaskListProps) {
  const [quickTitle, setQuickTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'day' | 'pending' | 'scratchpad'>('day');
  const [scratchpad, setScratchpad] = useState(() => {
    return localStorage.getItem('agenda_diaria_scratchpad') || 
      '💡 Notas Rápidas e Idéias:\n- Digite livremente seus pensamentos e anotações temporárias aqui.\n- Sincronize com a grade de horários ao planejar sua semana.';
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Filter tasks belonging to the current selected date
  const dayAllTasks = tasks.filter(t => t.date === selectedDate && filteredCategories.has(t.category));
  
  // All pending tasks regardless of the date (for overdue planning check)
  const pendingTasksAllTime = tasks.filter(t => t.completed === false && filteredCategories.has(t.category));

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask(quickTitle.trim(), true); // By default, quick adding creates all-day task
    setQuickTitle('');
  };

  const handleScratchpadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setScratchpad(val);
    localStorage.setItem('agenda_diaria_scratchpad', val);
  };

  const filteredDayTasks = dayAllTasks.filter(t => {
    if (statusFilter === 'pending') return !t.completed;
    if (statusFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs overflow-hidden">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/70 p-3 bg-slate-50/50 dark:bg-slate-950/20 select-none">
        <button
          onClick={() => setActiveTab('day')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'day'
              ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-2xs border border-slate-100 dark:border-slate-800'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Tarefas do Dia</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'pending'
              ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-2xs border border-slate-100 dark:border-slate-800'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Pin className="h-3.5 w-3.5" />
          <span>Banco Pendentes</span>
          {pendingTasksAllTime.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse ml-0.5 shrink-0" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('scratchpad')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'scratchpad'
              ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-2xs border border-slate-100 dark:border-slate-800'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bloco Rápido</span>
        </button>
      </div>

      {activeTab === 'day' && (
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          {/* Quick task adder */}
          <form onSubmit={handleQuickSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Adicionar tarefa rápida para hoje..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 py-3 outline-hidden transition-all placeholder:text-slate-450 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-655 dark:bg-indigo-950/40 dark:text-indigo-450 transition-colors"
                title="Adicionar"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Filtering controls */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800/20 pb-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            <div className="flex gap-1 bg-slate-100/50 dark:bg-slate-950/40 p-0.5 rounded-lg select-none">
              {(['all', 'pending', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                    statusFilter === filter
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs'
                      : 'text-slate-400 dark:text-slate-550'
                  }`}
                >
                  {filter === 'all' ? 'Tudo' : filter === 'pending' ? 'Ativas' : 'Feitas'}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin">
            {filteredDayTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <p className="text-xs font-semibold">Nenhuma tarefa encontrada.</p>
                <p className="text-[10px] mt-0.5 text-slate-400">Insira um título acima ou agende um compromisso.</p>
              </div>
            ) : (
              filteredDayTasks.map((task) => {
                const catStyle = CATEGORIES[task.category];
                const priorityStyle = PRIORITIES[task.priority];

                return (
                  <div
                    key={task.id}
                    className={`group/item flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
                      task.completed
                        ? 'bg-slate-50/50 border-slate-100 dark:bg-slate-950/20 dark:border-slate-850'
                        : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800/70 hover:dark:border-slate-700'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 shrink-0 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-md p-0.5 transition-colors focus:outline-hidden"
                      title={task.completed ? "Reabrir tarefa" : "Marcar como feita"}
                    >
                      {task.completed ? (
                        <CheckSquare className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300 dark:text-slate-700" />
                      )}
                    </button>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5 select-none text-[9px] font-bold">
                        {/* Time label */}
                        {task.startTime ? (
                          <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm font-mono tracking-tight shrink-0">
                            {task.startTime} ({task.durationMinutes}m)
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-1.5 py-0.5 rounded-sm shrink-0">
                            Dia Todo
                          </span>
                        )}

                        {/* Category and priority indicator */}
                        <span className={`px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0 bg-slate-100 text-slate-500 dark:bg-slate-955/40 dark:text-slate-400`}>
                          {catStyle.label}
                        </span>
                        
                        <span className={`px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0 ${priorityStyle.text} ${priorityStyle.bg}`}>
                          Prio: {priorityStyle.label}
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-snug break-words ${
                        task.completed ? 'line-through opacity-55 text-slate-500' : 'text-slate-850 dark:text-slate-100'
                      }`}>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className={`text-[10.5px] font-medium leading-relaxed mt-1 break-words ${
                          task.completed ? 'opacity-40 line-clamp-1' : 'opacity-70 dark:text-slate-400 line-clamp-2'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Row action controllers */}
                    <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-0.5 ml-auto shrink-0 select-none transition-opacity duration-150">
                      <button
                        onClick={() => onEditTask(task)}
                        className="rounded-lg p-1 hover:bg-slate-100 text-indigo-500 dark:hover:bg-slate-800 hover:text-indigo-650"
                        title="Editar"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="rounded-lg p-1 hover:bg-slate-100 text-red-500 dark:hover:bg-slate-800 hover:text-red-650"
                        title="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="flex-1 flex flex-col p-5 overflow-hidden">
          <div className="mb-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Selecione uma tarefa pendente para planejar/verificar ou remanejar no calendário.
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin">
            {pendingTasksAllTime.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-450">
                <CheckSquare className="h-8 w-8 text-emerald-500/80 mb-2" />
                <p className="text-xs font-semibold">Tudo em dia!</p>
                <p className="text-[10px] mt-0.5 text-slate-400">Não há pendores anteriores atrasados.</p>
              </div>
            ) : (
              pendingTasksAllTime.map((task) => {
                const catStyle = CATEGORIES[task.category];
                
                return (
                  <div
                    key={task.id}
                    className="flex flex-col rounded-xl border border-slate-100 bg-white p-3.5 dark:bg-slate-900 dark:border-slate-800/70"
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold font-mono py-0.5 px-1.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" /> {task.date.split('-').reverse().slice(0, 2).join('/')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleComplete(task.id)}
                          className="p-1 rounded text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                          title="Marcar como Concluída"
                        >
                          <Square className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTask({ ...task, date: selectedDate })} // Carry onto selectedDate!
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/20"
                          title="Arrastar/Remanejar para a data focada"
                        >
                          Mudar para hoje
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[10px] font-medium leading-normal mt-1 text-slate-400 opacity-80 break-words dark:text-slate-500 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-50 dark:border-slate-850 pt-2 text-[9px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${catStyle.text} ${catStyle.bg}`}>
                        {catStyle.label}
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-500 hover:scale-105 transition-transform"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'scratchpad' && (
        <div className="flex-1 flex flex-col p-5 overflow-hidden h-full">
          <textarea
            value={scratchpad}
            onChange={handleScratchpadChange}
            className="w-full flex-1 border border-slate-200 rounded-2xl bg-slate-50/50 p-4 font-mono text-xs text-slate-700 leading-relaxed outline-hidden focus:border-indigo-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-none min-h-[140px]"
            placeholder="Comece a digitar anotações informais do dia aqui..."
          />
          <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic text-center">
            🔒 Salvo automaticamente no seu navegador local.
          </div>
        </div>
      )}
    </div>
  );
}
