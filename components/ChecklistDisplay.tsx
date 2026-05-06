import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ChecklistItem } from '../types';

interface ChecklistDisplayProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
  isDarkMode?: boolean;
  compact?: boolean; // for card view (shows limited items)
}

export const ChecklistDisplay: React.FC<ChecklistDisplayProps> = ({
  items,
  onToggleItem,
  isDarkMode = true,
  compact = false,
}) => {
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  const displayItems = compact ? items.slice(0, 4) : items;
  const hiddenCount = compact ? Math.max(0, items.length - 4) : 0;

  return (
    <div className="space-y-1.5">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              allDone ? 'bg-emerald-400' : 'bg-purple-500'
            }`}
          />
        </div>
        <span className={`text-[10px] font-bold tabular-nums shrink-0 ${
          allDone
            ? 'text-emerald-400'
            : isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-0.5">
        <AnimatePresence>
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2.5 py-1.5 px-1 rounded-lg cursor-pointer transition-colors group ${
                isDarkMode
                  ? 'hover:bg-white/[0.03]'
                  : 'hover:bg-slate-50'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleItem(item.id);
              }}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  item.completed
                    ? 'bg-accent-cyan/20 border-accent-cyan'
                    : isDarkMode
                      ? 'border-slate-600 group-hover:border-slate-400'
                      : 'border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {item.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <Check size={11} className="text-accent-cyan" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Text */}
              <span
                className={`text-[13px] leading-snug transition-all duration-300 ${
                  item.completed
                    ? `line-through ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`
                    : isDarkMode ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                {item.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hidden items indicator */}
        {hiddenCount > 0 && (
          <div className={`text-[10px] font-medium pl-8 pt-0.5 ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            +{hiddenCount} {hiddenCount === 1 ? 'item' : 'itens'}
          </div>
        )}
      </div>
    </div>
  );
};
