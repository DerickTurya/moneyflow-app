-- Eventos para Maria Santos
INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'login', '{"method": "biometric"}'::jsonb, NOW() - INTERVAL '1 hour'
FROM users u WHERE u.email = 'maria@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'transfer_completed', '{"amount": 350.00, "currency": "BRL", "to": "Pedro"}'::jsonb, NOW() - INTERVAL '45 minutes'
FROM users u WHERE u.email = 'maria@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'page_view', '{"page": "/investments"}'::jsonb, NOW() - INTERVAL '20 minutes'
FROM users u WHERE u.email = 'maria@exemplo.com';

-- Eventos para Pedro Oliveira
INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'login', '{"method": "password"}'::jsonb, NOW() - INTERVAL '3 hours'
FROM users u WHERE u.email = 'pedro@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'page_view', '{"page": "/dashboard"}'::jsonb, NOW() - INTERVAL '2 hours 50 minutes'
FROM users u WHERE u.email = 'pedro@exemplo.com';

-- Eventos para Ana Costa
INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'login', '{"method": "fingerprint"}'::jsonb, NOW() - INTERVAL '15 minutes'
FROM users u WHERE u.email = 'ana@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'transfer_completed', '{"amount": 1200.00, "currency": "BRL", "to": "Fornecedor XYZ"}'::jsonb, NOW() - INTERVAL '10 minutes'
FROM users u WHERE u.email = 'ana@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'button_click', '{"button": "export_report"}'::jsonb, NOW() - INTERVAL '5 minutes'
FROM users u WHERE u.email = 'ana@exemplo.com';

SELECT COUNT(*) as total_eventos FROM user_events;