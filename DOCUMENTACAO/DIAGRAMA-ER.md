# 🗄️ Diagrama Entidade-Relacionamento (E-R) - MoneyFlow

## 📋 Modelo Conceitual

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MODELO ENTIDADE-RELACIONAMENTO                  │
└─────────────────────────────────────────────────────────────────────┘

                           1          0..*
        ┌──────────┐    possui    ┌─────────────┐
        │          │──────────────>│             │
        │   USER   │               │ TRANSACTION │
        │          │<──────────────│             │
        └─────┬────┘    pertence   └──────┬──────┘
              │           1             │
              │ 1                       │
              │                         │
              │ tem                     │
              │                         │
              │ 1                       │
        ┌─────▼──────┐                 │
        │            │                 │
        │ GAMIFICA   │                 │
        │   TION     │                 │
        │            │                 │
        └─────┬──────┘                 │
              │ 1                      │
              │                        │
              │ possui                 │
              │                        │
              │ 0..*                   │
        ┌─────▼──────────┐             │
        │                │             │
        │  ACHIEVEMENT   │             │
        │                │             │
        └────────────────┘             │
                                       │
              ┌────────────────────────┘
              │
              │ 1
              │ categorizada_por
              │
              │ 1
        ┌─────▼──────┐
        │            │
        │  CATEGORY  │
        │            │
        └────────────┘


        ┌──────────┐    cria      ┌──────────────┐
        │          │──────────────>│              │
        │   USER   │      1        │ VIRTUAL_CARD │
        │          │<──────────────│              │
        └─────┬────┘    possui     └──────────────┘
              │           0..*
              │ 1
              │
              │ registra
              │
              │ 0..*
        ┌─────▼──────────┐
        │                │
        │   USER_EVENT   │
        │   (Tracking)   │
        │                │
        └────────────────┘
