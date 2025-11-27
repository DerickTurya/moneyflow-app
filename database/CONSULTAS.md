# Consultas SQL Úteis - MoneyFlow

## 1. Consultas de Usuários

### Buscar usuário por email
```sql
SELECT * FROM users WHERE email = 'joao@exemplo.com';
```

### Listar usuários por nível de gamificação
```sql
SELECT full_name, points, level, streak_days
FROM users
ORDER BY points DESC
LIMIT 10;
```

### Usuários mais ativos (maior sequência)
```sql
SELECT full_name, streak_days, points, level
FROM users
ORDER BY streak_days DESC
LIMIT 10;
```

## 2. Consultas de Transações

### Transações do mês atual
```sql
SELECT t.*, c.name AS category_name, c.icon
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = 'USER_ID_HERE'
AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY t.transaction_date DESC;
```

### Total de receitas e despesas por mês
```sql
SELECT 
    DATE_TRUNC('month', transaction_date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
FROM transactions
WHERE user_id = 'USER_ID_HERE'
GROUP BY DATE_TRUNC('month', transaction_date)
ORDER BY month DESC;
```

### Top 5 categorias com mais gastos
```sql
SELECT 
    c.name,
    c.icon,
    COUNT(t.id) AS transaction_count,
    SUM(t.amount) AS total_spent
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = 'USER_ID_HERE'
AND t.type = 'expense'
AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.id, c.name, c.icon
ORDER BY total_spent DESC
LIMIT 5;
```

### Transações com alta confiança de IA
```sql
SELECT description, amount, ai_confidence, 
       c.name AS suggested_category
FROM transactions t
LEFT JOIN categories c ON t.ai_suggested_category = c.id
WHERE t.user_id = 'USER_ID_HERE'
AND t.ai_confidence >= 90
ORDER BY t.transaction_date DESC;
```

### Média de gastos por dia da semana
```sql
SELECT 
    TO_CHAR(transaction_date, 'Day') AS day_of_week,
    EXTRACT(DOW FROM transaction_date) AS day_num,
    AVG(amount) AS avg_amount,
    COUNT(*) AS transaction_count
FROM transactions
WHERE user_id = 'USER_ID_HERE'
AND type = 'expense'
GROUP BY TO_CHAR(transaction_date, 'Day'), EXTRACT(DOW FROM transaction_date)
ORDER BY day_num;
```

## 3. Consultas de Orçamentos

### Verificar progresso dos orçamentos ativos
```sql
SELECT 
    b.name,
    b.amount AS budget_amount,
    c.name AS category_name,
    COALESCE(SUM(t.amount), 0) AS spent,
    b.amount - COALESCE(SUM(t.amount), 0) AS remaining,
    ROUND((COALESCE(SUM(t.amount), 0) / b.amount * 100), 2) AS percentage_used
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON t.category_id = b.category_id 
    AND t.user_id = b.user_id
    AND t.type = 'expense'
    AND t.transaction_date BETWEEN b.start_date AND COALESCE(b.end_date, CURRENT_DATE)
WHERE b.user_id = 'USER_ID_HERE'
AND b.is_active = true
GROUP BY b.id, b.name, b.amount, c.name;
```

### Orçamentos que ultrapassaram o limite de alerta
```sql
SELECT 
    b.name,
    b.amount,
    b.alert_threshold,
    SUM(t.amount) AS spent,
    ROUND((SUM(t.amount) / b.amount * 100), 2) AS percentage
FROM budgets b
JOIN transactions t ON t.category_id = b.category_id 
    AND t.user_id = b.user_id
    AND t.type = 'expense'
    AND t.transaction_date BETWEEN b.start_date AND COALESCE(b.end_date, CURRENT_DATE)
WHERE b.user_id = 'USER_ID_HERE'
AND b.is_active = true
GROUP BY b.id, b.name, b.amount, b.alert_threshold
HAVING (SUM(t.amount) / b.amount * 100) >= b.alert_threshold;
```

## 4. Consultas de Metas

### Progresso das metas ativas
```sql
SELECT 
    title,
    target_amount,
    current_amount,
    ROUND((current_amount / target_amount * 100), 2) AS progress_percentage,
    target_date,
    target_amount - current_amount AS remaining,
    CASE 
        WHEN target_date IS NOT NULL THEN 
            (target_date - CURRENT_DATE)
        ELSE NULL
    END AS days_remaining
FROM goals
WHERE user_id = 'USER_ID_HERE'
AND status = 'active'
ORDER BY progress_percentage DESC;
```

### Metas próximas de serem atingidas
```sql
SELECT 
    title,
    target_amount,
    current_amount,
    ROUND((current_amount / target_amount * 100), 2) AS progress_percentage
FROM goals
WHERE user_id = 'USER_ID_HERE'
AND status = 'active'
AND (current_amount / target_amount * 100) >= 80
ORDER BY progress_percentage DESC;
```

## 5. Consultas de Gamificação

### Conquistas desbloqueadas pelo usuário
```sql
SELECT 
    a.name,
    a.description,
    a.icon,
    a.points,
    a.tier,
    ua.unlocked_at
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
WHERE ua.user_id = 'USER_ID_HERE'
ORDER BY ua.unlocked_at DESC;
```

### Conquistas disponíveis (não desbloqueadas)
```sql
SELECT 
    a.name,
    a.description,
    a.icon,
    a.points,
    a.tier
FROM achievements a
WHERE a.is_active = true
AND a.id NOT IN (
    SELECT achievement_id 
    FROM user_achievements 
    WHERE user_id = 'USER_ID_HERE'
)
ORDER BY a.points ASC;
```

