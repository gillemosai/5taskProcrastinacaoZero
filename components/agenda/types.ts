/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskCategory = 'work' | 'personal' | 'study' | 'health' | 'other';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // Format: YYYY-MM-DD
  startTime?: string; // Format: HH:MM (optional, if undefined, it's an all-day task)
  durationMinutes?: number; // Duration of the task in minutes
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
}

export interface CategoryTheme {
  name: string;
  color: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
}

export interface DayStats {
  total: number;
  completed: number;
  uncompleted: number;
  completionRate: number;
  productiveMinutes: number;
}