```

---

## 📊 Modelo Lógico

### Entidades e Atributos

#### 1. USER (Usuário)
```
USER
├── id: VARCHAR(36) [PK] - UUID único
├── email: VARCHAR(255) [UNIQUE, NOT NULL]
├── password: VARCHAR(255) [NOT NULL] - Hash bcrypt
├── full_name: VARCHAR(255) [NOT NULL]
├── cpf: VARCHAR(14) [UNIQUE]
├── phone: VARCHAR(20)
├── birthdate: DATE
├── profile_picture: TEXT - URL ou base64
├── created_at: TIMESTAMP [DEFAULT NOW()]
├── updated_at: TIMESTAMP [DEFAULT NOW()]
└── last_login: TIMESTAMP
```

#### 2. TRANSACTION (Transação)
```
TRANSACTION
├── id: VARCHAR(36) [PK] - UUID único
├── user_id: VARCHAR(36) [FK -> USER.id]
├── description: VARCHAR(255) [NOT NULL]
├── amount: DECIMAL(10,2) [NOT NULL]
├── type: ENUM('income', 'expense') [NOT NULL]
├── category: VARCHAR(50) [NOT NULL]
├── date: DATE [NOT NULL]
├── currency: VARCHAR(3) [DEFAULT 'BRL']
├── exchange_rate: DECIMAL(10,4) [DEFAULT 1.0000]
├── notes: TEXT
├── created_at: TIMESTAMP [DEFAULT NOW()]
└── updated_at: TIMESTAMP [DEFAULT NOW()]
```

#### 3. CATEGORY (Categoria)
```
CATEGORY
├── id: SERIAL [PK]
├── name: VARCHAR(50) [UNIQUE, NOT NULL]
├── icon: VARCHAR(10) - Emoji
├── color: VARCHAR(7) - Hex color
├── type: ENUM('income', 'expense') [NOT NULL]
└── description: TEXT
```

**Categorias Pré-definidas:**
- Alimentação (🛒, #e74c3c)
- Transporte (🚗, #3498db)
- Moradia (🏠, #9b59b6)
- Saúde (💊, #27ae60)
- Educação (📚, #e67e22)
- Lazer (🎬, #f39c12)
- Salário (💰, #00b894)
- Freelance (💼, #00cec9)
- Investimentos (📈, #00b894)

#### 4. GAMIFICATION (Gamificação)
```
GAMIFICATION
├── id: SERIAL [PK]
├── user_id: VARCHAR(36) [FK -> USER.id, UNIQUE]
├── points: INTEGER [DEFAULT 0]
├── level: VARCHAR(20) [DEFAULT 'Bronze']
├── streak: INTEGER [DEFAULT 0] - Dias consecutivos
├── last_action_date: DATE
├── total_logins: INTEGER [DEFAULT 0]
├── total_transactions: INTEGER [DEFAULT 0]
├── total_goals_completed: INTEGER [DEFAULT 0]
└── created_at: TIMESTAMP [DEFAULT NOW()]
```

**Níveis:**
- Bronze: 0-999 pontos
- Prata: 1000-2499 pontos
- Ouro: 2500-4999 pontos
- Platina: 5000-9999 pontos
- Diamante: 10000+ pontos

#### 5. ACHIEVEMENT (Conquista)
```
ACHIEVEMENT
├── id: SERIAL [PK]
├── user_id: VARCHAR(36) [FK -> USER.id]
├── achievement_type: VARCHAR(50) [NOT NULL]
├── title: VARCHAR(100) [NOT NULL]
├── description: TEXT
├── icon: VARCHAR(10) - Emoji
├── unlocked: BOOLEAN [DEFAULT FALSE]
├── unlocked_at: TIMESTAMP
└── progress: INTEGER [DEFAULT 0] - Percentual 0-100
```

**Conquistas Disponíveis:**
- Primeira Transação 🎯
- Poupador Iniciante 💰
- Sequência de 7 Dias 🔥
- Meta Atingida 🎯
- Nível Ouro 👑
- Orçamento Respeitado ✅
- Investidor Iniciante 📈
- 100 Transações 💯
- Economia de 1000 💵
- Cashback Master 🎁
- Controlador de Gastos 📊
- Planejador Financeiro 📅

#### 6. VIRTUAL_CARD (Cartão Virtual)
```
VIRTUAL_CARD
├── id: VARCHAR(36) [PK] - UUID único
├── user_id: VARCHAR(36) [FK -> USER.id]
├── card_number: VARCHAR(19) [NOT NULL] - 5269 XXXX XXXX XXXX
├── cvv: VARCHAR(3) [NOT NULL]
├── expiry: VARCHAR(5) [NOT NULL] - MM/YY
├── type: ENUM('virtual', 'physical') [DEFAULT 'virtual']
├── brand: VARCHAR(20) [DEFAULT 'Mastercard']
├── status: ENUM('active', 'blocked', 'expired') [DEFAULT 'active']
├── limit: DECIMAL(10,2) [DEFAULT 5000.00]
├── created_at: TIMESTAMP [DEFAULT NOW()]
└── blocked_at: TIMESTAMP
```

#### 7. USER_EVENT (Evento de Tracking)
```
USER_EVENT
├── id: SERIAL [PK]
├── user_id: VARCHAR(36) - ID do usuário (nullable para visitantes)
├── session_id: VARCHAR(100) - UUID da sessão
├── event_type: VARCHAR(50) [NOT NULL]
│   Tipos: login, logout, page_view, transaction_add,
│         transaction_edit, balance_view, chart_view,
│         goal_create, achievement_unlock, theme_change, etc.
├── event_data: JSONB - Dados adicionais do evento
│   Exemplo: {
│     "transaction_amount": 150.00,
│     "category": "food",
│     "theme": "dark"
│   }
├── ip_address: VARCHAR(45) - IPv4 ou IPv6
├── user_agent: TEXT - Browser info
├── referrer: TEXT - URL de origem
├── timestamp: TIMESTAMP [DEFAULT NOW()]
└── processed: BOOLEAN [DEFAULT FALSE]
```

#### 8. AI_RECOMMENDATION (Recomendação IA)
```
AI_RECOMMENDATION
├── id: SERIAL [PK]
├── user_id: VARCHAR(36) [FK -> USER.id]
├── recommendation_type: VARCHAR(50) [NOT NULL]
│   Tipos: saving_goal, investment, budget_alert, 
│           spending_pattern, category_limit
├── title: VARCHAR(255) [NOT NULL]
├── description: TEXT [NOT NULL]
├── priority: ENUM('low', 'medium', 'high') [DEFAULT 'medium']
├── action_url: VARCHAR(255) - Link para ação
├── status: ENUM('pending', 'accepted', 'dismissed') [DEFAULT 'pending']
├── created_at: TIMESTAMP [DEFAULT NOW()]
├── expires_at: TIMESTAMP
└── accepted_at: TIMESTAMP
```

#### 9. GOAL (Meta)
```
GOAL
├── id: VARCHAR(36) [PK] - UUID único
├── user_id: VARCHAR(36) [FK -> USER.id]
├── title: VARCHAR(255) [NOT NULL]
├── description: TEXT
├── target_amount: DECIMAL(10,2) [NOT NULL]
├── current_amount: DECIMAL(10,2) [DEFAULT 0.00]
├── deadline: DATE
├── category: VARCHAR(50)
├── status: ENUM('active', 'completed', 'failed') [DEFAULT 'active']
├── created_at: TIMESTAMP [DEFAULT NOW()]
├── completed_at: TIMESTAMP
└── progress_percentage: INTEGER [GENERATED] - Cálculo automático
```

---

## 🔗 Relacionamentos

### 1. USER ←→ TRANSACTION (1:N)
- **Tipo**: Um para Muitos
- **Cardinalidade**: Um usuário possui zero ou muitas transações
- **Chave Estrangeira**: `TRANSACTION.user_id` → `USER.id`
- **Constraint**: ON DELETE CASCADE (deletar user deleta todas transações)

### 2. USER ←→ GAMIFICATION (1:1)
- **Tipo**: Um para Um
- **Cardinalidade**: Um usuário tem exatamente um registro de gamificação
- **Chave Estrangeira**: `GAMIFICATION.user_id` → `USER.id`
- **Constraint**: UNIQUE(user_id)

### 3. USER ←→ ACHIEVEMENT (1:N)
- **Tipo**: Um para Muitos
- **Cardinalidade**: Um usuário pode ter várias conquistas
- **Chave Estrangeira**: `ACHIEVEMENT.user_id` → `USER.id`

### 4. USER ←→ VIRTUAL_CARD (1:N)
- **Tipo**: Um para Muitos
- **Cardinalidade**: Um usuário pode ter múltiplos cartões
- **Chave Estrangeira**: `VIRTUAL_CARD.user_id` → `USER.id`

### 5. USER ←→ USER_EVENT (1:N)
- **Tipo**: Um para Muitos
- **Cardinalidade**: Um usuário gera vários eventos
- **Chave Estrangeira**: `USER_EVENT.user_id` → `USER.id` (nullable)

### 6. TRANSACTION ←→ CATEGORY (N:1)
- **Tipo**: Muitos para Um
- **Cardinalidade**: Muitas transações pertencem a uma categoria
- **Relação**: Via campo `TRANSACTION.category` (string match)

### 7. USER ←→ AI_RECOMMENDATION (1:N)
- **Tipo**: Um para Muitos
- **Cardinalidade**: Um usuário recebe várias recomendações
- **Chave Estrangeira**: `AI_RECOMMENDATION.user_id` → `USER.id`

### 8. USER ←→ GOAL (1:N)
- **Tipo**: Um para Muitos
- **Cardinalidade**: Um usuário pode ter várias metas
- **Chave Estrangeira**: `GOAL.user_id` → `USER.id`

---

## 📈 Modelo Físico (PostgreSQL)

### Script de Criação Completo

```sql
-- ============================================
-- MONEYFLOW DATABASE - MODELO FÍSICO
-- PostgreSQL 17.2
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca textual