### Ranking de usuários por pontos
```sql
SELECT 
    ROW_NUMBER() OVER (ORDER BY points DESC) AS rank,
    full_name,
    points,
    level,
    streak_days
FROM users
WHERE deleted_at IS NULL
ORDER BY points DESC
LIMIT 50;
```

## 6. Consultas de Cashback

### Cashback disponível
```sql
SELECT 
    SUM(amount) AS total_cashback,
    COUNT(*) AS cashback_count
FROM cashback
WHERE user_id = 'USER_ID_HERE'
AND status IN ('pending', 'approved');
```

### Histórico de cashback por parceiro
```sql
SELECT 
    partner_name,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_cashback,
    AVG(percentage) AS avg_percentage
FROM cashback
WHERE user_id = 'USER_ID_HERE'
GROUP BY partner_name
ORDER BY total_cashback DESC;
```

### Cashback prestes a expirar
```sql
SELECT 
    partner_name,
    amount,
    expires_at,
    (expires_at - CURRENT_DATE) AS days_until_expiry
FROM cashback
WHERE user_id = 'USER_ID_HERE'
AND status IN ('pending', 'approved')
AND expires_at IS NOT NULL
AND expires_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY expires_at ASC;
```

## 7. Consultas de IA e Insights

### Insights recentes
```sql
SELECT 
    insight_type,
    title,
    description,
    confidence,
    priority,
    created_at
FROM ai_insights
WHERE user_id = 'USER_ID_HERE'
AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
AND action_taken = false
ORDER BY priority DESC, confidence DESC, created_at DESC
LIMIT 10;
```

### Padrões de gastos detectados pela IA
```sql
SELECT 
    title,
    description,
    data,
    confidence,
    created_at
FROM ai_insights
WHERE user_id = 'USER_ID_HERE'
AND insight_type = 'spending_pattern'
ORDER BY created_at DESC
LIMIT 5;
```

## 8. Consultas de Notificações

### Notificações não lidas
```sql
SELECT 
    title,
    message,
    type,
    priority,
    created_at
FROM notifications
WHERE user_id = 'USER_ID_HERE'
AND is_read = false
ORDER BY priority DESC, created_at DESC;
```

### Marcar todas as notificações como lidas
```sql
UPDATE notifications
SET is_read = true, read_at = CURRENT_TIMESTAMP
WHERE user_id = 'USER_ID_HERE'
AND is_read = false;
```

## 9. Consultas de Análise

### Comparação mês atual vs mês anterior
```sql
WITH current_month AS (
    SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = 'USER_ID_HERE'
    AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
),
previous_month AS (
    SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = 'USER_ID_HERE'
    AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
)
SELECT 
    cm.income AS current_income,
    pm.income AS previous_income,
    ROUND((cm.income - pm.income) / NULLIF(pm.income, 0) * 100, 2) AS income_change_percent,
    cm.expense AS current_expense,
    pm.expense AS previous_expense,
    ROUND((cm.expense - pm.expense) / NULLIF(pm.expense, 0) * 100, 2) AS expense_change_percent
FROM current_month cm, previous_month pm;
```

### Taxa de economia mensal
```sql
SELECT 
    DATE_TRUNC('month', transaction_date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS savings,
    ROUND(
        (SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) / 
         NULLIF(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) * 100), 2
    ) AS savings_rate
FROM transactions
WHERE user_id = 'USER_ID_HERE'
GROUP BY DATE_TRUNC('month', transaction_date)
ORDER BY month DESC;
```

## 10. Consultas de Transferências Internacionais

### Histórico de transferências
```sql
SELECT 
    from_currency,
    to_currency,
    from_amount,
    to_amount,
    exchange_rate,
    recipient_name,
    recipient_country,
    fee,
    status,
    created_at
FROM international_transfers
WHERE user_id = 'USER_ID_HERE'
ORDER BY created_at DESC;
```

### Total de taxas pagas em transferências
```sql
SELECT 
    to_currency,
    COUNT(*) AS transfer_count,
    SUM(fee) AS total_fees,
    AVG(fee) AS avg_fee
FROM international_transfers
WHERE user_id = 'USER_ID_HERE'
AND status = 'completed'
GROUP BY to_currency
ORDER BY total_fees DESC;
```

## 11. Consultas de Recargas

### Histórico de recargas
```sql
SELECT 
    recharge_type,
    provider,
    amount,
    bonus_amount,
    created_at
FROM recharges
WHERE user_id = 'USER_ID_HERE'
ORDER BY created_at DESC;
```

### Total de bônus recebido
```sql
SELECT 
    recharge_type,
    provider,
    SUM(bonus_amount) AS total_bonus,
    COUNT(*) AS recharge_count
FROM recharges
WHERE user_id = 'USER_ID_HERE'
AND status = 'completed'
GROUP BY recharge_type, provider
ORDER BY total_bonus DESC;
```

## 12. Consultas Administrativas

### Estatísticas gerais do sistema
```sql
SELECT 
    (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) AS total_users,
    (SELECT COUNT(*) FROM transactions) AS total_transactions,
    (SELECT SUM(amount) FROM transactions WHERE type = 'income') AS total_income,
    (SELECT SUM(amount) FROM transactions WHERE type = 'expense') AS total_expenses,
    (SELECT COUNT(*) FROM user_achievements) AS total_achievements_unlocked,
    (SELECT AVG(points) FROM users) AS avg_user_points;
```

### Usuários mais engajados (últimos 30 dias)
```sql
SELECT 
    u.full_name,
    u.email,
    COUNT(DISTINCT DATE(t.created_at)) AS active_days,
    COUNT(t.id) AS transaction_count,
    u.points,
    u.streak_days
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id 
    AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.full_name, u.email, u.points, u.streak_days
ORDER BY active_days DESC, transaction_count DESC
LIMIT 20;
```
