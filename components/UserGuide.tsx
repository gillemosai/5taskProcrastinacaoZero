import React from 'react';
import { X, ExternalLink, CheckCircle2, Clock, Trash2, Target, Zap, GripVertical, Eye, Archive, Sun } from 'lucide-react';

const GITHUB_README_URL = 'https://github.com/gillemosai/5taskProcrastinacaoZero#readme';

interface UserGuideProps {
    isDarkMode: boolean;
    onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ isDarkMode, onClose }) => {
    const card = isDarkMode
        ? 'bg-slate-800/60 border border-slate-700/50'
        : 'bg-white border border-slate-200';
    const accent = isDarkMode ? 'text-accent-cyan' : 'text-teal-600';
    const muted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Panel */}
            <div className={`relative w-full max-w-lg max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-background-dark border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>

                {/* Header */}
                <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div>
                        <h2 className="text-lg font-black">📘 Como Usar o 5Task</h2>
                        <p className={`text-[11px] mt-0.5 ${muted}`}>Guia rápido das funcionalidades</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

                    {/* Conceito */}
                    <div className={`rounded-2xl p-4 ${card}`}>
                        <h3 className={`font-bold text-sm mb-2 ${accent}`}>🎯 O Conceito</h3>
                        <p className={`text-[12px] leading-relaxed ${muted}`}>
                            O <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>5Task</strong> é um sistema anti-procrastinação que limita você a <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>no máximo 5 tarefas por vez</strong>. Menos tarefas significa mais foco e mais resultados.
                        </p>
                    </div>

                    {/* Tarefas */}
                    <div className={`rounded-2xl p-4 ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>✅ Tarefas</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Criar:</strong> Toque no botão <strong className="text-accent-cyan">+</strong> para adicionar uma nova tarefa
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Concluir:</strong> Marque o checkbox para completar uma tarefa e ganhar XP
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <GripVertical size={15} className="text-slate-500 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Reordenar:</strong> Arraste as tarefas para mudar a prioridade
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Regras Anti-Procrastinação */}
                    <div className={`rounded-2xl p-4 border-l-4 border-amber-500 ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>⏰ Regras Anti-Procrastinação</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                                <Clock size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    Cada tarefa tem <strong className={isDarkMode ? 'text-amber-300' : 'text-amber-600'}>24 horas</strong> para ser concluída
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Trash2 size={15} className="text-red-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    Após <strong className={isDarkMode ? 'text-red-300' : 'text-red-600'}>27 horas</strong>, a tarefa é excluída automaticamente
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Zap size={15} className="text-purple-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    O Einstein muda de humor conforme o tempo vai acabando!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quadro de Visão */}
                    <div className={`rounded-2xl p-4 ${card}`}>
                        <h3 className={`font-bold text-sm mb-2 ${accent}`}>👁️ Quadro de Visão</h3>
                        <p className={`text-[12px] leading-relaxed ${muted}`}>
                            Defina seus objetivos e sonhos no Quadro de Visão. Ele fica sempre visível para te lembrar do que realmente importa e manter a motivação em alta.
                        </p>
                    </div>

                    {/* Barra de Navegação */}
                    <div className={`rounded-2xl p-4 ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>🧭 Barra de Navegação</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <Eye size={14} className="text-amber-400 shrink-0" />
                                <p className={`text-[12px] ${muted}`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Visão</strong> — Abre seu Quadro de Visão</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Archive size={14} className="text-emerald-400 shrink-0" />
                                <p className={`text-[12px] ${muted}`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Arquivo</strong> — Resgate até 3 vezes suas tarefas não concluídas e limitadas a 5 exibidas</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Sun size={14} className="text-purple-400 shrink-0" />
                                <p className={`text-[12px] ${muted}`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Tema</strong> — Alterna entre modo claro e escuro</p>
                            </div>
                        </div>
                    </div>

                    {/* Gamificação */}
                    <div className={`rounded-2xl p-4 ${card}`}>
                        <h3 className={`font-bold text-sm mb-2 ${accent}`}>🏆 Progresso & XP</h3>
                        <p className={`text-[12px] leading-relaxed ${muted}`}>
                            Cada tarefa concluída gera <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>pontos de experiência (XP)</strong>. Acompanhe seu progresso e mantenha sua sequência de dias produtivos!
                        </p>
                    </div>

                    {/* Link para docs completa */}
                    <div className="pt-2 pb-2">
                        <a
                            href={GITHUB_README_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.97] ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700' : 'bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'}`}
                        >
                            <ExternalLink size={16} />
                            Ver documentação completa no GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