-- ============================================
-- TABELA: users
-- ============================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash bcrypt
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    phone VARCHAR(20),
    birthdate DATE,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT cpf_format CHECK (cpf ~* '^\d{3}\.\d{3}\.\d{3}-\d{2}$')
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);

-- ============================================
-- TABELA: categories
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(10) NOT NULL, -- Emoji
    color VARCHAR(7) NOT NULL, -- Hex color
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT
);

-- Inserir categorias padrão
INSERT INTO categories (name, icon, color, type) VALUES
('Alimentação', '🛒', '#e74c3c', 'expense'),
('Transporte', '🚗', '#3498db', 'expense'),
('Moradia', '🏠', '#9b59b6', 'expense'),
('Saúde', '💊', '#27ae60', 'expense'),
('Educação', '📚', '#e67e22', 'expense'),
('Lazer', '🎬', '#f39c12', 'expense'),
('Compras', '🛍️', '#e84393', 'expense'),
('Salário', '💰', '#00b894', 'income'),
('Freelance', '💼', '#00cec9', 'income'),
('Investimentos', '📈', '#00b894', 'income'),
('Cashback', '🎁', '#00b894', 'income'),
('Outros', '📌', '#95a5a6', 'expense');

-- ============================================
-- TABELA: transactions
-- ============================================
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Índices
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_type ON transactions(type);

