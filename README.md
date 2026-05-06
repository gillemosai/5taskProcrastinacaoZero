# 🧠 5task - Motor de Produtividade Procrastinação Zero

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo.png" width="160" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-5.1.1-blueviolet?style=for-the-badge" alt="Version">
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

Na versão **5.0**, expandimos o sistema de **Tarefas Recorrentes** para até **5 recorrentes no total**, com gerenciamento inteligente que mantém **2 recorrentes visíveis na tela principal** e disponibiliza as demais na aba dedicada **Recorrentes**, além de guiar o usuário com banners informativos automáticos.

## ✨ Funcionalidades Principais (Atualizado v5.1)

- **🎯 Menu em Leque (v5.1):** Ao clicar no botão "+", um menu animado exibe 3 tipos de tarefa: **Lista** (purple), **Tarefa** (cyan) e **Recorrente** (amber). Cada opção tem glow neon próprio e animação spring suave.
- **📝 Tarefas Tipo Lista (v5.1):** Novo tipo de tarefa com checklist interativo estilo Microsoft To-Do. Crie listas de compras, checklists de projeto, etc. Cada item pode ser marcado/desmarcado com animação. Barra de progresso mostra "X/Y itens" e a tarefa é auto-completada quando todos os itens forem marcados.
- **🔄 Criação de Recorrentes Otimizada (v5.1):** Ao selecionar "Recorrente" no menu em leque, o seletor de recorrência já vem pré-aberto com a opção "Diária" selecionada, agilizando a criação.

- **🔄 Recorrência Expandida (v5.0):** Configure até **5 tarefas recorrentes** no total (Diária, Dias Úteis, Semanal, Personalizada). As 2 primeiras aparecem na tela principal "Fazer Hoje"; a 3ª em diante é salva automaticamente na aba **Recorrentes** com um banner informativo. Um botão **"ver+ recorrentes"** aparece abaixo da lista quando há extras disponíveis.
- **📋 Abas Inteligentes (v5.0):** Navegue entre **Concluídas**, **Fazer Hoje** e **Recorrentes** para ter visão completa de todas as suas tarefas ativas, concluídas e recorrentes. Na aba Concluídas, o botão **"Fazer novamente"** permite recriar qualquer tarefa já finalizada.
- **🎉 Dia Produtivo (v5.0):** Ao concluir **3 tarefas no mesmo dia**, o Einstein celebra com uma animação especial de parabéns. Seu dia é contabilizado na **sequência de dias produtivos** (streak), incentivando a consistência.
- **✨ Contador Diário (v5.0):** O badge **"✨ Hoje: X"** no topo da lista de tarefas mostra em tempo real quantas tarefas você já concluiu no dia.
- **🌟 Expansão de Gamificação:** Receba badges visuais ao vivo na tela mostrando quantas missões de foco você aniquilou no dia, além de feedback instantâneo da sua pontuação após a linda animação de desaparecimento de tarefas cumpridas.
- **🛡️ Limite Quântico Inteligente:** O limite de criar até 5 tarefas só leva em consideração as que estão em andamento. Tarefas finalizadas contam na sua pontuação e desaparecem imediatamente da contagem de carga ativa.
- **⏱️ Motor Procrastinação Zero:**
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
- **🎯 Quadro Visão Wizard:** Um wizard passo a passo persistido localmente no IndexedDB para construir sua Visão Pessoal (Valores → Visão de Longo Prazo → Metas e Projetos), acessível a qualquer momento com o botão "Ver Minha Visão".
- **🏆 Gamificação Offline (Novidade):** Cada tarefa finalizada confere 1 ponto ao usuário. Os pontos são guardados localmente numa database de IndexedDB dedicada e atualizados ao vivo no novo Painel Dashboard brilhante.
- **🎨 Glass-Card UI & Cores Neon:** Visuais refinados de fundo escuro cyberpunk ("background-dark") e bordas destacadas estilo neon cyano e magenta, baseados no design system "Google Stitch".
- **📁 Arquivos & Resgates:** Tarefas perdidas caem no seu Arquivo ao invés de sumirem de uma vez. Você tem a opção de "Resgatar" falhas em suas missões caso não haja mais de 5 atividades em tela, possuindo um total de 3 vidas de resgate por item até sua completa auto-destruição.
- **🌗 Dual Theme Engine:** Alternância instantânea entre **Modo Escuro (Neon-Noir)** e **Modo Claro (High-Contrast)**.
- **🔝 Fluxo de Inserção Inteligente:** Novas tarefas são automaticamente adicionadas ao topo.
- **🚥 Matriz de Prioridade:** Classificação visual `(Urgente, Atenção e Crítico)`.
- **✨ Smooth Motion (Drag & Drop):** Reordenação intuitiva com animações fluidas físicas (impulsionado por Framer Motion).
- **📋 Micro-Kanban Integrado e Auto-Complete (v5.0.1):** Cada tarefa principal possui seu próprio quadro de planejamento (A Fazer, Fazendo, Concluído). O progresso das etapas é exibido ao vivo no próprio card da tarefa e, ao mover todas as etapas para "Concluído", a tarefa é finalizada automaticamente com uma animação suave.
- **💾 Offline-First Total:** Suas tarefas, sua Visão Pessoal e até seus Pontos de Conclusão sobrevivem sem internet permanentemente no "Armazenamento Procrastinação Zero".
- **📱 PWA Nativo:** Instalável em Android e iOS, totalmente pronto e testado para ser convertido num App da Google Play Store!

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
- [x] Correção de sobreposição de tags visuais em tarefas longas.
- [x] Implementação do Banco de Pontos Offline / Gamification Local no IndexedDB.
- [x] Nova Funcionalidade de Arquivos e Vidas de Resgate (v4.1.0).
- [x] TWA Experience em Full Screen: Integração resolvida com Google Play Developer signatures (v4.2.1).
- [x] Tarefas Recorrentes e Painel Analógico de Foco Diário (v4.2.1).
- [x] Expansão de Recorrentes para 5 tarefas, gerenciamento inteligente com aba dedicada (v5.0).
- [x] Banners informativos auto-dismiss e botão "ver+ recorrentes" (v5.0).
- [x] Modal "Dia Produtivo" ao completar 3 tarefas, contador diário e botão "Fazer novamente" (v5.0).
- [x] Menu em leque animado com 3 tipos de tarefa: Lista, Tarefa, Recorrente (v5.1).
- [x] Tarefas tipo Lista com checklist interativo, progresso e auto-complete (v5.1).
- [x] Correções de layout mobile no menu em leque e checklist colapsado por padrão (v5.1.1).
- [ ] ☁️ Sincronização e autenticação opcional em nuvem (Vercel Postgres/Firebase).
- [ ] 📊 Relatórios de Produtividade Quântica (Insights Semanais).

---

<p align="center">
  <strong>⚠️ Aviso de Integridade:</strong> A pasta <code>assets/</code> contém recursos binários essenciais protegidos. Não modifique os arquivos de imagem para garantir a consistência da experiência visual.
</p>

<p align="center">
  Desenvolvido com 💜 por <strong>Gil Lemos</strong>
</p>
