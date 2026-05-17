
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { AVATAR_IMAGES } from '../constants';
import { Mood } from '../types';

export interface ContextualTipData {
  key: string;
  emoji: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ContextualTipProps {
  tip: ContextualTipData;
  isDarkMode: boolean;
  onClose: () => void;
}

export const ContextualTip: React.FC<ContextualTipProps> = ({ tip, isDarkMode, onClose }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(`5task_tip_${tip.key}`, 'seen');
    timerRef.current = setTimeout(onClose, 8000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [tip.key, onClose]);

  const handleAction = () => {
    tip.onAction?.();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="fixed bottom-24 inset-x-0 mx-auto w-[92%] max-w-sm z-[150] pointer-events-auto"
    >
      <div className={`rounded-3xl shadow-2xl overflow-hidden border ${
        isDarkMode
          ? 'bg-slate-900/98 border-neon-purple/40 shadow-[0_8px_40px_rgba(188,19,254,0.18)]'
          : 'bg-white border-purple-200 shadow-[0_8px_40px_rgba(168,85,247,0.15)]'
      }`}>
        {/* Top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Einstein mini avatar */}
            <div className={`shrink-0 w-11 h-11 rounded-full border-2 overflow-hidden shadow-md ${
              isDarkMode ? 'border-neon-purple/60' : 'border-purple-300'
            }`}>
              <img src={AVATAR_IMAGES[Mood.EXCITED]} alt="Einstein" className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={`text-[10px] font-black uppercase tracking-widest ${
                  isDarkMode ? 'text-neon-purple' : 'text-purple-600'
                }`}>💡 Dica do Einstein</p>
                <button
                  onClick={onClose}
                  className={`shrink-0 p-1 rounded-full transition-colors ${
                    isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <X size={13} />
                </button>
              </div>

              <p className={`text-[13px] font-black leading-snug mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {tip.emoji} {tip.title}
              </p>
              <p className={`text-[12px] leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {tip.message}
              </p>
            </div>
          </div>

          {/* Action button */}
          {tip.actionLabel && tip.onAction && (
            <button
              onClick={handleAction}
              className="mt-3 w-full py-2.5 rounded-2xl font-black text-[12px] tracking-wide transition-all active:scale-95 bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg hover:shadow-neon-purple/40"
            >
              {tip.actionLabel} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