-- ============================================
-- TABELA: gamification
-- ============================================
CREATE TABLE gamification (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    level VARCHAR(20) DEFAULT 'Bronze',
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    last_action_date DATE,
    total_logins INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    total_goals_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice
CREATE INDEX idx_gamification_user_id ON gamification(user_id);
CREATE INDEX idx_gamification_points ON gamification(points DESC);

-- ============================================
-- TABELA: achievements
-- ============================================
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100)
);

-- Índices
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_type ON achievements(achievement_type);
CREATE INDEX idx_achievements_unlocked ON achievements(unlocked);

-- ============================================
-- TABELA: virtual_cards
-- ============================================
CREATE TABLE virtual_cards (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_number VARCHAR(19) NOT NULL,
    cvv VARCHAR(3) NOT NULL,
    expiry VARCHAR(5) NOT NULL, -- MM/YY
    type VARCHAR(10) DEFAULT 'virtual' CHECK (type IN ('virtual', 'physical')),
    brand VARCHAR(20) DEFAULT 'Mastercard',
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'expired')),
    card_limit DECIMAL(10,2) DEFAULT 5000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_at TIMESTAMP
);

-- Índices
CREATE INDEX idx_virtual_cards_user_id ON virtual_cards(user_id);
CREATE INDEX idx_virtual_cards_status ON virtual_cards(status);

-- ============================================
-- TABELA: user_events (Tracking)
-- ============================================
CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36), -- Nullable para visitantes
    session_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE
);

-- Índices
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_timestamp ON user_events(timestamp DESC);
CREATE INDEX idx_user_events_session ON user_events(session_id);
CREATE INDEX idx_user_events_data ON user_events USING GIN (event_data);

-- ============================================
-- TABELA: ai_recommendations
-- ============================================
CREATE TABLE ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    action_url VARCHAR(255),
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    accepted_at TIMESTAMP
);

-- Índices
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX idx_ai_recommendations_created ON ai_recommendations(created_at DESC);

-- ============================================
-- TABELA: goals
-- ============================================
CREATE TABLE goals (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (current_amount >= 0),
    deadline DATE,
    category VARCHAR(50),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Coluna calculada: percentual de progresso
ALTER TABLE goals ADD COLUMN progress_percentage INTEGER 
    GENERATED ALWAYS AS (
        CASE 
            WHEN target_amount > 0 
            THEN LEAST(100, ROUND((current_amount / target_amount * 100)::NUMERIC, 0))
            ELSE 0 
        END
    ) STORED;

-- Índices
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_deadline ON goals(deadline);

-- ============================================
-- TRIGGERS
-- ============================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- View: Resumo financeiro por usuário
CREATE VIEW user_financial_summary AS
SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    COUNT(DISTINCT t.id) AS total_transactions,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS total_expenses,
    (SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) - 
     SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)) AS balance,
    g.points,
    g.level,
    g.streak
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN gamification g ON u.id = g.user_id
GROUP BY u.id, u.full_name, u.email, g.points, g.level, g.streak;

