-- =============================================
-- MoneyFlow Database Schema
-- Sistema de Hub Financeiro com IA
-- =============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABELA: users
-- Armazena informações dos usuários
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    phone VARCHAR(15),
    birth_date DATE,
    profile_photo_url TEXT,
    
    -- Gamificação
    points INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'Bronze',
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Personalização
    preferences JSONB DEFAULT '{}',
    ai_settings JSONB DEFAULT '{"learning_enabled": true, "smart_notifications": true, "proactive_recommendations": true}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- =============================================
-- TABELA: accounts
-- Contas bancárias vinculadas aos usuários
-- =============================================
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('checking', 'savings', 'investment', 'credit')),
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50),
    agency VARCHAR(10),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'BRL',
    is_primary BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para accounts
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_is_primary ON accounts(is_primary);

-- =============================================
-- TABELA: categories
-- Categorias de transações
-- =============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'both')),
    is_system BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, icon, color, type, is_system) VALUES
('Alimentação', 'food', '🛒', '#e74c3c', 'expense', true),
('Transporte', 'transport', '🚗', '#3498db', 'expense', true),
('Moradia', 'housing', '🏠', '#9b59b6', 'expense', true),
('Saúde', 'health', '💊', '#27ae60', 'expense', true),
('Educação', 'education', '📚', '#e67e22', 'expense', true),
('Lazer', 'leisure', '🎬', '#f39c12', 'expense', true),
('Compras', 'shopping', '🛍️', '#e84393', 'expense', true),
('Outros', 'other', '📌', '#95a5a6', 'both', true),
('Salário', 'salary', '💰', '#00b894', 'income', true),
('Freelance', 'freelance', '💼', '#00cec9', 'income', true),
('Investimentos', 'investment', '📈', '#00b894', 'income', true),
('Cashback', 'cashback', '🎁', '#00b894', 'income', true);

-- Índice para categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_type ON categories(type);

-- =============================================
-- TABELA: transactions
-- Transações financeiras
-- =============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    transaction_date DATE NOT NULL,
    
    -- Dados adicionais
    payment_method VARCHAR(50),
    location VARCHAR(255),
    notes TEXT,
    receipt_url TEXT,
    
    -- IA e Categorização
    ai_confidence DECIMAL(5, 2) DEFAULT 0.00,
    ai_suggested_category UUID REFERENCES categories(id),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule JSONB,
    
    -- Metadados
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- =============================================
-- TABELA: budgets
-- Orçamentos e metas
-- =============================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    
    alert_threshold DECIMAL(5, 2) DEFAULT 80.00,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para budgets
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_is_active ON budgets(is_active);

-- =============================================
-- TABELA: goals
-- Metas financeiras
-- =============================================
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0.00,
    target_date DATE,
    
    icon VARCHAR(10) DEFAULT '🎯',
    color VARCHAR(7) DEFAULT '#00b894',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Índices para goals
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- =============================================
-- TABELA: achievements
-- Conquistas do sistema de gamificação
-- =============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    tier VARCHAR(20) CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value JSONB NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir conquistas padrão
INSERT INTO achievements (name, description, icon, points, tier, requirement_type, requirement_value) VALUES
('Primeira Transação', 'Adicione sua primeira transação', '🎯', 20, 'bronze', 'transaction_count', '{"count": 1}'),
('Consistente', 'Use o app por 7 dias seguidos', '🔥', 50, 'bronze', 'streak_days', '{"days": 7}'),
('Dedicado', 'Use o app por 30 dias seguidos', '💪', 200, 'silver', 'streak_days', '{"days": 30}'),
('No Limite', 'Cumpra seu orçamento mensal', '🎖️', 100, 'silver', 'budget_compliance', '{"compliance": 100}'),
('Mestre da Economia', 'Economize 20% vs mês anterior', '💰', 150, 'gold', 'savings_rate', '{"rate": 20}'),
('Investidor', 'Faça seu primeiro investimento', '📈', 75, 'bronze', 'investment_made', '{"count": 1}'),
('Planejador', 'Crie 3 metas financeiras', '🎯', 50, 'bronze', 'goals_created', '{"count": 3}'),
('Organizado', 'Categorize 50 transações', '📊', 80, 'silver', 'categorized_transactions', '{"count": 50}');

