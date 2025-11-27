# 🚀 Quick Start - MoneyFlow Event Tracking API

Guia rápido para rodar a API em **5 minutos**!

## ⚡ Início Rápido

### Pré-requisitos

✅ Node.js 20+ LTS (você já tem instalado)  
✅ PostgreSQL 12+ (instalar se necessário)  
✅ Docker Desktop (opcional, mas recomendado)

---

## 📦 Opção 1: Com Docker (Recomendado)

### Passo 1: Instalar Dependências

```powershell
cd C:\Users\USER\OneDrive\Desktop\hackathon\backend
npm install
```

### Passo 2: Iniciar Kafka e PostgreSQL

```powershell
docker-compose up -d
```

Isso irá iniciar:
- 🐘 **PostgreSQL** na porta 5432
- 📨 **Kafka** na porta 9092
- 📊 **Kafka UI** na porta 8080

### Passo 3: Criar Tabela de Eventos

```powershell
# Aguardar 10 segundos para PostgreSQL ficar pronto
Start-Sleep -Seconds 10

# Criar tabela user_events
psql -h localhost -U postgres -d moneyflow -f ..\database\user_events.sql
# Senha: postgres123
```

### Passo 4: Iniciar API

```powershell
npm run dev
```

✅ **API rodando em:** `http://localhost:3000`

### Passo 5: Testar

Abra no navegador: `http://localhost:3000/test.html`

---

## 🔧 Opção 2: Sem Docker (Kafka Local)

### Passo 1: Instalar PostgreSQL

1. Download: https://www.postgresql.org/download/windows/
2. Instalar com senha: `postgres123`
3. Criar banco:

```powershell
psql -U postgres
CREATE DATABASE moneyflow;
\c moneyflow
\i C:/Users/USER/OneDrive/Desktop/hackathon/database/schema.sql
\i C:/Users/USER/OneDrive/Desktop/hackathon/database/user_events.sql
\q
```

### Passo 2: Instalar Kafka (Opcional)

Se não quiser usar Kafka, a API continuará funcionando (eventos não serão enviados para streaming, mas serão salvos no PostgreSQL se forem críticos).

**Download Kafka:**
https://kafka.apache.org/downloads

**Extrair e iniciar:**

```powershell
# Iniciar Zookeeper
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties

# Iniciar Kafka (novo terminal)
.\bin\windows\kafka-server-start.bat .\config\server.properties
```

### Passo 3: Instalar Dependências e Iniciar

```powershell
cd C:\Users\USER\OneDrive\Desktop\hackathon\backend
npm install
npm run dev
```

---

## 🧪 Testar a API

### 1. Health Check

```powershell
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-26T...",
  "uptime": 1.234,
  "version": "v1"
}
```

### 2. Login

```powershell
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid...",
    "email": "joao@exemplo.com",
    "name": "João Silva"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "15m"
  }
}
```

### 3. Enviar Evento

```powershell
# Copiar o accessToken do login acima
$token = "eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:3000/api/v1/events `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_type": "page_view",
    "timestamp": "2025-11-26T10:30:00.000Z",
    "user": {
      "device_id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "session": {
      "session_id": "987fcdeb-51a2-43f7-9abc-123456789012",
      "seq": 1
    },
    "properties": {
      "page": "dashboard"
    }
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Event accepted",
  "event_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 🎨 Test Page Interativa

Abra no navegador:

```
http://localhost:3000/test.html
```

### Funcionalidades:

- ✅ Login com email/senha
- ✅ Enviar eventos com 1 clique
- ✅ Ver logs em tempo real
- ✅ Estatísticas de eventos
- ✅ Teste de erro
- ✅ Flush manual da fila

**Credenciais de teste:**
- Email: `joao@exemplo.com`
- Senha: `senha123`

---

## 🔍 Verificar Eventos no Banco

```powershell
psql -h localhost -U postgres -d moneyflow
```

```sql
-- Ver todos os eventos
SELECT * FROM user_events ORDER BY created_at DESC LIMIT 10;

-- Contar eventos por tipo
SELECT event_type, COUNT(*) 
FROM user_events 
GROUP BY event_type 
ORDER BY COUNT(*) DESC;

-- Ver eventos de um usuário específico
SELECT event_type, created_at, event_data->>'properties' as properties
FROM user_events
WHERE user_id = 'uuid_do_usuario'
ORDER BY created_at DESC;
```

---

## 📊 Kafka UI (Se usar Docker)

Abra no navegador:

```
http://localhost:8080
```

Você verá:
- ✅ Topics: `events`, `events-errors`
- ✅ Messages em tempo real
- ✅ Consumer groups
- ✅ Brokers status

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
```powershell
# Verificar se PostgreSQL está rodando
Get-Service -Name postgresql*

# Ou se usando Docker
docker ps
```

### Erro: "Kafka producer not available"

**Solução 1 (Docker):**
```powershell
# Verificar containers
docker ps

# Reiniciar Kafka
docker-compose restart kafka
```

**Solução 2 (Sem Kafka):**
A API continuará funcionando. Eventos críticos serão salvos no PostgreSQL.

### Erro: "Port 3000 already in use"

**Solução:**
```powershell
# Alterar porta no .env
# PORT=3001

# Ou matar processo na porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

---

## 📝 Logs

Ver logs em tempo real:

```powershell
# Logs gerais
Get-Content logs\app.log -Wait

# Apenas erros
Get-Content logs\error.log -Wait
```

---

## 🎯 Próximos Passos

1. ✅ API rodando
2. ✅ Eventos sendo enviados
3. ✅ Banco salvando eventos críticos
4. 🚀 Integrar SDK no HTML demo:

```html
<!-- No demo/index.html -->
<script src="http://localhost:3000/moneyflow-tracking.js"></script>
<script>
  MoneyFlow.initTracking({
    apiUrl: 'http://localhost:3000/api/v1',
    debug: true
  });
  
  // Após login
  MoneyFlow.setUserId(usuario.id);
  MoneyFlow.setAccessToken(tokens.accessToken);
</script>
```

5. 📊 Criar consumer Kafka para analytics
6. 🤖 Implementar ML para detecção de padrões

---

## 🆘 Precisa de Ajuda?

### Documentação Completa

- 📖 `README.md` - Documentação completa da API
- 🏗️ `ARQUITETURA.md` - Arquitetura do sistema
- 🔗 `INTEGRACAO_BANCO.md` - Integração com PostgreSQL
- 📊 `../database/CONSULTAS.md` - Consultas SQL úteis

### Comandos Úteis

```powershell
# Parar containers Docker
docker-compose down

# Ver logs de container específico
docker logs moneyflow-kafka -f

# Resetar tudo (CUIDADO: apaga dados)
docker-compose down -v
```

---

## ✅ Checklist de Sucesso

- [ ] Node.js 20+ instalado
- [ ] Docker Desktop rodando (opcional)
- [ ] `npm install` executado
- [ ] PostgreSQL rodando (porta 5432)
- [ ] Kafka rodando (porta 9092) - opcional
- [ ] API rodando (porta 3000)
- [ ] `/health` retorna status healthy
- [ ] Login funciona
- [ ] Eventos são aceitos (202 status)
- [ ] Test page abre corretamente
- [ ] Eventos aparecem no banco

---

**Dica:** Use o script automatizado `start.ps1` para iniciar tudo de uma vez! 🚀

```powershell
.\start.ps1
```

---

**Boa sorte no Hackathon FMU 2025.2!** 🏆🎉
