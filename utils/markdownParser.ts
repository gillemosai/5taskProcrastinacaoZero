export function parseMarkdown(markdown: string): string {
    if (!markdown) return '';

    let html = markdown;

    // Step 1: Protect all HTML block-level elements from being mangled by markdown rules.
    // This regex captures multi-line <p>, <div>, and standalone <a> blocks.
    const blocks: string[] = [];
    html = html.replace(/<(p|div)[\s\S]*?<\/\1>/gi, (match) => {
        // Process inline images within the block to add inline styling
        let processed = match;
        // Ensure images inside <p align="center"> display inline
        if (/align\s*=\s*["']center["']/i.test(processed)) {
            processed = processed.replace(/<p\s/gi, '<p style="text-align:center" ');
        }
        blocks.push(processed);
        return `\n___BLOCK${blocks.length - 1}___\n`;
    });

    // Code Blocks (before inline code to avoid conflicts)
    html = html.replace(/```([a-z]+)?\n([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto my-4 text-sm shadow-inner border border-slate-800"><code>$2</code></pre>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100 uppercase tracking-wide">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-6 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Inline Code
    html = html.replace(/`(.*?)`/gim, '<code class="bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-sm">$1</code>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-8 border-slate-200 dark:border-slate-800" />');

    // Checkboxes
    html = html.replace(/^- \[x\] (.*)/gim, '<div class="flex items-start gap-2 my-2"><input type="checkbox" checked readOnly class="mt-1 rounded border-slate-300 text-amber-500 focus:ring-amber-500" /><span class="line-through opacity-60">$1</span></div>');
    html = html.replace(/^- \[ \] (.*)/gim, '<div class="flex items-start gap-2 my-2"><input type="checkbox" readOnly class="mt-1 rounded border-slate-300 text-amber-500 focus:ring-amber-500" /><span>$1</span></div>');

    // Sub-list items (indented with spaces + * or -)
    html = html.replace(/^  [*-] (.*)/gim, '<li class="ml-10 list-[circle] mb-2 marker:text-slate-400">$1</li>');

    // Top-level list items
    html = html.replace(/^[-] (?!\[[ x]\])(.*)/gim, '<li class="ml-6 list-disc mb-2 marker:text-amber-500">$1</li>');

    // Numbered list items (1. 2. 3. etc)
    html = html.replace(/^\d+\.\s+(.*)/gim, '<li class="ml-6 list-decimal mb-2 marker:text-amber-500">$1</li>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-amber-500 underline decoration-blue-500/30 font-medium transition-colors">$1</a>');

    // Paragraphs - split by double newlines
    html = html.split('\n\n').map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('___BLOCK')) return trimmed;
        if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<hr') || trimmed.startsWith('<div class="flex') || trimmed.startsWith('<li')) return trimmed;
        return `<p class="mb-5 text-slate-700 dark:text-slate-300 leading-relaxed">${trimmed}</p>`;
    }).join('\n');

    // Wrap consecutive <li> items in <ul> tags
    html = html.replace(/(<li[\s\S]*?<\/li>\s*)+/g, (match) => {
        return `<ul class="my-4">\n${match}</ul>\n`;
    });

    // Restore HTML blocks
    blocks.forEach((block, index) => {
        html = html.replace(`___BLOCK${index}___`, block);
    });

    return html;
}