-- View: Top categorias por usuário
CREATE VIEW user_top_categories AS
SELECT 
    user_id,
    category,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    ROUND(AVG(amount), 2) AS avg_amount
FROM transactions
GROUP BY user_id, category
ORDER BY user_id, total_amount DESC;

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função: Calcular pontos de gamificação
CREATE OR REPLACE FUNCTION calculate_gamification_points(
    p_user_id VARCHAR(36),
    p_action VARCHAR(50)
) RETURNS INTEGER AS $$
DECLARE
    points INTEGER := 0;
BEGIN
    CASE p_action
        WHEN 'login' THEN points := 10;
        WHEN 'transaction_add' THEN points := 25;
        WHEN 'goal_complete' THEN points := 100;
        WHEN 'streak_7' THEN points := 50;
        WHEN 'achievement_unlock' THEN points := 75;
        ELSE points := 5;
    END CASE;
    
    UPDATE gamification 
    SET points = points + points 
    WHERE user_id = p_user_id;
    
    RETURN points;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DADOS DE TESTE (SEED)
-- ============================================

-- Usuário demo
INSERT INTO users (id, email, password, full_name, cpf, phone, birthdate) VALUES
('25a4b86d-0918-4312-b773-6b5bfc14cd02', 
 'joao@exemplo.com', 
 '$2b$10$XQsZxY.abcdefghijklmnoABCDEFGHIJKLMNOP', -- senha: demo123
 'João Silva',
 '123.456.789-00',
 '(11) 98765-4321',
 '1990-01-15');

-- Gamificação inicial
INSERT INTO gamification (user_id, points, level, streak) VALUES
('25a4b86d-0918-4312-b773-6b5bfc14cd02', 3150, 'Prata', 12);

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================
COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON TABLE transactions IS 'Transações financeiras (receitas e despesas)';
COMMENT ON TABLE gamification IS 'Sistema de pontos, níveis e streaks';
COMMENT ON TABLE achievements IS 'Conquistas desbloqueadas pelos usuários';
COMMENT ON TABLE virtual_cards IS 'Cartões virtuais gerados pelos usuários';
COMMENT ON TABLE user_events IS 'Tracking de eventos e analytics';
COMMENT ON TABLE goals IS 'Metas financeiras dos usuários';

-- FIM DO SCRIPT
```

---

## 📐 Normalização

### Formas Normais Aplicadas

✅ **1FN (Primeira Forma Normal)**
- Todos os atributos são atômicos
- Não há grupos repetitivos
- Cada célula contém apenas um valor

✅ **2FN (Segunda Forma Normal)**
- Está em 1FN
- Não há dependências parciais
- Todos os atributos não-chave dependem da chave primária completa

✅ **3FN (Terceira Forma Normal)**
- Está em 2FN
- Não há dependências transitivas
- Atributos não-chave dependem apenas da chave primária

✅ **BCNF (Boyce-Codd Normal Form)**
- Está em 3FN
- Toda dependência funcional tem como determinante uma superchave

---

## 🔒 Integridade Referencial

### Regras de Integridade

1. **PRIMARY KEY**: Todas as tabelas têm chave primária única
2. **FOREIGN KEY**: Relacionamentos com constraint de integridade
3. **ON DELETE CASCADE**: Deleção em cascata para dados dependentes
4. **UNIQUE**: Campos únicos (email, cpf, user_id em gamification)
5. **NOT NULL**: Campos obrigatórios
6. **CHECK**: Validações de domínio (valores permitidos, ranges)

---

## 📊 Cardinalidades

- **1:1** - User : Gamification
- **1:N** - User : Transaction
- **1:N** - User : Achievement
- **1:N** - User : VirtualCard
- **1:N** - User : UserEvent
- **1:N** - User : Goal
- **N:1** - Transaction : Category

---

**Desenvolvido para o Hackathon 2025**
