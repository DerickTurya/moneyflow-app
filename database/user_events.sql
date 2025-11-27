-- Adicionar tabela de eventos para backup
-- Esta tabela armazena eventos críticos diretamente no PostgreSQL

CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_id UNIQUE (id)
);

-- Índices para otimização de queries
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_data ON user_events USING GIN (event_data);

-- Comentários
COMMENT ON TABLE user_events IS 'Backup de eventos críticos do sistema de tracking';
COMMENT ON COLUMN user_events.id IS 'UUID único do evento (mesmo usado no Kafka)';
COMMENT ON COLUMN user_events.user_id IS 'ID do usuário que gerou o evento';
COMMENT ON COLUMN user_events.event_type IS 'Tipo do evento (login, logout, transfer_completed, etc)';
COMMENT ON COLUMN user_events.event_data IS 'Dados completos do evento em formato JSON';
COMMENT ON COLUMN user_events.created_at IS 'Timestamp de criação do evento';

-- Função para limpar eventos antigos (opcional)
CREATE OR REPLACE FUNCTION clean_old_events(days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_events
    WHERE created_at < NOW() - (days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION clean_old_events IS 'Remove eventos mais antigos que X dias (padrão: 90 dias)';

-- View para análise rápida de eventos
CREATE OR REPLACE VIEW v_event_summary AS
SELECT 
    user_id,
    event_type,
    COUNT(*) as event_count,
    MIN(created_at) as first_event,
    MAX(created_at) as last_event,
    MAX(created_at) - MIN(created_at) as time_span
FROM user_events
GROUP BY user_id, event_type;

COMMENT ON VIEW v_event_summary IS 'Resumo de eventos por usuário e tipo';
