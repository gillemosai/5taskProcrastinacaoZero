import React from 'react';
import { X, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border border-slate-700/50' : 'bg-white border border-slate-200'
          }`}
        >
          {/* Header */}
          <div className={`p-5 flex items-start justify-between border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-cyan/20 text-accent-cyan">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Novidades Pela Área!
                </h2>
                <p className={`text-xs font-semibold ${isDarkMode ? 'text-accent-cyan' : 'text-blue-600'}`}>
                  Versão 4.2.0 • Atualizações de Performance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-500'} />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Experiência Nativa Aprimorada
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Removemos as distrações visuais (como a barra de endereço) para entregar uma navegação de aplicativo mais imersiva e nativa. A navegação interna ficou mais segura usando "Seta Voltar" ao invés de "X".
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <RotateCcw size={20} className={isDarkMode ? 'text-purple-400' : 'text-purple-500'} />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Tarefas Recorrentes
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Cansado de cadastrar as mesmas atividades? Agora você pode definir uma recorrência de rotina (Diária, Semanal, Dias Úteis) para recriá-las automaticamente após concluí-las.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <Sparkles size={20} className={isDarkMode ? 'text-amber-400' : 'text-amber-500'} />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Exclusão Inteligente
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Manter o Board limpo é essencial para focar no que importa. As tarefas concluídas serão purgadas automaticamente após 1 hora ou quando o dia virar!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`w-full mt-8 py-3.5 rounded-xl font-black text-[15px] transition-all active:scale-95 shadow-lg ${
                isDarkMode 
                  ? 'bg-accent-cyan text-slate-900 shadow-accent-cyan/20 hover:brightness-110' 
                  : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
              }`}
            >
              Explorar Novidades
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
