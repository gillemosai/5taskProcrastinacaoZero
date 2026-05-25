/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from './types';

// Format Date object to YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Convert YYYY-MM-DD to a readable PT-BR format
export function formatPortugueseDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const daysOfWeek = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];
  
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const monthName = months[date.getMonth()];
  
  return `${dayOfWeek}, ${day} de ${monthName} de ${year}`;
}

export function formatSimpleDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

// Convert "HH:MM" into total minutes from start of day
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

// Convert total minutes from start of day back to "HH:MM" format
export function minutesToTime(minutes: number): string {
  const m = Math.max(0, Math.min(1439, minutes));
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Add minutes to "HH:MM" time and return "HH:MM"
export function addMinutesToTime(timeStr: string, minutes: number): string {
  const totalMins = timeToMinutes(timeStr) + minutes;
  return minutesToTime(totalMins);
}

// Generate calendar cells (42 days grid) for a given month and year
export interface CalendarCell {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function generateMonthGrid(year: number, month: number): CalendarCell[] {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 6 is Saturday
  
  const cells: CalendarCell[] = [];
  const todayKey = formatDateKey(new Date());

  // Fill padding days from previous month
  const prevMonthEnd = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthEnd - i);
    cells.push({
      date: d,
      dateKey: formatDateKey(d),
      isCurrentMonth: false,
      isToday: formatDateKey(d) === todayKey
    });
  }

  // Fill current month days
  const currentMonthEnd = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= currentMonthEnd; i++) {
    const d = new Date(year, month, i);
    cells.push({
      date: d,
      dateKey: formatDateKey(d),
      isCurrentMonth: true,
      isToday: formatDateKey(d) === todayKey
    });
  }

  // Fill packing days from next month to reach multiple of 7 (or 42 cells total)
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    cells.push({
      date: d,
      dateKey: formatDateKey(d),
      isCurrentMonth: false,
      isToday: formatDateKey(d) === todayKey
    });
  }

  return cells;
}

// Layout helper: Calculate columns for overlapping tasks
// This allows rendering overlapping tasks side-by-side gracefully like a desktop calendar
export interface LayoutTask extends Task {
  column: number;
  totalColumns: number;
}

export function resolveTaskOverlaps(dayTasks: Task[]): LayoutTask[] {
  // Filter out all-day tasks first
  const scheduledTasks = dayTasks
    .filter(t => t.startTime !== undefined)
    .sort((a, b) => {
      const minA = timeToMinutes(a.startTime!);
      const minB = timeToMinutes(b.startTime!);
      if (minA !== minB) return minA - minB;
      return (b.durationMinutes || 0) - (a.durationMinutes || 0); // longer tasks first
    });

  if (scheduledTasks.length === 0) return [];

  const layoutTasks: LayoutTask[] = scheduledTasks.map(t => ({
    ...t,
    column: 0,
    totalColumns: 1
  }));

  // Simple interval partitioning algorithm
  // Group overlapping tasks into clusters
  const clusters: LayoutTask[][] = [];

  for (const t of layoutTasks) {
    const tStart = timeToMinutes(t.startTime!);
    const tEnd = tStart + (t.durationMinutes || 30);

    let placedInCluster = false;
    for (const cluster of clusters) {
      // Check if task overlaps with ANY task in the cluster
      const overlaps = cluster.some(c => {
        const cStart = timeToMinutes(c.startTime!);
        const cEnd = cStart + (c.durationMinutes || 30);
        return (tStart < cEnd && tEnd > cStart);
      });

      if (overlaps) {
        cluster.push(t);
        placedInCluster = true;
        break;
      }
    }

    if (!placedInCluster) {
      clusters.push([t]);
    }
  }

  // For each cluster, assign columns
  for (const cluster of clusters) {
    const columns: number[][] = []; // indices of active times per column
    
    for (const t of cluster) {
      const tStart = timeToMinutes(t.startTime!);
      const tEnd = tStart + (t.durationMinutes || 30);

      // Find first column where this task doesn't overlap
      let colIdx = 0;
      while (true) {
        if (!columns[colIdx]) {
          columns[colIdx] = [];
        }

        const colOverlaps = columns[colIdx].some(otherIdx => {
          const other = cluster[otherIdx];
          const oStart = timeToMinutes(other.startTime!);
          const oEnd = oStart + (other.durationMinutes || 30);
          return (tStart < oEnd && tEnd > oStart);
        });

        if (!colOverlaps) {
          // Found column
          t.column = colIdx;
          columns[colIdx].push(cluster.indexOf(t));
          break;
        }
        colIdx++;
      }
    }

    // Update total columns for all tasks in this cluster
    const clusterMaxCols = columns.length;
    for (const t of cluster) {
      t.totalColumns = clusterMaxCols;
    }
  }

  return layoutTasks;
}
