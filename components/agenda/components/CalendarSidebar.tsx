/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckSquare, Target, Clock, Star } from 'lucide-react';
import { Task, TaskCategory, DayStats } from '../types';
import { CATEGORIES } from '../constants';
import { generateMonthGrid, formatDateKey } from '../utils';

interface CalendarSidebarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tasks: Task[];
  filteredCategories: Set<TaskCategory>;
  onToggleCategory: (category: TaskCategory) => void;
  dayStats: DayStats;
}

export default function CalendarSidebar({
  selectedDate,
  onSelectDate,
  tasks,
  filteredCategories,
  onToggleCategory,
  dayStats
}: CalendarSidebarProps) {
  const [currentYear, setCurrentYear] = useState(() => {
    const [y] = selectedDate.split('-').map(Number);
    return y || new Date().getFullYear();
  });
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    const [, m] = selectedDate.split('-').map(Number);
    return (m !== undefined ? m - 1 : new Date().getMonth());
  });

  const monthsPT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onSelectDate(formatDateKey(today));
  };

  const monthCells = generateMonthGrid(currentYear, currentMonth);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getCategoriesForDate = (dateKey: string): TaskCategory[] => {
    const dayTasks = tasks.filter(t => t.date === dateKey);
    const uniqueCats = new Set<TaskCategory>();
    dayTasks.forEach(t => uniqueCats.add(t.category));
    return Array.from(uniqueCats);
  };

  const strokeRadius = 40;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (dayStats.completionRate / 100) * strokeCircumference;

  return (
    <div className="flex flex-col gap-6 w-full text-slate-700 dark:text-slate-355">
      {/* 1. Módulo do Calendário */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              {monthsPT[currentMonth]} {currentYear}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg p-1 hover:bg-slate-50 text-slate-500 hover:text-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Mês Anterior"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handleGoToday}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Hoje
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-lg p-1 hover:bg-slate-50 text-slate-500 hover:text-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Próximo Mês"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {weekDays.map(wd => (
            <span key={wd} className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              {wd}
            </span>
          ))}
        </div>

        {/* Grid de Celas do Calendário */}
        <div className="grid grid-cols-7 gap-1">
          {monthCells.map((cell, idx) => {
            const isSelected = selectedDate === cell.dateKey;
            const dateCats = getCategoriesForDate(cell.dateKey);
            const isCurrentMonth = cell.isCurrentMonth;
            
            return (
              <button
                key={`${cell.dateKey}-${idx}`}
                onClick={() => onSelectDate(cell.dateKey)}
                className={`relative flex flex-col items-center justify-center aspect-square rounded-xl p-1 transition-all select-none group cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : cell.isToday
                    ? 'bg-indigo-50/50 text-indigo-700 font-bold border border-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/60'
                    : isCurrentMonth
                    ? 'hover:bg-slate-50 text-slate-800 dark:text-slate-200 dark:hover:bg-slate-850'
                    : 'text-slate-350 dark:text-slate-600 hover:bg-slate-50/30'
                }`}
              >
                <span className="text-xs relative z-10">{cell.date.getDate()}</span>
                
                {/* Dots representando tarefas do dia */}
                <div className="absolute bottom-1.5 flex gap-0.5 justify-center max-w-[85%] overflow-hidden">
                  {dateCats.slice(0, 4).map(cat => (
                    <span 
                      key={cat} 
                      className={`h-1 w-1 rounded-full ${CATEGORIES[cat].accent} ${
                        isSelected ? 'bg-white' : ''
                      }`} 
                    />
                  ))}
                  {dateCats.length > 4 && (
                    <span className={`h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500 ${isSelected ? 'bg-white' : ''}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filtros de Categorias */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/90">
        <h5 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <Target className="h-4 w-4 text-emerald-500" /> Categorias
        </h5>
        
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, value]) => {
            const isChecked = filteredCategories.has(key as TaskCategory);
            const dayCount = tasks.filter(t => t.date === selectedDate && t.category === key).length;
            
            return (
              <label 
                key={key} 
                className="flex items-center justify-between rounded-xl px-3 py-2 border border-slate-50 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-950 cursor-pointer select-none transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(key as TaskCategory)}
                    className="accent-indigo-650 rounded-sm h-4 w-4 transition-transform group-hover:scale-105"
                  />
                  <span className={`h-2.5 w-2.5 rounded-full ${value.accent}`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{value.label}</span>
                </div>
                {dayCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 text-slate-550 dark:text-slate-400">
                    {dayCount}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Resumo de Produtividade do Dia */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/90">
        <h5 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <CheckSquare className="h-4 w-4 text-indigo-500" /> Foco Diário
        </h5>

        <div className="flex items-center gap-4">
          {/* Radial progress circle */}
          <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={strokeRadius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={strokeRadius}
                className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-500"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={strokeCircumference}
                strokeDashoffset={isNaN(strokeDashoffset) ? strokeCircumference : strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-bold text-slate-800 dark:text-white leading-none">
                {Math.round(dayStats.completionRate)}%
              </span>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                Produtivo: <b className="text-slate-800 dark:text-slate-200">
                  {Math.floor(dayStats.productiveMinutes / 60)}h {dayStats.productiveMinutes % 60}m
                </b>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                Concluídos: <b className="text-slate-800 dark:text-slate-200">{dayStats.completed} / {dayStats.total}</b>
              </span>
            </div>

            <div className="pt-1">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${dayStats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