-- =============================================
-- TABELA: user_achievements
-- Conquistas desbloqueadas pelos usuários
-- =============================================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, achievement_id)
);

-- Índices para user_achievements
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- =============================================
-- TABELA: cashback
-- Programa de cashback
-- =============================================
CREATE TABLE cashback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    
    partner_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'redeemed', 'expired')),
    
    expires_at TIMESTAMP,
    redeemed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para cashback
CREATE INDEX idx_cashback_user_id ON cashback(user_id);
CREATE INDEX idx_cashback_status ON cashback(status);
CREATE INDEX idx_cashback_transaction_id ON cashback(transaction_id);

-- =============================================
-- TABELA: notifications
-- Notificações do sistema
-- =============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'achievement', 'budget_alert')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =============================================
-- TABELA: ai_insights
-- Insights gerados pela IA
-- =============================================
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('spending_pattern', 'recommendation', 'prediction', 'anomaly')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    confidence DECIMAL(5, 2) DEFAULT 0.00,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    
    data JSONB NOT NULL,
    action_taken BOOLEAN DEFAULT false,
    
    valid_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para ai_insights
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX idx_ai_insights_created_at ON ai_insights(created_at);

-- =============================================
-- TABELA: recurring_transactions
-- Transações recorrentes
-- =============================================
CREATE TABLE recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence DATE NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    auto_create BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para recurring_transactions
CREATE INDEX idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_next_occurrence ON recurring_transactions(next_occurrence);
CREATE INDEX idx_recurring_transactions_is_active ON recurring_transactions(is_active);

-- =============================================
-- TABELA: recharges
-- Recargas de celular e transporte
-- =============================================
CREATE TABLE recharges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    
    recharge_type VARCHAR(20) NOT NULL CHECK (recharge_type IN ('mobile', 'transport')),
    provider VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    card_number VARCHAR(50),
    
    amount DECIMAL(15, 2) NOT NULL,
    bonus_amount DECIMAL(15, 2) DEFAULT 0.00,
    
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para recharges
CREATE INDEX idx_recharges_user_id ON recharges(user_id);
CREATE INDEX idx_recharges_type ON recharges(recharge_type);
CREATE INDEX idx_recharges_created_at ON recharges(created_at);

-- =============================================
-- TABELA: international_transfers
-- Transferências internacionais
-- =============================================
CREATE TABLE international_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    from_amount DECIMAL(15, 2) NOT NULL,
    to_amount DECIMAL(15, 2) NOT NULL,
    exchange_rate DECIMAL(15, 6) NOT NULL,
    
    recipient_name VARCHAR(255) NOT NULL,
    recipient_country VARCHAR(100) NOT NULL,
    recipient_account VARCHAR(100),
    
    fee DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Índices para international_transfers
CREATE INDEX idx_international_transfers_user_id ON international_transfers(user_id);
CREATE INDEX idx_international_transfers_status ON international_transfers(status);
CREATE INDEX idx_international_transfers_created_at ON international_transfers(created_at);

-- =============================================
-- FUNÇÕES E TRIGGERS
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar saldo da conta após transação
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.account_id = NEW.account_id THEN
            IF NEW.type = 'income' THEN
                UPDATE accounts SET balance = balance - OLD.amount + NEW.amount WHERE id = NEW.account_id;
            ELSIF NEW.type = 'expense' THEN
                UPDATE accounts SET balance = balance + OLD.amount - NEW.amount WHERE id = NEW.account_id;
            END IF;
        ELSE
            -- Reverter saldo da conta antiga
            IF OLD.type = 'income' THEN
                UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
            ELSIF OLD.type = 'expense' THEN
                UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
            END IF;
            -- Aplicar na nova conta
            IF NEW.type = 'income' THEN
                UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
            ELSIF NEW.type = 'expense' THEN
                UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_account_balance
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_account_balance();

-- Função para atualizar pontos de gamificação
CREATE OR REPLACE FUNCTION award_points_for_transaction()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET points = points + 5 WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_award_points
    AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION award_points_for_transaction();

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View: Resumo de transações por categoria
CREATE VIEW v_transactions_by_category AS
SELECT 
    u.id AS user_id,
    u.full_name,
    c.name AS category_name,
    c.icon,
    c.color,
    COUNT(t.id) AS transaction_count,
    SUM(t.amount) AS total_amount,
    DATE_TRUNC('month', t.transaction_date) AS month
