# 🔄 Fluxo de Dados: Banco → API → Frontend

## 📊 Arquitetura de Dados

A API de tracking **NÃO cria dados fictícios**. Ela funciona assim:

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  Frontend   │────▶│  API (POST)  │────▶│  PostgreSQL    │
│   (SDK)     │     │  /events     │     │  user_events   │
└─────────────┘     └──────────────┘     └────────────────┘
                                                   │
                                                   │ Dados reais
                                                   ▼
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  Frontend   │◄────│  API (GET)   │◄────│  PostgreSQL    │
│  Dashboard  │     │  /analytics  │     │  Queries       │
└─────────────┘     └──────────────┘     └────────────────┘
```

## 📝 Fluxo Completo

### 1️⃣ **Captura de Eventos (SDK → API → Banco)**

**Frontend envia evento:**
```javascript
MoneyFlow.track('transfer_completed', {
  amount: 150.50,
  currency: 'BRL',
  to_account: '****1234'
});
```

**API recebe e salva no banco:**
```javascript
// src/routes/eventRoutes.js
await db.query(
  `INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
   VALUES ($1, $2, $3, $4, $5)`,
  [event.event_id, event.user.user_id, event.event_type, event, timestamp]
);
```

**Banco armazena:**
```sql
-- Tabela: user_events
id                  | user_id  | event_type          | event_data (JSONB)      | created_at
--------------------|----------|---------------------|-------------------------|-------------------
uuid-123...         | uuid-abc | transfer_completed  | {"amount": 150.50, ...} | 2025-11-26 10:30:00
```

### 2️⃣ **Consulta de Dados (Banco → API → Frontend)**

**Frontend solicita dados:**
```javascript
fetch('http://localhost:3000/api/v1/analytics/events', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  console.log(data); // Dados REAIS do banco
});
```

**API consulta o banco:**
```javascript
// src/routes/analyticsRoutes.js
const result = await db.query(`
  SELECT id, event_type, event_data, created_at
  FROM user_events
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT 50
`, [userId]);

res.json({
  success: true,
  data: result.rows  // ← Dados REAIS do PostgreSQL
});
```

**PostgreSQL retorna dados reais:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "event_type": "transfer_completed",
      "event_data": {
        "amount": 150.50,
        "currency": "BRL"
      },
      "created_at": "2025-11-26T10:30:00.000Z"
    }
  ]
}
```

## 🎯 Endpoints de Analytics (Dados Reais do Banco)

### 1. `GET /api/v1/analytics/events`
**Retorna:** Lista de eventos do usuário (do banco)

**Query Parameters:**
- `limit` - Número de eventos (padrão: 50)
- `offset` - Paginação
- `event_type` - Filtrar por tipo
- `start_date` - Data inicial
- `end_date` - Data final

**Exemplo:**
```bash
curl -H "Authorization: Bearer $token" \
  "http://localhost:3000/api/v1/analytics/events?limit=10&event_type=login"
```

**Resposta (dados reais do banco):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "event_type": "login",
      "event_data": { "method": "email" },
      "created_at": "2025-11-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### 2. `GET /api/v1/analytics/summary`
**Retorna:** Resumo de eventos por tipo (do banco)

**SQL executado:**
```sql
SELECT 
  event_type,
  COUNT(*) as count,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM user_events
WHERE user_id = $1
GROUP BY event_type
ORDER BY count DESC;
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "event_type": "page_view",
      "count": "25",
      "first_event": "2025-11-20T10:00:00.000Z",
      "last_event": "2025-11-26T15:30:00.000Z"
    },
    {
      "event_type": "transfer_completed",
      "count": "8",
      "first_event": "2025-11-22T14:20:00.000Z",
      "last_event": "2025-11-26T12:15:00.000Z"
    }
  ]
}
```

### 3. `GET /api/v1/analytics/user-stats`
**Retorna:** Estatísticas completas do usuário (do banco)

**Consultas SQL executadas:**
1. Dados do usuário (`users`)
2. Total de eventos (`user_events`)
3. Último login (`user_events WHERE event_type = 'login'`)
4. Total de transações (`user_events WHERE event_type IN (...)`)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-abc",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "points": 3150,
      "level": "Prata",
      "streak_days": 12,
      "member_since": "2025-10-01T00:00:00.000Z"
    },
    "stats": {
      "total_events": 127,
      "last_login": "2025-11-26T09:00:00.000Z",
      "total_transactions": 15,
      "total_amount": 2450.75
    }
  }
}
```

### 4. `GET /api/v1/analytics/transactions`
**Retorna:** Eventos de transações financeiras (do banco)

**SQL executado:**
```sql
SELECT 
  id,
  event_type,
  event_data->'properties' as properties,
  created_at
