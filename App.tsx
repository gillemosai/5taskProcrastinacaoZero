
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Archive, StickyNote, ArrowRight, RefreshCw, Database, AlertCircle, Upload, ShieldCheck, Wifi, WifiOff, Sun, Moon, Target, Eye, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task, Mood, QuoteType, SubTask, Priority, HighlightColor } from './types';
import { QUOTES, AVATAR_IMAGES, LOGO_URL } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';
import { WelcomeCarousel } from './components/WelcomeCarousel';
import { ArchiveModal } from './components/ArchiveModal';
import { VisionBoard } from './components/VisionBoard';
import { UserGuide } from './components/UserGuide';

/**
 * ⚠️ INSTRUÇÃO AO SISTEMA: PROIBIDO MEXER NA PASTA "assets".
 * NÃO APAGAR, NÃO RENOMEAR, NÃO ALTERAR NADA DENTRO DE "assets/".
 */

// --- Database Engine (IndexedDB) ---
let dbInstance: IDBDatabase | null = null;
const DB_NAME = '5task_quantum_v78_db';
const STORE_NAME = 'tasks_store';
const VISION_STORE = 'vision_store';
const GAMIFICATION_STORE = 'gamification_store';

const ARCHIVE_STORE = 'archive_store';

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 19);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(VISION_STORE)) {
        db.createObjectStore(VISION_STORE);
      }
      if (!db.objectStoreNames.contains(GAMIFICATION_STORE)) {
        db.createObjectStore(GAMIFICATION_STORE, { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(ARCHIVE_STORE)) {
        db.createObjectStore(ARCHIVE_STORE);
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
};

const saveTasksToDB = async (tasks: Task[]) => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(tasks, 'current_tasks');
};

const loadTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('current_tasks');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

const saveArchivedTasksToDB = async (tasks: Task[]) => {
  const db = await getDB();
  const tx = db.transaction(ARCHIVE_STORE, 'readwrite');
  const store = tx.objectStore(ARCHIVE_STORE);
  store.put(tasks, 'current_archive');
};

const loadArchivedTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(ARCHIVE_STORE, 'readonly');
    const store = tx.objectStore(ARCHIVE_STORE);
    const request = store.get('current_archive');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

export const saveVisionToDB = async (data: any) => {
  const db = await getDB();
  const tx = db.transaction(VISION_STORE, 'readwrite');
  const store = tx.objectStore(VISION_STORE);
  store.put(data, 'current_vision');
};

export const loadVisionFromDB = async (): Promise<any> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(VISION_STORE, 'readonly');
    const store = tx.objectStore(VISION_STORE);
    const request = store.get('current_vision');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
};

export const saveCompletedTaskToDB = async (text: string) => {
  const db = await getDB();
  const tx = db.transaction(GAMIFICATION_STORE, 'readwrite');
  const store = tx.objectStore(GAMIFICATION_STORE);
  const data = { task_text: text, completed_at: Date.now() };
  if (store.autoIncrement) {
    store.add(data);
  } else {
    store.add(data, Date.now());
  }
};

export const getGamificationStats = async (): Promise<{ totalXP: number, streak: number, todayCount: number }> => {
  const db = await getDB();
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(GAMIFICATION_STORE, 'readonly');
      const store = tx.objectStore(GAMIFICATION_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const entries: { task_text: string, completed_at: number }[] = request.result || [];
        const tasksByDay: Record<string, number> = {};
        entries.forEach(entry => {
          const date = new Date(entry.completed_at);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          tasksByDay[dateStr] = (tasksByDay[dateStr] || 0) + 1;
        });
        let totalXP = 0;
        Object.keys(tasksByDay).forEach(dateStr => {
          const count = tasksByDay[dateStr];
          totalXP += count * 10;
          if (count >= 5) totalXP += 50;
        });
        let streak = 0;
        let currentCheckDate = new Date();
        let daysChecked = 0;
        while (true) {
          const dateStr = `${currentCheckDate.getFullYear()}-${String(currentCheckDate.getMonth() + 1).padStart(2, '0')}-${String(currentCheckDate.getDate()).padStart(2, '0')}`;
          const count = tasksByDay[dateStr] || 0;
          if (count >= 3) {
            streak++;
          } else if (daysChecked > 0) {
            break;
          }
          currentCheckDate.setDate(currentCheckDate.getDate() - 1);
          daysChecked++;
        }
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        resolve({ totalXP, streak, todayCount: tasksByDay[todayStr] || 0 });
      };
      request.onerror = () => resolve({ totalXP: 0, streak: 0, todayCount: 0 });
    } catch (e) {
      resolve({ totalXP: 0, streak: 0, todayCount: 0 });
    }
  });
};

const playPulseSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.warn('Audio feedback failed', e);
  }
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [quote, setQuote] = useState(QUOTES.welcome[0]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('5task_welcome_seen'));
  const [showVisionBoard, setShowVisionBoard] = useState(false);
  const [showVisionViewOnly, setShowVisionViewOnly] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showProductiveModal, setShowProductiveModal] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showQuoteBubble, setShowQuoteBubble] = useState(true);
  const [visionText, setVisionText] = useState('');
  const [pulseButton, setPulseButton] = useState(false);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    loadTasksFromDB().then(savedTasks => {
      setTasks(savedTasks);
      setIsLoaded(true);
      window.dispatchEvent(new Event('app-ready'));
    });
    loadArchivedTasksFromDB().then(savedArchive => setArchivedTasks(savedArchive));
    getGamificationStats().then(stats => {
      setTotalPoints(stats.totalXP);
      setStreak(stats.streak);
    });
    loadVisionFromDB().then(data => {
      if (data && data.visao) setVisionText(data.visao);
    });
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTasksToDB(tasks);
      saveArchivedTasksToDB(archivedTasks);
    }
  }, [tasks, archivedTasks, isLoaded]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Auto-hide quote bubble after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowQuoteBubble(false), 6000);
    return () => clearTimeout(timer);
  }, [quote]);



  // Rotina de Expiração Anti-Procrastinação e Atualização de Humor de Urgência
  useEffect(() => {
    const checkUrgencyAndExpiration = () => {
      setTasks(prev => {
        const now = Date.now();
        const HOURS_24_MS = 24 * 60 * 60 * 1000;
        const HOURS_27_MS = 27 * 60 * 60 * 1000;

        let changed = false;
        let urgencyMood: Mood | null = null;
        let minTimeLeft = Infinity;

        const validTasks = prev.filter(t => {
          if (!t.completed) {
            const age = now - t.createdAt;
            if (age > HOURS_27_MS) {
              const rCount = t.rescueCount || 0;
              if (rCount < 3) {
                setArchivedTasks(oldArchive => [t, ...oldArchive].slice(0, 10));
              }
              changed = true;
              return false;
            }
            if (age > HOURS_24_MS) {
              const timeLeftMs = HOURS_27_MS - age;
              if (timeLeftMs < minTimeLeft) {
                minTimeLeft = timeLeftMs;
                if (timeLeftMs <= 60 * 60 * 1000) {
                  urgencyMood = Mood.PANIC_1H;
                } else if (timeLeftMs <= 2 * 60 * 60 * 1000) {
                  urgencyMood = Mood.PANIC_2H;
                } else {
                  urgencyMood = Mood.PANIC_3H;
                }
              }
            }
          }
          return true;
        });

        setTimeout(() => {
          setMood(current => {
            if (urgencyMood) return urgencyMood;
            if (current === Mood.PANIC_1H || current === Mood.PANIC_2H || current === Mood.PANIC_3H) return Mood.HAPPY;
            return current;
          });
          setQuote(currentQuote => {
            if (urgencyMood === Mood.PANIC_1H) return "É O FIM DOS TEMPOS! ACABE ESSA TAREFA AGORA! 🚨";
            if (urgencyMood === Mood.PANIC_2H) return "Não há mais como fugir... O desespero se aproxima! Faltam menos de 2 horas! 😱";
            if (urgencyMood === Mood.PANIC_3H) return "O tempo de tolerância começou... o relógio está correndo contra você! 😬";
            return currentQuote;
          });
        }, 0);

        return changed ? validTasks : prev;
      });
    };

    checkUrgencyAndExpiration();
    const interval = setInterval(checkUrgencyAndExpiration, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateEinstein = (type: QuoteType, customMood?: Mood) => {
    if (mood === Mood.PANIC_1H || mood === Mood.PANIC_2H || mood === Mood.PANIC_3H) return;
    const quotes = QUOTES[type];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setShowQuoteBubble(true);
    if (customMood) setMood(customMood);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (tasks.length >= 5) {
      updateEinstein('full', Mood.SHOCKED);
      return;
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      completed: false,
      createdAt: Date.now(),
      subTasks: [],
      priority: 'none',
      highlightColor: 'none'
    };
    setTasks([newTask, ...tasks]);
    setInputText('');
    setIsAddingTask(false);
    updateEinstein('add', Mood.EXCITED);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const newState = !t.completed;
          if (newState) {
            updateEinstein('complete', Mood.HAPPY);
            saveCompletedTaskToDB(t.text).then(() => {
              getGamificationStats().then(stats => {
                setTotalPoints(stats.totalXP);
                setStreak(stats.streak);
                if (stats.todayCount === 3) {
                  setShowProductiveModal(true);
                }
              });
            }).catch(e => console.error("Error saving gamification:", e));
          }
          return { ...t, completed: newState };
        }
        return t;
      });
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setTasks(prev => prev.filter(t => t.id !== id));
      updateEinstein('delete', Mood.SHOCKED);
    }
  };

  const updateTaskProps = (id: string, priority: Priority, color: HighlightColor) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority, highlightColor: color } : t));
  };

  // Drag & Drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
  };
  const handleDragEnter = (e: React.DragEvent, position: number) => {
    dragOverItem.current = position;
  };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newList = [...tasks];
      const movedItem = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, movedItem);
      setTasks(newList);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleRescueTask = (taskToRescue: Task) => {
    if (tasks.length >= 5) {
      const freeSlots = 5 - tasks.length;
      alert(`Você só pode ter no máximo 5 tarefas ativas simultaneamente. ${freeSlots === 0 ? 'Conclua alguma atividade para liberar espaço!' : `Você tem espaço para resgatar apenas ${freeSlots} tarefa(s).`}`);
      return;
    }

    const currentRescue = taskToRescue.rescueCount || 0;
    const newRescueCount = currentRescue + 1;

    if (newRescueCount === 3) {
      alert("ATENÇÃO: Este é o seu ÚLTIMO RESGATE para esta tarefa. Se não for concluída dentro do prazo, ela será excluída permanentemente do sistema pois está atrapalhando a produtividade.");
    }

    const rescuedTask: Task = {
      ...taskToRescue,
      rescueCount: newRescueCount,
      createdAt: Date.now(),
      priority: 'none',
      highlightColor: 'none'
    };

    setArchivedTasks(prev => prev.filter(t => t.id !== taskToRescue.id));
    setTasks(prev => [rescuedTask, ...prev]);

    if (archivedTasks.length <= 1) {
      setShowArchiveModal(false);
    }
  };

  const currentLevelProgress = totalPoints % 100;
  const progressPercent = totalPoints === 0 ? 0 : (currentLevelProgress === 0 ? 100 : currentLevelProgress);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-display ${isDarkMode ? 'bg-background-dark text-slate-100' : 'bg-background-light text-slate-900'}`}>
      {showWelcome && (
        <WelcomeCarousel
          isDarkMode={isDarkMode}
          onComplete={() => {
            setShowWelcome(false);
            localStorage.setItem('5task_welcome_seen', 'true');
          }}
        />
      )}



      {/* ===== MAIN DASHBOARD ===== */}
      <main className="px-4 py-3 space-y-4 max-w-4xl mx-auto pb-32">

        {/* --- Hero Section: Avatar LEFT | Stats + Visão RIGHT --- */}
        <section className="flex gap-3 items-start">
          {/* Avatar Large (Left) */}
          <div className="shrink-0 flex flex-col items-center" onClick={() => setShowQuoteBubble(!showQuoteBubble)}>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 cursor-pointer">
              <div className="absolute inset-0 bg-neon-purple rounded-full blur-2xl opacity-15 animate-pulse"></div>
              <div className={`relative w-full h-full rounded-full border-[3px] shadow-lg z-10 flex items-center justify-center overflow-hidden transition-colors ${isDarkMode ? 'border-neon-blue bg-slate-900' : 'border-slate-300 bg-white'}`}>
                <img
                  src={AVATAR_IMAGES[mood]}
                  alt="Einstein"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 text-lg z-20">⚛️</div>
            </div>
          </div>

          {/* Right Column: Quote + Stats + Visão */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Quote Bubble */}
            <AnimatePresence>
              {showQuoteBubble && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`rounded-xl px-3 py-2 text-[11px] font-bold font-mono shadow-lg relative cursor-pointer leading-snug
                    ${isDarkMode ? 'bg-white/95 text-slate-900 border border-neon-blue/30' : 'bg-slate-900/95 text-white border border-slate-600'}`}
                    onClick={() => setShowQuoteBubble(false)}
                  >
                    "{quote}"
                    <div className={`absolute -left-1.5 top-4 w-2.5 h-2.5 rotate-45 ${isDarkMode ? 'bg-white border-l border-b border-neon-blue/30' : 'bg-slate-900 border-l border-b border-slate-600'}`}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2">
              {/* Progress Card */}
              <div className={`rounded-xl px-2 sm:px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'glass-card-vivid' : 'bg-white shadow-md border border-slate-100'}`}>
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-9 h-9 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="15" fill="none" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="3" />
                    <circle cx="20" cy="20" r="15" fill="none" stroke="#ee00ff" strokeWidth="3" strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 15}`,
                        strokeDashoffset: `${Math.max(0, 2 * Math.PI * 15 - (2 * Math.PI * 15 * Math.min(progressPercent / 100, 1)))}`,
                      }}
                    />
                  </svg>
                  <span className="absolute text-[8px] font-black">{progressPercent}%</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-normal sm:tracking-wider truncate">Progresso</p>
                  <p className="text-base font-black leading-none">{totalPoints} <span className="text-[9px] font-normal text-slate-500">XP</span></p>
                </div>
              </div>

              {/* Sequência Card (was Streak) */}
              <div className={`rounded-xl px-2 sm:px-2.5 py-2 flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'glass-card-vivid bg-gradient-to-br from-primary/8 to-transparent' : 'bg-white shadow-md border border-primary/10'}`}>
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-normal sm:tracking-wider truncate">Sequência</p>
                  <p className="text-base font-black leading-none italic">{streak} <span className="text-[9px] font-normal text-slate-500 not-italic">{streak === 1 ? 'dia' : 'dias'}</span></p>
                </div>
              </div>
            </div>

            {/* Visão: show text if filled, button if empty */}
            {visionText.trim() ? (
              <div
                onClick={() => setShowVisionViewOnly(true)}
                className={`w-full rounded-xl px-3 py-2 cursor-pointer transition-all active:scale-[0.98] ${isDarkMode ? 'glass-card-vivid hover:bg-white/5' : 'bg-white shadow-md border border-slate-100 hover:bg-amber-50'}`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1 ${isDarkMode ? 'text-amber-400/70' : 'text-amber-600/70'}`}>
                  <Target size={10} /> Minha Visão
                </p>
                <p className={`text-[11px] leading-snug line-clamp-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {visionText}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowVisionViewOnly(true)}
                className={`w-full rounded-xl px-3 py-2 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isDarkMode ? 'glass-card-vivid text-amber-400 hover:bg-white/5' : 'bg-white shadow-md border border-slate-100 text-amber-600 hover:bg-amber-50'}`}
              >
                <Target size={15} /> Visão
              </button>
            )}
          </div>
        </section>

        {/* --- Task Lists Section (HERO - Primary Focus) --- */}
        <section>
          {activeTaskId && tasks.find(t => t.id === activeTaskId) ? (
            <div className={`border rounded-3xl p-6 shadow-2xl min-h-[500px] ${isDarkMode ? 'glass-card border-none' : 'bg-white border-slate-200'}`}>
              <KanbanBoard
                task={tasks.find(t => t.id === activeTaskId)!}
                onClose={() => setActiveTaskId(null)}
                onUpdateSubtasks={(subs) => setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, subTasks: subs } : t))}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <>
              {/* Today Tasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black flex items-center gap-2">
                    Hoje <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-accent-cyan/15 text-accent-cyan' : 'bg-accent-cyan/10 text-teal-700'}`}>{tasks.length}</span>
                  </h3>
                </div>
                <div className="space-y-2.5 relative">
                  <AnimatePresence>
                    {tasks.map((task, idx) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={idx}
                        onComplete={toggleTask}
                        onDelete={deleteTask}
                        onEdit={(id, text) => setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t))}
                        onUpdateProps={updateTaskProps}
                        onOpenKanban={setActiveTaskId}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                    {tasks.length === 0 && (
                      <div
                        onClick={() => {
                          playPulseSound();
                          setPulseButton(true);
                          setTimeout(() => setPulseButton(false), 800);
                        }}
                        className={`p-8 rounded-xl text-center border-2 border-dashed transition-colors cursor-pointer active:scale-95 duration-200 ${isDarkMode ? 'border-slate-800 text-slate-500 hover:bg-slate-800/50 hover:border-accent-cyan' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-accent-cyan'}`}
                      >
                        Nenhuma tarefa ativa. Clique aqui ou no <strong className="text-accent-cyan">+</strong> para criar.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Focus Levels - Compact & Below Tasks */}
              <div className={`mt-4 p-3 rounded-xl relative overflow-hidden ${isDarkMode ? 'glass-card-vivid' : 'bg-slate-50 border border-slate-200'}`}>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest shrink-0">Foco</h4>
                  <div className="flex items-end gap-1.5 h-7 flex-1 max-w-[160px]">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className={`flex-1 transition-opacity ${tasks.length >= n ? 'opacity-100' : 'opacity-20'}`}>
                        <div className={`w-full rounded-sm ${n === 5 ? 'bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.4)]' : `bg-primary/${n * 20}`}`}
                          style={{ height: `${n * 4 + 3}px` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${tasks.length >= 5 ? 'text-accent-cyan' : 'text-slate-500'}`}>
                    {tasks.length}/5
                  </span>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ===== FLOATING ADD TASK MODAL ===== */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`fixed bottom-28 inset-x-0 mx-auto w-[90%] max-w-md z-50 p-4 rounded-3xl shadow-2xl ${isDarkMode ? 'glass-card cyan-glow' : 'bg-white border-2 border-accent-cyan shadow-xl'}`}
          >
            <form onSubmit={addTask} className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="font-bold">Nova Tarefa</h3>
                <button type="button" onClick={() => setIsAddingTask(false)} className="text-slate-400 p-1"><X size={18} /></button>
              </div>
              <input
                autoFocus
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="O que vamos resolver hoje?"
                className={`w-full rounded-2xl p-4 outline-none font-medium ${isDarkMode ? 'bg-background-dark text-white border border-slate-700 focus:border-accent-cyan' : 'bg-slate-50 border-2 border-slate-200 focus:border-accent-cyan'}`}
              />
              <button type="submit" className="w-full bg-accent-cyan text-background-dark font-bold p-4 rounded-xl shadow-lg active:scale-95 disabled:opacity-50">
                Criar Tarefa
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FIXED BOTTOM NAV BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pb-3 pointer-events-none">
        <div className={`flex items-center justify-center gap-1 px-3 py-2 rounded-[28px] pointer-events-auto w-[95%] max-w-md ${isDarkMode ? 'glass-card border border-slate-700/50' : 'bg-white/95 shadow-2xl border border-slate-200'} backdrop-blur-xl`}>

          {/* Visão */}
          <div className="relative group">
            <button
              onClick={() => setShowVisionViewOnly(true)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90 min-w-[56px] ${isDarkMode ? 'text-amber-400 hover:bg-amber-400/10' : 'text-amber-600 hover:bg-amber-50'
                }`}
            >
              <Eye size={20} />
              <span className="text-[9px] font-bold leading-none">Visão</span>
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200 shadow-lg'}`}>
              📋 Ver seu Quadro de Visão
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1 ${isDarkMode ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-slate-200'}`}></div>
            </div>
          </div>

          {/* Docs */}
          <div className="relative group">
            <button
              onClick={() => setShowUserGuide(true)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90 min-w-[56px] ${isDarkMode ? 'text-blue-400 hover:bg-blue-400/10' : 'text-blue-600 hover:bg-blue-50'
                }`}
            >
              <FileText size={20} />
              <span className="text-[9px] font-bold leading-none">Docs</span>
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200 shadow-lg'}`}>
              📖 Guia de uso do 5Task
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1 ${isDarkMode ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-slate-200'}`}></div>
            </div>
          </div>

          {/* Divider */}
          <div className={`h-8 w-[1px] mx-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-slate-200'}`}></div>

          {/* FAB Add Button (Center) */}
          <div className="relative group w-14 h-14 flex items-center justify-center -my-3 z-50">
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-50
                ${isDarkMode ? 'text-background-dark' : 'text-slate-900'}
                ${pulseButton
                  ? 'bg-accent-cyan scale-125 shadow-[0_0_40px_rgba(0,242,255,1)] animate-pulse border-4 border-white/50'
                  : 'bg-accent-cyan hover:scale-105 shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                }
              `}
            >
              <Plus size={30} strokeWidth={3} className={`transition-transform ${isAddingTask ? 'rotate-45' : ''}`} />
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-8 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200 shadow-lg'}`}>
              ✨ Criar nova tarefa
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1 ${isDarkMode ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-slate-200'}`}></div>
            </div>
          </div>

          {/* Divider */}
          <div className={`h-8 w-[1px] mx-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-slate-200'}`}></div>

          {/* Arquivo */}
          <div className="relative group">
            <button
              onClick={() => setShowArchiveModal(true)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90 min-w-[56px] ${isDarkMode ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-emerald-600 hover:bg-emerald-50'
                }`}
            >
              <Archive size={20} />
              <span className="text-[9px] font-bold leading-none">Arquivo</span>
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200 shadow-lg'}`}>
              📂 Resgatar tarefas não concluídas
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1 ${isDarkMode ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-slate-200'}`}></div>
            </div>
          </div>

          {/* Tema */}
          <div className="relative group">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90 min-w-[56px] ${isDarkMode ? 'text-purple-400 hover:bg-purple-400/10' : 'text-purple-600 hover:bg-purple-50'
                }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="text-[9px] font-bold leading-none">Tema</span>
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200 shadow-lg'}`}>
              🎨 Alternar modo claro/escuro
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1 ${isDarkMode ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-slate-200'}`}></div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className={`mt-1.5 text-[10px] text-center font-mono pointer-events-auto leading-relaxed ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          <p>5Task - Procrastinacao Zero - V 4.1.0</p>
          <p>Copyright @gillemosai | Todos os direitos reservados</p>
        </div>
      </div>

      {/* ===== VISION BOARD: Full Editor (from TopMenu) ===== */}
      {showVisionBoard && (
        <VisionBoard
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowVisionBoard(false);
            loadVisionFromDB().then(data => {
              if (data && data.visao) setVisionText(data.visao);
            });
          }}
        />
      )}

      {/* ===== VISION BOARD: View-Only Popup (from dashboard button) ===== */}
      {showVisionViewOnly && (
        <VisionBoard
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowVisionViewOnly(false);
            loadVisionFromDB().then(data => {
              if (data && data.visao) setVisionText(data.visao);
            });
          }}
          viewOnly={true}
        />
      )}

      {/* ===== ARCHIVE MODAL ===== */}
      <AnimatePresence>
        {showArchiveModal && (
          <ArchiveModal
            archivedTasks={archivedTasks}
            isDarkMode={isDarkMode}
            onClose={() => setShowArchiveModal(false)}
            onRescue={handleRescueTask}
          />
        )}
      </AnimatePresence>

      {/* ===== PRODUCTIVE DAY MODAL ===== */}
      <AnimatePresence>
        {showProductiveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowProductiveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className={`relative max-w-sm w-full p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center ${isDarkMode ? 'glass-card-vivid border-2 border-accent-cyan/50' : 'bg-white border-2 border-accent-cyan/50'}`}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowProductiveModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                title="Fechar"
              >
                <X size={24} />
              </button>

              <div className="w-40 h-40 mb-6 rounded-full border-4 border-accent-cyan shadow-[0_0_30px_rgba(0,242,255,0.4)] overflow-hidden shrink-0">
                <img
                  src={AVATAR_IMAGES[Mood.HAPPY]}
                  alt="Einstein Feliz"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className={`text-2xl font-black mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Parabéns! 🎉
              </h2>
              <p className={`text-lg font-medium mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Hoje foi um dia produtivo! Você cumpriu 3 metas e garantiu seu dia na sequência!
              </p>

              <button
                onClick={() => setShowProductiveModal(false)}
                className="w-full bg-accent-cyan text-background-dark font-black text-lg p-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,242,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,242,255,0.23)] hover:scale-105 transition-all active:scale-95"
              >
                Continuar Vencendo! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== USER GUIDE ===== */}
      {showUserGuide && (
        <UserGuide isDarkMode={isDarkMode} onClose={() => setShowUserGuide(false)} />
      )}
    </div>
  );
};

export default App;
