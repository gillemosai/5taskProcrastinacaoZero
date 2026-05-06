import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, ListChecks } from 'lucide-react';
import { ChecklistItem } from '../types';

interface ListTaskModalProps {
  isDarkMode?: boolean;
  onClose: () => void;
  onCreate: (title: string, items: ChecklistItem[]) => void;
}

export const ListTaskModal: React.FC<ListTaskModalProps> = ({
  isDarkMode = true,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<{ id: string; text: string }[]>([
    { id: crypto.randomUUID(), text: '' },
  ]);
  const titleRef = useRef<HTMLInputElement>(null);
  const lastItemRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), text: '' };
    setItems(prev => [...prev, newItem]);
    // Focus the new input after render
    setTimeout(() => lastItemRef.current?.focus(), 50);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return; // minimum 1 item
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, text: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, text } : item));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index === items.length - 1) {
        addItem();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validItems = items.filter(item => item.text.trim());
    if (validItems.length === 0) return;

    const checklistItems: ChecklistItem[] = validItems.map(item => ({
      id: item.id,
      text: item.text.trim(),
      completed: false,
    }));

    onCreate(title.trim(), checklistItems);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className={`fixed bottom-28 inset-x-0 mx-auto w-[90%] max-w-md z-50 p-4 rounded-3xl shadow-2xl ${
        isDarkMode
          ? 'glass-card border border-purple-500/30'
          : 'bg-white border-2 border-purple-400 shadow-xl'
      }`}
      style={{
        boxShadow: isDarkMode
          ? '0 0 30px rgba(188, 19, 254, 0.2), 0 8px 32px rgba(0,0,0,0.5)'
          : '0 8px 32px rgba(0,0,0,0.15)',
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-purple-500/15' : 'bg-purple-100'}`}>
              <ListChecks size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
            </div>
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Nova Lista</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 p-1 hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title input */}
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome da lista..."
          className={`w-full rounded-2xl p-3.5 outline-none font-semibold text-sm ${
            isDarkMode
              ? 'bg-background-dark text-white border border-slate-700 focus:border-purple-500'
              : 'bg-slate-50 border-2 border-slate-200 focus:border-purple-400'
          }`}
        />

        {/* Checklist items */}
        <div className={`rounded-2xl p-3 space-y-2 ${
          isDarkMode
            ? 'bg-slate-900/60 border border-slate-800'
            : 'bg-slate-50 border border-slate-200'
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Itens da Lista
          </span>

          <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                {/* Circle checkbox (visual only, always unchecked) */}
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                  isDarkMode ? 'border-slate-600' : 'border-slate-300'
                }`} />

                <input
                  ref={index === items.length - 1 ? lastItemRef : undefined}
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={`Item ${index + 1}...`}
                  className={`flex-1 px-2 py-1.5 rounded-lg outline-none text-sm font-medium ${
                    isDarkMode
                      ? 'bg-transparent text-white placeholder-slate-600 focus:bg-slate-800/50'
                      : 'bg-transparent text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className={`p-1 rounded-lg transition-colors shrink-0 ${
                      isDarkMode
                        ? 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'
                        : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add item button */}
          <button
            type="button"
            onClick={addItem}
            className={`flex items-center gap-1.5 w-full px-2 py-2 rounded-lg text-xs font-bold transition-all ${
              isDarkMode
                ? 'text-purple-400 hover:bg-purple-500/10'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Plus size={14} />
            Adicionar item
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!title.trim() || items.every(i => !i.text.trim())}
          className="w-full bg-accent-cyan text-background-dark font-bold p-3.5 rounded-xl shadow-lg active:scale-95 disabled:opacity-40 transition-all text-sm"
          style={{
            boxShadow: '0 4px 14px rgba(0, 242, 255, 0.25)',
          }}
        >
          Criar Lista
        </button>
      </form>
    </motion.div>
  );
};