FROM user_events
WHERE user_id = $1
  AND event_type IN ('transfer_completed', 'payment_completed', 'recharge_completed')
ORDER BY created_at DESC
LIMIT 50;
```

### 5. `GET /api/v1/analytics/timeline`
**Retorna:** Timeline de eventos por hora (do banco)

**SQL executado:**
```sql
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  event_type,
  COUNT(*) as count
FROM user_events
WHERE user_id = $1
  AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), event_type
ORDER BY hour DESC;
```

### 6. `GET /api/v1/analytics/heatmap`
**Retorna:** Atividade diária dos últimos 30 dias (do banco)

**SQL executado:**
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as events
FROM user_events
WHERE user_id = $1
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 💡 Integração com Demo HTML

Para usar os dados reais no HTML demo:

```javascript
// demo/script.js

async function loadUserStats() {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:3000/api/v1/analytics/user-stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Atualizar UI com dados REAIS do banco
    document.getElementById('userPoints').textContent = data.data.user.points;
    document.getElementById('userLevel').textContent = data.data.user.level;
    document.getElementById('userStreak').textContent = data.data.user.streak_days;
    document.getElementById('totalEvents').textContent = data.data.stats.total_events;
  }
}

async function loadTransactions() {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:3000/api/v1/analytics/transactions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Renderizar transações REAIS
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = data.data.map(tx => `
      <div class="transaction-item">
        <span>${tx.event_type}</span>
        <span>${tx.properties.amount}</span>
        <span>${new Date(tx.created_at).toLocaleDateString()}</span>
      </div>
    `).join('');
  }
}
```

## 🔄 Fluxo Completo de Exemplo

### Cenário: Usuário faz uma transferência

1. **Frontend (demo/index.html):**
   ```javascript
   // Usuário clica em "Transferir"
   function realizarTransferencia(valor, destino) {
     // ... lógica de transferência ...
     
     // Rastrear evento
     MoneyFlow.track('transfer_completed', {
       amount: valor,
       to_account: destino,
       currency: 'BRL'
     });
   }
   ```

2. **SDK (moneyflow-tracking.js):**
   ```javascript
   // SDK envia para API
   fetch('http://localhost:3000/api/v1/events', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${accessToken}`
     },
     body: JSON.stringify(event)
   });
   ```

3. **API (eventRoutes.js):**
   ```javascript
   // API valida e salva no banco
   await db.query(
     `INSERT INTO user_events (...)
      VALUES (...)`,
     [event_id, user_id, 'transfer_completed', event_data, timestamp]
   );
   ```

4. **PostgreSQL:**
   ```sql
   -- Banco armazena o evento
   INSERT INTO user_events VALUES (
     'uuid-123',
     'uuid-abc',
     'transfer_completed',
     '{"amount": 150.50, "to_account": "****1234"}'::jsonb,
     '2025-11-26 10:30:00'
   );
   ```

5. **Dashboard (demo/index.html):**
   ```javascript
   // Dashboard consulta eventos REAIS
   async function atualizarDashboard() {
     const stats = await fetch('/api/v1/analytics/user-stats', {...});
     const transactions = await fetch('/api/v1/analytics/transactions', {...});
     
     // Exibe dados REAIS do banco
     renderizarGraficos(stats.data);
     renderizarTransacoes(transactions.data);
   }
   ```

## ✅ Resumo

| Componente | Fonte dos Dados |
|------------|-----------------|
| **SDK** | Captura eventos do usuário |
| **API /events** | Salva no PostgreSQL |
| **PostgreSQL** | Armazena dados reais |
| **API /analytics** | Consulta PostgreSQL |
| **Dashboard** | Exibe dados do banco |

**Nenhum dado é fictício!** Tudo vem do banco de dados PostgreSQL.

---

**📌 Importante:** Para ter dados reais, você precisa:
1. ✅ PostgreSQL configurado
2. ✅ Tabela `user_events` criada
3. ✅ Usuário logado (JWT token)
4. ✅ Eventos sendo enviados pelo SDK

Depois disso, todos os endpoints `/analytics/*` retornarão **dados reais do banco**!
