# 🧠 5task - Motor de Produtividade Procrastinação Zero

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo.png" width="160" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-7.0.0.2-blueviolet?style=for-the-badge" alt="Version">
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

## ✨ Funcionalidades Principais (Atualizado v7.0.0.2)

- **⚡ Renascimento Visual: Logotipo "T-Raio" (v6.0.0.3):** Nova identidade visual minimalista, simétrica e harmônica baseada na fusão da letra **"T"** (Task) com o **Raio** (Foco/Produtividade) estilizados sobre a curva do número **"5"**. Cores em gradiente ciano e magenta com acabamento neon de alta qualidade.
- **🧠 5 Expressões Inéditas do Einstein 3D Neon (v6.0.0.3):** Reações emotivas e expressivas geradas em alta definição (estilo animação 3D Pixar) com luzes neon para aumentar a conexão emocional e a imersão com o usuário:
  - **Foco (`einstein-focus.png`):** Einstein de óculos focado em lousa digital holográfica de física.
  - **Vitória (`einstein-victory.png`):** Albert celebrando e jogando tarefas no ar com óculos neon rosa.
  - **Zen (`einstein-zen.png`):** Expressão meditativa em lótus para acalmar momentos estressantes.
  - **Mentor (`einstein-mentor.png`):** Einstein acolhedor e sábio segurando uma xícara quente.
  - **Desafio (`einstein-challenge.png`):** Postura firme e desafiadora de braços cruzados para quando o limite de tarefas for excedido.
- **📖 Repertório Emocional Ampliado em `QUOTES.md` (v6.0.0.3):** Adicionados dezenas de insights de física e frases motivacionais exclusivas categorizadas pelos novos estados emocionais do avatar.
- **🎓 Onboarding Anti-Procrastinação (v5.4.0):** Novo `WelcomeCarousel` com 5 slides amigáveis e motivadores que apresentam o método, os benefícios e reposicionam o app como solução anti-procrastinação — não como uma simples lista de tarefas.
- **💡 Dicas Contextuais com Einstein (v5.4.0):** Sistema de balões educativos disparados por eventos reais: ao concluir a 1ª tarefa, ao visitar a aba Concluídas pela 1ª vez e ao ter uma tarefa expirada para o Arquivo. Cada dica aparece apenas uma vez, respeitando o usuário.
- **📖 "O que é isso?" na Visão (v5.4.0):** Botão explicativo na tela Minha Visão que abre um modal com o Einstein explicando o método dos 3 pilares de Petr Ludwig ("O Fim da Procrastinação"): Valores → Visão → Metas.

- **📐 Descrição Compacta de Tarefas (v5.3.0):** Textos longos são automaticamente limitados a **2 linhas** com indicador **"ver mais..."** em cyan. Ao clicar, o texto expande mostrando **"ver menos"** para recolher. O card mantém tamanho compacto por padrão, evitando que descrições longas quebrem o layout.
- **📋 Botão Kanban Visível (v5.3.0):** Cada tarefa ativa agora exibe um botão **"Quebrar em etapas"** sempre visível. Tarefas que já possuem etapas no Kanban mostram o label **"Kanban"** junto com a barra de progresso (X/Y). Tarefas tipo Lista mantêm seu próprio sistema de checklist.
- **🎯 Menu em Leque Avançado (v5.3.3):** Ao clicar no botão "+", um menu radial baseado em **SVG Path** é revelado com precisão absoluta de renderização, com opções de: Lista, Simples e Recorrente.
- **🔄 Segundo Nível em Arco (v5.3.3):** O menu se adapta formando fatias de anel ao redor de um botão persistente, oferecendo 4 opções (Diária, Semanal, Dias Úteis, Custom) para recorrências.
- **🎶 Feedback Sonoro Responsivo (v5.3.3):** Cada clique do usuário na interface reproduz um pequeno tick de resposta via `AudioContext` de baixo nível, dando uma sensação tátil impressionante.
- **🗨️ Balão de Fala Profissional (v5.3.5):** O bico do balão de fala do Einstein foi refinado com um **SVG Path** elegante e afilado, substituindo o visual antigo por um acabamento muito mais profissional e fluido.
- **🧠 Repertório Dinâmico e Memória (v5.3.8):** As falas do avatar são agora carregadas externamente via `QUOTES.md`. O Einstein também ganhou uma "memória de curto prazo" que **impede a repetição das últimas 3 frases**, tornando as interações muito mais naturais e variadas.
- **📝 Tarefas Tipo Lista:** Novo tipo de tarefa com checklist interativo estilo Microsoft To-Do. Crie listas de compras, checklists de projeto, etc. Cada item pode ser marcado/desmarcado com animação. Barra de progresso mostra "X/Y itens" e a tarefa é auto-completada quando todos os itens forem marcados.

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
- [x] Descrição de tarefas compacta com clamp de 2 linhas e "ver mais/ver menos" (v5.3.0).
- [x] Botão Kanban "Quebrar em etapas" sempre visível em tarefas ativas (v5.3.0).
- [x] Refinamento estético do balão de fala com SVG Path (v5.3.5).
- [x] Externalização de frases para `QUOTES.md` e sistema de memória anti-repetição (v5.3.8).
- [x] Correção de aspas duplicadas no balão de fala do Einstein (v5.4.0).
- [x] WelcomeCarousel reformulado com 5 slides motivadores e botão "Pular introdução" (v5.4.0).
- [x] Sistema de dicas contextuais com Einstein (1ª conclusão, aba Concluídas, Arquivo) (v5.4.0).
- [x] Modal "O que é isso?" na tela Visão explicando o método de Petr Ludwig (v5.4.0).
- [x] Identidade visual harmônica "T-Raio" e 5 novos avatares Einstein 3D Neon (v6.0.0.0).
- [x] Correção no carregamento do logotipo do app no Android (geração de ícones/splash nativos) e atualização do SW para v6.0.0.3.
- [x] Agenda Diária Pro integrada ao 5Task (exclusivo desktop/PWA) com visão de timeline, calendário lateral e gestão completa de compromissos (v7.0.0.0).
- [x] Atualização do Service Worker e PWA cache para v7.0.0.0.
- [x] Correção no botão de adicionar tarefa recorrente para abrir o subset do menu radial (v7.0.0.1).
- [x] Acessibilidade de cores (WCAG), remoção de blur e transição dinâmica com troca de lugar das fatias no menu em leque (v7.0.0.2).
- [ ] ☁️ Sincronização e autenticação opcional em nuvem (Vercel Postgres/Firebase).
- [ ] 📊 Relatórios de Produtividade Quântica (Insights Semanais).

---

<p align="center">
  <strong>⚠️ Aviso de Integridade:</strong> A pasta <code>assets/</code> contém recursos binários essenciais protegidos. Não modifique os arquivos de imagem para garantir a consistência da experiência visual.
</p>

<p align="center">
  Desenvolvido com 💜 por <strong>Gil Lemos</strong>
</p>
