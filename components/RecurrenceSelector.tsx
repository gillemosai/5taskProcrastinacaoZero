import React from 'react';
import { Repeat, CalendarDays, CalendarCheck, CalendarRange, Clock } from 'lucide-react';
import { RecurrenceType } from '../types';

interface RecurrenceSelectorProps {
  isDarkMode?: boolean;
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
  intervalValue: number;
  onIntervalChange: (value: number) => void;
}

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  isDarkMode = true,
  value,
  onChange,
  intervalValue,
  onIntervalChange
}) => {
  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center gap-2">
        <Repeat size={16} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recorrência</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange('none')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            value === 'none'
              ? isDarkMode
                ? 'bg-accent-cyan text-slate-900 border-accent-cyan shadow-md shadow-accent-cyan/10'
                : 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/10'
              : isDarkMode
              ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          Nenhuma
        </button>

        <button
          type="button"
          onClick={() => onChange('daily')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            value === 'daily'
              ? isDarkMode
                ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20'
                : 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-700/20'
              : isDarkMode
              ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          <CalendarDays size={14} /> Diária
        </button>

        <button
          type="button"
          onClick={() => onChange('weekdays')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            value === 'weekdays'
              ? isDarkMode
                ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-700/20'
              : isDarkMode
              ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          <CalendarCheck size={14} /> Dias Úteis
        </button>

        <button
          type="button"
          onClick={() => onChange('weekly')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            value === 'weekly'
              ? isDarkMode
                ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20'
                : 'bg-pink-700 text-white border-pink-700 shadow-md shadow-pink-700/20'
              : isDarkMode
              ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          <CalendarRange size={14} /> Semanal
        </button>

        <button
          type="button"
          onClick={() => onChange('custom')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            value === 'custom'
              ? isDarkMode
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-amber-700 text-white border-amber-700 shadow-md shadow-amber-700/20'
              : isDarkMode
              ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Clock size={14} /> Custom
        </button>
      </div>

      {value === 'custom' && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Repetir a cada:</span>
          <input
            type="number"
            min="2"
            max="30"
            value={intervalValue}
            onChange={(e) => onIntervalChange(parseInt(e.target.value) || 2)}
            className={`w-16 px-2 py-1 text-center rounded-md font-bold outline-none border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
          />
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>dias</span>
        </div>
      )}

      {value !== 'none' && (
        <p className={`text-[10px] italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          * Máximo de 2 tarefas recorrentes ativas simultaneamente.
        </p>
      )}
    </div>
  );
};
