import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, Mood, QuoteType, RecurrenceType } from '../types';
import {
  loadTasksFromDB,
  saveTasksToDB,
  loadArchivedTasksFromDB,
  saveArchivedTasksToDB,
  loadCompletedTasksFromDB,
  saveCompletedTasksToDB,
  loadGamificationPointsFromDB,
  saveGamificationPointsToDB
} from '../services/db/taskDb';
import { QUOTES } from '../constants';

export const useTaskEngine = ({ triggerHaptic }: { triggerHaptic?: (type?: any) => void }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [gamificationPoints, setGamificationPoints] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showProductiveModal, setShowProductiveModal] = useState<boolean>(false);
  const [productiveStreak, setProductiveStreak] = useState<number>(0);
  const [completedTodayCount, setCompletedTodayCount] = useState<number>(0);

  const [einsteinMood, setEinsteinMood] = useState<Mood>(Mood.HAPPY);
  const [einsteinQuote, setEinsteinQuote] = useState<string>('');
  const quoteHistoryRef = useRef<string[]>([]);

  // Som de clique/conclusão via Web Audio API (baixo nível)
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn('Erro ao tocar som:', e);
    }
  }, [soundEnabled]);

  // Gerenciador de frases do Einstein com filtro anti-repetição
  const setRandomQuote = useCallback((type: QuoteType) => {
    const list = QUOTES[type] || QUOTES.welcome;
    if (!list || list.length === 0) return;

    let available = list.filter((q) => !quoteHistoryRef.current.includes(q));
    if (available.length === 0) available = list;

    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedQuote = available[randomIndex];

    quoteHistoryRef.current = [...quoteHistoryRef.current.slice(-2), selectedQuote];
    setEinsteinQuote(selectedQuote);
  }, []);

  // Carregar banco inicial
  useEffect(() => {
    const initData = async () => {
      const storedTasks = await loadTasksFromDB();
      const storedArchived = await loadArchivedTasksFromDB();
      const storedCompleted = await loadCompletedTasksFromDB();
      const storedPoints = await loadGamificationPointsFromDB();

      setTasks(storedTasks);
      setArchivedTasks(storedArchived);
      setCompletedTasks(storedCompleted);
      setGamificationPoints(storedPoints);

      // Calcular tarefas concluídas hoje
      const todayStr = new Date().toISOString().split('T')[0];
      const todayDone = storedCompleted.filter((t) => {
        if (!t.completedAt) return false;
        return new Date(t.completedAt).toISOString().split('T')[0] === todayStr;
      }).length;
      setCompletedTodayCount(todayDone);

      setRandomQuote('welcome');
    };
    initData();
  }, [setRandomQuote]);

  // Salvar tasks automaticamente quando atualizarem
  useEffect(() => {
    if (tasks.length >= 0) saveTasksToDB(tasks);
  }, [tasks]);

  useEffect(() => {
    saveArchivedTasksToDB(archivedTasks);
  }, [archivedTasks]);

  useEffect(() => {
    saveCompletedTasksToDB(completedTasks);
  }, [completedTasks]);

  useEffect(() => {
    saveGamificationPointsToDB(gamificationPoints);
  }, [gamificationPoints]);

  // Monitorar expiração de 27h e estado do Einstein
  useEffect(() => {
    const checkExpirationsAndMood = () => {
      const now = Date.now();
      const activeTasks = tasks.filter((t) => !t.completed);

      let highestPanicMood: Mood | null = null;
      let hasUrgent = false;

      const updatedTasks = tasks.filter((t) => {
        if (t.completed) return true;
        const elapsedHours = (now - t.createdAt) / (1000 * 60 * 60);

        // 27 Horas -> Mover para Arquivo automaticamente
        if (elapsedHours >= 27) {
          setArchivedTasks((prev) => [{ ...t, rescueSource: 'expiration' }, ...prev]);
          if (triggerHaptic) triggerHaptic('warning');
          return false;
        }

        // Pânico de 3h, 2h, 1h
        if (elapsedHours >= 26) {
          highestPanicMood = Mood.PANIC_1H;
        } else if (elapsedHours >= 25 && !highestPanicMood) {
          highestPanicMood = Mood.PANIC_2H;
        } else if (elapsedHours >= 24 && !highestPanicMood) {
          highestPanicMood = Mood.PANIC_3H;
        } else if (elapsedHours >= 20) {
          hasUrgent = true;
        }

        return true;
      });

      if (updatedTasks.length !== tasks.length) {
        setTasks(updatedTasks);
      }

      if (highestPanicMood) {
        setEinsteinMood(highestPanicMood);
      } else if (hasUrgent) {
        setEinsteinMood(Mood.THINKING);
      } else if (activeTasks.length >= 5) {
        setEinsteinMood(Mood.CHALLENGE);
      } else if (activeTasks.length === 0 && completedTodayCount > 0) {
        setEinsteinMood(Mood.VICTORY);
      } else {
        setEinsteinMood(Mood.HAPPY);
      }
    };

    checkExpirationsAndMood();
    const interval = setInterval(checkExpirationsAndMood, 30000); // Checa a cada 30s
    return () => clearInterval(interval);
  }, [tasks, completedTodayCount, triggerHaptic]);

  // Ação: Adicionar Tarefa
  const addTask = useCallback(
    (text: string, recurrence: RecurrenceType = 'none', taskType: 'task' | 'list' | 'recurring' = 'task') => {
      const activeCount = tasks.filter((t) => !t.completed).length;
      if (activeCount >= 5) {
        setEinsteinMood(Mood.CHALLENGE);
        setRandomQuote('full');
        if (triggerHaptic) triggerHaptic('warning');
        return false;
      }

      const newTask: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: Date.now(),
        taskType,
        recurrence,
        isRecurring: recurrence !== 'none' || taskType === 'recurring'
      };

      setTasks((prev) => [newTask, ...prev]);
      playClickSound();
      if (triggerHaptic) triggerHaptic('light');
      setRandomQuote('add');
      return true;
    },
    [tasks, playClickSound, setRandomQuote, triggerHaptic]
  );

  // Ação: Concluir Tarefa
  const toggleCompleteTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const willComplete = !t.completed;
            if (willComplete) {
              setGamificationPoints((pts) => pts + 1);
              setCompletedTodayCount((count) => {
                const newCount = count + 1;
                if (newCount === 3) {
                  setShowProductiveModal(true);
                  setProductiveStreak((s) => s + 1);
                }
                return newCount;
              });
              setCompletedTasks((cPrev) => [{ ...t, completed: true, completedAt: Date.now() }, ...cPrev]);
              playClickSound();
              if (triggerHaptic) triggerHaptic('success');
              setRandomQuote('complete');
            }
            return { ...t, completed: willComplete, completedAt: willComplete ? Date.now() : undefined };
          }
          return t;
        })
      );
    },
    [playClickSound, setRandomQuote, triggerHaptic]
  );

  // Ação: Deletar Tarefa
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      playClickSound();
      if (triggerHaptic) triggerHaptic('medium');
      setRandomQuote('delete');
    },
    [playClickSound, setRandomQuote, triggerHaptic]
  );

  return {
    tasks,
    setTasks,
    archivedTasks,
    setArchivedTasks,
    completedTasks,
    setCompletedTasks,
    gamificationPoints,
    soundEnabled,
    setSoundEnabled,
    showProductiveModal,
    setShowProductiveModal,
    productiveStreak,
    completedTodayCount,
    einsteinMood,
    setEinsteinMood,
    einsteinQuote,
    setRandomQuote,
    addTask,
    toggleCompleteTask,
    deleteTask,
    playClickSound
  };
};
