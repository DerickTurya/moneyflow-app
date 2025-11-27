INSERT INTO users (id, full_name, email, password_hash, phone, points, level, streak_days) VALUES
(uuid_generate_v4(), 'Maria Santos', 'maria@exemplo.com', crypt('senha123', gen_salt('bf')), '(11) 91234-5678', 5420, 'Ouro', 25),
(uuid_generate_v4(), 'Pedro Oliveira', 'pedro@exemplo.com', crypt('senha123', gen_salt('bf')), '(21) 99876-5432', 1850, 'Bronze', 5),
(uuid_generate_v4(), 'Ana Costa', 'ana@exemplo.com', crypt('senha123', gen_salt('bf')), '(31) 98765-1234', 7800, 'Diamante', 45)
ON CONFLICT (email) DO NOTHING;

SELECT full_name, email, phone, level FROM users ORDER BY created_at DESC LIMIT 4;