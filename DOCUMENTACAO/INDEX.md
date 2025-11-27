# 📚 MoneyFlow - Documentação Completa do Hackathon 2025

## 🎯 Visão Geral do Projeto

**MoneyFlow** é uma aplicação web completa de gestão financeira pessoal que transforma o controle de finanças em uma experiência gamificada, acessível e inteligente.

---

## 📂 Estrutura da Documentação

### 1. 📖 [README.md](README.md)
**Documentação Principal do Projeto**
- Visão geral e problema/solução
- Arquitetura do sistema
- Tecnologias utilizadas
- Estrutura de pastas
- Guia de instalação
- Lista completa de funcionalidades
- Métricas do projeto

### 2. 🔷 [DIAGRAMAS-UML.md](DIAGRAMAS-UML.md)
**Diagramas UML Completos**
- Diagrama de Casos de Uso
- Diagrama de Classes
- Diagrama de Sequência (Login, Adicionar Transação)
- Diagrama de Atividades (Gamificação)
- Diagrama de Componentes

### 3. 🗄️ [DIAGRAMA-ER.md](DIAGRAMA-ER.md)
**Modelo de Banco de Dados**
- Diagrama Entidade-Relacionamento
- Modelo Conceitual
- Modelo Lógico (todas as 9 tabelas)
- Modelo Físico (SQL completo PostgreSQL)
- Relacionamentos e cardinalidades
- Índices e constraints
- Views e funções úteis
- Dados de seed

### 4. 🎨 [DESIGN-INTERFACE.md](DESIGN-INTERFACE.md)
**Guia de Design e UI/UX**
- Identidade visual
- Paleta de cores (tema claro e escuro)
- Tipografia e hierarquia
- Componentes (botões, cards, inputs, modais, toast)
- Layouts (Dashboard, Transações, Perfil)
- Responsividade e breakpoints
- Acessibilidade (ARIA, contraste, tamanhos)
- Animações e transições

### 5. 📊 [APRESENTACAO.md](APRESENTACAO.md)
**Apresentação para o Hackathon**
- 5 Slides completos (Capa, Problema/Solução, Arquitetura, Features, Métricas)
- Roteiro de apresentação (4 minutos)
- Design visual dos slides
- Screenshots sugeridas
- Checklist pré-apresentação

---

## 🚀 Links Rápidos

| Recurso | Link |
|---------|------|
| **Demo Online** | https://derickturya.github.io/moneyflow-app/demo/ |
| **Repositório GitHub** | https://github.com/DerickTurya/moneyflow-app |
| **Tracking Dashboard** | http://localhost:3000/tracking.html (local) |

---

## 📦 Entregáveis do Hackathon

### ✅ 1. Frontend
**Localização**: `/demo/`
- `index.html` - Interface principal (2951 linhas)
- `styles.css` - Estilos completos (4445 linhas)
- `script.js` - Lógica da aplicação (4489 linhas)
- `moneyflow-tracking.js` - Sistema de tracking

**Features Implementadas:**
- ✅ Dashboard com saldo e gráficos
- ✅ Gestão completa de transações
- ✅ Sistema de gamificação (pontos, níveis, conquistas, streak)
- ✅ Personalização IA (análise de perfil, recomendações, insights)
- ✅ Criação de cartões virtuais
- ✅ 6 modos de acessibilidade
- ✅ Tema claro e escuro
- ✅ Responsivo (mobile, tablet, desktop)

### ✅ 2. Backend
**Localização**: `/backend/`
- `server.js` - Servidor Express
- `/src/routes/` - Rotas da API
- `/src/models/` - Modelos de dados
- `/src/middlewares/` - Auth, rate limiting, validation
- `package.json` - Dependências Node.js

**APIs Implementadas:**
- ✅ Autenticação (login, register)
- ✅ Tracking de eventos
- ✅ Analytics e métricas
- ✅ Gerenciamento de usuários

### ✅ 3. Banco de Dados
**Localização**: `/database/`
- `schema.sql` - Schema completo
- `user_events.sql` - Tabela de tracking
- `docker-compose.yml` - PostgreSQL via Docker

**Tabelas Implementadas:**
- ✅ users (usuários)
- ✅ transactions (transações)
- ✅ categories (categorias)
- ✅ gamification (pontos, níveis)
- ✅ achievements (conquistas)
- ✅ virtual_cards (cartões)
- ✅ user_events (tracking)
- ✅ ai_recommendations (IA)
- ✅ goals (metas)

### ✅ 4. Documentação
**Localização**: `/DOCUMENTACAO/`
- ✅ README.md - Documentação geral
- ✅ DIAGRAMAS-UML.md - 5 diagramas UML
- ✅ DIAGRAMA-ER.md - Modelo completo do banco
- ✅ DESIGN-INTERFACE.md - Guia de UI/UX
- ✅ APRESENTACAO.md - 5 slides + roteiro

### ✅ 5. Apresentação
**Formato**: Markdown (pode ser convertido para PowerPoint/PDF)
- ✅ 5 slides completos
- ✅ Roteiro de 4 minutos
- ✅ Design visual especificado
- ✅ Screenshots sugeridas

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Linhas de Código** | ~15.000 |
| **Arquivos** | 58 |
| **Telas/Screens** | 15+ |
| **Features** | 50+ |
| **Tabelas BD** | 9 |
| **APIs** | 10+ |
| **Diagramas UML** | 5 |
| **Modos Acessibilidade** | 6 |
| **Idiomas** | PT-BR |
| **Responsivo** | ✅ Mobile, Tablet, Desktop |

