import React, { useState, useRef, useEffect } from 'react';
import { Menu, FileText, Target, Download } from 'lucide-react';
import { Task } from '../types';
import { exportUncompletedTasks } from '../utils/exportTasks';
import { MarkdownViewer } from './MarkdownViewer';
import { VisionBoard } from './VisionBoard';

interface TopMenuProps {
    tasks: Task[];
    isDarkMode: boolean;
}

export const TopMenu: React.FC<TopMenuProps> = ({ tasks, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [showDocumentation, setShowDocumentation] = useState(false);
    const [showVisionBoard, setShowVisionBoard] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleAction = (action: () => void) => {
        setIsOpen(false);
        action();
    };

    return (
        <>
            <div className="absolute left-6 top-6 z-40" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-3 rounded-full transition-all shadow-lg active:scale-90 ${isDarkMode
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                        }`}
                >
                    <Menu size={20} />
                </button>

                {isOpen && (
                    <div className={`absolute top-14 left-0 w-72 rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 z-50 origin-top-left transition-all ${isDarkMode ? 'bg-slate-900/95 border-slate-700/80 shadow-black/50' : 'bg-white/95 border-slate-200 shadow-slate-300/50'
                        }`}>
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => handleAction(() => setShowDocumentation(true))}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors text-left ${isDarkMode ? 'text-slate-200 hover:bg-slate-800 focus:bg-slate-800' : 'text-slate-700 hover:bg-slate-100 focus:bg-slate-100'
                                    }`}
                            >
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><FileText size={18} /></div>
                                <span>Documentação</span>
                            </button>

                            <button
                                onClick={() => handleAction(() => setShowVisionBoard(true))}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors text-left ${isDarkMode ? 'text-slate-200 hover:bg-slate-800 focus:bg-slate-800' : 'text-slate-700 hover:bg-slate-100 focus:bg-slate-100'
                                    }`}
                            >
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Target size={18} /></div>
                                <span>Quadro Visão</span>
                            </button>

                            <div className={`h-px w-full my-1 ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`}></div>

                            <button
                                onClick={() => handleAction(() => exportUncompletedTasks(tasks))}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors text-left group ${isDarkMode ? 'text-slate-200 hover:bg-emerald-950/40 focus:bg-emerald-950/40' : 'text-slate-700 hover:bg-emerald-50 focus:bg-emerald-50'
                                    }`}
                            >
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors"><Download size={18} /></div>
                                <div className="flex-1">
                                    <span className="block leading-tight mb-0.5">Tarefas Pendentes</span>
                                    <div className={`text-[11px] leading-tight ${isDarkMode ? 'text-slate-400 group-hover:text-emerald-400/80' : 'text-slate-500 group-hover:text-emerald-600/80'}`}>
                                        Baixar as 30 últimas (.md)
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showDocumentation && (
                <MarkdownViewer
                    isDarkMode={isDarkMode}
                    onClose={() => setShowDocumentation(false)}
                />
            )}

            {showVisionBoard && (
                <VisionBoard
                    isDarkMode={isDarkMode}
                    onClose={() => setShowVisionBoard(false)}
                />
            )}
        </>
    );
};
