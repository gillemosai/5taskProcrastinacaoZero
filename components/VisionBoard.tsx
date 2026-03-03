import React, { useState, useEffect } from 'react';
import { X, Target, Save, Heart, Eye, Rocket, ChevronLeft, ChevronRight, BookOpen, Check } from 'lucide-react';
import { loadVisionFromDB, saveVisionToDB } from '../App';

interface VisionBoardProps {
    onClose: () => void;
    isDarkMode: boolean;
}

interface WizardStep {
    key: 'valores' | 'visao' | 'metas';
    icon: React.ReactNode;
    color: string;
    borderFocus: string;
    title: string;
    description: string;
    placeholder: string;
}

const STEPS: WizardStep[] = [
    {
        key: 'valores',
        icon: <Heart size={22} />,
        color: 'text-pink-500',
        borderFocus: 'focus:border-pink-500/50',
        title: 'Meus Valores Pessoais',
        description: 'Quais são as coisas mais importantes para você na vida? Pense naquilo que você não abre mão e que te faz sentir que está agindo de forma certa e justa no seu dia a dia.',
        placeholder: 'Família, saúde, honestidade, tranquilidade, respeito ao próximo.',
    },
    {
        key: 'visao',
        icon: <Eye size={22} />,
        color: 'text-blue-500',
        borderFocus: 'focus:border-blue-500/50',
        title: 'Minha Visão de Longo Prazo',
        description: 'Como você quer viver a sua vida todos os dias? Pense na rotina que te faz feliz, nas coisas que você gosta de fazer e em como você quer que as pessoas ao seu redor se sintam com a sua presença.',
        placeholder: '"Quero manter uma vida equilibrada e saudável, cuidando bem da minha família e tendo um ambiente de paz em casa. Quero ajudar quem está ao meu redor a viver com menos estresse."',
    },
    {
        key: 'metas',
        icon: <Rocket size={22} />,
        color: 'text-amber-500',
        borderFocus: 'focus:border-amber-500/50',
        title: 'Minhas Metas e Projetos',
        description: 'Quais são os passos práticos que você está dando agora para viver essa visão? Liste coisas que você pode começar e terminar.',
        placeholder: '• Identificar e cortar os gastos bobos do mês.\n• Começar a caminhar 30 minutos por dia.\n• Tirar um tempo no domingo para planejar o cardápio.',
    },
];