---

## 🛠️ Stack Tecnológico Completo

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+, Vanilla)
- Chart.js
- Material Icons
- LocalStorage API

### Backend
- Node.js v20+
- Express.js
- PostgreSQL 17.2
- JSON Web Token (JWT)
- bcrypt
- Docker

### DevOps
- Git & GitHub
- GitHub Pages (deploy frontend)
- Docker Compose (PostgreSQL)

---

## ✨ Diferenciais do Projeto

### 1. 🎮 Gamificação Completa
- Sistema de pontos por ações
- 5 níveis (Bronze → Diamante)
- 12+ conquistas desbloqueáveis
- Streak de dias consecutivos
- Leaderboard

### 2. 🤖 IA Personalizada
- Categorização automática (95% precisão)
- Análise de perfil financeiro (4 tipos)
- Recomendações contextuais
- Detecção de padrões de gastos
- Sugestão de metas inteligentes

### 3. ♿ Acessibilidade Total
- **Modo Cego**: Screen reader completo
- **Modo Surdo**: Alertas visuais
- **Modo Idoso**: Interface ampliada + tutorial
- **4 tamanhos de fonte**
- **3 modos de contraste**
- **3 níveis de espaçamento**

### 4. 📊 Analytics Avançado
- Tracking de eventos em tempo real
- Dashboard administrativo
- Métricas de engajamento
- Histórico completo de ações

### 5. 💳 Cartão Virtual Instantâneo
- Criação em 2 segundos
- Número válido + CVV + validade
- Design moderno estilo Nubank
- Persistência em localStorage

---

## 🎯 Funcionalidades Implementadas

### Core Features
✅ Login e registro de usuários
✅ Dashboard financeiro completo
✅ Adicionar/Editar/Excluir transações
✅ Categorização automática com IA
✅ Gráficos de categorias (Chart.js)
✅ Saldo em tempo real (receitas - despesas)
✅ Multi-moeda (BRL, USD, EUR, GBP)
✅ Busca e filtro de transações

### Gamificação
✅ Sistema de pontos
✅ 5 níveis de progressão
✅ 12+ conquistas
✅ Streak de dias consecutivos
✅ Notificações de progresso

### Personalização IA
✅ Análise de perfil financeiro
✅ Recomendações personalizadas
✅ Insights sobre gastos
✅ Metas sugeridas
✅ Detecção de padrões
✅ Produtos recomendados

### Acessibilidade
✅ Modo cego (screen reader)
✅ Modo surdo (alertas visuais)
✅ Modo idoso (UI ampliada)
✅ 4 tamanhos de fonte
✅ 3 modos de contraste
✅ 3 níveis de espaçamento

### Outros
✅ Tema claro e escuro
✅ Cartões virtuais
✅ Tracking de eventos
✅ PWA Ready
✅ Totalmente responsivo
✅ Logout funcional

---

## 📖 Como Usar Esta Documentação

### Para Apresentação do Hackathon:
1. **Leia**: [APRESENTACAO.md](APRESENTACAO.md)
2. **Prepare**: 5 slides baseados no modelo
3. **Ensaie**: Roteiro de 4 minutos
4. **Demo**: Teste o link online antes

### Para Avaliação Técnica:
1. **Visão Geral**: [README.md](README.md)
2. **Diagramas**: [DIAGRAMAS-UML.md](DIAGRAMAS-UML.md)
3. **Banco de Dados**: [DIAGRAMA-ER.md](DIAGRAMA-ER.md)
4. **Design**: [DESIGN-INTERFACE.md](DESIGN-INTERFACE.md)

### Para Instalação Local:
1. Siga o guia em [README.md](README.md) seção "Guia de Instalação"
2. Configure PostgreSQL via Docker
3. Inicie backend: `npm start`
4. Abra frontend: `demo/index.html`

---

## 🏆 Conquistas do Projeto

- ✅ **Sistema Completo**: Frontend + Backend + Database
- ✅ **Código Limpo**: ~15k linhas bem organizadas
- ✅ **Documentação Completa**: 5 arquivos detalhados
- ✅ **Deploy Online**: GitHub Pages funcionando
- ✅ **Responsivo**: Mobile, Tablet, Desktop
- ✅ **Acessível**: 6 modos de acessibilidade
- ✅ **Inovador**: IA + Gamificação + Acessibilidade
- ✅ **Escalável**: Arquitetura em 3 camadas
- ✅ **Seguro**: JWT, bcrypt, validações

---

## 📞 Contato

**Desenvolvedor**: Derick Turya  
**GitHub**: [@DerickTurya](https://github.com/DerickTurya)  
**Projeto**: [moneyflow-app](https://github.com/DerickTurya/moneyflow-app)  
**Demo**: https://derickturya.github.io/moneyflow-app/demo/  

---

## 📄 Licença

Desenvolvido para o **Hackathon 2025**

---

## 🙏 Agradecimentos

Obrigado pela oportunidade de apresentar o MoneyFlow no Hackathon 2025!

---

**💰 MoneyFlow: Transformando Finanças em Jogo 🎮**
