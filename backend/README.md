# MoneyFlow Event Tracking API 🚀

Sistema completo de rastreamento de eventos com Kafka, autenticação JWT e SDK JavaScript profissional.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [API Endpoints](#api-endpoints)
- [SDK Frontend](#sdk-frontend)
- [Segurança](#segurança)
- [Kafka](#kafka)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes)

## 🏗️ Arquitetura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │─────▶│  Express API │─────▶│    Kafka    │
│   (SDK JS)  │      │   + JWT Auth │      │   Producer  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                       │
                            ▼                       ▼
                     ┌──────────────┐        ┌───────────┐
                     │  PostgreSQL  │        │ Consumers │
                     │   (Backup)   │        │ (Future)  │
                     └──────────────┘        └───────────┘
```

### Componentes

1. **SDK Frontend** (`moneyflow-tracking.js`)
   - Tracking automático de eventos
   - Fila offline com localStorage
   - Retry com exponential backoff
   - Batch de eventos
   - Suporte a sendBeacon

2. **API Collector** (`src/server.js`)
   - Express.js com TypeScript-ready
   - Validação com Joi
   - Rate limiting por IP e usuário
   - JWT authentication
   - CORS seguro
   - Sanitização de PII

3. **Kafka Producer** (`src/config/kafka.js`)
   - KafkaJS profissional
   - Reconnection automática
   - Compressão GZIP
   - Error handling
   - Topic de fallback para erros

4. **PostgreSQL** (`database/schema.sql`)
   - Backup de eventos críticos
   - Tabela `user_events` com JSONB
   - Idempotência por event_id

## 🚀 Instalação

### Pré-requisitos

- Node.js 20+ LTS ✅ (já instalado)
- PostgreSQL 12+
- Kafka 2.8+ (ou Docker)

### Passo 1: Instalar Dependências

```powershell
cd backend
npm install
```

### Passo 2: Configurar Banco de Dados

```powershell
# Criar banco de dados
psql -U postgres
CREATE DATABASE moneyflow;
\c moneyflow

# Executar schema
\i database/schema.sql

# Criar tabela de eventos
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_id UNIQUE (id)
);

CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at DESC);
```

### Passo 3: Instalar Kafka com Docker

```powershell
# Criar docker-compose.yml
docker-compose up -d
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
```

### Passo 4: Configurar Variáveis de Ambiente

```powershell
# Copiar .env.example para .env
cp .env.example .env

# Editar .env com suas credenciais
notepad .env
```

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moneyflow
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=sua_chave_secreta_jwt_super_segura
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=sua_chave_refresh_token
JWT_REFRESH_EXPIRES_IN=7d

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=moneyflow-api
KAFKA_TOPIC_EVENTS=events
KAFKA_TOPIC_ERRORS=events-errors

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:5500
CORS_CREDENTIALS=true

# Security
SANITIZE_PII=true
```

## 📡 API Endpoints

### Autenticação

#### POST `/api/v1/auth/login`

Login de usuário.

**Request:**
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
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

#### POST `/api/v1/auth/refresh`

Renovar access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### GET `/api/v1/auth/me`

Obter dados do usuário autenticado (requer JWT).

**Headers:**
```
Authorization: Bearer <access_token>
```

### Eventos

#### POST `/api/v1/events`

Enviar evento único.

**Request:**
```json
{
  "event_id": "uuid",
  "event_type": "transfer_initiated",
  "timestamp": "2025-11-26T10:30:00.000Z",
  "user": {
    "user_id": "uuid",
    "device_id": "uuid"
  },
  "session": {
    "session_id": "uuid",
    "seq": 1
  },
  "context": {
    "url": "https://app.moneyflow.com/transfer",
    "user_agent": "Mozilla/5.0..."
  },
  "properties": {
    "amount": 150.50,
    "currency": "BRL",
    "to_account": "****1234"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event accepted",
  "event_id": "uuid"
}
```

#### POST `/api/v1/events/batch`

Enviar múltiplos eventos.

**Request:**
```json
{
  "events": [
    { /* evento 1 */ },
    { /* evento 2 */ }
  ]
}
```

#### GET `/api/v1/events/types`

Listar tipos de eventos disponíveis.

**Response:**
```json
{
  "success": true,
  "event_types": [
    "page_view",
    "click",
    "form_submit",
    "login",
    "logout",
    "transfer_initiated",
    "transfer_completed",
    "payment_completed",
    "recharge_completed",
    "cashback_earned",
    "goal_created",
    "goal_completed",
    "achievement_unlocked",
    "budget_exceeded",
    "error",
    "heartbeat"
  ]
}
```

## 🎯 SDK Frontend

### Instalação

```html
<script src="https://cdn.moneyflow.com/tracking/v1/moneyflow-tracking.js"></script>
```

Ou localmente:

```html
<script src="/moneyflow-tracking.js"></script>
```

### Inicialização

```javascript
MoneyFlow.initTracking({
  apiUrl: 'http://localhost:3000/api/v1',
  batchSize: 10,
  batchTimeout: 5000,
  maxQueueSize: 1000,
  retryAttempts: 3,
  retryDelay: 1000,
  enableAutoTracking: true,
  enableOfflineQueue: true,
  debug: false
});
```

### Tracking Manual

```javascript
// Evento simples
MoneyFlow.track('page_view', {
  page: 'dashboard',
  section: 'overview'
});

// Evento de transferência
MoneyFlow.track('transfer_initiated', {
  amount: 150.50,
  currency: 'BRL',
  to_account: '****1234',
  transfer_type: 'pix'
});

// Evento de cashback
MoneyFlow.track('cashback_earned', {
  amount: 5.50,
  partner: 'iFood',
  percentage: 5
});
```

### Autenticação

```javascript
// Após login
MoneyFlow.setUserId(user.id);
MoneyFlow.setAccessToken(tokens.accessToken);

// Após logout
MoneyFlow.clearUser();
```

### Flush Manual

```javascript
// Enviar todos os eventos da fila imediatamente
MoneyFlow.flushQueue()
  .then(() => console.log('Queue flushed'))
  .catch(err => console.error('Flush failed', err));
```

### Auto-Tracking

O SDK automaticamente rastreia:

- ✅ **page_view** - Ao carregar a página
- ✅ **click** - Cliques em links, botões e elementos com `data-track`
- ✅ **form_submit** - Submissões de formulários
- ✅ **error** - Erros JavaScript e promise rejections
- ✅ **heartbeat** - A cada 60 segundos

## 🔒 Segurança

### Sanitização de PII

O sistema automaticamente sanitiza dados sensíveis:

- **CPF**: `123.456.789-01` → `***.***. ***-01`
- **Email**: `joao@exemplo.com` → `j***@exemplo.com`
- **Telefone**: `(11) 99999-9999` → `(**) ****-****`
- **Senha**: Removida completamente
- **Token**: Removido completamente

### Rate Limiting

- **Eventos**: 100 req/min por IP ou usuário
- **Autenticação**: 5 req/15min por IP

### Idempotência

Eventos duplicados (mesmo `event_id`) são automaticamente detectados e ignorados por 5 minutos.

### JWT

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- **Algorithm**: HS256
- **Issuer**: moneyflow-api
- **Audience**: moneyflow-client

### CORS

Apenas origens configuradas em `CORS_ORIGIN` podem acessar a API.

### HTTPS

**⚠️ Em produção, SEMPRE use HTTPS (TLS obrigatório)**

## 📊 Kafka

### Tópicos

- `events` - Eventos válidos
- `events-errors` - Eventos com erro de processamento

### Schema do Evento

```javascript
{
  event_id: "uuid",
  event_type: "string",
  timestamp: "ISO 8601",
  server_timestamp: "ISO 8601",
  user: {
    user_id: "uuid?",
    device_id: "uuid"
  },
  session: {
    session_id: "uuid",
    seq: number
  },
  context: {
    url: "string",
    referrer: "string",
    ip: "string",
    user_agent: "string",
    screen_width: number,
    screen_height: number,
    viewport_width: number,
    viewport_height: number,
    timezone: "string",
    locale: "string"
  },
  properties: {},
  version: "1.0.0"
}
```

### Consumer (Exemplo Futuro)

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'moneyflow-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'analytics' });

await consumer.connect();
await consumer.subscribe({ topic: 'events' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    console.log('Event received:', event);
    
    // Processar evento (analytics, ML, etc.)
  }
});
```

## 🗄️ Banco de Dados

### Tabela `user_events`

```sql
CREATE TABLE user_events (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Consultas Úteis

```sql
-- Eventos de um usuário específico
SELECT * FROM user_events 
WHERE user_id = 'uuid' 
ORDER BY created_at DESC 
LIMIT 100;

-- Contar eventos por tipo
SELECT event_type, COUNT(*) 
FROM user_events 
GROUP BY event_type 
ORDER BY COUNT(*) DESC;

-- Eventos das últimas 24 horas
SELECT * FROM user_events 
WHERE created_at >= NOW() - INTERVAL '24 hours';
```

## 🧪 Testes

### Testar API

```powershell
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"joao@exemplo.com","password":"senha123"}'

# Enviar evento
curl -X POST http://localhost:3000/api/v1/events `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <token>" `
  -d '{...}'
```

### Test Page

1. Abrir `backend/public/test.html` no navegador
2. Fazer login com `joao@exemplo.com` / `senha123`
3. Clicar nos botões para testar eventos
4. Verificar logs em tempo real

## 🚀 Executar

### Desenvolvimento

```powershell
cd backend
npm run dev
```

### Produção

```powershell
npm start
```

## 📝 Logs

Logs são salvos em:

- `logs/app.log` - Todos os logs
- `logs/error.log` - Apenas erros

## 🎯 Roadmap

- [ ] Consumer Kafka para analytics
- [ ] Dashboard de métricas em tempo real
- [ ] Machine Learning para detecção de anomalias
- [ ] Suporte a WebSocket para eventos em tempo real
- [ ] SDK para React Native
- [ ] SDK para Flutter
- [ ] Integração com BigQuery/Snowflake
- [ ] A/B testing framework

## 📄 Licença

MIT License - MoneyFlow Team

---

**Desenvolvido para Hackathon FMU 2025.2** 🏆
