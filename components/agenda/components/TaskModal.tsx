/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, AlertTriangle, BarChart, FileText, Check, Plus } from 'lucide-react';
import { Task, TaskCategory, TaskPriority } from '../types';
import { CATEGORIES, PRIORITIES } from '../constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'completed'> & { id?: string; completed?: boolean }) => void;
  selectedDate: string;
  initialTime?: string;
  taskToEdit?: Task | null;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  initialTime,
  taskToEdit
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState<TaskCategory>('work');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setDate(taskToEdit.date);
        setIsAllDay(!taskToEdit.startTime);
        setStartTime(taskToEdit.startTime || '09:00');
        setDuration(taskToEdit.durationMinutes || 60);
        setCategory(taskToEdit.category);
        setPriority(taskToEdit.priority);
      } else {
        setTitle('');
        setDescription('');
        setDate(selectedDate);
        setIsAllDay(false);
        setStartTime(initialTime || '09:00');
        setDuration(60);
        setCategory('work');
        setPriority('medium');
      }
    }
  }, [isOpen, taskToEdit, selectedDate, initialTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime: isAllDay ? undefined : startTime,
      durationMinutes: isAllDay ? undefined : duration,
      category,
      priority,
      completed: taskToEdit ? taskToEdit.completed : false
    });
    
    onClose();
  };

  const durationPresets = [
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '45m', value: 45 },
    { label: '1h', value: 60 },
    { label: '1.5h', value: 90 },
    { label: '2h', value: 120 },
    { label: '3h', value: 180 }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800/80 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800/80">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-600 dark:text-indigo-400">
                <Plus className="h-4 w-4" />
              </span>
              {taskToEdit ? 'Editar Compromisso' : 'Novo Compromisso'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-655 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-600 dark:bg-red-955/20 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="task-title" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-405 mb-1.5">
                  Título da Tarefa
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Ex: Reunião com Cliente, Estudar Inglês..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium outline-hidden transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400/80 dark:focus:bg-slate-955 focus:ring-indigo-505/20"
                  autoFocus
                />
              </div>

              {/* Descrição input */}
              <div>
                <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-405 mb-1.5 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> Notas / Detalhes (Opcional)
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Adicione observações, links ou tópicos..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-hidden transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400/80 dark:focus:bg-slate-955 focus:ring-indigo-505/20 resize-none"
                />
              </div>

              {/* Date & All Day Toggle Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="task-date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Data
                  </label>
                  <input
                    id="task-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400/80"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/20 px-4 py-3 cursor-pointer select-none hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-950 transition-colors">
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="accent-indigo-650 rounded-sm h-4 w-4 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dia Todo (Sem hora)</span>
                  </label>
                </div>
              </div>

              {/* Horário & Duração (Exibe apenas se não for dia todo) */}
              {!isAllDay && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden border-t border-slate-100 pt-3 dark:border-slate-800/40"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="task-start-time" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 mb-1.5 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Horário de Início
                      </label>
                      <input
                        id="task-start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400/80"
                      />
                    </div>
                    <div>
                      <label htmlFor="task-duration" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 mb-1.5 flex items-center gap-1">
                        Duração
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="task-duration"
                          type="number"
                          min="5"
                          max="480"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-20 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-center font-medium outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                        />
                        <span className="text-sm text-slate-500 font-medium">minutos ({Math.floor(duration / 60) > 0 ? `${Math.floor(duration / 60)}h ` : ''}{duration % 60}m)</span>
                      </div>
                    </div>
                  </div>

                  {/* Duração Presets */}
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                      Presets de Duração
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {durationPresets.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setDuration(preset.value)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition-all cursor-pointer ${
                            duration === preset.value
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Category & Priority Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3 dark:border-slate-800/40">
                {/* Category Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-405 mb-1.5 flex items-center gap-1">
                    <BarChart className="h-3.5 w-3.5" /> Categoria
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(CATEGORIES).map(([key, value]) => {
                      const isSelected = category === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCategory(key as TaskCategory)}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium text-left transition-all cursor-pointer ${
                            isSelected
                              ? `${value.bg} ${value.text} border-transparent ring-2 ${value.border}`
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-900'
                          }`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${value.accent}`} />
                          <span className="truncate">{value.label}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 ml-auto shrink-0 opacity-80" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Prioridade
                  </label>
                  <div className="space-y-1.5">
                    {Object.entries(PRIORITIES).map(([key, value]) => {
                      const isSelected = priority === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPriority(key as TaskPriority)}
                          className={`flex items-center justify-between w-full rounded-xl border px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? `${value.bg} ${value.text} border-transparent ring-1 ring-offset-0 ring-${key === 'high' ? 'red' : key === 'medium' ? 'amber' : 'green'}-500/30`
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${key === 'high' ? 'bg-red-500' : key === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                            <span>{value.label}</span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0 opacity-80" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-655 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-650 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-750 focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                {taskToEdit ? 'Salvar Alterações' : 'Criar Compromisso'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
