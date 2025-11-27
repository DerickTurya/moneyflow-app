# MoneyFlow AI - Demo Interativo 🚀

## O que é este Demo?

Este é um **protótipo HTML interativo** do MoneyFlow AI, criado para demonstração no Hackathon FMU 2025.2. Ele simula perfeitamente todas as funcionalidades do app mobile em um formato que funciona direto no navegador.

## ✨ Recursos do Demo

### 📱 Interface Responsiva
- **Design Mobile-First**: Otimizado para celular, mas funciona perfeitamente em tablet e desktop
- **Visual Moderno**: Gradientes, animações suaves, ícones Material Design
- **Navegação Intuitiva**: Bottom navigation igual a apps nativos

### 🎯 Funcionalidades Implementadas

1. **Dashboard**
   - Saldo total com receitas e despesas
   - Gráfico interativo de gastos por categoria (Chart.js)
   - Transações recentes
   - Insights da IA
   - Ações rápidas (PIX, Adicionar, Cashback, Assistente)

2. **Adicionar Transação**
   - Formulário completo para criar transações
   - **IA Automática**: Categoriza transações baseado na descrição
   - Validação de campos
   - Feedback visual com modal de sucesso
   - Sistema de pontos (gamificação)

3. **Lista de Transações**
   - Todas as transações com filtros
   - Busca por texto
   - Filtros por tipo (Receitas, Despesas)
   - Categorização automática com ícones

4. **Gamificação**
   - Sistema de níveis (Bronze, Prata, Ouro, Platina)
   - Barra de progresso visual
   - **6 Conquistas** com status de desbloqueio
   - Ranking/Leaderboard com posição do usuário
   - Desafio do mês
   - Pontuação por ações

5. **PIX**
   - Interface de transferência
   - Chaves PIX salvas
   - Valor personalizável

### 🎨 Design System

- **Cores**: Paleta roxa/azul profissional
- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Material Icons
- **Animações**: Transições suaves, hover effects
- **Responsivo**: Breakpoints para mobile, tablet e desktop

### 🤖 IA Integrada (Simulada)

O demo simula a categorização automática da IA:
- Analisa palavras-chave na descrição
- Categoriza automaticamente (Alimentação, Transporte, Moradia, etc.)
- Mostra confiança de 98%
- Sistema de pontos por ação

## 🚀 Como Usar

### Opção 1: Abrir Localmente
1. Abra o arquivo `index.html` no navegador
2. Pronto! O app está funcionando

### Opção 2: Com Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"
4. Acesse `http://localhost:5500`

### Opção 3: Servidor Python
```bash
# Na pasta demo/
python -m http.server 8000
```
Acesse: `http://localhost:8000`

## 📖 Fluxo de Demonstração

1. **Splash Screen** (2s): Logo animado
2. **Login**: Tela de entrada (clique em "Entrar")
3. **Dashboard**: 
   - Mostre o saldo total
   - Explique o gráfico de gastos
   - Destaque os insights da IA
4. **Adicionar Transação**:
   - Clique no botão "+" central
   - Digite: "Supermercado Carrefour"
   - Valor: 150
   - A IA irá categorizar automaticamente!
5. **Gamificação**:
   - Mostre o sistema de níveis
   - Explique as conquistas desbloqueadas
   - Destaque o ranking
6. **Transações**:
   - Liste todas as transações
   - Mostre os filtros

## 🎯 Diferencial para o Hackathon

Este demo permite:
- ✅ **Demonstração Visual Completa**: Todos podem ver o app funcionando
- ✅ **Interatividade Real**: Adicionar transações, ver gráficos atualizarem
- ✅ **Mobile-First**: Abra no celular para experiência autêntica
- ✅ **Sem Dependências**: Não precisa instalar nada
- ✅ **Código Limpo**: HTML/CSS/JS bem estruturado
- ✅ **Design Profissional**: Visual de app comercial

## 🔗 Arquitetura Real

Embora este seja um protótipo HTML, o projeto completo possui:

### Backend (Node.js + Express)
- API RESTful com 11 rotas
- JWT Authentication
- PostgreSQL + MongoDB + Redis
- Socket.io para real-time
- OpenAI GPT-4 integration

### Frontend (React Native + Expo)
- 5 telas principais
- React Navigation
- Vector Icons
- Chart Kit

### Database (PostgreSQL)
- 6 tabelas relacionais
- Triggers automáticos
- Views otimizadas
- Seed data completo

**Tudo está documentado em:**
- `/backend` - Código do servidor
- `/frontend` - App React Native
- `/database` - SQL Schema
- `/docs` - Documentação técnica
- `/presentation` - Pitch de 4 minutos

## 📱 Testando no Celular

1. **Opção 1**: Abra `index.html` direto no navegador do celular
2. **Opção 2**: Use um servidor local e acesse via IP local
3. **Opção 3**: Hospede no GitHub Pages (grátis)

### Deploy GitHub Pages (Opcional)
```bash
# Criar repositório e fazer push
git init
git add .
git commit -m "MoneyFlow AI Demo"
git branch -M main
git remote add origin <seu-repo>
git push -u origin main

# Ativar GitHub Pages em Settings > Pages
# Selecione branch 'main' e pasta 'demo'
```

## 🎨 Personalização

### Trocar Cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --primary: #6C5CE7;  /* Cor principal */
    --secondary: #A29BFE; /* Cor secundária */
    /* ... */
}
```

### Adicionar Transações Padrão
Edite o array `transactions` em `script.js`

### Modificar Categorias
Edite o objeto `categoryData` em `script.js`

## 💡 Dicas para Apresentação

1. **Comece pelo problema**: Múltiplos apps financeiros = complexo
2. **Mostre o demo ao vivo**: Adicione uma transação na frente da banca
3. **Destaque a IA**: Categorização automática com 98% de confiança
4. **Gamificação**: Sistema de pontos e conquistas engaja usuários
5. **Mostre o código**: Backend e banco de dados prontos para produção

## 📞 Suporte

Este demo foi criado para o **Hackathon FMU 2025.2** - Hub Financeiro Móvel com IA.

**Criado com ❤️ para demonstrar o poder da inovação financeira!**

---

**Tecnologias:** HTML5, CSS3, JavaScript ES6, Chart.js, Material Icons, Google Fonts
**Compatibilidade:** Chrome, Firefox, Safari, Edge (mobile e desktop)
**Licença:** Desenvolvido para fins educacionais e demonstração
