# 🚀 Gerador de AAB para Play Console — sem PWABuilder

## O que esse processo faz
Usa o **Bubblewrap** (ferramenta oficial do Google Chrome Labs) para gerar um 
Android App Bundle (.aab) da sua PWA, pronto para subir no Play Console.

---

## ✅ Pré-requisitos (instalar uma vez)

### 1. Java JDK 11+
Baixe em: https://adoptium.net/
Verifique: `java -version`

### 2. Android SDK Command Line Tools
Baixe em: https://developer.android.com/studio#command-tools
Extraia em: `C:\Android\sdk`

### 3. Node.js 18+
Baixe em: https://nodejs.org (já deve estar instalado)

### 4. Bubblewrap CLI (instalar globalmente)
```powershell
npm install -g @bubblewrap/cli
```

---

## 🔑 Passo 1 — Gerar o Keystore (PRIMEIRA VEZ APENAS)

⚠️ **GUARDE este arquivo e as senhas em local seguro.** Se perder, não poderá atualizar o app na Play Store.

```powershell
cd D:\_Meus_APPS\5task\play-console

keytool -genkey -v `
  -keystore android.keystore `
  -alias 5task `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000 `
  -dname "CN=5Task, OU=Dev, O=5Task, L=Brasil, ST=SP, C=BR" `
  -storepass SUA_SENHA_AQUI `
  -keypass SUA_SENHA_AQUI
```

> Substitua `SUA_SENHA_AQUI` por uma senha forte e anote-a.

---

## 🏗️ Passo 2 — Inicializar o projeto Bubblewrap

```powershell
cd D:\_Meus_APPS\5task\play-console

bubblewrap init --manifest="https://5taskprocrastinacaozero.vercel.app/manifest.json"
```

Quando solicitado:
- **Package ID:** `com.fivetask.quantum.app`
- **App version code:** `540`
- **App version name:** `5.4.0`
- **Key path:** `./android.keystore`
- **Key alias:** `5task`
- **Key password:** (a senha que você criou)

---

## 📦 Passo 3 — Gerar o AAB (release)

```powershell
cd D:\_Meus_APPS\5task\play-console

bubblewrap build --release
```

O arquivo gerado ficará em:
`D:\_Meus_APPS\5task\play-console\app-release-bundle.aab`

---

## 🛡️ Passo 4 — Extrair a SHA-256 para o assetlinks.json

```powershell
keytool -list -v `
  -keystore D:\_Meus_APPS\5task\play-console\android.keystore `
  -alias 5task `
  -storepass SUA_SENHA_AQUI
```

Copie o valor **SHA-256** e atualize o arquivo:
`D:\_Meus_APPS\5task\public\.well-known\assetlinks.json`

---

## 📤 Passo 5 — Upload no Play Console

1. Acesse: https://play.google.com/console
2. Vá em **Teste Fechado (Internal Testing / Alpha)**
3. Clique em **Criar nova versão**
4. Faça upload do arquivo `app-release-bundle.aab`
5. Preencha as notas da versão: *"Versão 5.4.0 — Sistema de onboarding aprimorado, dicas contextuais Einstein, tarefas recorrentes melhoradas"*
6. Salve e envie para revisão

---

## 🔄 Para atualizações futuras

Apenas incremente `appVersionCode` (+1) e rode `bubblewrap build --release` novamente.

Versão atual: **540** → próxima: **541**

---

## ⚡ Script PowerShell automatizado

Execute `gerar-aab.ps1` na pasta `play-console` para automatizar os passos 2 e 3.
