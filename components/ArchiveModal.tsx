import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Archive } from 'lucide-react';
import { Task } from '../types';

interface ArchiveModalProps {
    archivedTasks: Task[];
    isDarkMode: boolean;
    onClose: () => void;
    onRescue: (task: Task) => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
    archivedTasks,
    isDarkMode,
    onClose,
    onRescue
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl flex flex-col max-h-[85vh] ${isDarkMode ? 'bg-slate-900 border border-slate-700/50 text-white' : 'bg-white border border-slate-200 text-slate-900'
                    }`}
            >
                <div className={`p-4 sm:p-6 border-b flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
                    } backdrop-blur-md`}>
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                            <Archive className="text-emerald-500" size={24} />
                        </div>
                        Arquivo de Tarefas
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                    {archivedTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center gap-4 text-slate-500">
                            <div className={`p-4 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <Archive size={40} opacity={0.5} />
                            </div>
                            <p>Nenhuma tarefa no arquivo no momento.<br />As tarefas não concluídas aparecem aqui quando o prazo expira.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {archivedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`p-4 rounded-xl flex items-center justify-between gap-3 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                                        }`}
                                >
                                    <p className="font-medium text-sm sm:text-base line-clamp-2 flex-1 break-words">
                                        {task.text}
                                    </p>
                                    <button
                                        onClick={() => onRescue(task)}
                                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all active:scale-95 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 dark:hover:text-amber-500 border border-emerald-500/20"
                                    >
                                        <RefreshCw size={14} />
                                        Resgatar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
