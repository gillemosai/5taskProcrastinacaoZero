/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskCategory, TaskPriority, Task } from './types';

export const CATEGORIES: Record<TaskCategory, { label: string; color: string; bg: string; text: string; border: string; accent: string }> = {
  work: {
    label: 'Trabalho',
    color: '#4f46e5', // indigo-600
    bg: 'bg-indigo-50/90 dark:bg-indigo-950/20',
    text: 'text-indigo-800 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-900/50',
    accent: 'bg-indigo-600'
  },
  personal: {
    label: 'Pessoal',
    color: '#10b981', // emerald-500
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/20',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    accent: 'bg-emerald-500'
  },
  study: {
    label: 'Estudos',
    color: '#f59e0b', // amber-500
    bg: 'bg-amber-50/90 dark:bg-amber-950/20',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-900/50',
    accent: 'bg-amber-500'
  },
  health: {
    label: 'Saúde',
    color: '#f43f5e', // rose-500
    bg: 'bg-rose-50/90 dark:bg-rose-950/20',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-900/50',
    accent: 'bg-rose-500'
  },
  other: {
    label: 'Outros',
    color: '#64748b', // slate-500
    bg: 'bg-slate-50/90 dark:bg-slate-950/20',
    text: 'text-slate-800 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-900/50',
    accent: 'bg-slate-500'
  }
};

export const PRIORITIES: Record<TaskPriority, { label: string; bg: string; text: string; border: string; iconColor: string }> = {
  high: {
    label: 'Alta',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/50',
    iconColor: 'text-red-500'
  },
  medium: {
    label: 'Média',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/45',
    iconColor: 'text-amber-500'
  },
  low: {
    label: 'Baixa',
    bg: 'bg-green-50 dark:bg-green-950/20',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-900/45',
    iconColor: 'text-green-500'
  }
};

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'starter-1',
    title: 'Reunião de Planejamento Diário',
    description: 'Sincronizar tarefas e metas do dia com a equipe principal. Revisar pendências do backlog.',
    date: '2026-05-25',
    startTime: '09:00',
    durationMinutes: 45,
    category: 'work',
    priority: 'high',
    completed: true
  },
  {
    id: 'starter-2',
    title: 'Análise de Relatório Financeiro',
    description: 'Verificar planilhas de faturamento e margem de lucro operacional do trimestre.',
    date: '2026-05-25',
    startTime: '10:30',
    durationMinutes: 90,
    category: 'work',
    priority: 'medium',
    completed: false
  },
  {
    id: 'starter-3',
    title: 'Sessão de Treino Funcional',
    description: 'Treino focado em cardio e resistência na academia do condomínio.',
    date: '2026-05-25',
    startTime: '07:30',
    durationMinutes: 60,
    category: 'health',
    priority: 'medium',
    completed: true
  },
  {
    id: 'starter-4',
    title: 'Estudo de React 19 e Compiler',
    description: 'Ler documentação oficial sobre novidades de Hooks, Server Components e o compilador automático do React.',
    date: '2026-05-25',
    startTime: '14:00',
    durationMinutes: 120,
    category: 'study',
    priority: 'high',
    completed: false
  },
  {
    id: 'starter-5',
    title: 'Médico - Clínico Geral',
    description: 'Consulta de rotina anual. Levar exames de sangue recentes.',
    date: '2026-05-25',
    startTime: '16:30',
    durationMinutes: 60,
    category: 'health',
    priority: 'high',
    completed: false
  },
  {
    id: 'starter-6',
    title: 'Supermercado - Compras Semanais',
    description: 'Frutas, legumes, ovos, arroz integral e itens de limpeza descartáveis.',
    date: '2026-05-25',
    startTime: '18:30',
    durationMinutes: 45,
    category: 'personal',
    priority: 'low',
    completed: false
  },
  {
    id: 'starter-7',
    title: 'Meditação Guiada de 10 minutos',
    description: 'Exercício de respiração consciente antes de dormir para acalmar a mente.',
    date: '2026-05-25',
    startTime: '22:30',
    durationMinutes: 15,
    category: 'health',
    priority: 'low',
    completed: false
  },
  {
    id: 'starter-8',
    title: 'Beber 3 litros de água',
    description: 'Manter a garrafa de 1L na mesa de trabalho e beber pelo menos 3 cheias.',
    date: '2026-05-25',
    category: 'health',
    priority: 'low',
    completed: false
  },
  {
    id: 'starter-9',
    title: 'Revisar faturas de cartão de crédito',
    description: 'Checar se não há cobranças indevidas antes do fechamento.',
    date: '2026-05-25',
    category: 'personal',
    priority: 'medium',
    completed: false
  }
];
