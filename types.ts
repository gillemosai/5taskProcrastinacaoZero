
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
}

export enum Mood {
  HAPPY = 'HAPPY',
  THINKING = 'THINKING',
  EXCITED = 'EXCITED',
  SHOCKED = 'SHOCKED',
  PANIC_3H = 'PANIC_3H',
  PANIC_2H = 'PANIC_2H',
  PANIC_1H = 'PANIC_1H',
}

export type QuoteType = 'welcome' | 'add' | 'complete' | 'delete' | 'full' | 'idle';
