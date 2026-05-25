/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Sun, Moon, Search, Sliders, Play, Plus, BookOpen, Layers } from 'lucide-react';
import { Task, TaskCategory, DayStats } from './types';
import { DEFAULT_TASKS, CATEGORIES } from './constants';
import { formatDateKey, formatPortugueseDate } from './utils';

import CalendarSidebar from './components/CalendarSidebar';
import TimelineView from './components/TimelineView';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';

// Audio Feedback helper for micro-interactions
function playChimeProgress() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Play a friendly, dual-tone soft chime
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // Warm E major interval (E5 -> G#5)
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(830.61, now + 0.12);
    
    osc2.frequency.setValueAtTime(523.25, now);
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch {
    // ignore AudioContext blocked by browser autoplay constraints
  }
}

export default function App() {
  // Load tasks from localStorage or fall back to DEFAULT_TASKS
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('agenda_diaria_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_TASKS; }
    }
    return DEFAULT_TASKS;
  });

  // Track the current selected day in "YYYY-MM-DD" format.
  // We match default state to the current metadata date: May 25, 2026.
  const [selectedDate, setSelectedDate] = useState('2026-05-25');

  // Multi-select fitler for task categories (all active by default)
  const [filteredCategories, setFilteredCategories] = useState<Set<TaskCategory>>(
    () => new Set<TaskCategory>(['work', 'personal', 'study', 'health', 'other'])
  );

  // Search feature state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Theme management (Light vs Dark Slate)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('agenda_diaria_theme');
    return saved === 'dark';
  });

  // TaskModal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [initialModalTime, setInitialModalTime] = useState<string | undefined>(undefined);

  // Auto-persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agenda_diaria_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Apply dark mode theme class to <html> tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('agenda_diaria_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('agenda_diaria_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle previous day traversal
  const handlePrevDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatDateKey(date));
  };

  // Handle next day traversal
  const handleNextDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);
    setSelectedDate(formatDateKey(date));
  };

  const handleGoToday = () => {
    setSelectedDate(formatDateKey(new Date()));
  };

  // Toggle category filters
  const handleToggleCategory = (category: TaskCategory) => {
    setFilteredCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        // Prevent clearing all categories if it's the last one left, keep at least one
        if (next.size > 1) {
          next.delete(category);
        }
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Open/close handlers for modal
  const handleOpenAddTask = (timeStr?: string) => {
    setTaskToEdit(null);
    setInitialModalTime(timeStr);
    setIsModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Create or Update task logic
  const handleSaveTask = (savedTaskData: Omit<Task, 'id' | 'completed'> & { id?: string; completed?: boolean }) => {
    if (savedTaskData.id) {
      // Update existing
      setTasks(prev => prev.map(t => {
        if (t.id === savedTaskData.id) {
          return {
            ...t,
            title: savedTaskData.title,
            description: savedTaskData.description,
            date: savedTaskData.date,
            startTime: savedTaskData.startTime,
            durationMinutes: savedTaskData.durationMinutes,
            category: savedTaskData.category,
            priority: savedTaskData.priority,
            completed: savedTaskData.completed ?? t.completed
          };
        }
        return t;
      }));
    } else {
      // Create new task
      const newTask: Task = {
        ...savedTaskData,
        id: `task-${Date.now()}`,
        completed: false
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = !t.completed;
        if (nextStatus) {
          playChimeProgress();
        }
        return { ...t, completed: nextStatus };
      }
      return t;
    }));
  };

  // Quick list task creator
  const handleQuickAddTask = (title: string, isAllDay: boolean) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      date: selectedDate,
      category: 'other',
      priority: 'medium',
      completed: false,
      startTime: isAllDay ? undefined : '09:00',
      durationMinutes: isAllDay ? undefined : 60
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Calculations for current page stats (based on active date & filters)
  const dayStats: DayStats = (() => {
    const dayTasks = tasks.filter(t => t.date === selectedDate && filteredCategories.has(t.category));
    const total = dayTasks.length;
    const completed = dayTasks.filter(t => t.completed).length;
    const uncompleted = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    // Sum minutes of all scheduled tasks on this day
    const productiveMinutes = dayTasks
      .filter(t => t.startTime !== undefined)
      .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);

    return {
      total,
      completed,
      uncompleted,
      completionRate,
      productiveMinutes
    };
  })();

  // Filter tasks matching search queries
  const searchedTasks = tasks.filter(t => {
    if (!searchTerm.trim()) return false;
    const query = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      (t.description?.toLowerCase().includes(query) || false)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white pb-6">
      
      {/* 1. Header Fixo Superior */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-100 px-6 py-4.5 dark:bg-slate-900/95 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        
        {/* LOGO E TÍTULO */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
            <CalendarIcon className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              Agenda Diária
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              Organizador Inteligente para PC
            </span>
          </div>
        </div>

        {/* NAVEGAÇÃO DE DIA CENTRAL */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl select-none">
          <button
            onClick={handlePrevDay}
            className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all active:scale-95"
            title="Dia Anterior"
          >
            Anterior
          </button>
          
          <div className="px-4 py-1.5 text-xs font-bold text-indigo-700 bg-white dark:bg-slate-900 dark:text-indigo-400 rounded-xl shadow-2xs text-center min-w-[200px] border border-slate-100 dark:border-slate-800">
            {formatPortugueseDate(selectedDate)}
          </div>

          <button
            onClick={handleNextDay}
            className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all active:scale-95"
            title="Próximo Dia"
          >
            Próximo
          </button>
        </div>

        {/* BUSCA, TEMA E NOVO COMPROMISSO */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Barra de Busca Dinâmica */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-48 text-xs font-medium rounded-xl border border-slate-205 bg-slate-50/50 pl-9.5 pr-4 py-2.5 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
            />
            {searchTerm.trim().length > 0 && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Toggle de Tema Light/Dark */}
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className="rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-400 transition-colors p-2.5 select-none"
            title={isDarkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Botão de Adicionar Principal */}
          <button
            onClick={() => handleOpenAddTask()}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-700 active:scale-95 transition-all outline-hidden cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Tarefa</span>
          </button>
        </div>
      </header>

      {/* 2. Conteúdo Principal - 3 Colunas para PC/Desktop */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
        
        {/* COLUNA ESQUERDA (Tamanho 3/12): Mini Calendário, Filtros de Tipo, Gauges */}
        <aside className="lg:col-span-3 h-full flex flex-col gap-6">
          <CalendarSidebar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            tasks={tasks}
            filteredCategories={filteredCategories}
            onToggleCategory={handleToggleCategory}
            dayStats={dayStats}
          />
        </aside>

        {/* COLUNA CENTRAL (Tamanho 5/12): Grade da Linha do Tempo e Horários */}
        <section className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[500px]">
          <TimelineView
            selectedDate={selectedDate}
            tasks={tasks}
            filteredCategories={filteredCategories}
            onAddTask={handleOpenAddTask}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        </section>

        {/* COLUNA DIREITA (Tamanho 4/12): Checklists, Tarefas Avulsas, Bloco de Notas */}
        <section className="lg:col-span-4 h-[calc(100vh-140px)] min-h-[500px]">
          <TaskList
            selectedDate={selectedDate}
            tasks={tasks}
            filteredCategories={filteredCategories}
            onAddTask={handleQuickAddTask}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        </section>
      </main>

      {/* 3. Dropdown de Resultados da Busca Geral (Exibido apenas quando há texto na busca) */}
      {searchTerm.trim().length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-2xl p-4 overflow-hidden max-h-96 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-2 mb-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
              Resultados da busca geral ({searchedTasks.length})
            </h4>
            <button
              onClick={() => setSearchTerm('')}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
            >
              Fechar
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
            {searchedTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                Nenhuma tarefa corresponde a sua pesquisa.
              </div>
            ) : (
              searchedTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedDate(t.date);
                    setSearchTerm('');
                  }}
                  className="bg-slate-50/60 hover:bg-indigo-50/25 dark:bg-slate-950 dark:hover:bg-indigo-950/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors group flex items-start justify-between gap-1"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {t.title}
                    </h5>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      Agendado para: <b>{t.date.split('-').reverse().join('/')} {t.startTime ? `@ ${t.startTime}` : '(Dia todo)'}</b>
                    </p>
                  </div>
                  {t.completed && (
                    <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded uppercase leading-none">
                      Feito
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Modal para Criar/Editar compromissos */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
          setInitialModalTime(undefined);
        }}
        onSave={handleSaveTask}
        selectedDate={selectedDate}
        initialTime={initialModalTime}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
