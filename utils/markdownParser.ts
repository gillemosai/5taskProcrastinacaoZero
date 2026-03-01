export function parseMarkdown(markdown: string): string {
    if (!markdown) return '';

    let html = markdown;

    // Protect HTML block tags from paragraph wrapping
    const blocks: string[] = [];
    html = html.replace(/<(p|div|img|a)[^>]*>[\s\S]*?<\/\1>|<img[^>]+>/gi, (match) => {
        blocks.push(match);
        return `___BLOCK${blocks.length - 1}___`;
    });

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100 uppercase tracking-wide">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-6 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Inline Code
    html = html.replace(/`(.*?)`/gim, '<code class="bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-sm">$1</code>');

    // Code Blocks
    html = html.replace(/```([a-z]+)?\n([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto my-4 text-sm shadow-inner border border-slate-800"><code>$2</code></pre>');

    // Checkboxes
    html = html.replace(/^- \[x\] (.*)/gim, '<div class="flex items-start gap-2 my-2"><input type="checkbox" checked readOnly class="mt-1 rounded border-slate-300 text-amber-500 focus:ring-amber-500" /><span class="line-through opacity-60">$1</span></div>');
    html = html.replace(/^- \[ \] (.*)/gim, '<div class="flex items-start gap-2 my-2"><input type="checkbox" readOnly class="mt-1 rounded border-slate-300 text-amber-500 focus:ring-amber-500" /><span>$1</span></div>');

    // Lists (Bulleted)
    html = html.replace(/^[\*-] (?!\[[ x]\])(.*)/gim, '<li class="ml-6 list-disc mb-2 marker:text-amber-500">$1</li>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-amber-500 underline decoration-blue-500/30 font-medium transition-colors">$1</a>');

    // Horizontal rules
    html = html.replace(/^---/gim, '<hr class="my-8 border-slate-200 dark:border-slate-800" />');

    // Paragraphs
    html = html.split('\n\n').map(p => {
        if (p.trim().startsWith('___BLOCK')) return p;
        if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<hr') || p.trim().startsWith('<div class="flex') || p.trim().startsWith('<li')) return p;
        return p.trim() ? `<p class="mb-5 text-slate-700 dark:text-slate-300 leading-relaxed">${p}</p>` : '';
    }).join('\n');

    // Clean up loose list items by wrapping them (optional, doing a simple global replace for now)
    html = html.replace(/(<li.*?>.*?<\/li>)\n*(?!<li)/g, '$1\n</ul>\n').replace(/(?<!<\/li>\n*)<li/g, '<ul class="my-4">\n<li');

    // Restore HTML blocks
    blocks.forEach((block, index) => {
        html = html.replace(`___BLOCK${index}___`, block);
    });

    return html;
}
