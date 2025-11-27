# 🚀 Início Rápido SEM Docker

## Modo Standalone (Apenas PostgreSQL)

Vamos rodar a API **sem precisar de Kafka ou Docker**, apenas com PostgreSQL!

### ✅ Passo 1: Instalar PostgreSQL

Se ainda não tem PostgreSQL instalado:

**Download:** https://www.postgresql.org/download/windows/

**Durante instalação:**
- Senha do postgres: `postgres123`
- Porta: `5432` (padrão)

### ✅ Passo 2: Criar Banco de Dados

```powershell
# Abrir psql
psql -U postgres

# Criar banco
CREATE DATABASE moneyflow;

# Conectar ao banco
\c moneyflow

# Executar schema principal
\i 'C:/Users/USER/OneDrive/Desktop/hackathon/database/schema.sql'

# Criar tabela de eventos
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_id UNIQUE (id)
);

CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at DESC);

# Sair
\q
```

### ✅ Passo 3: Instalar Dependências da API

```powershell
cd C:\Users\USER\OneDrive\Desktop\hackathon\backend
npm install
```

### ✅ Passo 4: Iniciar API (Modo Standalone)

```powershell
npm run dev
```

Você verá:

```
════════════════════════════════════════════════════════
🚀 MoneyFlow Event Tracking API
════════════════════════════════════════════════════════
📡 API: http://localhost:3000
🧪 Test Page: http://localhost:3000/test.html
❤️ Health: http://localhost:3000/health
📊 Mode: Standalone (PostgreSQL only)
════════════════════════════════════════════════════════
```

### ✅ Passo 5: Testar

Abra no navegador: **http://localhost:3000/test.html**

**Credenciais:**
- Email: `joao@exemplo.com`
- Senha: `senha123`

---

## 🧪 Testar API via PowerShell

### Health Check

```powershell
curl http://localhost:3000/health
```

### Login

```powershell
$body = @{
    email = "joao@exemplo.com"
    password = "senha123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response
$token = $response.tokens.accessToken
```

### Enviar Evento

```powershell
$event = @{
    event_id = [guid]::NewGuid().ToString()
    event_type = "page_view"
    timestamp = (Get-Date).ToUniversalTime().ToString("o")
    user = @{
        device_id = [guid]::NewGuid().ToString()
    }
    session = @{
        session_id = [guid]::NewGuid().ToString()
        seq = 1
    }
    properties = @{
        page = "test"
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/events" `
    -Method POST `
    -Body $event `
    -ContentType "application/json" `
    -Headers @{Authorization = "Bearer $token"}
```

---

## 📊 Verificar Eventos no Banco

```powershell
psql -U postgres -d moneyflow
```

```sql
-- Ver todos eventos
SELECT event_type, created_at, event_data->>'properties' as properties
FROM user_events
ORDER BY created_at DESC
LIMIT 10;

-- Contar por tipo
SELECT event_type, COUNT(*) 
FROM user_events 
GROUP BY event_type;
```

---

## 🎯 Diferenças: Standalone vs Completo

| Feature | Standalone | Com Kafka |
|---------|-----------|-----------|
| PostgreSQL | ✅ Sim | ✅ Sim |
| Kafka | ❌ Não | ✅ Sim |
| Eventos no DB | ✅ Todos | ⚠️ Só críticos |
| Docker | ❌ Não precisa | ✅ Precisa |
| Streaming | ❌ Não | ✅ Sim |
| Analytics RT | ❌ Não | ✅ Sim |

**Vantagem do Standalone:** Mais simples, não precisa Docker, perfeito para desenvolvimento e demos!

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to database"

```powershell
# Verificar se PostgreSQL está rodando
Get-Service -Name postgresql*

# Se não estiver, iniciar
Start-Service postgresql-x64-15
```

### Erro: "Port 3000 already in use"

```powershell
# Encontrar processo
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Matar processo
Stop-Process -Id <PID> -Force
```

### Erro: "User joao@exemplo.com not found"

Você precisa executar o schema SQL primeiro que cria o usuário de teste.

---

## ✅ Pronto!

Sua API está rodando em **modo standalone** (PostgreSQL only). Todos os eventos serão salvos diretamente no banco de dados.

**Próximo passo:** Integrar o SDK no HTML demo! 🎉
