-- Eventos automáticos para Roberto Alves
INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'login', '{"method": "password"}'::jsonb, NOW()
FROM users u WHERE u.email = 'roberto@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'page_view', '{"page": "/welcome"}'::jsonb, NOW() - INTERVAL '10 seconds'
FROM users u WHERE u.email = 'roberto@exemplo.com';

INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
SELECT uuid_generate_v4(), u.id, 'button_click', '{"button": "complete_profile"}'::jsonb, NOW() - INTERVAL '5 seconds'
FROM users u WHERE u.email = 'roberto@exemplo.com';

SELECT full_name, email, phone, (SELECT COUNT(*) FROM user_events WHERE user_id = u.id) as eventos
FROM users u 
ORDER BY created_at DESC LIMIT 5;