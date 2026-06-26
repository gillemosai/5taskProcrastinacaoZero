import React from 'react';
import { Sparkles, Download, ArrowRight, ShieldCheck, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mood } from '../types';
import { AVATAR_IMAGES } from '../constants';
import { Capacitor } from '@capacitor/core';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isForceUpdate: boolean;
  latestVersion: string;
  releaseNotes: string;
  playStoreUrl: string;
  isDarkMode: boolean;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  isForceUpdate,
  latestVersion,
  releaseNotes,
  playStoreUrl,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const isNative = Capacitor.isNativePlatform();

  const handleUpdate = () => {
    if (isNative) {
      // Abre a Play Store
      window.open(playStoreUrl, '_system');
    } else {
      // Recarrega a página na Web/PC para limpar o cache
      window.location.reload();
    }
  };

  const handleOverlayClick = () => {
    if (!isForceUpdate) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-md overflow-hidden flex flex-col rounded-3xl shadow-3xl ${
            isDarkMode 
              ? 'bg-slate-900 border border-slate-800/80 text-white' 
              : 'bg-white border border-slate-100 text-slate-900'
          }`}
        >
          {/* Header & Fechar (apenas se não for obrigatório) */}
          {!isForceUpdate && (
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-10 p-2 rounded-xl transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X size={20} />
            </button>
          )}

          {/* Destaque Superior / Einstein */}
          <div className={`p-6 pb-2 pt-8 flex flex-col items-center text-center ${
            isDarkMode ? 'bg-slate-950/30' : 'bg-slate-50/50'
          }`}>
            <div className="relative mb-4">
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse ${
                isForceUpdate ? 'bg-rose-500' : 'bg-cyan-500'
              }`} />
              <div className={`relative w-24 h-24 rounded-full border-4 shadow-lg z-10 flex items-center justify-center overflow-hidden ${
                isDarkMode ? 'border-accent-cyan bg-slate-900' : 'border-slate-300 bg-white'
              }`}>
                <img
                  src={AVATAR_IMAGES[isForceUpdate ? Mood.PANIC_2H : Mood.EXCITED]}
                  alt="Einstein"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 text-xl animate-bounce z-20">⚛️</div>
            </div>


            {/* Balão de Fala do Einstein */}
            <div className={`relative px-4 py-3 rounded-2xl max-w-[280px] text-xs font-semibold leading-relaxed border ${
              isDarkMode 
                ? 'bg-slate-850 border-slate-800 text-slate-300' 
                : 'bg-white border-slate-100 text-slate-650'
            }`}>
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t ${
                isDarkMode ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-100'
              }`} />
              {isForceUpdate ? (
                <span>
                  {isNative 
                    ? '"Esta é uma atualização crítica indispensável! Preciso recalibrar nossos algoritmos de foco agora mesmo!"'
                    : '"Esta é uma atualização crítica indispensável! Atualize a memória cache para carregar a nova versão."'}
                </span>
              ) : (
                <span>
                  {isNative 
                    ? '"Excelente trabalho combatendo a procrastinação! Preparei novos recursos incríveis para nossa jornada."'
                    : '"Excelente trabalho! Uma nova versão está disponível. Atualize a memória cache para carregar os novos recursos."'}
                </span>
              )}
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="p-6 pt-4 flex-1">
            <div className="text-center mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-2 ${
                isForceUpdate 
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                  : 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20'
              }`}>
                <Sparkles size={12} />
                {isForceUpdate ? 'Atualização Crítica' : 'Nova Atualização'}
              </span>
              <h2 className="text-xl font-black tracking-tight">
                Versão {latestVersion} Disponível!
              </h2>
            </div>

            {/* Notas de Lançamento */}
            <div className={`p-4 rounded-2xl mb-6 border ${
              isDarkMode 
                ? 'bg-slate-950/40 border-slate-850' 
                : 'bg-slate-50 border-slate-100'
            }`}>
              <h3 className={`text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <ShieldCheck size={14} className="text-emerald-500" />
                Novidades da versão:
              </h3>
              <p className={`text-xs leading-relaxed font-medium ${
                isDarkMode ? 'text-slate-350' : 'text-slate-600'
              }`}>
                {releaseNotes || "Aproveite melhorias gerais de estabilidade, sincronização e novas otimizações para a sua rotina de foco!"}
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleUpdate}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isDarkMode 
                    ? 'bg-accent-cyan text-slate-950 shadow-accent-cyan/10 hover:brightness-110' 
                    : 'bg-slate-950 text-white shadow-slate-950/15 hover:bg-slate-850'
                }`}
              >
                {isNative ? <Download size={18} /> : <RefreshCw size={18} />}
                {isNative ? 'Atualizar na Google Play' : 'Atualizar Memória Cache'}
                <ArrowRight size={16} />
              </motion.button>

              {!isForceUpdate && (
                <button
                  onClick={onClose}
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-colors ${
                    isDarkMode ? 'text-slate-500 hover:text-slate-350' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Continuar na versão atual
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