export const VisionBoard: React.FC<VisionBoardProps> = ({ onClose, isDarkMode }) => {
    const [valores, setValores] = useState('');
    const [visao, setVisao] = useState('');
    const [metas, setMetas] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isAnimating, setIsAnimating] = useState(false);

    const fieldValues: Record<string, string> = { valores, visao, metas };
    const setters: Record<string, (v: string) => void> = {
        valores: setValores,
        visao: setVisao,
        metas: setMetas,
    };

    useEffect(() => {
        const loadInit = async () => {
            try {
                const data = await loadVisionFromDB();
                if (data) {
                    setValores(data.valores || '');
                    setVisao(data.visao || '');
                    setMetas(data.metas || '');
                } else {
                    // Fallback para localStorage as migração
                    const saved = localStorage.getItem('5task_vision_board');
                    if (saved) {
                        const lData = JSON.parse(saved);
                        setValores(lData.valores || '');
                        setVisao(lData.visao || '');
                        setMetas(lData.metas || '');
                        saveVisionToDB(lData); // Migra
                    }
                }
            } catch (e) {
                console.error("Failed to parse vision board data", e);
            }
        };
        loadInit();
    }, []);

    const handleSave = async () => {
        const data = { valores, visao, metas };
        await saveVisionToDB(data);
        localStorage.setItem('5task_vision_board', JSON.stringify(data)); // Mantém backup duplo por via das duvidas
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const goToStep = (nextStep: number) => {
        if (isAnimating || nextStep < 0 || nextStep >= STEPS.length) return;
        setDirection(nextStep > currentStep ? 'next' : 'prev');
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsAnimating(false);
        }, 200);
    };

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'}`}>
            <div className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>

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

                {/* Step Progress Indicator */}
                <div className="flex items-center gap-2 px-6 pt-5 pb-2">
                    {STEPS.map((s, i) => (
                        <button
                            key={s.key}
                            onClick={() => goToStep(i)}
                            className={`flex items-center gap-1.5 transition-all duration-300 ${i === currentStep ? 'flex-[2]' : 'flex-1'}`}
                        >
                            <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${i < currentStep
                                ? 'bg-green-500'
                                : i === currentStep
                                    ? (isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-500')
                                    : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')
                                }`} />
                        </button>
                    ))}
                </div>
                <div className={`text-center text-xs font-mono uppercase tracking-widest pb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Passo {currentStep + 1} de {STEPS.length}
                </div>

                {/* Content Body - Single Step */}
                <div className="px-6 sm:px-8 pb-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div
                        className={`transition-all duration-200 ease-out ${isAnimating
                            ? `opacity-0 ${direction === 'next' ? 'translate-x-8' : '-translate-x-8'}`
                            : 'opacity-100 translate-x-0'
                            }`}
                    >
                        {/* Step Card */}
                        <div className={`p-6 rounded-2xl border mt-2 ${isDarkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                            {/* Step Title */}
                            <div className={`flex items-center gap-3 mb-4 ${step.color}`}>
                                <div className={`p-2.5 rounded-xl bg-current/10 ${isDarkMode ? 'bg-opacity-20' : 'bg-opacity-10'}`}
                                    style={{ backgroundColor: `currentColor`, opacity: 0.12 }}
                                >
                                    {step.icon}
                                </div>
                                <h3 className={`font-bold text-xl ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{step.title}</h3>
                            </div>

                            {/* Description */}
                            <p className={`text-sm leading-relaxed mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {step.description}
                            </p>

                            {/* Textarea */}
                            <textarea
                                value={fieldValues[step.key]}
                                onChange={(e) => setters[step.key](e.target.value)}
                                placeholder={step.placeholder}
                                className={`w-full p-4 rounded-xl resize-none outline-none transition-all text-base ${isDarkMode
                                    ? `bg-slate-900 focus:bg-slate-800 text-slate-200 placeholder-slate-600 border border-slate-800/50 ${step.borderFocus}`
                                    : `bg-white focus:bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 ${step.borderFocus}`
                                    }`}
                                rows={5}
                                autoFocus
                            />

                            {/* Filled indicator */}
                            {fieldValues[step.key].trim().length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2 text-green-500 text-xs font-medium">
                                    <Check size={14} /> Preenchido
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-6 gap-3">
                            <button
                                onClick={() => goToStep(currentStep - 1)}
                                disabled={isFirstStep}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all active:scale-95 ${isFirstStep
                                    ? 'opacity-0 pointer-events-none'
                                    : (isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                                    }`}
                            >
                                <ChevronLeft size={18} /> Anterior
                            </button>

                            {isLastStep ? (
                                <button
                                    onClick={handleSave}
                                    className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${isSaved
                                        ? 'bg-green-500 text-white shadow-green-500/30'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/20'
                                        }`}
                                >
                                    <Save size={18} />
                                    {isSaved ? 'Salvo!' : 'Salvar Tudo'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => goToStep(currentStep + 1)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Próximo <ChevronRight size={18} />
                                </button>
                            )}
                        </div>

                        {/* Banner Promo - only on last step */}
                        {isLastStep && (
                            <a href="https://amzn.to/4aX5epU" target="_blank" rel="noopener noreferrer" className={`block mt-8 p-5 rounded-2xl border-2 transition-all group overflow-hidden relative ${isDarkMode ? 'bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-amber-900/60 hover:border-amber-700/80 shadow-[0_0_30px_-10px_rgba(251,191,36,0.2)]' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400 shadow-xl'} shadow-xl`}>
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-colors"></div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40 shrink-0">
                                        <BookOpen size={28} className="text-white" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className={`text-base font-black mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>📘 O Fim da Procrastinação</h4>
                                        <p className={`text-xs ${isDarkMode ? 'text-amber-200/80' : 'text-amber-800/80'}`}>O método comprovado por Petr Ludwig.</p>
                                    </div>
                                    <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white text-sm shadow-md flex items-center gap-2 group-hover:from-amber-400 group-hover:to-orange-400 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                                        Ver livro <Target size={16} />
                                    </div>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
