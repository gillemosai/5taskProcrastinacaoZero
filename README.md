# 🧠 5task - Motor de Produtividade Procrastinação Zero

<p align="center">
  <img src="https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo.png" width="160" alt="5task Logo">
</p>

<p align="center">
  <strong>"Tudo deve ser feito da forma mais simples possível, mas não simplista." — Albert Einstein</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-8.0.0.0-blueviolet?style=for-the-badge" alt="Version">
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

<details>
<summary><b>🌍 English</b></summary>

**5task** is a minimalist, gamified to-do app built on one rule: *at most 5 tasks, finished within 24 hours*. If you procrastinate, Einstein panics. It works **offline** (PWA, data stored in IndexedDB), has dark/light themes, a micro-Kanban per task, recurring tasks, and is installable on Android and iOS.

**Try it:** https://5task-procrastinacao-zero.vercel.app/ · **Stack:** React 19, Tailwind CSS, Framer Motion, IndexedDB, Capacitor (Android).

```bash
git clone https://github.com/gillemosai/5taskProcrastinacaoZero.git
cd 5taskProcrastinacaoZero && npm install && npm run dev
```

Version history: [CHANGELOG.md](CHANGELOG.md).

</details>

---

## 🚀 Sobre o Projeto

O **5task** é um gerenciador de tarefas minimalista e gamificado, desenhado sob o princípio da **Priorização Radical**. Em um mundo de distrações infinitas, o 5task impõe um limite físico de apenas **5 tarefas simultâneas**. 

Na versão **5.0**, expandimos o sistema de **Tarefas Recorrentes** para até **5 recorrentes no total**, com gerenciamento inteligente que mantém **2 recorrentes visíveis na tela principal** e disponibiliza as demais na aba dedicada **Recorrentes**, além de guiar o usuário com banners informativos automáticos.

## ✨ Funcionalidades Principais (Atualizado v7.0.0.4)

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
    git clone https://github.com/gillemosai/5taskProcrastinacaoZero.git
    cd 5taskProcrastinacaoZero
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o motor:**
    ```bash
    npm run dev
    ```

## 📱 Como Gerar o Android App Bundle (.aab) para a Google Play

Para gerar a versão atualizada do aplicativo para a Google Play Store, execute os seguintes passos:

1. **Faça o build da nova versão Web:**
   ```bash
   npm run build
   ```
2. **Sincronize as novidades com a pasta do Android:**
   ```bash
   npx cap sync android
   ```
3. **Abra o projeto no Android Studio:**
   ```bash
   npx cap open android
   ```
4. **Gere o arquivo `.aab` assinado no Android Studio:**
   * No Android Studio, vá em: **Build -> Generate Signed Bundle / APK...**
   * Escolha **Android App Bundle** e clique em **Next**.
   * Insira suas chaves de assinatura e selecione a variante **release**.
   * Clique em **Finish** para compilar o arquivo `.aab` pronto para o Google Play Console.

## 🗺️ Roadmap

O histórico do que já foi entregue está no [CHANGELOG](CHANGELOG.md). Próximos passos:

- [ ] ☁️ Sincronização e autenticação opcional em nuvem (Vercel Postgres/Firebase).
- [ ] 📊 Relatórios de Produtividade Quântica (Insights Semanais).

---

<p align="center">
  <strong>⚠️ Aviso de Integridade:</strong> A pasta <code>assets/</code> contém recursos binários essenciais protegidos. Não modifique os arquivos de imagem para garantir a consistência da experiência visual.
</p>

<p align="center">
  Desenvolvido com 💜 por <strong>Gil Lemos</strong>
</p>
