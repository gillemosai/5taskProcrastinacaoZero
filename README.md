# 🧠 5task - Motor de Produtividade Procrastinação Zero

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo.png" width="160" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-79.0-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Focus-Max-00f3ff?style=for-the-badge" alt="Focus">
  <img src="https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge" alt="PWA Ready">
  <img src="https://img.shields.io/badge/Theme-Dual-yellow?style=for-the-badge" alt="Dual Theme">
  <img src="https://img.shields.io/badge/Feature-Procrastinacao_Zero-red?style=for-the-badge" alt="Procrastinação Zero">
</p>

<p align="center">
  <a href="https://5task-procrastinacao-zero.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/TESTAR_AGORA-CLIQUE_AQUI-5e17eb?style=for-the-badge&logo=rocket" alt="Testar Agora">
  </a>
</p>

---

## 🚀 Sobre o Projeto

O **5task** é um gerenciador de tarefas minimalista e gamificado, desenhado sob o princípio da **Priorização Radical**. Em um mundo de distrações infinitas, o 5task impõe um limite físico de apenas **5 tarefas simultâneas**. 

Na versão **v79 (Procrastinação Zero)**, elevamos a experiência com um sistema implacável contra o acúmulo de tarefas, aplicando mecânicas de tempo limite e avatares de desespero conforme o prazo expira.

## ✨ Funcionalidades Principais (Atualizado v79)

- **🛡️ Limite Quântico:** O sistema bloqueia a criação de mais de 5 tarefas para garantir que sua energia mental não se disperse.
- **⏱️ Motor Procrastinação Zero (Novo):**
  * **Ciclo de Vida de 24h:** Toda tarefa idealmente deve ser finalizada no mesmo dia em que foi criada.
  * **Tempo de Tolerância (+3h):** Excedendo o prazo, a tarefa entra em alerta de tolerância com um contador regressivo (vermelho).
  * **Pânico Global:** Nas 3 horas finais, o Einstein perde sua calma e adentra em três estados diferentes de puro Desespero/Pânico (`PANIC_3H`, `PANIC_2H`, `PANIC_1H`), clamando por foco!
  
    <p align="center">
      <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-panic-3h.png" width="100" alt="Pânico 3H">
      &nbsp;&nbsp;&nbsp;
      <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-panic-2h.png" width="100" alt="Pânico 2H">
      &nbsp;&nbsp;&nbsp;
      <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-panic-1h.png" width="100" alt="Pânico 1H">
    </p>

  * **Expurgo Automático:** Se 27 horas passarem, a tarefa será sumariamente e automaticamente destruída. Nenhuma procrastinação sobrevivente.
- **🌗 Dual Theme Engine:** Alternância instantânea entre **Modo Escuro (Neon-Noir)** e **Modo Claro (High-Contrast)**.
- **🔝 Fluxo de Inserção Inteligente:** Novas tarefas são automaticamente adicionadas ao topo.
- **🚥 Matriz de Prioridade:** Classificação visual `(Urgente, Atenção e Crítico)`.
- **🎨 Sistema de Destaque Colorido:** Personalize seus cards com 3 cores base (Ciano, Roxo e Rosa).
- **✨ Smooth Motion (Drag & Drop):** Reordenação intuitiva com animações fluidas.
- **📋 Micro-Kanban Integrado:** Cada tarefa principal possui seu próprio quadro de planejamento (A Fazer, Fazendo, Concluído).
- **💾 Offline-First (IndexedDB):** Seus dados são salvos localmente no "Armazenamento Procrastinação Zero" do navegador.
- **📱 PWA Nativo:** Instalável em Android e iOS, pronto para empacotamento em Wrapper Nativo. (Otimizado com Sharp).

## 🛠️ Tecnologias de Ponta

- **[React 19](https://react.dev/):** A fundação para uma interface reativa e ultra-veloz.
- **[Tailwind CSS](https://tailwindcss.com/):** Design responsivo com utilitários customizados para efeitos Neon e Vidro (Glassmorphism).
- **[Lucide React](https://lucide.dev/):** Ícones vetoriais modernos para uma navegação limpa.
- **[IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API):** Banco de dados persistente no lado do cliente.

## ⚙️ Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/gillemosai/5task-android.git
    cd 5task-android
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o motor:**
    ```bash
    npm run dev
    ```

## 🗺️ Roadmap de Evolução

- [x] Limite de 5 tarefas e Gamificação com Einstein.
- [x] Persistência local com IndexedDB.
- [x] Micro-Kanban por tarefa.
- [x] Sistema de Temas Claro/Escuro (v78).
- [x] Priorização Colorida e Reordenação Animada (v78).
- [x] Expiração de 27 horas (Procrastinação Zero - v79).
- [x] Painel visual do Einstein em Pânico (v79).
- [x] Otimização das imagens dos avatares para o PWA / Wrapper.
- [ ] ☁️ Sincronização em nuvem (Firebase Integration).
- [ ] 📊 Relatórios de Produtividade Quântica (Insights Semanais).

---

<p align="center">
  <strong>⚠️ Aviso de Integridade:</strong> A pasta <code>assets/</code> contém recursos binários essenciais protegidos. Não modifique os arquivos de imagem para garantir a consistência da experiência visual.
</p>

<p align="center">
  Desenvolvido com 💜 por <strong>Gil Lemos</strong>
</p>
