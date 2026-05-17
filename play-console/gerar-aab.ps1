# Script PowerShell para geração do AAB da 5Task
# Execute com: .\gerar-aab.ps1 -KeyPassword "SUA_SENHA"

param(
    [Parameter(Mandatory=$true)]
    [string]$KeyPassword,
    
    [string]$VersionCode = "540",
    [string]$VersionName = "5.4.0"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  5Task - Gerador de AAB para Play Console" -ForegroundColor Cyan  
Write-Host "  Versão $VersionName (código $VersionCode)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório
Set-Location $ScriptDir

# Verificar pré-requisitos
Write-Host "🔍 Verificando pré-requisitos..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js não encontrado. Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "  ✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Java não encontrado. Instale em: https://adoptium.net" -ForegroundColor Red
    exit 1
}

try {
    $bubblewrapVersion = bubblewrap --version
    Write-Host "  ✅ Bubblewrap: $bubblewrapVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Bubblewrap não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g @bubblewrap/cli
    Write-Host "  ✅ Bubblewrap instalado com sucesso!" -ForegroundColor Green
}

Write-Host ""

# Verificar keystore
$keystorePath = Join-Path $ScriptDir "android.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "🔑 Keystore não encontrado. Gerando novo..." -ForegroundColor Yellow
    
    keytool -genkey -v `
        -keystore $keystorePath `
        -alias 5task `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -dname "CN=5Task, OU=Dev, O=5Task App, L=Brasil, ST=SP, C=BR" `
        -storepass $KeyPassword `
        -keypass $KeyPassword
    
    Write-Host "  ✅ Keystore gerado: $keystorePath" -ForegroundColor Green
    Write-Host ""
    Write-Host "  ⚠️  IMPORTANTE: Faça backup do arquivo android.keystore!" -ForegroundColor Red
    Write-Host "  ⚠️  Sem ele, não poderá atualizar o app na Play Store!" -ForegroundColor Red
} else {
    Write-Host "🔑 Keystore existente encontrado: $keystorePath" -ForegroundColor Green
}

Write-Host ""

# Extrair SHA-256 do keystore
Write-Host "📋 Extraindo SHA-256 para assetlinks.json..." -ForegroundColor Yellow
$keytoolOutput = keytool -list -v `
    -keystore $keystorePath `
    -alias 5task `
    -storepass $KeyPassword 2>&1

$sha256Line = $keytoolOutput | Select-String "SHA256:" | Select-Object -First 1
if ($sha256Line) {
    $sha256 = ($sha256Line -replace ".*SHA256:\s*", "").Trim()
    Write-Host "  ✅ SHA-256: $sha256" -ForegroundColor Green
    
    # Salvar SHA-256 em arquivo para referência
    $sha256 | Out-File -FilePath (Join-Path $ScriptDir "sha256.txt") -Encoding UTF8
    Write-Host "  💾 Salvo em: sha256.txt" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Não foi possível extrair SHA-256. Verifique a senha." -ForegroundColor Yellow
}

Write-Host ""

# Verificar se projeto já foi inicializado
$gradleFile = Join-Path $ScriptDir "build.gradle"
if (-not (Test-Path $gradleFile)) {
    Write-Host "🏗️  Inicializando projeto Bubblewrap..." -ForegroundColor Yellow
    Write-Host "    (Responda às perguntas com os valores abaixo)" -ForegroundColor Gray
    Write-Host "    Package ID: com.fivetask.quantum.app" -ForegroundColor Gray
    Write-Host "    Version Code: $VersionCode" -ForegroundColor Gray
    Write-Host "    Version Name: $VersionName" -ForegroundColor Gray
    Write-Host "    Key path: ./android.keystore" -ForegroundColor Gray
    Write-Host "    Key alias: 5task" -ForegroundColor Gray
    Write-Host ""
    
    bubblewrap init --manifest="https://5taskprocrastinacaozero.vercel.app/manifest.json"
} else {
    Write-Host "🏗️  Projeto já inicializado (build.gradle encontrado)." -ForegroundColor Green
    
    # Atualizar versão no build.gradle
    Write-Host "    Atualizando versão para $VersionName ($VersionCode)..." -ForegroundColor Gray
    $buildGradle = Get-Content $gradleFile
    $buildGradle = $buildGradle -replace 'versionCode \d+', "versionCode $VersionCode"
    $buildGradle = $buildGradle -replace 'versionName "[^"]*"', "versionName `"$VersionName`""
    $buildGradle | Set-Content $gradleFile -Encoding UTF8
    Write-Host "    ✅ Versão atualizada no build.gradle" -ForegroundColor Green
}

Write-Host ""

# Build
Write-Host "📦 Gerando AAB release..." -ForegroundColor Yellow
Write-Host "    Isso pode levar alguns minutos..." -ForegroundColor Gray
Write-Host ""

$env:KEYSTORE_PASSWORD = $KeyPassword
$env:KEY_PASSWORD = $KeyPassword

bubblewrap build --release

Write-Host ""

# Verificar arquivo gerado
$aabFiles = Get-ChildItem -Path $ScriptDir -Filter "*.aab" -Recurse
if ($aabFiles) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ AAB GERADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    foreach ($aab in $aabFiles) {
        $sizeMB = [math]::Round($aab.Length / 1MB, 2)
        Write-Host ""
        Write-Host "  📁 Arquivo: $($aab.FullName)" -ForegroundColor White
        Write-Host "  📏 Tamanho: $sizeMB MB" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "  🚀 Próximo passo: Faça upload no Play Console!" -ForegroundColor Cyan
    Write-Host "  🔗 https://play.google.com/console" -ForegroundColor Cyan
} else {
    Write-Host "  ❌ Arquivo AAB não encontrado. Verifique os erros acima." -ForegroundColor Red
}

Write-Host ""
