import React, { useState, useEffect } from 'react';
import { X, Target, Save, Heart, Eye, Rocket, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface VisionBoardProps {
    onClose: () => void;
    isDarkMode: boolean;
}

export const VisionBoard: React.FC<VisionBoardProps> = ({ onClose, isDarkMode }) => {
    const [valores, setValores] = useState('');
    const [visao, setVisao] = useState('');
    const [metas, setMetas] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('5task_vision_board');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setValores(data.valores || '');
                setVisao(data.visao || '');
                setMetas(data.metas || '');
            } catch (e) {
                console.error("Failed to parse vision board data", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('5task_vision_board', JSON.stringify({ valores, visao, metas }));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'}`}>
            <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>

                {/* Header */}
                <div className={`flex items-center justify-between p-4 px-6 border-b shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20`}>
                            <Target size={20} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400">Visão</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar relative">

                    {/* Blocks */}
                    <div className="space-y-6">
                        {/* Bloco 1 */}
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-3 text-pink-500">
                                <Heart size={20} className="drop-shadow-sm" />
                                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Meus Valores Pessoais</h3>
                            </div>
                            <textarea
                                value={valores}
                                onChange={(e) => setValores(e.target.value)}
                                placeholder="Ex: família, liberdade, criatividade..."
                                className={`w-full p-4 rounded-xl resize-none outline-none transition-all ${isDarkMode ? 'bg-slate-900 focus:bg-slate-800 text-slate-200 placeholder-slate-600' : 'bg-white focus:bg-slate-50 text-slate-800 placeholder-slate-400'} border ${isDarkMode ? 'border-slate-800/50 focus:border-pink-500/50' : 'border-slate-200 focus:border-pink-300'}`}
                                rows={3}
                            />
                        </div>

                        {/* Bloco 2 */}
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-3 text-blue-500">
                                <Eye size={20} className="drop-shadow-sm" />
                                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Minha Visão de Longo Prazo</h3>
                            </div>
                            <textarea
                                value={visao}
                                onChange={(e) => setVisao(e.target.value)}
                                placeholder="Como você quer que sua vida seja no futuro? Que legado quer deixar?"
                                className={`w-full p-4 rounded-xl resize-none outline-none transition-all ${isDarkMode ? 'bg-slate-900 focus:bg-slate-800 text-slate-200 placeholder-slate-600' : 'bg-white focus:bg-slate-50 text-slate-800 placeholder-slate-400'} border ${isDarkMode ? 'border-slate-800/50 focus:border-blue-500/50' : 'border-slate-200 focus:border-blue-300'}`}
                                rows={3}
                            />
                        </div>

                        {/* Bloco 3 */}
                        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-3 text-amber-500">
                                <Rocket size={20} className="drop-shadow-sm" />
                                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Minhas Metas e Projetos</h3>
                            </div>
                            <textarea
                                value={metas}
                                onChange={(e) => setMetas(e.target.value)}
                                placeholder="Quais objetivos estão alinhados com sua visão?"
                                className={`w-full p-4 rounded-xl resize-none outline-none transition-all ${isDarkMode ? 'bg-slate-900 focus:bg-slate-800 text-slate-200 placeholder-slate-600' : 'bg-white focus:bg-slate-50 text-slate-800 placeholder-slate-400'} border ${isDarkMode ? 'border-slate-800/50 focus:border-amber-500/50' : 'border-slate-200 focus:border-amber-300'}`}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSave}
                            className={`flex items-center flex-row-reverse gap-2 px-8 py-3.5 flex-1 sm:flex-none justify-center rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 ${isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            <Save size={20} />
                            <span className="text-lg">{isSaved ? 'Salvo com sucesso!' : 'Salvar Dados'}</span>
                        </button>
                    </div>

                    {/* Banner Promo */}
                    <a href="https://amzn.to/4aX5epU" target="_blank" rel="noopener noreferrer" className={`block mt-10 p-6 rounded-2xl border-2 transition-all group overflow-hidden relative ${isDarkMode ? 'bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-amber-900/60 hover:border-amber-700/80 shadow-[0_0_30px_-10px_rgba(251,191,36,0.2)]' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400 shadow-xl'} shadow-xl`}>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-colors"></div>
                        <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40 shrink-0">
                                <BookOpen size={36} className="text-white" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className={`text-xl font-black mb-1.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>📘 Conheça o livro O Fim da Procrastinação</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-amber-200/80' : 'text-amber-800/80'}`}>O método comprovado por Petr Ludwig.</p>
                            </div>
                            <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white shadow-md flex items-center gap-2 group-hover:from-amber-400 group-hover:to-orange-400 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                                Aprenda o método completo <Target size={18} />
                            </div>
                        </div>
                    </a>

                    {/* Accordion Explanation */}
                    <div className={`mt-8 border rounded-2xl overflow-hidden shadow-sm transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                        <button
                            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                            className="w-full p-5 lg:p-6 flex items-center justify-between font-bold"
                        >
                            <div className={`flex items-center gap-3 text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                <span className="text-xl">ℹ️</span> Como funciona o Quadro Visão?
                            </div>
                            <div className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                {isAccordionOpen ? <ChevronUp size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} /> : <ChevronDown size={20} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />}
                            </div>
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${isAccordionOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                        >
                            <div className={`p-6 pt-0 lg:px-8 space-y-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <div className="flex gap-4 items-start">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-black text-sm border border-pink-500/30">1</div>
                                    <div>
                                        <strong className="text-pink-500 block mb-1 text-base">Valores Pessoais</strong>
                                        <p className="text-sm leading-relaxed">São os princípios que guiam sua vida. A bússola de tudo que você faz.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-black text-sm border border-blue-500/30">2</div>
                                    <div>
                                        <strong className="text-blue-500 block mb-1 text-base">Visão de Longo Prazo</strong>
                                        <p className="text-sm leading-relaxed">A direção de como você quer que sua vida seja. Não uma meta rígida, mas um horizonte.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-sm border border-amber-500/30">3</div>
                                    <div>
                                        <strong className="text-amber-500 block mb-1 text-base">Metas e Projetos</strong>
                                        <p className="text-sm leading-relaxed">Objetivos concretos que derivam da sua visão e estão alinhados com seus valores.</p>
                                    </div>
                                </div>
                                <div className={`mt-6 p-5 rounded-xl border text-center italic font-medium ${isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    "Quando você sabe o porquê, o como fica mais fácil."
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
