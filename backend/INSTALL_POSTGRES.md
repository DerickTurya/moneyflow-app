# 🐘 Guia de Instalação - PostgreSQL no Windows

## 📥 Passo 1: Download do PostgreSQL

### Opção A: Instalador Oficial (Recomendado)
1. Acesse: https://www.postgresql.org/download/windows/
2. Clique em "Download the installer"
3. Escolha PostgreSQL **16.x** (versão estável mais recente)
4. Baixe o instalador para Windows x86-64

### Opção B: Via Chocolatey (se tiver instalado)
```powershell
choco install postgresql16 -y
```

## 🔧 Passo 2: Instalação

1. **Execute o instalador** (postgresql-16.x-windows-x64.exe)

2. **Diretório de instalação:** 
   - Padrão: `C:\Program Files\PostgreSQL\16`
   - ✅ Deixe o padrão

3. **Componentes para instalar:**
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (interface gráfica)
   - ✅ Stack Builder (opcional)
   - ✅ Command Line Tools

4. **Diretório de dados:**
   - Padrão: `C:\Program Files\PostgreSQL\16\data`
   - ✅ Deixe o padrão

5. **Senha do superusuário (postgres):**
   - Digite: `postgres123`
   - ⚠️ **IMPORTANTE:** Use a mesma senha do arquivo `.env`!
   - Confirme a senha

6. **Porta:**
   - Padrão: `5432`
   - ✅ Deixe o padrão

7. **Locale:**
   - Padrão: `Portuguese, Brazil`
   - ✅ Deixe o padrão

8. **Clique em "Next" → "Install"**
   - Aguarde a instalação (2-3 minutos)

9. **Desmarque "Stack Builder"** (não é necessário)
   - Clique em "Finish"

## ✅ Passo 3: Verificar Instalação

Abra o PowerShell e execute:

```powershell
# Adicionar PostgreSQL ao PATH da sessão atual
$env:Path = "C:\Program Files\PostgreSQL\16\bin;" + $env:Path

# Verificar versão
psql --version

# Testar conexão
psql -U postgres -c "SELECT version();"
```

**Senha quando solicitado:** `postgres123`

**Saída esperada:**
```
PostgreSQL 16.x on x86_64-w64-mingw32, compiled by gcc.exe (Rev10, Built by MSYS2 project) 13.2.0, 64-bit
```

## 🗄️ Passo 4: Criar Banco de Dados

### Opção A: Via psql (Linha de Comando)

```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql:
CREATE DATABASE moneyflow;

# Conectar ao banco criado
\c moneyflow

# Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

# Sair
\q
```

### Opção B: Via pgAdmin 4 (Interface Gráfica)

1. Abra o **pgAdmin 4** (Iniciar → pgAdmin 4)
2. Conecte ao servidor PostgreSQL (senha: `postgres123`)
3. Clique com botão direito em "Databases"
4. Selecione "Create" → "Database..."
5. Nome: `moneyflow`
6. Owner: `postgres`
7. Clique em "Save"

## 📝 Passo 5: Aplicar Schemas

### 5.1 Aplicar schema principal

```powershell
cd C:\Users\USER\OneDrive\Desktop\hackathon\backend

# Aplicar schema.sql
psql -U postgres -d moneyflow -f database/schema.sql
```

**Saída esperada:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
...
CREATE INDEX
CREATE TRIGGER
```

### 5.2 Aplicar schema de eventos

```powershell
# Aplicar user_events.sql
psql -U postgres -d moneyflow -f database/user_events.sql
```

**Saída esperada:**
```
CREATE TABLE
CREATE INDEX
CREATE FUNCTION
CREATE VIEW
```

## 🔍 Passo 6: Verificar Tabelas Criadas

```powershell
psql -U postgres -d moneyflow -c "\dt"
```

**Saída esperada:**
```
                List of relations
 Schema |        Name         | Type  |  Owner   
--------+---------------------+-------+----------
 public | accounts            | table | postgres
 public | cards               | table | postgres
 public | transactions        | table | postgres
 public | user_events         | table | postgres
 public | users               | table | postgres
 ...
```

## 🚀 Passo 7: Iniciar a API

```powershell
cd C:\Users\USER\OneDrive\Desktop\hackathon\backend

