# 🔒 MoneyFlow - Documentação de Segurança

## Visão Geral

Este documento descreve as medidas de segurança implementadas no MoneyFlow para proteger dados dos usuários sem comprometer a experiência de demonstração do projeto no hackathon.

---

## 🛡️ Medidas de Segurança Implementadas

### 1. Rate Limiting
**Objetivo**: Prevenir spam e ataques de força bruta

**Implementação**:
- Limite de 5 tentativas por minuto para cada ação
- Janela de tempo de 60 segundos
- Aplicado em: login, registro, transações

```javascript
// Exemplo de uso
if (!MoneyFlowSecurity.checkRateLimit('login', userEmail)) {
    alert('Muitas tentativas. Aguarde 1 minuto.');
    return;
}
```

### 2. Validação de Entrada
**Objetivo**: Prevenir XSS e injeção de código

**Implementação**:
- Sanitização de todos os inputs do usuário
- Escape de HTML em dados exibidos
- Validação de formatos (email, CPF, telefone)

```javascript
// Email
MoneyFlowSecurity.validateEmail(email);

// Senha (mínimo 6 caracteres para demo)
MoneyFlowSecurity.validatePassword(password);

// CPF
MoneyFlowSecurity.validateCPF(cpf);
```

### 3. Proteção de Dados Sensíveis
**Objetivo**: Mascarar dados pessoais em logs e interface

**Implementação**:
- Máscaras para CPF, email, telefone, cartão
- Logs sanitizados (sem senhas/tokens)
- Encoding básico de dados no localStorage

```javascript
// Mascarar dados
MoneyFlowSecurity.maskData('123.456.789-00', 'cpf');
// Resultado: ***.456.***-**

// Log seguro (esconde senhas)
MoneyFlowSecurity.secureLog('Login:', { email, password });
// Console: Login: { email: 'user@email.com', password: '***' }
```

### 4. Timeout de Sessão
**Objetivo**: Logout automático por inatividade

**Implementação**:
- Timeout padrão: 30 minutos
- Resetado em qualquer atividade do usuário
- Callbacks configuráveis

```javascript
// Setup (já configurado no sistema)
MoneyFlowSecurity.setupSessionTimeout(() => {
    window.doLogout();
}, 30);
```

### 5. Prevenção de Clickjacking
**Objetivo**: Evitar que o site seja carregado em iframes maliciosos

**Implementação**:
- Verificação se `window.self !== window.top`
- Alerta no console se detectado
- (Em produção: redirecionamento automático)

### 6. Content Security Policy (CSP)
**Objetivo**: Limitar recursos que podem ser carregados

**Implementação**:
- CSP básico configurado
- Comentado durante apresentação (não bloqueia recursos)
- Ativável em produção

### 7. Validação de URLs
**Objetivo**: Prevenir redirecionamentos maliciosos

**Implementação**:
- Whitelist de protocolos (http, https)
- Validação antes de navegação externa

```javascript
if (MoneyFlowSecurity.validateURL(url)) {
    window.open(url, '_blank');
}
```

### 8. Proteção CSRF
**Objetivo**: Prevenir requisições falsificadas

**Implementação**:
- Geração de tokens CSRF
- Validação em operações sensíveis
- Armazenado em sessionStorage

```javascript
// Gerar token
const token = MoneyFlowSecurity.generateCSRFToken();
sessionStorage.setItem('csrf_token', token);

// Validar
if (MoneyFlowSecurity.validateCSRFToken(receivedToken)) {
    // Processar requisição
}
```

### 9. Força de Senha
**Objetivo**: Incentivar senhas fortes

**Implementação**:
- Análise de comprimento e complexidade
- Feedback visual em tempo real
- Níveis: Fraca, Média, Forte

```javascript
const strength = MoneyFlowSecurity.checkPasswordStrength(password);
// Retorna: 'Fraca', 'Média' ou 'Forte'
```

### 10. Limpeza de Dados Sensíveis
**Objetivo**: Remover dados temporários ao sair

**Implementação**:
- Limpa sessionStorage
- Opcional: limpa console
- Executado no logout

---

## 🔐 Dados Protegidos

### No LocalStorage (Encoded)
- ✅ Dados do usuário
- ✅ Token de acesso
- ✅ Transações
- ✅ Preferências

### Mascarados na Interface
- ✅ CPF: `***.456.***-**`
- ✅ Email: `u***@email.com`
- ✅ Telefone: `(**) *****-1234`
- ✅ Cartão: `4532 **** **** 1234`

### Ocultados em Logs
- ✅ Senhas
- ✅ Tokens de autenticação
- ✅ CVV de cartões
- ✅ Números completos de cartão

---

## ⚙️ Configuração de Segurança

### Modo Apresentação (Padrão)
```javascript
const config = {
    DEMO_MODE: true,              // Permite acesso sem autenticação real
    RATE_LIMIT_ENABLED: true,     // Rate limiting ativo
    SESSION_TIMEOUT: 30,          // 30 minutos
    MAX_ATTEMPTS: 5,              // 5 tentativas
    CSP_ENABLED: false,           // Desabilitado para não bloquear recursos
    CONSOLE_LOGS: true            // Logs visíveis para debug
};
```

