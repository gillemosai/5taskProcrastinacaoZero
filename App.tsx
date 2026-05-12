
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Archive, StickyNote, ArrowRight, RefreshCw, Database, AlertCircle, Upload, ShieldCheck, Wifi, WifiOff, Sun, Moon, Target, Eye, FileText, Repeat, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task, Mood, QuoteType, SubTask, Priority, HighlightColor, TaskType, ChecklistItem } from './types';
import { QUOTES, AVATAR_IMAGES, LOGO_URL } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';
import { WelcomeCarousel } from './components/WelcomeCarousel';
import { ArchiveModal } from './components/ArchiveModal';
import { VisionBoard } from './components/VisionBoard';
import { UserGuide } from './components/UserGuide';
import { RecurrenceType } from './types';
import { FanMenu } from './components/FanMenu';
import { ListTaskModal } from './components/ListTaskModal';

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
const COMPLETED_STORE = 'completed_store';

type ActiveTab = 'today' | 'completed' | 'recurring';

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 20);
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
      if (!db.objectStoreNames.contains(COMPLETED_STORE)) {
        db.createObjectStore(COMPLETED_STORE);
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

const saveCompletedTasksToDB = async (tasks: Task[]) => {
  const db = await getDB();
  const tx = db.transaction(COMPLETED_STORE, 'readwrite');
  const store = tx.objectStore(COMPLETED_STORE);
  store.put(tasks, 'completed_tasks');
};

const loadCompletedTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(COMPLETED_STORE, 'readonly');
    const store = tx.objectStore(COMPLETED_STORE);
    const request = store.get('completed_tasks');
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
  if (localStorage.getItem('5task_sound') === 'false') return;
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

const playActionSound = () => {
  if (localStorage.getItem('5task_sound') === 'false') return;
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
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play);
    } else {
      play();
    }
  } catch (e) {
    // ignorar silenciosamente
  }
};

