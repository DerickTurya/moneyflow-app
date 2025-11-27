# Inicia todos os serviços necessários (Kafka, PostgreSQL, API)
Write-Host "🚀 Iniciando MoneyFlow API..." -ForegroundColor Green

# Verificar se Node.js está instalado
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado. Por favor, instale Node.js 20+ LTS" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $nodeVersion detectado" -ForegroundColor Green

# Verificar se Docker está instalado
$dockerVersion = docker --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Docker não encontrado. Kafka será iniciado localmente (se disponível)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Docker detectado: $dockerVersion" -ForegroundColor Green
    
    # Iniciar Docker Compose
    Write-Host "📦 Iniciando containers (Kafka, PostgreSQL, Kafka UI)..." -ForegroundColor Cyan
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Containers iniciados com sucesso" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Kafka UI: http://localhost:8080" -ForegroundColor Yellow
        Write-Host "🐘 PostgreSQL: localhost:5432" -ForegroundColor Yellow
        Write-Host "📨 Kafka: localhost:9092" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "❌ Erro ao iniciar containers" -ForegroundColor Red
        exit 1
    }
}

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️ Arquivo .env não encontrado. Copiando de .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Arquivo .env criado. Por favor, configure suas credenciais." -ForegroundColor Green
}

# Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências instaladas com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
        exit 1
    }
}

# Criar diretório de logs
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "✅ Diretório de logs criado" -ForegroundColor Green
}

# Aguardar Kafka e PostgreSQL ficarem prontos
Write-Host "⏳ Aguardando serviços ficarem prontos..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Iniciar API
Write-Host ""
Write-Host "🚀 Iniciando MoneyFlow API na porta 3000..." -ForegroundColor Green
Write-Host ""
Write-Host "📡 Endpoints disponíveis:" -ForegroundColor Cyan
Write-Host "  - http://localhost:3000/health" -ForegroundColor White
Write-Host "  - http://localhost:3000/api/v1/events" -ForegroundColor White
Write-Host "  - http://localhost:3000/api/v1/auth/login" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test Page: public/test.html" -ForegroundColor Cyan
Write-Host ""

npm run dev