FROM transactions t
JOIN users u ON t.user_id = u.id
JOIN categories c ON t.category_id = c.id
GROUP BY u.id, u.full_name, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);

-- View: Saldo total por usuário
CREATE VIEW v_user_balance AS
SELECT 
    u.id AS user_id,
    u.full_name,
    COALESCE(SUM(a.balance), 0) AS total_balance,
    COUNT(a.id) AS account_count
FROM users u
LEFT JOIN accounts a ON u.id = a.user_id
GROUP BY u.id, u.full_name;

-- View: Cashback disponível por usuário
CREATE VIEW v_user_cashback AS
SELECT 
    user_id,
    SUM(amount) AS total_cashback,
    COUNT(*) AS cashback_count
FROM cashback
WHERE status IN ('pending', 'approved')
GROUP BY user_id;

-- View: Progresso de metas
CREATE VIEW v_goals_progress AS
SELECT 
    g.id,
    g.user_id,
    g.title,
    g.target_amount,
    g.current_amount,
    ROUND((g.current_amount / g.target_amount * 100), 2) AS progress_percentage,
    g.target_date,
    CASE 
        WHEN g.current_amount >= g.target_amount THEN 'completed'
        WHEN g.target_date < CURRENT_DATE THEN 'overdue'
        ELSE 'in_progress'
    END AS status
FROM goals g;

-- =============================================
-- DADOS INICIAIS DE TESTE
-- =============================================

-- Inserir usuário de teste
INSERT INTO users (full_name, email, password_hash, cpf, phone, points, level, streak_days) VALUES
('João Silva', 'joao@exemplo.com', crypt('senha123', gen_salt('bf')), '12345678901', '11987654321', 3150, 'Prata', 12);

-- Obter ID do usuário
DO $$
DECLARE
    test_user_id UUID;
    test_account_id UUID;
    cat_food UUID;
    cat_transport UUID;
    cat_health UUID;
    cat_salary UUID;
BEGIN
    SELECT id INTO test_user_id FROM users WHERE email = 'joao@exemplo.com';
    
    -- Inserir conta
    INSERT INTO accounts (user_id, account_type, bank_name, balance, is_primary)
    VALUES (test_user_id, 'checking', 'Banco MoneyFlow', 7234.50, true)
    RETURNING id INTO test_account_id;
    
    -- Obter IDs das categorias
    SELECT id INTO cat_food FROM categories WHERE slug = 'food';
    SELECT id INTO cat_transport FROM categories WHERE slug = 'transport';
    SELECT id INTO cat_health FROM categories WHERE slug = 'health';
    SELECT id INTO cat_salary FROM categories WHERE slug = 'salary';
    
    -- Inserir transações de exemplo
    INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, transaction_date, ai_confidence) VALUES
    (test_user_id, test_account_id, cat_food, 'Supermercado Extra', -156.80, 'expense', CURRENT_DATE, 95.5),
    (test_user_id, test_account_id, cat_salary, 'Salário', 4500.00, 'income', CURRENT_DATE - INTERVAL '5 days', 100.0),
    (test_user_id, test_account_id, cat_transport, 'Uber', -28.50, 'expense', CURRENT_DATE - INTERVAL '1 day', 92.0),
    (test_user_id, test_account_id, cat_health, 'Farmácia São Paulo', -85.00, 'expense', CURRENT_DATE - INTERVAL '3 days', 98.0);
    
    -- Inserir meta
    INSERT INTO goals (user_id, title, description, target_amount, current_amount, icon)
    VALUES (test_user_id, 'Fundo de Emergência', 'Reserva de 6 meses de despesas', 20000.00, 7234.50, '💰');
    
    -- Inserir orçamento
    INSERT INTO budgets (user_id, category_id, name, amount, period, start_date)
    VALUES (test_user_id, cat_food, 'Orçamento Alimentação', 1000.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE));
    
END $$;

-- =============================================
-- COMENTÁRIOS FINAIS
-- =============================================
COMMENT ON TABLE users IS 'Usuários do sistema MoneyFlow';
COMMENT ON TABLE transactions IS 'Todas as transações financeiras';
COMMENT ON TABLE categories IS 'Categorias de transações com IA';
COMMENT ON TABLE achievements IS 'Sistema de conquistas e gamificação';
COMMENT ON TABLE ai_insights IS 'Insights gerados por IA de personalização';
