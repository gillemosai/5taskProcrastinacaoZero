import React, { useEffect, useState } from 'react';
import { X, FileText } from 'lucide-react';
import { parseMarkdown } from '../utils/markdownParser';

// We can import the README directly via VITE since this is a Vite app.
import readmeText from '../README.md?raw';

interface MarkdownViewerProps {
    onClose: () => void;
    isDarkMode: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ onClose, isDarkMode }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        setHtmlContent(parseMarkdown(readmeText));
    }, []);

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'}`}>
            <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-4 px-6 border-b shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20`}>
                            <FileText size={20} className="text-white" />
                        </div>
                        <h2 className={`text-xl font-bold font-mono tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Documentação</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10 overflow-y-auto flex-1 custom-scrollbar">
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-h1:font-black prose-h2:font-bold prose-h3:font-bold prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>
            </div>
        </div>
    );
};
