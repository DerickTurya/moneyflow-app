# Modelagem do Banco de Dados - MoneyFlow

## Diagrama ER (Entidade-Relacionamento)

```
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ id (PK)            │
│ full_name          │
│ email (UNIQUE)     │
│ password_hash      │
│ cpf (UNIQUE)       │
│ phone              │
│ birth_date         │
│ profile_photo_url  │
│ points             │◄──────────────┐
│ level              │               │
│ streak_days        │               │
│ preferences (JSON) │               │
│ ai_settings (JSON) │               │
│ created_at         │               │
│ updated_at         │               │
└─────────────────────┘               │
         ▲                            │
         │                            │
         │ 1:N                        │
         │                            │
┌─────────────────────┐               │
│     ACCOUNTS        │               │
├─────────────────────┤               │
│ id (PK)            │               │
│ user_id (FK)       │───────────────┘
│ account_type       │
│ bank_name          │
│ account_number     │
│ balance            │
│ currency           │
│ is_primary         │
│ created_at         │
└─────────────────────┘
         ▲
         │ 1:N
         │
┌─────────────────────────────┐
│      TRANSACTIONS           │
├─────────────────────────────┤
│ id (PK)                    │
│ user_id (FK) ──────────────┼───► USERS
│ account_id (FK)            │
│ category_id (FK) ──────────┼───► CATEGORIES
│ description                │
│ amount                     │
│ type (income/expense)      │
│ transaction_date           │
│ payment_method             │
│ ai_confidence              │
│ ai_suggested_category (FK) │
│ is_recurring               │
│ tags (ARRAY)               │
│ metadata (JSON)            │
│ created_at                 │
└─────────────────────────────┘
         │
         │ N:1
         ▼
┌─────────────────────┐
│    CATEGORIES       │
├─────────────────────┤
│ id (PK)            │
│ name               │
│ slug (UNIQUE)      │
│ icon               │
│ color              │
│ type               │
│ is_system          │
└─────────────────────┘

┌─────────────────────┐        ┌──────────────────────┐
│      BUDGETS        │        │       GOALS          │
├─────────────────────┤        ├──────────────────────┤
│ id (PK)            │        │ id (PK)             │
│ user_id (FK) ──────┼───┐    │ user_id (FK) ───────┼───┐
│ category_id (FK)   │   │    │ title               │   │
│ name               │   │    │ description         │   │
│ amount             │   │    │ target_amount       │   │
│ period             │   │    │ current_amount      │   │
│ start_date         │   │    │ target_date         │   │
│ alert_threshold    │   │    │ priority            │   │
│ is_active          │   │    │ status              │   │
└─────────────────────┘   │    └──────────────────────┘   │
                          │                               │
                          └───────────────────────────────┼───► USERS
                                                          │
┌─────────────────────────┐                              │
│    ACHIEVEMENTS         │                              │
├─────────────────────────┤                              │
│ id (PK)                │                              │
│ name                   │                              │
│ description            │                              │
│ icon                   │                              │
│ points                 │                              │
│ tier                   │                              │
│ requirement_type       │                              │
│ requirement_value (JSON)│                             │
└─────────────────────────┘                              │
         ▲                                               │
         │ N:M                                           │
         │                                               │
┌─────────────────────────┐                              │
│  USER_ACHIEVEMENTS      │                              │
├─────────────────────────┤                              │
│ id (PK)                │                              │
│ user_id (FK) ──────────┼──────────────────────────────┘
│ achievement_id (FK)    │
│ unlocked_at            │
└─────────────────────────┘

┌─────────────────────┐        ┌──────────────────────┐
│     CASHBACK        │        │   NOTIFICATIONS      │
├─────────────────────┤        ├──────────────────────┤
│ id (PK)            │        │ id (PK)             │
│ user_id (FK) ──────┼───┐    │ user_id (FK) ───────┼───► USERS
│ transaction_id (FK)│   │    │ title               │
│ partner_name       │   │    │ message             │
│ amount             │   │    │ type                │
│ percentage         │   │    │ priority            │
│ status             │   │    │ is_read             │
│ expires_at         │   │    │ action_url          │
│ redeemed_at        │   │    │ metadata (JSON)     │
└─────────────────────┘   │    └──────────────────────┘
                          │
                          └───────────────────────────► USERS

┌─────────────────────────────┐
│       AI_INSIGHTS           │
├─────────────────────────────┤
│ id (PK)                    │
│ user_id (FK) ──────────────┼───► USERS
│ insight_type               │
│ title                      │
│ description                │
│ confidence                 │
│ priority                   │
│ data (JSON)                │
│ action_taken               │
│ valid_until                │
└─────────────────────────────┘

┌──────────────────────────────┐
│  RECURRING_TRANSACTIONS      │
├──────────────────────────────┤
│ id (PK)                     │
│ user_id (FK) ───────────────┼───► USERS
│ category_id (FK)            │
│ description                 │
│ amount                      │
│ frequency                   │
│ start_date                  │
│ next_occurrence             │
│ is_active                   │
│ auto_create                 │
└──────────────────────────────┘

┌──────────────────────────────┐
│         RECHARGES            │
├──────────────────────────────┤
│ id (PK)                     │
│ user_id (FK) ───────────────┼───► USERS
│ transaction_id (FK)         │
│ recharge_type               │
│ provider                    │
│ phone_number                │
│ amount                      │
│ bonus_amount                │
│ status                      │
└──────────────────────────────┘

┌──────────────────────────────┐
│  INTERNATIONAL_TRANSFERS     │
├──────────────────────────────┤
│ id (PK)                     │
│ user_id (FK) ───────────────┼───► USERS
│ transaction_id (FK)         │
│ from_currency               │
│ to_currency                 │
│ from_amount                 │
│ to_amount                   │
│ exchange_rate               │
│ recipient_name              │
│ recipient_country           │
│ fee                         │
│ status                      │
└──────────────────────────────┘
```

