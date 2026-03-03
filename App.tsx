
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Download, StickyNote, ArrowRight, RefreshCw, Database, AlertCircle, Upload, ShieldCheck, Wifi, WifiOff, Sun, Moon, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task, Mood, QuoteType, SubTask, Priority, HighlightColor } from './types';
import { QUOTES, AVATAR_IMAGES, LOGO_URL } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';
import { WelcomeCarousel } from './components/WelcomeCarousel';
import { TopMenu } from './components/TopMenu';
import { VisionBoard } from './components/VisionBoard';

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

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 17);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(VISION_STORE)) {
        db.createObjectStore(VISION_STORE);
      }
      if (!db.objectStoreNames.contains(GAMIFICATION_STORE)) {
        db.createObjectStore(GAMIFICATION_STORE, { keyPath: 'id', autoIncrement: true });
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
  store.add({ task_text: text, completed_at: Date.now() });
};

export const getGamificationPoints = async (): Promise<number> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(GAMIFICATION_STORE, 'readonly');
    const store = tx.objectStore(GAMIFICATION_STORE);
    const request = store.count();
    request.onsuccess = () => resolve(request.result || 0);
    request.onerror = () => resolve(0);
  });
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
  const [totalPoints, setTotalPoints] = useState(0);
  const [isAddingTask, setIsAddingTask] = useState(false);

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
    getGamificationPoints().then(pts => setTotalPoints(pts));
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isLoaded) saveTasksToDB(tasks);
  }, [tasks, isLoaded]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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
              getGamificationPoints().then(pts => setTotalPoints(pts));
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

  const progressPercent = Math.min(Math.round((totalPoints / 20) * 100), 100);
  const circumference = 251;
  const strokeOffset = Math.max(0, circumference - (circumference * Math.min(totalPoints / 20, 1)));

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

      {/* ===== STICKY HEADER (Stitch Style) ===== */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 ${isDarkMode ? 'bg-background-dark/80' : 'bg-background-light/80'} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <TopMenu tasks={tasks} isDarkMode={isDarkMode} onOpenVisionBoard={() => setShowVisionBoard(true)} />
          <img src={LOGO_URL} alt="5TASK Logo" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="relative p-2 text-slate-400 hover:text-white transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 transition-all overflow-hidden relative cursor-pointer group" onClick={() => setShowVisionBoard(true)}>
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors z-10"></div>
            <img src={AVATAR_IMAGES[mood]} alt="Einstein Status" className="w-full h-full object-cover scale-150 origin-top" />
          </div>
        </div>
      </header>

      {/* ===== MAIN DASHBOARD ===== */}
      <main className="px-6 py-4 space-y-6 max-w-4xl mx-auto pb-32">

        {/* --- Bento Top: Progress + Streak --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Progress Card */}
          <div className={`md:col-span-2 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between ${isDarkMode ? 'glass-card' : 'bg-white shadow-lg border-2 border-slate-100'}`}>
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Progresso Geral</h2>
              <p className="text-4xl font-bold">
                {totalPoints} <span className="text-lg font-normal text-slate-500">Tarefas</span>
              </p>
              {totalPoints > 0 && <p className="text-primary text-sm font-medium">+1 XP por tarefa</p>}
              {quote && (
                <p className={`mt-2 text-sm italic py-2 px-4 rounded-lg border-l-2 border-primary ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                  {quote}
                </p>
              )}
            </div>
            <div className="relative flex items-center justify-center mt-6 sm:mt-0">
              <svg className="w-24 h-24 sm:w-28 sm:h-28">
                <circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeWidth="8" className={isDarkMode ? 'text-slate-800' : 'text-slate-200'}></circle>
                <circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                  style={{ strokeDasharray: `${circumference}`, strokeDashoffset: `${strokeOffset}`, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                ></circle>
              </svg>
              <span className="absolute text-xl font-bold">{progressPercent}%</span>
            </div>
          </div>

          {/* Streak Card */}
          <div className={`rounded-xl p-6 flex flex-col justify-between bg-gradient-to-br ${isDarkMode ? 'from-primary/10 to-transparent glass-card' : 'from-primary/5 to-white shadow-lg border-2 border-primary/10'}`}>
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">Streak</span>
            </div>
            <div className="mt-8">
              <p className="text-5xl font-bold italic">0</p>
              <p className="text-slate-400 text-sm mt-1">Dias Seguidos</p>
            </div>
          </div>
        </section>

        {/* --- Task Lists Section --- */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today Tasks Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Hoje <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>{tasks.length}</span>
                  </h3>
                </div>
                <div className="space-y-3 relative">
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
                      <div className={`p-8 rounded-xl text-center border-2 border-dashed ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                        Nenhuma tarefa ativa. Clique no <strong className="text-accent-cyan">+</strong> para criar.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Trends Column */}
              <div className="space-y-6">
                <div className={`p-6 rounded-xl relative overflow-hidden ${isDarkMode ? 'glass-card' : 'bg-slate-50 border border-slate-200'}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-slate-400 text-sm font-medium">Níveis de Foco Diário</h3>
                    <div className="flex items-end gap-1 h-32">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className={`flex-1 transition-opacity ${tasks.length >= n ? 'opacity-100' : 'opacity-20'}`}>
                          <div className={`w-full rounded-t ${n === 5 ? 'bg-accent-cyan shadow-[0_0_15px_rgba(0,242,255,0.4)]' : `bg-primary/${n * 20}`}`}
                            style={{ height: `${n * 24}px` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter w-full">
                      <span>1</span><span>2</span><span>3</span><span>4</span>
                      <span className={tasks.length >= 5 ? 'text-accent-cyan' : ''}>MAX (5)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            className={`fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 p-4 rounded-3xl shadow-2xl ${isDarkMode ? 'glass-card cyan-glow' : 'bg-white border-2 border-accent-cyan shadow-xl'}`}
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

      {/* ===== FIXED BOTTOM NAV BAR (Stitch Style) ===== */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 rounded-full ${isDarkMode ? 'glass-card' : 'bg-white shadow-xl border border-slate-200'}`}>
        <div className={`flex flex-col items-center gap-1 ${isOnline ? 'text-green-500' : 'text-red-500'} px-2`}>
          {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
        </div>
        <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

        {/* FAB Add Button */}
        <button
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="w-14 h-14 bg-accent-cyan text-background-dark rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.4)] z-50"
        >
          <Plus size={30} strokeWidth={3} className={`transition-transform ${isAddingTask ? 'rotate-45' : ''}`} />
        </button>

        <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        <button onClick={() => window.open('https://github.com/gillemosai/5taskProcrastinacaoZero#readme', '_blank')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary px-2 cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>
      </div>

      {showVisionBoard && (
        <VisionBoard
          isDarkMode={isDarkMode}
          onClose={() => setShowVisionBoard(false)}
        />
      )}
    </div>
  );
};

export default App;
