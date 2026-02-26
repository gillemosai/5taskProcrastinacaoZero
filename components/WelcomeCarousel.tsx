
import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Trash2, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';

interface WelcomeCarouselProps {
    onComplete: () => void;
    isDarkMode: boolean;
}

const slides = [
    {
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        glowColor: 'shadow-amber-500/30',
        bgGradient: 'from-amber-500/20 to-orange-500/10',
        borderColor: 'border-amber-500/30',
        title: 'Atenção',
        message: 'As tarefas devem ser concluídas em 24 horas',
        emoji: '⚠️',
    },
    {
        icon: Trash2,
        iconColor: 'text-red-400',
        glowColor: 'shadow-red-500/30',
        bgGradient: 'from-red-500/20 to-pink-500/10',
        borderColor: 'border-red-500/30',
        title: 'Após 27 horas',
        message: 'Tarefas não concluídas\nserão excluídas sumariamente',
        emoji: '🗑️',
    },
    {
        icon: Rocket,
        iconColor: 'text-neon-blue',
        glowColor: 'shadow-neon-blue/30',
        bgGradient: 'from-neon-blue/20 to-neon-purple/10',
        borderColor: 'border-neon-blue/30',
        title: 'Não Procrastine',
        message: 'Seu Sucesso depende de você!',
        emoji: '🚀',
    },
];

export const WelcomeCarousel: React.FC<WelcomeCarouselProps> = ({ onComplete, isDarkMode }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.clientWidth;
        const index = Math.round(scrollLeft / width);
        setCurrentSlide(index);
    };

    const scrollToSlide = (index: number) => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onComplete, 400);
    };

    return (
        <div
            className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
            {/* Background overlay */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-950/90' : 'bg-slate-900/80'}`} />

            {/* Carousel container */}
            <div
                className={`relative w-full max-w-md mx-4 rounded-3xl overflow-hidden border shadow-2xl transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-90'
                    } ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}
            >
                {/* Scroll area */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {slides.map((slide, index) => {
                        const IconComponent = slide.icon;
                        return (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full snap-center flex flex-col items-center justify-center px-8 py-12"
                                style={{ minWidth: '100%' }}
                            >
                                {/* Icon circle with glow */}
                                <div
                                    className={`relative w-28 h-28 rounded-full flex items-center justify-center mb-8 bg-gradient-to-br ${slide.bgGradient} border ${slide.borderColor} shadow-lg ${slide.glowColor}`}
                                >
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" style={{ animationDuration: '2s' }} />
                                    <IconComponent size={48} className={slide.iconColor} strokeWidth={1.5} />
                                </div>

                                {/* Emoji */}
                                <div className="text-4xl mb-4">{slide.emoji}</div>

                                {/* Title */}
                                <h2
                                    className={`text-2xl font-black tracking-tight mb-3 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'
                                        }`}
                                >
                                    {slide.title}
                                </h2>

                                {/* Message */}
                                <p
                                    className={`text-base text-center leading-relaxed max-w-xs whitespace-pre-line ${isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                        }`}
                                >
                                    {slide.message}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom controls */}
                <div className="px-8 pb-8 flex flex-col items-center gap-5">
                    {/* Dots indicator */}
                    <div className="flex items-center gap-2.5">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToSlide(index)}
                                className={`rounded-full transition-all duration-300 ${currentSlide === index
                                    ? 'w-8 h-2.5 bg-neon-blue shadow-lg shadow-neon-blue/50'
                                    : `w-2.5 h-2.5 ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-400'}`
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center gap-3 w-full">
                        {currentSlide > 0 && (
                            <button
                                onClick={() => scrollToSlide(currentSlide - 1)}
                                className={`flex items-center gap-1 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${isDarkMode
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <ChevronLeft size={18} /> Voltar
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (currentSlide < slides.length - 1) {
                                    scrollToSlide(currentSlide + 1);
                                } else {
                                    handleClose();
                                }
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 shadow-lg ${currentSlide === slides.length - 1
                                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue/40 hover:shadow-neon-blue/60'
                                : 'bg-neon-blue text-slate-900 shadow-neon-blue/30 hover:shadow-neon-blue/50'
                                }`}
                        >
                            {currentSlide === slides.length - 1 ? (
                                <>COMEÇAR <Rocket size={18} /></>
                            ) : (
                                <>Próximo <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
