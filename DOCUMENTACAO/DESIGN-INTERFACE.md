# 🎨 Design de Interface - MoneyFlow

## 📋 Índice
1. [Identidade Visual](#identidade-visual)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Componentes](#componentes)
5. [Layouts](#layouts)
6. [Responsividade](#responsividade)
7. [Acessibilidade](#acessibilidade)

---

## 🎯 Identidade Visual

### Logo e Nome
- **Nome**: MoneyFlow
- **Conceito**: Fluxo contínuo de dinheiro e controle financeiro
- **Ícone**: 💰 (símbolo de dinheiro com movimento)
- **Slogan**: "Sua jornada financeira, gamificada"

### Princípios de Design
- **Minimalista**: Interface limpa e objetiva
- **Moderno**: Uso de gradientes, sombras e animações suaves
- **Intuitivo**: Navegação clara e lógica
- **Acessível**: Contraste adequado e suporte a leitores de tela

---

## 🎨 Paleta de Cores

### Cores Primárias

```css
/* Verde Principal - Sucesso, Positivo */
--primary: #00b894;
--primary-dark: #00856f;
--primary-light: #55efc4;

/* Tema Claro */
--background: #f8f9fa;
--surface: #ffffff;
--text: #2d3436;
--text-secondary: #636e72;

/* Tema Escuro */
--dark-background: #0a0a0a;
--dark-surface: #1a1a1a;
--dark-card: #252525;
--dark-text: #e8e8e8;
--dark-text-secondary: #b0b0b0;
```

### Cores Secundárias

```css
/* Status Colors */
--success: #00b894; /* Verde */
--danger: #d63031;  /* Vermelho */
--warning: #fdcb6e; /* Amarelo */
--info: #0984e3;    /* Azul */

/* Categorias */
--food: #e74c3c;       /* Alimentação - Vermelho */
--transport: #3498db;  /* Transporte - Azul */
--housing: #9b59b6;    /* Moradia - Roxo */
--health: #27ae60;     /* Saúde - Verde */
--education: #e67e22;  /* Educação - Laranja */
--leisure: #f39c12;    /* Lazer - Amarelo */
--salary: #00b894;     /* Salário - Verde */
--shopping: #e84393;   /* Compras - Rosa */
--other: #95a5a6;      /* Outros - Cinza */
```

### Gradientes

```css
/* Gradiente Principal - Header, Cards */
background: linear-gradient(135deg, #00b894 0%, #00856f 100%);

/* Gradiente Dark - Tema Escuro */
background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);

/* Gradiente Cartão Virtual */
background: linear-gradient(135deg, #00b894 0%, #00856f 100%);

/* Gradiente Nível Prata */
background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
```

---

## ✍️ Tipografia

### Fonte Principal
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Hierarquia Tipográfica

```css
/* Títulos */
h1 { font-size: 32px; font-weight: 700; line-height: 1.2; }
h2 { font-size: 24px; font-weight: 600; line-height: 1.3; }
h3 { font-size: 18px; font-weight: 600; line-height: 1.4; }

/* Corpo de Texto */
body { font-size: 16px; font-weight: 400; line-height: 1.5; }
.small { font-size: 14px; }
.tiny { font-size: 12px; }

/* Destaques */
.balance { font-size: 48px; font-weight: 700; }
.amount { font-size: 20px; font-weight: 600; }
```

### Tamanhos de Fonte (Acessibilidade)
- **Small**: 0.875em (14px)
- **Normal**: 1em (16px)
- **Large**: 1.125em (18px)
- **X-Large**: 1.25em (20px)

---

## 🧩 Componentes

### 1. Botões

```css
/* Botão Primário */
.btn-primary {
    background: var(--primary);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 184, 148, 0.3);
}

/* Botão Secundário */
.btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
}

/* Botão Perigo */
.btn-danger {
    background: var(--danger);
    color: white;
}
```

**Variações:**
- Primary (verde)
- Secondary (outline verde)
- Danger (vermelho)
- Success (verde claro)
- Icon (apenas ícone)

### 2. Cards

```css
/* Card Padrão */
.card {
    background: var(--surface);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Card com Gradiente */
.card-gradient {
    background: linear-gradient(135deg, #00b894 0%, #00856f 100%);
    color: white;
}

/* Card de Estatística */
.stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
}

.stat-card .icon {
    font-size: 32px;
    padding: 12px;
    background: rgba(0, 184, 148, 0.1);
    border-radius: 12px;
}

.stat-card h3 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
}

.stat-card p {
    color: var(--text-secondary);
    font-size: 14px;
}
```

**Tipos:**
- Card padrão
- Card gradiente
- Card de estatística
- Card de transação
- Card de conquista

### 3. Inputs

```css
/* Input de Texto */
.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(0, 184, 148, 0.1);
}

/* Input com Ícone */
.input-group {
    position: relative;
}

.input-group .material-icons {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.input-group .form-input {
    padding-left: 44px;
}

/* Select Personalizado */
.custom-select {
    appearance: none;
    background-image: url("data:image/svg+xml,...");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 40px;
}
```

### 4. Modais

```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: var(--surface);
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
```

### 5. Toast Notifications

```css
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 9999;
    animation: slideDown 0.3s ease, slideUp 0.3s ease 2.7s;
}

.toast.success {
    border-left: 4px solid var(--success);
}

.toast.error {
    border-left: 4px solid var(--danger);
}
```

### 6. Badges

```css
.badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.badge-bronze { background: #cd7f32; color: white; }
.badge-prata { background: #c0c0c0; color: #333; }
.badge-ouro { background: #ffd700; color: #333; }
.badge-platina { background: #e5e4e2; color: #333; }
.badge-diamante { background: #b9f2ff; color: #333; }
```

---

## 📱 Layouts

### 1. Dashboard

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  Olá, João Silva 👋                     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Balance Card (Gradient)                │
│  💰 Saldo Total                         │
│  R$ 2.343,20                            │
│  [Receitas] [Despesas]                  │
└─────────────────────────────────────────┘
┌──────────────┬──────────────────────────┐
│  Quick       │  Gráfico                 │
│  Actions     │  de Categorias           │
│  [+ Add]     │  (Chart.js)              │
│  [Transfer]  │                          │
│  [Pix]       │                          │
└──────────────┴──────────────────────────┘
┌─────────────────────────────────────────┐
│  Transações Recentes                    │
│  ┌──────────────────────────┐           │
│  │ 🛒 Supermercado -156.80  │           │
│  │ 💰 Salário      +4500.00 │           │
│  │ 🚗 Uber         -28.50   │           │
│  └──────────────────────────┘           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Bottom Navigation                      │
│  [Dashboard] [Transações] [Pontos] [▲]  │
└─────────────────────────────────────────┘
```

### 2. Transações

```
┌─────────────────────────────────────────┐
│  ← Transações                    [≡]    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [🔍 Buscar transações...]              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [Todas] [Receitas] [Despesas]          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Lista de Transações                    │
│  ┌──────────────────────────────────┐   │
│  │ 🛒 Supermercado Extra           │   │
│  │    Alimentação • Ontem          │   │
│  │    R$ 156,80                    │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ 💰 Salário                      │   │
│  │    Salário • 21/11              │   │
│  │    +R$ 4500,00                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [+] Botão Flutuante                    │
└─────────────────────────────────────────┘
```

### 3. Perfil

```
┌─────────────────────────────────────────┐
│  ← João Silva                    [⚙]    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         😊                              │
│      João Silva                         │
│  joao.silva@email.com                   │
└─────────────────────────────────────────┘
┌──────────┬──────────┬──────────────────┐
│  2.450   │ 12 dias  │  Prata           │
│  Pontos  │ Sequência│  Nível           │
└──────────┴──────────┴──────────────────┘
┌─────────────────────────────────────────┐
│  Conta                                  │
│  ▸ Dados Pessoais              >        │
│  ▸ Segurança                   >        │
│  ▸ Notificações                >        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Personalização                         │
│  ▸ Tema                        >        │
│  ▸ Acessibilidade              >        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [🚪 Sair da Conta]                     │
└─────────────────────────────────────────┘
```

---

## 📐 Responsividade

### Breakpoints

```css
/* Mobile Small */
@media (max-width: 480px) {
    /* Fonte menor, grids 1 coluna */
}

/* Mobile */
@media (max-width: 768px) {
    /* Grids 2 colunas, padding reduzido */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
    /* Grids 3-4 colunas */
}

/* Desktop */
@media (min-width: 1025px) {
    /* Layout completo, sidebars */
}
```

### Grid System

```css
/* Grid Responsivo */
.grid {
    display: grid;
    gap: 20px;
}

/* Desktop: 4 colunas */
@media (min-width: 1025px) {
    .grid { grid-template-columns: repeat(4, 1fr); }
}

/* Tablet: 2 colunas */
@media (min-width: 769px) and (max-width: 1024px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile: 1 coluna */
@media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
}
```

---

## ♿ Acessibilidade

### Contraste

```css
/* Modo Alto Contraste */
.high-contrast {
    --background: #000000;
    --text: #ffffff;
    --primary: #ffff00;
}

/* Modo Preto e Branco */
.bw-mode {
    filter: grayscale(100%);
}

/* Modo Amarelo e Preto */
.yb-mode {
    --background: #000000;
    --text: #ffff00;
    --primary: #ffff00;
}
```

### ARIA Labels

```html
<!-- Botões -->
<button aria-label="Adicionar nova transação">+</button>

<!-- Navegação -->
<nav aria-label="Navegação principal">...</nav>

<!-- Formulários -->
<input aria-label="Valor da transação" type="number">

<!-- Status -->
<div role="status" aria-live="polite">
    Transação adicionada com sucesso
</div>
```

### Tamanhos de Toque

```css
/* Mínimo 44x44px para toque */
.touchable {
    min-width: 44px;
    min-height: 44px;
}
```

---

## 🎬 Animações

### Transições Suaves

```css
/* Padrão */
transition: all 0.3s ease;

/* Hover em Cards */
.card:hover {
    transform: translateY(-4px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.loading {
    animation: spin 1s linear infinite;
}

/* Fade In */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
```

---

## 📏 Espaçamento

### Sistema de Espaçamento

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

### Border Radius

```css
--border-radius-sm: 8px;
--border-radius-md: 12px;
--border-radius-lg: 16px;
--border-radius-xl: 20px;
--border-radius-full: 9999px;
```

---

## 🖼️ Ícones

### Material Icons
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" 
      rel="stylesheet">

<!-- Uso -->
<span class="material-icons">dashboard</span>
<span class="material-icons">account_balance_wallet</span>
<span class="material-icons">emoji_events</span>
```

### Emojis como Ícones
```
💰 Dinheiro
🛒 Compras
🚗 Transporte
🏠 Casa
💊 Saúde
📚 Educação
🎬 Lazer
📈 Investimentos
🎁 Cashback
🏆 Conquistas
```

---

## 🎯 Princípios de Usabilidade

1. **Clareza**: Interface autoexplicativa
2. **Feedback**: Resposta visual a cada ação
3. **Consistência**: Padrões mantidos em todas as telas
4. **Eficiência**: Ações em poucos cliques
5. **Prevenção de Erros**: Validações e confirmações
6. **Flexibilidade**: Atalhos para usuários avançados
7. **Minimalismo**: Apenas o essencial visível

---

**Desenvolvido para o Hackathon 2025**
