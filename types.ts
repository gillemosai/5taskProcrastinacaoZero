
export type KanbanColumn = 'todo' | 'doing' | 'done';

export type Priority = 'urgent' | 'attention' | 'critical' | 'none';
export type HighlightColor = 'blue' | 'purple' | 'pink' | 'yellow' | 'none';

export interface SubTask {
  id: string;
  text: string;
  column: KanbanColumn;
  createdAt: number;
}

export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom';

export type TaskType = 'task' | 'list' | 'recurring';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subTasks?: SubTask[];
  priority?: Priority;
  highlightColor?: HighlightColor;
  rescueCount?: number;
  completedAt?: number;
  recurrence?: RecurrenceType;
  recurrenceInterval?: number; // Em dias, para 'custom'
  lastRecurredAt?: number;
  isRecurring?: boolean;
  rescueSource?: 'expiration' | 'completed'; // Origem do resgate
  isRecreatedRecurring?: boolean; // Tarefa recriada por recorrência
  taskType?: TaskType; // Tipo da tarefa: task, list, recurring
  checklistItems?: ChecklistItem[]; // Itens do checklist (para taskType === 'list')
}

export enum Mood {
  HAPPY = 'HAPPY',
  THINKING = 'THINKING',
  EXCITED = 'EXCITED',
  SHOCKED = 'SHOCKED',
  PANIC_3H = 'PANIC_3H',
  PANIC_2H = 'PANIC_2H',
  PANIC_1H = 'PANIC_1H',
  FOCUS = 'FOCUS',
  VICTORY = 'VICTORY',
  ZEN = 'ZEN',
  MENTOR = 'MENTOR',
  CHALLENGE = 'CHALLENGE',
}

export type QuoteType = 'welcome' | 'add' | 'complete' | 'delete' | 'full' | 'idle' | 'focus' | 'victory' | 'zen' | 'mentor' | 'challenge';