## Relacionamentos

### 1. Users (1:N)
- **ACCOUNTS**: Um usuário pode ter múltiplas contas
- **TRANSACTIONS**: Um usuário pode ter múltiplas transações
- **BUDGETS**: Um usuário pode ter múltiplos orçamentos
- **GOALS**: Um usuário pode ter múltiplas metas
- **CASHBACK**: Um usuário pode ter múltiplos cashbacks
- **NOTIFICATIONS**: Um usuário pode ter múltiplas notificações
- **AI_INSIGHTS**: Um usuário pode ter múltiplos insights

### 2. Categories (1:N)
- **TRANSACTIONS**: Uma categoria pode estar em múltiplas transações
- **BUDGETS**: Uma categoria pode ter múltiplos orçamentos

### 3. Achievements (N:M com Users)
- **USER_ACHIEVEMENTS**: Tabela de relacionamento

### 4. Transactions (N:1)
- **CASHBACK**: Pode gerar cashback
- **RECHARGES**: Pode ser uma recarga
- **INTERNATIONAL_TRANSFERS**: Pode ser uma transferência

## Índices Importantes

```sql
-- Performance em consultas de usuários
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);

-- Performance em transações
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- Performance em notificações
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Performance em gamificação
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
```

## Triggers e Funções

### 1. update_updated_at_column()
Atualiza automaticamente o campo `updated_at` quando um registro é modificado.

### 2. update_account_balance()
Atualiza o saldo da conta automaticamente quando:
- Uma transação é inserida
- Uma transação é atualizada
- Uma transação é deletada

### 3. award_points_for_transaction()
Adiciona 5 pontos ao usuário quando uma nova transação é criada.

## Views Úteis

### v_transactions_by_category
Agrupa transações por categoria e mês para análises.

### v_user_balance
Calcula o saldo total de todas as contas do usuário.

### v_user_cashback
Soma o cashback disponível por usuário.

### v_goals_progress
Calcula o progresso das metas financeiras.

## Tipos de Dados Especiais

### JSONB
Usado para armazenar dados flexíveis:
- `users.preferences`: Preferências do usuário
- `users.ai_settings`: Configurações de IA
- `transactions.metadata`: Metadados da transação
- `achievements.requirement_value`: Requisitos da conquista
- `ai_insights.data`: Dados do insight

### ARRAY
- `transactions.tags`: Tags da transação

## Constraints

### Check Constraints
- `account_type`: Apenas valores válidos
- `transaction.type`: income, expense, transfer
- `budget.period`: daily, weekly, monthly, yearly
- `notification.type`: info, warning, success, error, achievement, budget_alert

### Unique Constraints
- `users.email`: Email único
- `users.cpf`: CPF único
- `categories.slug`: Slug único
- `user_achievements(user_id, achievement_id)`: Conquista única por usuário

## Extensões PostgreSQL

### uuid-ossp
Gera UUIDs para IDs primários.

### pgcrypto
Criptografa senhas usando bcrypt.

## Escalabilidade

### Particionamento
Recomendado para a tabela `transactions` quando houver milhões de registros:
```sql
-- Particionamento por data (mensal)
CREATE TABLE transactions_2025_01 PARTITION OF transactions
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### Replicação
- Master-Slave para leitura
- Multi-Master para alta disponibilidade

## Backup

```bash
# Backup completo
pg_dump -U postgres moneyflow > backup.sql

# Backup apenas schema
pg_dump -U postgres --schema-only moneyflow > schema.sql

# Backup apenas dados
pg_dump -U postgres --data-only moneyflow > data.sql
```

## Segurança

1. **Criptografia de senhas**: bcrypt via pgcrypto
2. **SSL/TLS**: Conexões criptografadas
3. **Row-Level Security (RLS)**: Isolar dados por usuário
4. **Audit log**: Tabela de auditoria para alterações críticas
