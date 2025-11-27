# 📚 MoneyFlow - Documentação Completa do Projeto

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Guia de Instalação](#guia-de-instalação)
6. [Funcionalidades](#funcionalidades)

---

## 🎯 Visão Geral

**MoneyFlow** é uma aplicação web de gestão financeira pessoal que transforma o controle de finanças em uma experiência gamificada, acessível e inteligente.

### Problema
- 73% dos brasileiros não controlam suas finanças pessoais
- Apps tradicionais são complexos e desmotivantes
- Falta de acessibilidade para pessoas com deficiência
- Ausência de personalização e inteligência nos aplicativos financeiros

### Solução
Uma plataforma completa que combina:
- 🎮 **Gamificação** (pontos, níveis, conquistas, streak)
- 🤖 **IA Personalizada** (categorização automática, recomendações)
- ♿ **Acessibilidade Total** (6 modos diferentes)
- 📊 **Analytics Avançado** (tracking comportamental)

---

## 🏗️ Arquitetura do Sistema

### Arquitetura em 3 Camadas

```
┌─────────────────────────────────────────┐
│         FRONTEND (Presentation)         │
│   HTML5 + CSS3 + JavaScript Vanilla     │
│   - Interface Responsiva                │
│   - Dark/Light Theme                    │
│   - PWA Ready                           │
└───────────────┬─────────────────────────┘
                │ REST API
                │ HTTP/JSON
┌───────────────▼─────────────────────────┐
│          BACKEND (Application)          │
│         Node.js + Express.js            │
│   - API RESTful                         │
│   - Autenticação JWT                    │
│   - Rate Limiting                       │
│   - Validação de Dados                  │
└───────────────┬─────────────────────────┘
                │ SQL Queries
                │ Event Streams
┌───────────────▼─────────────────────────┐
│           DATABASE (Data)               │
│         PostgreSQL 17.2                 │
│   - User Events (tracking)              │
│   - Users (autenticação)                │
│   - Transactions (localStorage)         │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        MESSAGE QUEUE (Optional)         │
│           Apache Kafka                  │
│   - Event Processing                    │
│   - Real-time Analytics                 │
└─────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Usuário** → Interface Web
2. **Frontend** → Envia requisição HTTP
3. **Backend** → Valida e processa
4. **Database** → Armazena dados
5. **Kafka** → Processa eventos (opcional)
6. **Backend** → Retorna resposta JSON
7. **Frontend** → Atualiza interface

---

## 💻 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e animações
- **JavaScript (ES6+)** - Lógica da aplicação
- **Chart.js** - Gráficos interativos
- **Material Icons** - Iconografia
- **LocalStorage** - Persistência local

### Backend
- **Node.js** (v20+) - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JSON Web Token (JWT)** - Autenticação
- **bcrypt** - Hash de senhas
- **Kafka.js** - Message broker (opcional)

### DevOps
- **Git** - Controle de versão
- **GitHub** - Repositório
- **GitHub Pages** - Hospedagem frontend
- **Docker** - Containerização (PostgreSQL)

---

## 📁 Estrutura do Projeto

```
hackathon/
├── demo/                       # Frontend da aplicação
│   ├── index.html             # Interface principal
│   ├── styles.css             # Estilos globais
│   ├── script.js              # Lógica JavaScript
│   └── moneyflow-tracking.js  # Tracking de eventos
│
├── backend/                    # Backend Node.js
│   ├── src/
│   │   ├── routes/            # Rotas da API
│   │   ├── models/            # Modelos de dados
│   │   ├── middlewares/       # Middlewares
│   │   ├── auth/              # Autenticação JWT
│   │   ├── config/            # Configurações
│   │   └── utils/             # Utilitários
│   ├── server.js              # Servidor principal
│   ├── package.json           # Dependências
│   └── docker-compose.yml     # PostgreSQL container
│
├── database/                   # Scripts SQL
│   ├── schema.sql             # Schema do banco
│   └── user_events.sql        # Tabela de eventos
│
├── DOCUMENTACAO/              # Documentação completa
│   ├── README.md              # Este arquivo
│   ├── DIAGRAMAS-UML.md       # Diagramas UML
│   ├── DIAGRAMA-ER.md         # Diagrama Entidade-Relacionamento
│   ├── DESIGN-INTERFACE.md    # Guia de design
│   └── APRESENTACAO.md        # Slides da apresentação
│
└── DEPLOY.md                  # Guia de deploy
```

---

## 🚀 Guia de Instalação

### Pré-requisitos
- Node.js v20+
- PostgreSQL 17+
- Git

### Passo 1: Clonar Repositório
```bash
git clone https://github.com/DerickTurya/moneyflow-app.git
cd moneyflow-app
```

### Passo 2: Instalar Backend
```bash
cd backend
npm install
```

### Passo 3: Configurar Banco de Dados
```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d

# Ou instalar PostgreSQL localmente
# Executar scripts SQL em database/
```

### Passo 4: Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Editar .env com suas credenciais
```

### Passo 5: Iniciar Aplicação
```bash
# Backend
cd backend
npm start

# Frontend
# Abrir demo/index.html no navegador
# Ou acessar: http://localhost:3000
```

### Acesso Rápido
- **Frontend Online**: https://derickturya.github.io/moneyflow-app/demo/
- **Backend Local**: http://localhost:3000
- **Tracking Dashboard**: http://localhost:3000/tracking.html

---

## ✨ Funcionalidades

### 1. Dashboard Financeiro
- Saldo total em tempo real
- Receitas vs Despesas
- Gráfico de categorias
- Transações recentes
- Multi-moeda (BRL, USD, EUR, GBP)

### 2. Gestão de Transações
- Adicionar receitas/despesas
- Categorização automática com IA
- Edição e exclusão
- Filtros por categoria e tipo
- Busca de transações

### 3. Sistema de Gamificação
- **Pontos**: Ganhe por cada ação
- **Níveis**: Bronze → Prata → Ouro → Platina → Diamante
- **Conquistas**: 12+ badges desbloqueáveis
- **Streak**: Sequência de dias consecutivos
- **Desafios**: Metas semanais e mensais

### 4. Personalização IA
- Análise de perfil financeiro
- Recomendações personalizadas
- Insights sobre gastos
- Metas sugeridas
- Detecção de padrões
- Produtos recomendados

### 5. Cartões Virtuais
- Criação instantânea
- Número de cartão válido
- CVV e data de validade
- Tipos: Virtual ou Físico
- Design estilo Nubank

### 6. Acessibilidade
- **Modo Cego**: Screen reader completo
- **Modo Surdo**: Alertas visuais
- **Modo Idoso**: Interface ampliada + tutorial
- **Tamanhos de Fonte**: 4 opções
- **Contraste**: 3 modos (padrão, P&B, amarelo/preto)
- **Espaçamento**: 3 níveis

### 7. Temas
- Tema Claro
- Tema Escuro (#0a0a0a)
- Persistência automática

### 8. Responsividade
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (360x640)
- PWA Ready

### 9. Tracking & Analytics
- Monitoramento de eventos
- Dashboard de usuários
- Métricas em tempo real
- Histórico de atividades

---

## 📊 Métricas do Projeto

- **Linhas de Código**: ~15.000
- **Arquivos**: 58
- **Telas**: 15+
- **Features**: 50+
- **Tempo de Desenvolvimento**: 2 dias intensivos
- **Commits**: 10+

---

## 👥 Equipe

- **Desenvolvedor Full Stack**: Derick Turya
- **GitHub**: @DerickTurya

---

## 📄 Licença

Este projeto foi desenvolvido para o Hackathon 2025.

---

## 🔗 Links Úteis

- **Demo Online**: https://derickturya.github.io/moneyflow-app/demo/
- **Repositório**: https://github.com/DerickTurya/moneyflow-app
- **Documentação Técnica**: /DOCUMENTACAO/
