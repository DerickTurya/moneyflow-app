INSERT INTO user_events (id, user_id, event_type, event_data, created_at) VALUES
(uuid_generate_v4(), '25a4b86d-0918-4312-b773-6b5bfc14cd02', 'login', '{"method": "password"}'::jsonb, NOW() - INTERVAL '2 hours'),
(uuid_generate_v4(), '25a4b86d-0918-4312-b773-6b5bfc14cd02', 'page_view', '{"page": "/dashboard"}'::jsonb, NOW() - INTERVAL '1 hour'),
(uuid_generate_v4(), '25a4b86d-0918-4312-b773-6b5bfc14cd02', 'transfer_completed', '{"amount": 150.50, "currency": "BRL"}'::jsonb, NOW() - INTERVAL '30 minutes'),
(uuid_generate_v4(), '25a4b86d-0918-4312-b773-6b5bfc14cd02', 'page_view', '{"page": "/transactions"}'::jsonb, NOW() - INTERVAL '10 minutes'),
(uuid_generate_v4(), '25a4b86d-0918-4312-b773-6b5bfc14cd02', 'button_click', '{"button": "send_money"}'::jsonb, NOW() - INTERVAL '5 minutes');
SELECT COUNT(*) as eventos_criados FROM user_events;