# Iniciar API em modo desenvolvimento
npm run dev
```

**Saída esperada:**
```
🚀 Server running on http://localhost:3000
✅ Database connected successfully
📊 API Version: v1
🔗 API Endpoints:
   - Health: GET /health
   - Events: POST /api/v1/events
   - Auth: POST /api/v1/auth/login
   - Analytics: GET /api/v1/analytics/*
```

## 🧪 Passo 8: Criar Usuário de Teste

### Via SQL direto:

```powershell
psql -U postgres -d moneyflow
```

```sql
-- Criar usuário de teste
INSERT INTO users (
  id,
  name,
  email,
  cpf,
  password_hash,
  phone,
  points,
  level,
  streak_days,
  created_at
) VALUES (
  uuid_generate_v4(),
  'João Silva',
  'joao@teste.com',
  '12345678900',
  crypt('senha123', gen_salt('bf')),  -- Senha: senha123
  '11999999999',
  1000,
  'Bronze',
  5,
  NOW()
);

-- Verificar usuário criado
SELECT id, name, email, level, points FROM users;
```

### Via API (recomendado - depois de criar endpoint de registro):

```powershell
# Fazer login com usuário criado
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"joao@teste.com","password":"senha123"}'
```

## 📊 Passo 9: Testar Analytics

```powershell
# Salvar token de autenticação
$token = "SEU_TOKEN_JWT_AQUI"

# Testar endpoint de user stats
curl -H "Authorization: Bearer $token" `
  http://localhost:3000/api/v1/analytics/user-stats

# Testar endpoint de summary
curl -H "Authorization: Bearer $token" `
  http://localhost:3000/api/v1/analytics/summary

# Testar endpoint de eventos
curl -H "Authorization: Bearer $token" `
  "http://localhost:3000/api/v1/analytics/events?limit=10"
```

## 🔧 Solução de Problemas

### Erro: "psql: command not found"

Adicione PostgreSQL ao PATH permanentemente:

```powershell
# Abra PowerShell como Administrador
[Environment]::SetEnvironmentVariable(
  "Path",
  $env:Path + ";C:\Program Files\PostgreSQL\16\bin",
  [EnvironmentVariableTarget]::Machine
)

# Reinicie o PowerShell
```

### Erro: "password authentication failed"

Verifique se a senha está correta no `.env`:

```env
DB_PASSWORD=postgres123
```

E se é a mesma senha usada na instalação.

### Erro: "database 'moneyflow' does not exist"

Crie o banco manualmente:

```powershell
psql -U postgres -c "CREATE DATABASE moneyflow;"
```

### Erro: "could not connect to server"

Verifique se o serviço está rodando:

```powershell
# Ver status do serviço
Get-Service -Name "postgresql*"

# Iniciar serviço se estiver parado
Start-Service -Name "postgresql-x64-16"
```

### Erro: API não conecta ao banco

Verifique as configurações em `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moneyflow
DB_USER=postgres
DB_PASSWORD=postgres123
```

Reinicie a API:

```powershell
# Parar API (Ctrl+C)
# Iniciar novamente
npm run dev
```

## 📚 Comandos Úteis

```powershell
# Conectar ao banco
psql -U postgres -d moneyflow

# Ver todas as tabelas
\dt

# Ver estrutura de uma tabela
\d user_events

# Ver dados de uma tabela
SELECT * FROM users LIMIT 5;

# Ver eventos registrados
SELECT event_type, COUNT(*) FROM user_events GROUP BY event_type;

# Sair do psql
\q
```

## ✅ Checklist Final

- [ ] PostgreSQL 16 instalado
- [ ] Serviço PostgreSQL rodando
- [ ] Banco `moneyflow` criado
- [ ] Extensões `uuid-ossp` e `pgcrypto` instaladas
- [ ] Schema principal aplicado (15 tabelas)
- [ ] Schema de eventos aplicado (user_events)
- [ ] Arquivo `.env` configurado
- [ ] API conectada ao banco
- [ ] Usuário de teste criado
- [ ] Login funcionando
- [ ] Endpoints de analytics retornando dados

## 🎯 Próximos Passos

1. **Integrar SDK no HTML demo** → `demo/index.html`
2. **Popular banco com eventos** → Usar SDK ou API
3. **Testar analytics no dashboard** → Consultar dados reais
4. **Preparar para hackathon** → 26/11/2025 ✅

---

**Tempo estimado:** 10-15 minutos
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)