const playAvatarSound = () => {
  if (localStorage.getItem('5task_sound') === 'false') return;
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
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
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
  const [newTaskRecurrence, setNewTaskRecurrence] = useState<RecurrenceType>('none');
  const [newTaskInterval, setNewTaskInterval] = useState(2);
  const [todayCompletedCount, setTodayCompletedCount] = useState(0);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showQuoteBubble, setShowQuoteBubble] = useState(true);
  const [visionText, setVisionText] = useState('');
  const [pulseButton, setPulseButton] = useState(false);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [swUpdateReady, setSwUpdateReady] = useState(false);
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [showRecurringBanner, setShowRecurringBanner] = useState(false);
  const [showFanMenu, setShowFanMenu] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => localStorage.getItem('5task_sound') !== 'false');

  useEffect(() => {
    localStorage.setItem('5task_sound', isSoundEnabled ? 'true' : 'false');
  }, [isSoundEnabled]);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Detecta quando o Service Worker tem uma nova versão disponível
  useEffect(() => {
    const handleSwUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      swRegistrationRef.current = customEvent.detail?.registration || null;
      setSwUpdateReady(true);
    };
    window.addEventListener('sw-update-available', handleSwUpdate);
    return () => window.removeEventListener('sw-update-available', handleSwUpdate);
  }, []);

  const handleAppUpdate = () => {
    // Instrui o SW em espera a assumir o controle imediatamente
    if (swRegistrationRef.current?.waiting) {
      swRegistrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Fallback: recarrega forçado
      window.location.reload();
    }
  };

  useEffect(() => {
    loadTasksFromDB().then(savedTasks => {
      setTasks(savedTasks);
      setIsLoaded(true);
      window.dispatchEvent(new Event('app-ready'));
    });
    loadArchivedTasksFromDB().then(savedArchive => setArchivedTasks(savedArchive));
    loadCompletedTasksFromDB().then(savedCompleted => setCompletedTasks(savedCompleted));
    getGamificationStats().then(stats => {
      setTotalPoints(stats.totalXP);
      setStreak(stats.streak);
      setTodayCompletedCount(stats.todayCount);
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
      saveCompletedTasksToDB(completedTasks);
    }
  }, [tasks, archivedTasks, completedTasks, isLoaded]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Auto-hide quote bubble after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowQuoteBubble(false), 6000);
    return () => clearTimeout(timer);
  }, [quote]);

  // Auto-hide recurring banner after 5 seconds
  useEffect(() => {
    if (!showRecurringBanner) return;
    const timer = setTimeout(() => setShowRecurringBanner(false), 5000);
    return () => clearTimeout(timer);
  }, [showRecurringBanner]);



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
          // Tarefas concluídas agora são gerenciadas pelo toggleTask, não mais aqui
          if (t.completed) {
            return true; // Manter — toggleTask cuida de mover para completedTasks
          } else {
            const age = now - t.createdAt;
            if (age > HOURS_27_MS) {
              const rCount = t.rescueCount || 0;
              if (rCount < 3) {
                setArchivedTasks(oldArchive => [{ ...t, rescueSource: 'expiration' as const }, ...oldArchive].slice(0, 10));
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

  // Rotina de Recriação de Tarefas Recorrentes (verifica a cada 1 minuto)
  useEffect(() => {
    const checkRecurringTasks = () => {
      setCompletedTasks(prevCompleted => {
        const todayDate = new Date();
        const newRecurringTasks: Task[] = [];
        let changed = false;

        const updatedCompleted = prevCompleted.map(t => {
          if (!t.isRecurring || !t.recurrence || t.recurrence === 'none') return t;

          const completedDate = new Date(t.completedAt || t.createdAt);
          const wasRecreated = t.lastRecurredAt && new Date(t.lastRecurredAt).toDateString() === todayDate.toDateString();

          if (wasRecreated) return t;

          let shouldRecreate = false;
          if (t.recurrence === 'daily') {
            shouldRecreate = completedDate.toDateString() !== todayDate.toDateString();
          } else if (t.recurrence === 'weekdays') {
            const isWeekday = todayDate.getDay() > 0 && todayDate.getDay() < 6;
            shouldRecreate = isWeekday && completedDate.toDateString() !== todayDate.toDateString();
          } else if (t.recurrence === 'weekly') {
            const daysDiff = Math.floor((todayDate.getTime() - completedDate.getTime()) / (1000 * 3600 * 24));
            shouldRecreate = daysDiff >= 7;
          } else if (t.recurrence === 'custom' && t.recurrenceInterval) {
            const daysDiff = Math.floor((todayDate.getTime() - completedDate.getTime()) / (1000 * 3600 * 24));
            shouldRecreate = daysDiff >= t.recurrenceInterval;
          }

          if (shouldRecreate) {
            newRecurringTasks.push({
              ...t,
              id: crypto.randomUUID(),
              completed: false,
              createdAt: Date.now(),
              completedAt: undefined,
              lastRecurredAt: Date.now(),
              priority: 'none',
              highlightColor: 'none',
              rescueCount: 0,
              isRecreatedRecurring: true,
            });
            changed = true;
            return { ...t, lastRecurredAt: Date.now() };
          }
          return t;
        });

        if (newRecurringTasks.length > 0) {
          setTasks(prevTasks => {
            const activeTasks = prevTasks.filter(t => !t.completed);
            const activeRecurringCount = activeTasks.filter(t => t.isRecurring).length;
            const availableSlots = 5 - activeTasks.length;
            const availableRecurringSlots = 2 - activeRecurringCount;
            // Respeitar ambos os limites: 5 tarefas ativas e 2 recorrentes na tela principal
            const maxToAdd = Math.min(Math.max(0, availableSlots), Math.max(0, availableRecurringSlots));
            const toAdd = newRecurringTasks.slice(0, maxToAdd);
            // Recorrentes que não cabem na main vão para completedTasks (aba recorrentes)
            const overflow = newRecurringTasks.slice(maxToAdd);
            if (overflow.length > 0) {
              setCompletedTasks(prev => [...overflow, ...prev]);
            }
            if (toAdd.length > 0) return [...toAdd, ...prevTasks];
            return prevTasks;
          });
        }

        return changed ? updatedCompleted : prevCompleted;
      });
    };

    checkRecurringTasks();
    const interval = setInterval(checkRecurringTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateEinstein = (type: QuoteType, customMood?: Mood) => {
    if (mood === Mood.PANIC_1H || mood === Mood.PANIC_2H || mood === Mood.PANIC_3H) return;
    const quotes = QUOTES[type];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setShowQuoteBubble(true);
    if (customMood) setMood(customMood);
    
    playAvatarSound();
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const isRecurringNew = newTaskRecurrence !== 'none';

    // Conta recorrentes GLOBAIS (tasks + completedTasks)
    const globalRecurringCount = [
      ...tasks.filter(t => t.isRecurring),
      ...completedTasks.filter(t => t.isRecurring),
    ].length;

    // Limite absoluto de 5 recorrentes no sistema
    if (isRecurringNew && globalRecurringCount >= 5) {
      alert('Limite máximo de 5 tarefas recorrentes atingido. Remova uma recorrente antes de criar outra.');
      return;
    }

    const activeTasks = tasks.filter(t => !t.completed);
    const activeNonRecurringCount = activeTasks.filter(t => !t.isRecurring).length;
    const activeRecurringOnMain = activeTasks.filter(t => t.isRecurring);

    // === CASO 1: Criando tarefa RECORRENTE ===
    if (isRecurringNew) {
      const newRecurringTask: Task = {
        id: crypto.randomUUID(),
        text: inputText.trim(),
        completed: false,
        createdAt: Date.now(),
        subTasks: [],
        priority: 'none',
        highlightColor: 'none',
        isRecurring: true,
        recurrence: newTaskRecurrence,
        recurrenceInterval: newTaskRecurrence === 'custom' ? newTaskInterval : undefined,
      };

      // Se a tela principal já tem 5 tarefas OU já tem 2+ recorrentes na main → vai direto para aba recorrentes
      if (activeTasks.length >= 5 || activeRecurringOnMain.length >= 2) {
        setCompletedTasks(prev => [newRecurringTask, ...prev]);
        setShowRecurringBanner(true);
      } else {
        // Tem espaço na tela principal E menos de 2 recorrentes → adiciona na main
        setTasks(prev => [newRecurringTask, ...prev]);
      }

      setInputText('');
      setNewTaskRecurrence('none');
      setNewTaskInterval(2);
      setIsAddingTask(false);
      updateEinstein('add', Mood.EXCITED);
      playActionSound();
      return;
    }

    // === CASO 2: Criando tarefa NÃO-RECORRENTE (diária) ===
    // Limite: 5 tarefas não-recorrentes no máximo
    if (activeNonRecurringCount >= 5) {
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
      highlightColor: 'none',
      isRecurring: false,
      recurrence: 'none',
    };

    // Se a tela principal está cheia (5 tarefas) mas tem recorrentes, empurra recorrentes para aba
    if (activeTasks.length >= 5 && activeRecurringOnMain.length > 0) {
      // Move a recorrente mais antiga da main para completedTasks (aba recorrentes)
      const recurringToDisplace = activeRecurringOnMain[activeRecurringOnMain.length - 1]; // mais antiga
      setTasks(prev => [newTask, ...prev.filter(t => t.id !== recurringToDisplace.id)]);
      setCompletedTasks(prev => [recurringToDisplace, ...prev]);
      setShowRecurringBanner(true);
    } else {
      setTasks(prev => [newTask, ...prev]);
    }

    setInputText('');
    setNewTaskRecurrence('none');
    setNewTaskInterval(2);
    setShowFanMenu(false);
    setIsAddingTask(false);
    updateEinstein('add', Mood.EXCITED);
    playActionSound();
  };

  const toggleTask = (id: string) => {
    const taskToComplete = tasks.find(t => t.id === id);
    if (!taskToComplete) return;

    if (!taskToComplete.completed) {
      // Completando a tarefa → move para completedTasks
      const completedTask: Task = { ...taskToComplete, completed: true, completedAt: Date.now() };

      // Remove da lista principal
      setTasks(prev => prev.filter(t => t.id !== id));

      // Adiciona à lista de concluídas (máximo 15, FIFO)
      setCompletedTasks(prev => [completedTask, ...prev].slice(0, 15));

      updateEinstein('complete', Mood.HAPPY);
      playActionSound();
      saveCompletedTaskToDB(taskToComplete.text).then(() => {
        getGamificationStats().then(stats => {
          const previousCount = todayCompletedCount;
          setTotalPoints(stats.totalXP);
          setStreak(stats.streak);
          setTodayCompletedCount(stats.todayCount);
          // Só mostra o modal ao cruzar a marca de 3 tarefas (transição de <3 para >=3)
          if (previousCount < 3 && stats.todayCount >= 3) {
            setShowProductiveModal(true);
          }
        });
      }).catch(e => console.error("Error saving gamification:", e));
    }
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setTasks(prev => prev.filter(t => t.id !== id));
      updateEinstein('delete', Mood.SHOCKED);
      playActionSound();
    }
  };

  const deleteRecurringTask = (text: string) => {
    if (window.confirm(`Deseja excluir permanentemente a recorrência de "${text}"?`)) {
      setTasks(prev => prev.filter(t => !(t.isRecurring && t.text === text)));
      setCompletedTasks(prev => prev.filter(t => !(t.isRecurring && t.text === text)));
      updateEinstein('delete', Mood.SHOCKED);
      playActionSound();
    }
  };

  const updateTaskProps = (id: string, priority: Priority, color: HighlightColor) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority, highlightColor: color } : t));
  };

  const updateTaskRecurrence = (id: string, recurrence: RecurrenceType, interval?: number) => {
    // Validação global: até 5 recorrentes no sistema todo
    const globalRecurringCount = [
      ...tasks.filter(t => t.isRecurring && t.id !== id),
      ...completedTasks.filter(t => t.isRecurring),
    ].length;
    if (recurrence !== 'none' && globalRecurringCount >= 5) {
      alert('Limite máximo de 5 tarefas recorrentes atingido. Remova uma recorrente antes de configurar outra.');
      return;
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, recurrence, recurrenceInterval: interval, isRecurring: recurrence !== 'none' } : t));
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
    const activeTasksCount = tasks.filter(t => !t.completed).length;
    if (activeTasksCount >= 5) {
      alert('Você só pode ter no máximo 5 tarefas ativas simultaneamente. Conclua alguma atividade para liberar espaço!');
      return;
    }

    const currentRescue = taskToRescue.rescueCount || 0;
    const newRescueCount = currentRescue + 1;

    if (newRescueCount === 3) {
      alert("ATENÇÃO: Este é o seu ÚLTIMO RESGATE para esta tarefa. Se não for concluída dentro do prazo, ela será excluída permanentemente do sistema.");
    }

    // Tarefa resgatada recebe novo timer de 24h (createdAt = now)
    // Mantém prioridade e cor originais para referência visual
    const rescuedTask: Task = {
      ...taskToRescue,
      rescueCount: newRescueCount,
      createdAt: Date.now(), // Timer reiniciado: 24h para concluir
      completed: false,
      completedAt: undefined,
      rescueSource: 'expiration',
    };

    setArchivedTasks(prev => prev.filter(t => t.id !== taskToRescue.id));
    setTasks(prev => [rescuedTask, ...prev]);

    if (archivedTasks.length <= 1) {
      setShowArchiveModal(false);
    }
    playActionSound();
  };

  // Resgatar tarefa da lista de concluídas (etiqueta "Fazer novamente!")
  const handleRescueCompletedTask = (taskToRescue: Task) => {
    const activeTasksCount = tasks.filter(t => !t.completed).length;
    if (activeTasksCount >= 5) {
      alert('Você só pode ter no máximo 5 tarefas ativas simultaneamente. Conclua alguma atividade para liberar espaço!');
      return;
    }

    // Tarefa resgatada de concluídas recebe novo timer de 24h
    // Mantém prioridade, cor e checklistItems originais
    const rescuedTask: Task = {
      ...taskToRescue,
      id: crypto.randomUUID(),
      completed: false,
      completedAt: undefined,
      createdAt: Date.now(), // Timer reiniciado: 24h para concluir
      rescueSource: 'completed',
      rescueCount: 0,
      // Reseta checklistItems para unchecked se for lista
      checklistItems: taskToRescue.checklistItems
        ? taskToRescue.checklistItems.map(item => ({ ...item, completed: false }))
        : undefined,
    };

    setCompletedTasks(prev => prev.filter(t => t.id !== taskToRescue.id));
    setTasks(prev => [rescuedTask, ...prev]);
    playActionSound();
  };

  // === NEW: Add List Task ===
  const addListTask = (title: string, items: ChecklistItem[]) => {
    const activeTasks = tasks.filter(t => !t.completed);
    const activeNonRecurringCount = activeTasks.filter(t => !t.isRecurring).length;
    if (activeNonRecurringCount >= 5) {
      updateEinstein('full', Mood.SHOCKED);
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: title,
      completed: false,
      createdAt: Date.now(),
      subTasks: [],
      priority: 'none',
      highlightColor: 'none',
      isRecurring: false,
      recurrence: 'none',
      taskType: 'list',
      checklistItems: items,
    };

    const activeRecurringOnMain = activeTasks.filter(t => t.isRecurring);
    if (activeTasks.length >= 5 && activeRecurringOnMain.length > 0) {
      const recurringToDisplace = activeRecurringOnMain[activeRecurringOnMain.length - 1];
      setTasks(prev => [newTask, ...prev.filter(t => t.id !== recurringToDisplace.id)]);
      setCompletedTasks(prev => [recurringToDisplace, ...prev]);
      setShowRecurringBanner(true);
    } else {
      setTasks(prev => [newTask, ...prev]);
    }

    setShowListModal(false);
    setShowFanMenu(false);
    updateEinstein('add', Mood.EXCITED);
    playActionSound();
  };

  // === NEW: Toggle Checklist Item ===
  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId || !task.checklistItems) return task;
      const updatedItems = task.checklistItems.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const allDone = updatedItems.every(item => item.completed);
      if (allDone && updatedItems.length > 0) {
        // Auto-complete: all items checked → complete the task after a brief delay
        setTimeout(() => toggleTask(taskId), 800);
      }
      playActionSound();
      return { ...task, checklistItems: updatedItems };
    }));
  };

  // === NEW: Add Checklist Item to existing list task ===
  const addChecklistItem = (taskId: string, text: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const newItem = { id: crypto.randomUUID(), text, completed: false };
      return { ...task, checklistItems: [...(task.checklistItems || []), newItem] };
    }));
  };

  // === NEW: Fan Menu handler ===
  const handleFanMenuSelect = (type: TaskType, recurrence?: RecurrenceType) => {
    setShowFanMenu(false);
    if (type === 'list') {
      setShowListModal(true);
    } else if (type === 'task') {
      setNewTaskRecurrence('none');
      setIsAddingTask(true);
    } else if (type === 'recurring') {
      setNewTaskRecurrence(recurrence || 'daily');
      setIsAddingTask(true);
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
      <main className="px-4 py-3 space-y-4 max-w-4xl mx-auto pb-24">

        {/* --- Hero Section: Avatar LEFT | Stats + Visão RIGHT --- */}
        <section className="flex gap-3 items-start relative">
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
            <span className={`text-[9px] font-mono font-bold mt-1 tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>V 5.3.4</span>
          </div>

          {/* Right Column: Quote + Stats + Visão */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Quote Bubble */}
            <AnimatePresence>
              {showQuoteBubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute z-[100] left-[115px] sm:left-[135px] top-2 md:top-4 w-[calc(100%-120px)] sm:w-[calc(100%-140px)] max-w-sm drop-shadow-2xl"
                >
                  <div
                    className={`rounded-[2rem] px-5 py-4 text-[14px] md:text-[15px] font-bold relative cursor-pointer leading-relaxed text-center
                    ${isDarkMode ? 'bg-[#f3eff7] text-[#8e24aa] border-none' : 'bg-[#f3eff7] text-[#8e24aa] border border-purple-100'}`}
                    onClick={(e) => { e.stopPropagation(); setShowQuoteBubble(false); }}
                  >
                    "{quote}"
                    <div className={`absolute -left-3 top-8 w-8 h-8 rotate-45 ${isDarkMode ? 'bg-[#f3eff7]' : 'bg-[#f3eff7] border-l border-b border-purple-100'}`}></div>
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
                onUpdateSubtasks={(subs) => {
                  setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, subTasks: subs } : t));
                  // Auto-complete: quando todas as etapas estão em 'done', completa a tarefa
                  if (subs.length > 0 && subs.every(st => st.column === 'done')) {
                    setTimeout(() => {
                      setActiveTaskId(null); // Fecha o Kanban
                      setTimeout(() => {
                        if (activeTaskId) toggleTask(activeTaskId); // Completa a tarefa com animação suave
                      }, 400);
                    }, 1200);
                  }
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <>
              {/* ====== MINHAS TAREFAS — Tab Bar Section ====== */}
              <div className="space-y-3">
                {/* Title */}
                <h2 className={`text-lg font-black tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  📋 Minhas Tarefas
                  
                  <button
                    onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                    className={`p-1.5 rounded-full transition-all active:scale-95 ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-rose-400' : 'text-slate-500 hover:bg-slate-100 hover:text-rose-600'}`}
                    title={isSoundEnabled ? "Desativar Som" : "Ativar Som"}
                  >
                    {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  {todayCompletedCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                      ✨ Hoje: {todayCompletedCount}
                    </span>
                  )}
                </h2>

                {/* Segmented Tab Bar */}
                <div className={`flex rounded-2xl p-1 gap-1 ${isDarkMode ? 'bg-slate-900/80 border border-slate-700/50' : 'bg-slate-100 border border-slate-200'}`}>
                  {[
                    { key: 'completed' as ActiveTab, label: 'Concluídas', count: completedTasks.length, icon: '✅' },
                    { key: 'today' as ActiveTab, label: 'Fazer Hoje', count: tasks.filter(t => !t.completed).length, icon: '🎯' },
                    { key: 'recurring' as ActiveTab, label: 'Recorrentes', count: [...tasks.filter(t => t.isRecurring), ...completedTasks.filter(t => t.isRecurring)].length, icon: '🔄' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1
                        ${activeTab === tab.key
                          ? (isDarkMode
                            ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_12px_rgba(0,242,255,0.15)]'
                            : 'bg-accent-cyan/10 text-teal-700 border border-accent-cyan/30 shadow-sm')
                          : (isDarkMode
                            ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')
                        }
                      `}
                    >
                      <span className="hidden sm:inline">{tab.icon}</span>
                      {tab.label}
                      <span className={`text-[9px] px-1 py-0 rounded-full font-bold ${activeTab === tab.key ? (isDarkMode ? 'bg-accent-cyan/25 text-accent-cyan' : 'bg-accent-cyan/15 text-teal-700') : (isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-500')}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ====== TAB CONTENT ====== */}
                <div className="min-h-[200px]">
                  <AnimatePresence mode="wait">

                    {/* TAB: Fazer Hoje (default) */}
                    {activeTab === 'today' && (
                      <motion.div
                        key="today"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-2.5 relative">
                          <AnimatePresence>
                            {tasks.filter(t => !t.completed).map((task, idx) => (
                              <TaskItem
                                key={task.id}
                                task={task}
                                index={idx}
                                onComplete={toggleTask}
                                onDelete={deleteTask}
                                onEdit={(id, text) => setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t))}
                                onUpdateProps={updateTaskProps}
                                onUpdateRecurrence={updateTaskRecurrence}
                                onToggleChecklistItem={toggleChecklistItem}
                                onAddChecklistItem={addChecklistItem}
                                onOpenKanban={setActiveTaskId}
                                onDragStart={handleDragStart}
                                onDragEnter={handleDragEnter}
                                onDragEnd={handleDragEnd}
                                isDarkMode={isDarkMode}
                              />
                            ))}
                            {tasks.filter(t => !t.completed).length === 0 && (
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

                          {/* Botão "+ recorrentes" — aparece quando há recorrentes na aba */}
                          {(() => {
                            const extraRecurring = completedTasks.filter(t => t.isRecurring && !t.completed).length;
                            const allRecurringInSystem = [
                              ...tasks.filter(t => t.isRecurring),
                              ...completedTasks.filter(t => t.isRecurring),
                            ];
                            const totalRecurring = allRecurringInSystem.length;
                            if (totalRecurring > 0 && extraRecurring > 0) {
                              return (
                                <button
                                  onClick={() => setActiveTab('recurring')}
                                  className={`w-full mt-3 p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border-2 border-dashed ${
                                    isDarkMode
                                      ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50'
                                      : 'border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-500'
                                  }`}
                                >
                                  <Repeat size={16} />
                                  + {extraRecurring} recorrente{extraRecurring > 1 ? 's' : ''}
                                </button>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: Concluídas */}
                    {activeTab === 'completed' && (
                      <motion.div
                        key="completed"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {completedTasks.length === 0 ? (
                          <div className={`p-8 rounded-xl text-center border-2 border-dashed ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                            <p className="text-sm">Nenhuma tarefa concluída ainda.</p>
                            <p className="text-[11px] mt-1 opacity-60">As tarefas concluídas aparecem aqui (máximo 15).</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {completedTasks.map(task => (
                              <div
                                key={task.id}
                                className={`p-3 rounded-xl flex items-center justify-between gap-3 border transition-all ${isDarkMode ? 'bg-slate-800/30 border-slate-700/40 hover:bg-slate-800/50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap gap-1.5 mb-1">
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black tracking-wider uppercase ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>✓ Concluída</span>
                                    {task.isRecurring && task.recurrence !== 'none' && (
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wider uppercase flex items-center gap-0.5 ${isDarkMode ? 'bg-cyan-500/15 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                                        🔄 Recorrente
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm font-medium line-through ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {task.text}
                                  </p>
                                  {task.completedAt && (
                                    <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                      {new Date(task.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleRescueCompletedTask(task)}
                                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[11px] transition-all active:scale-95 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200'}`}
                                >
                                  <RefreshCw size={12} />
                                  Fazer novamente
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* TAB: Recorrentes */}
                    {activeTab === 'recurring' && (
                      <motion.div
                        key="recurring"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {(() => {
                          const allRecurring = [
                            ...tasks.filter(t => t.isRecurring && t.recurrence !== 'none'),
                            ...completedTasks.filter(t => t.isRecurring && t.recurrence !== 'none'),
                          ];
                          // Deduplica por texto
                          const seen = new Set<string>();
                          const uniqueRecurring = allRecurring.filter(t => {
                            if (seen.has(t.text)) return false;
                            seen.add(t.text);
                            return true;
                          });

                          if (uniqueRecurring.length === 0) {
                            return (
                              <div className={`p-8 rounded-xl text-center border-2 border-dashed ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                                <p className="text-sm">Nenhuma tarefa recorrente configurada.</p>
                                <p className="text-[11px] mt-1 opacity-60">Crie uma tarefa e configure a recorrência no menu de edição.</p>
                              </div>
                            );
                          }

                          const getRecurrenceLabel = (r?: string) => {
                            switch (r) {
                              case 'daily': return 'Diária';
                              case 'weekdays': return 'Dias Úteis';
                              case 'weekly': return 'Semanal';
                              case 'custom': return 'Personalizada';
                              default: return r || '';
                            }
                          };

                          return (
                            <div className="space-y-2">
                              {uniqueRecurring.map(task => (
                                <div
                                  key={task.id}
                                  className={`p-3 rounded-xl flex items-center gap-3 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700/40' : 'bg-slate-50 border-slate-200'}`}
                                >
                                  <div className={`p-2 rounded-lg shrink-0 ${isDarkMode ? 'bg-cyan-500/15' : 'bg-cyan-100'}`}>
                                    <Repeat size={16} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700'} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{task.text}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-cyan-400/70' : 'text-cyan-600'}`}>
                                      {getRecurrenceLabel(task.recurrence)}
                                      {task.recurrence === 'custom' && task.recurrenceInterval && ` (${task.recurrenceInterval} dias)`}
                                    </p>
                                  </div>
                                  <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${task.completed ? (isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : (isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700')}`}>
                                    {task.completed ? 'Concluída' : 'Ativa'}
                                  </span>
                                  <button
                                    onClick={() => deleteRecurringTask(task.text)}
                                    className={`p-2 rounded-lg transition-colors shrink-0 ${isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                    title="Excluir recorrência"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </motion.div>
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
                      <div key={n} className={`flex-1 transition-opacity ${tasks.filter(t => !t.completed).length >= n ? 'opacity-100' : 'opacity-20'}`}>
                        <div className={`w-full rounded-sm ${n === 5 ? 'bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.4)]' : `bg-primary/${n * 20}`}`}
                          style={{ height: `${n * 4 + 3}px` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${tasks.filter(t => !t.completed).length >= 5 ? 'text-accent-cyan' : 'text-slate-500'}`}>
                    {tasks.filter(t => !t.completed).length}/5
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
                <button type="button" onClick={() => { setIsAddingTask(false); setNewTaskRecurrence('none'); }} className="text-slate-400 p-1"><X size={18} /></button>
              </div>
              <input
                autoFocus
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="O que vamos resolver hoje?"
                className={`w-full rounded-2xl p-4 outline-none font-medium ${isDarkMode ? 'bg-background-dark text-white border border-slate-700 focus:border-accent-cyan' : 'bg-slate-50 border-2 border-slate-200 focus:border-accent-cyan'}`}
              />
              {newTaskRecurrence === 'custom' && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-slate-700/50">
                  <label className="text-sm font-bold opacity-90 flex-1">A cada quantos dias?</label>
                  <input
                    type="number"
                    min="2"
                    max="365"
                    value={newTaskInterval}
                    onChange={e => setNewTaskInterval(parseInt(e.target.value) || 2)}
                    className={`w-20 rounded-xl p-2 outline-none text-center font-bold text-lg ${isDarkMode ? 'bg-slate-900 text-white border border-slate-700' : 'bg-slate-100 text-slate-900 border border-slate-300'}`}
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-accent-cyan text-background-dark font-bold p-4 rounded-xl shadow-lg active:scale-95 disabled:opacity-50 mt-1">
                Criar Tarefa
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FAN MENU ===== */}
      <FanMenu
        isOpen={showFanMenu}
        onClose={() => setShowFanMenu(false)}
        onSelectType={handleFanMenuSelect}
        isDarkMode={isDarkMode}
      />

      {/* ===== LIST TASK MODAL ===== */}
      <AnimatePresence>
        {showListModal && (
          <ListTaskModal
            isDarkMode={isDarkMode}
            onClose={() => { setShowListModal(false); setShowFanMenu(false); }}
            onCreate={addListTask}
          />
        )}
      </AnimatePresence>

      {/* ===== RECURRING BANNER (auto-dismiss) ===== */}
      <AnimatePresence>
        {showRecurringBanner && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 inset-x-0 mx-auto w-[90%] max-w-md z-[60] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 ${
              isDarkMode
                ? 'bg-slate-800/95 border border-cyan-500/40 backdrop-blur-xl'
                : 'bg-white border-2 border-cyan-400 shadow-cyan-200/50'
            }`}
            onClick={() => setShowRecurringBanner(false)}
          >
            <div className={`p-2 rounded-lg shrink-0 ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
              <Repeat size={18} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[12px] font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Tarefa recorrente salva! 🔄
              </p>
              <p className={`text-[11px] leading-snug ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Veja suas recorrentes na aba <strong className="text-cyan-500">Recorrentes</strong>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SW UPDATE BANNER ===== */}
      <AnimatePresence>
        {swUpdateReady && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between gap-3 px-4 py-3 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #00f2ff 0%, #bc13fe 100%)',
            }}
          >
            <div className="flex items-center gap-2 text-slate-900">
              <RefreshCw size={18} className="shrink-0 animate-spin" style={{ animationDuration: '2s' }} />
              <span className="text-[13px] font-black leading-tight">
                Nova versão disponível!
              </span>
            </div>
            <button
              onClick={handleAppUpdate}
              className="shrink-0 bg-slate-900 text-white text-[12px] font-black px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-lg hover:bg-slate-800"
            >
              Atualizar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FIXED BOTTOM NAV BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
        <div className={`flex items-center justify-center gap-1 px-3 py-2.5 pointer-events-auto w-full max-w-full ${isDarkMode ? 'bg-slate-950/95 border-t border-slate-800/60' : 'bg-white/95 shadow-2xl border-t border-slate-200'} backdrop-blur-xl`} style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>

          {/* Visão */}
          <button
            onClick={() => setShowVisionViewOnly(true)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all active:scale-90 min-w-[52px] ${isDarkMode ? 'text-amber-400 hover:bg-amber-400/10' : 'text-amber-600 hover:bg-amber-50'}`}
          >
            <Eye size={20} />
            <span className="text-[9px] font-bold leading-none">Visão</span>
          </button>

          {/* Guia */}
          <button
            onClick={() => setShowUserGuide(true)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all active:scale-90 min-w-[52px] ${isDarkMode ? 'text-blue-400 hover:bg-blue-400/10' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FileText size={20} />
            <span className="text-[9px] font-bold leading-none">Guia</span>
          </button>

          {/* FAB Add Button (Center) */}
          <div className="relative w-14 h-14 flex items-center justify-center -my-4 z-50 mx-2">
            <button
              onClick={() => {
                if (isAddingTask || showListModal) {
                  setIsAddingTask(false);
                  setShowListModal(false);
                  setShowFanMenu(false);
                } else {
                  setShowFanMenu(!showFanMenu);
                }
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-50
                ${isDarkMode ? 'text-background-dark' : 'text-slate-900'}
                ${pulseButton
                  ? 'bg-accent-cyan scale-125 shadow-[0_0_40px_rgba(0,242,255,1)] animate-pulse border-4 border-white/50'
                  : 'bg-accent-cyan hover:scale-105 shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                }
              `}
            >
              <Plus size={30} strokeWidth={3} className={`transition-transform duration-300 ${(showFanMenu || isAddingTask || showListModal) ? 'rotate-45' : ''}`} />
            </button>
          </div>

          {/* Arquivo */}
          <button
            onClick={() => setShowArchiveModal(true)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all active:scale-90 min-w-[52px] ${isDarkMode ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-emerald-600 hover:bg-emerald-50'}`}
          >
            <Archive size={20} />
            <span className="text-[9px] font-bold leading-none">Arquivo</span>
          </button>

          {/* Tema */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all active:scale-90 min-w-[52px] ${isDarkMode ? 'text-purple-400 hover:bg-purple-400/10' : 'text-purple-600 hover:bg-purple-50'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-[9px] font-bold leading-none">Tema</span>
          </button>
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
