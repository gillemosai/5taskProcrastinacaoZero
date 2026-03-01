import { Task } from '../types';

export function exportUncompletedTasks(tasks: Task[]) {
    // Filter uncompleted tasks
    const uncompleted = tasks.filter(t => !t.completed);

    // Sort by created at (newest first)
    uncompleted.sort((a, b) => b.createdAt - a.createdAt);

    // Take max 30
    const top30 = uncompleted.slice(0, 30);

    if (top30.length === 0) {
        alert('Não há tarefas não concluídas para exportar!');
        return;
    }

    let markdownContent = `# Tarefas Não Concluídas (As 30 Últimas)\n\n`;
    markdownContent += `*Exportado em: ${new Date().toLocaleString('pt-BR')}*\n\n`;
    markdownContent += `---\n\n`;

    top30.forEach((task, index) => {
        const dateStr = new Date(task.createdAt).toLocaleString('pt-BR');
        markdownContent += `${index + 1}. [ ] **${task.text}** (Criada em: ${dateStr})\n`;

        if (task.subTasks && task.subTasks.length > 0) {
            task.subTasks.forEach(sub => {
                const subChecked = sub.column === 'done' ? '[x]' : '[ ]';
                markdownContent += `   - ${subChecked} ${sub.text}\n`;
            });
        }
        markdownContent += '\n';
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    const now = new Date();
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    link.setAttribute('download', `30-tarefas-nao-concluidas-${dateString}.md`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
