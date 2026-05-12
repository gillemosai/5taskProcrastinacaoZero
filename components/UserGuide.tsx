import React from 'react';
import { X, ExternalLink, CheckCircle2, Clock, Trash2, Target, Zap, GripVertical, Eye, Archive, Sun, ArrowLeft, Repeat, RefreshCw, Trophy, Sparkles, LayoutGrid } from 'lucide-react';

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
                        <p className={`text-[11px] mt-0.5 ${muted}`}>Guia rápido v5.3.5</p>
                    </div>
                    <button onClick={onClose} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}>
                        <ArrowLeft size={18} /> <span className="text-sm font-bold">Voltar</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

                    {/* Conceito */}
                    <div className={`rounded-2xl p-4 ${card}`}>
                        <h3 className={`font-bold text-sm mb-2 ${accent}`}>🎯 O Conceito</h3>
                        <p className={`text-[12px] leading-relaxed ${muted}`}>
                            O <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>5Task</strong> é um sistema anti-procrastinação que limita você a <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>no máximo 5 tarefas por vez</strong>, com suporte a até <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>5 tarefas recorrentes</strong>. Menos tarefas significa mais foco e mais resultados.
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
                            <div className="flex items-start gap-2.5">
                                <LayoutGrid size={15} className="text-purple-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Etapas Kanban:</strong> O progresso das subtarefas (ex: 2/4 etapas) aparece no card. Ao concluir 100%, a tarefa é finalizada automaticamente!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tarefas Recorrentes */}
                    <div className={`rounded-2xl p-4 border-l-4 border-cyan-500 ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>🔄 Tarefas Recorrentes</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                                <Repeat size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    Você pode ter até <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>5 tarefas recorrentes</strong> no total (Diária, Dias Úteis, Semanal ou Personalizada)
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Repeat size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>2 na tela principal:</strong> As 2 primeiras recorrentes aparecem em "Fazer Hoje". As demais ficam na aba <strong className="text-cyan-500">Recorrentes</strong>
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Repeat size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>ver+ recorrentes:</strong> Quando há recorrentes extras, um botão aparece abaixo da lista para levá-lo à aba dedicada
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Abas Inteligentes (v5.3.3) */}
                    <div className={`rounded-2xl p-4 border-l-4 border-purple-500 ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>📋 Abas Inteligentes <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ml-1 ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>v5.3.5</span></h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                                <LayoutGrid size={15} className="text-purple-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    Navegue entre 3 abas: <strong className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>Concluídas</strong>, <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>Fazer Hoje</strong> e <strong className="text-cyan-500">Recorrentes</strong>
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <RefreshCw size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Fazer novamente:</strong> Na aba Concluídas, toque no botão para recriar qualquer tarefa já finalizada
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Contador diário:</strong> O badge <strong className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>"✨ Hoje: X"</strong> mostra quantas tarefas você concluiu no dia
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

                    {/* Dia Produtivo (v5.3.3) */}
                    <div className={`rounded-2xl p-4 border-l-4 border-emerald-500 ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>🎉 Dia Produtivo <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ml-1 ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>v5.3.5</span></h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                                <Trophy size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    Ao concluir <strong className={isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}>3 tarefas no dia</strong>, o Einstein comemora com uma animação especial de parabéns!
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Zap size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    Seu dia é contabilizado na <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>sequência de dias produtivos</strong> — mantenha o ritmo para aumentar seu streak!
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

                    {/* Experiência Tátil (v5.3.3) */}
                    <div className={`rounded-2xl p-4 border-l-4 border-accent-cyan ${card}`}>
                        <h3 className={`font-bold text-sm mb-3 ${accent}`}>✨ Experiência Tátil <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ml-1 ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>v5.3.5</span></h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                                <Target size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Menu em Leque:</strong> Um novo menu radial moderno ao adicionar tarefas, permitindo acesso rápido a tarefas Simples, Listas e Recorrentes.
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Zap size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                <p className={`text-[12px] leading-relaxed ${muted}`}>
                                    <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Feedback Sonoro:</strong> Cada clique na interface emite um leve feedback sonoro, proporcionando uma resposta tátil de alta qualidade.
                                </p>
                            </div>
                        </div>
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
                            Cada tarefa concluída gera <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>pontos de experiência (XP)</strong>. Acompanhe seu progresso, mantenha sua sequência de dias produtivos e desbloqueie o modal de celebração ao atingir 3 tarefas no dia!
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