### Modo Produção (Recomendado)
```javascript
const config = {
    DEMO_MODE: false,             // Requer autenticação real
    RATE_LIMIT_ENABLED: true,
    SESSION_TIMEOUT: 15,          // 15 minutos (mais restritivo)
    MAX_ATTEMPTS: 3,              // 3 tentativas
    CSP_ENABLED: true,            // Ativa CSP
    CONSOLE_LOGS: false           // Desabilita logs em produção
};
```

---

## 🚀 Como Usar

### 1. Incluir no HTML
```html
<!-- Adicionar antes do script.js -->
<script src="security.js"></script>
```

### 2. Usar nas Funções
```javascript
// Validar email no login
function handleLogin() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    // Rate limiting
    if (!MoneyFlowSecurity.checkRateLimit('login', email)) {
        showToast('Muitas tentativas. Aguarde.', 'error');
        return;
    }
    
    // Validação
    if (!MoneyFlowSecurity.validateEmail(email)) {
        showToast('Email inválido', 'error');
        return;
    }
    
    if (!MoneyFlowSecurity.validatePassword(password)) {
        showToast('Senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    // Prosseguir com login...
}
```

### 3. Mascarar Dados
```javascript
// Na exibição de perfil
document.getElementById('cpf-display').textContent = 
    MoneyFlowSecurity.maskData(user.cpf, 'cpf');

document.getElementById('email-display').textContent = 
    MoneyFlowSecurity.maskData(user.email, 'email');
```

---

## ⚠️ Considerações Importantes

### Para a Apresentação do Hackathon
- ✅ Segurança está **ATIVA** mas **não invasiva**
- ✅ Não bloqueia demonstrações
- ✅ Não requer HTTPS (funciona em localhost e GitHub Pages)
- ✅ Rate limiting suave (5 tentativas/minuto)
- ✅ Timeout longo (30 minutos)
- ✅ Logs visíveis para debug

### Para Produção Real
- ⚠️ Ativar HTTPS obrigatório
- ⚠️ Reduzir timeout de sessão (15 minutos)
- ⚠️ Aumentar validações de senha (mínimo 8 caracteres + complexidade)
- ⚠️ Implementar CAPTCHA após X tentativas
- ⚠️ Ativar CSP completo
- ⚠️ Desabilitar logs em console
- ⚠️ Implementar auditoria de segurança
- ⚠️ Adicionar autenticação de dois fatores (2FA)

---

## 🧪 Testes de Segurança

### 1. Rate Limiting
```javascript
// Tentar login 6 vezes seguidas
for (let i = 0; i < 6; i++) {
    handleLogin(); // 6ª tentativa deve ser bloqueada
}
```

### 2. XSS Prevention
```javascript
// Tentar injetar HTML
const maliciousInput = '<script>alert("XSS")</script>';
const sanitized = MoneyFlowSecurity.sanitizeInput(maliciousInput);
// Resultado: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### 3. Validação de Dados
```javascript
// Emails inválidos
MoneyFlowSecurity.validateEmail('invalid');        // false
MoneyFlowSecurity.validateEmail('test@');          // false
MoneyFlowSecurity.validateEmail('test@test.com');  // true

// CPFs inválidos
MoneyFlowSecurity.validateCPF('111.111.111-11');   // false
MoneyFlowSecurity.validateCPF('123.456.789-00');   // true
```

---

## 📊 Estatísticas de Segurança

| Métrica | Valor | Status |
|---------|-------|--------|
| Rate Limiting | ✅ Ativo | 5 req/min |
| Validação XSS | ✅ Ativo | 100% inputs |
| Máscaras de Dados | ✅ Ativo | CPF, Email, Tel, Card |
| Session Timeout | ✅ Ativo | 30 min |
| CSRF Protection | ✅ Ativo | Token-based |
| Logs Sanitizados | ✅ Ativo | Senhas ocultas |
| Clickjacking | ✅ Protegido | Frame detection |
| Password Strength | ✅ Ativo | 3 níveis |

---

## 🔧 Manutenção

### Atualizar Configurações
Editar `demo/.env.example` e criar `.env` local:
```bash
# Copiar exemplo
cp demo/.env.example demo/.env

# Editar valores
nano demo/.env
```

### Desabilitar Temporariamente
Para debug ou testes específicos:
```javascript
// No console do navegador
MoneyFlowSecurity.maxAttempts = 999; // Desabilita rate limiting
```

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## 📞 Suporte

Para questões de segurança, contactar:
- **Desenvolvedor**: Derick Turya
- **GitHub Issues**: https://github.com/DerickTurya/moneyflow-app/issues
- **Security Policy**: Reportar vulnerabilidades via GitHub Security

---

**🔒 MoneyFlow: Finanças Seguras e Acessíveis**

*Última atualização: 27/11/2025*
