# 🔐 Guia de Segurança - MoneyFlow

## Para Apresentação do Hackathon

### ✅ O que está protegido (SEM atrapalhar a demo):

1. **Rate Limiting Suave**
   - Login: 5 tentativas/minuto
   - Transações: 5 adições/minuto
   - ✅ Permite demonstração fluida

2. **Validação de Entrada**
   - XSS prevention (sanitiza HTML)
   - Validação de email/CPF/telefone
   - ✅ Não interfere com dados demo

3. **Máscaras de Dados Sensíveis**
   - CPF: `***.456.***-**`
   - Email: `u***@email.com`
   - ✅ Protege privacidade em screenshots

4. **Timeout de Sessão**
   - 30 minutos de inatividade
   - ✅ Tempo suficiente para apresentação

5. **Logs Sanitizados**
   - Senhas/tokens ocultados
   - ✅ Seguro para compartilhar tela

### ⚠️ O que NÃO está ativo (para facilitar demo):

1. **CSP Restritivo** - Comentado (não bloqueia CDNs)
2. **CAPTCHA** - Não implementado (fluidez)
3. **2FA** - Não implementado (demo mode)
4. **HTTPS Obrigatório** - Funciona em localhost

---

## Como Testar na Apresentação

### Teste 1: Rate Limiting
```javascript
// No console do navegador:
// Tente fazer login 6 vezes seguidas
// A 6ª tentativa será bloqueada
```

### Teste 2: Validação
```javascript
// Tente adicionar transação com:
// Descrição: <script>alert('xss')</script>
// Será sanitizado automaticamente
```

### Teste 3: Máscaras
```javascript
// Vá ao Perfil e veja CPF mascarado
// Email também aparece parcialmente oculto
```

---

## Ativando Segurança Total (Produção)

### 1. Editar `demo/security.js`:
```javascript
// Linha ~20: Descomentar CSP
document.head.appendChild(meta);

// Linha ~88: Reduzir timeout
setupSessionTimeout(callback, 15); // 15 minutos
```

### 2. Criar `demo/.env`:
```bash
DEMO_MODE=false
MAX_LOGIN_ATTEMPTS=3
SESSION_TIMEOUT_MINUTES=15
```

### 3. Backend - Adicionar CORS restritivo:
```javascript
app.use(cors({
    origin: 'https://derickturya.github.io',
    credentials: true
}));
```

---

## Comandos Úteis

### Ver tentativas de rate limit:
```javascript
console.log(window.MoneyFlowSecurity.rateLimits);
```

### Resetar rate limit (debug):
```javascript
window.MoneyFlowSecurity.rateLimits.clear();
```

### Desabilitar temporariamente:
```javascript
window.MoneyFlowSecurity.maxAttempts = 999;
```

---

## Checklist Pré-Apresentação

- [ ] ✅ `security.js` carregado no HTML
- [ ] ✅ Rate limiting funcionando
- [ ] ✅ Validações ativas
- [ ] ✅ Máscaras de dados visíveis
- [ ] ✅ Logs sanitizados
- [ ] ✅ Timeout configurado (30 min)
- [ ] ⚠️ CSP desabilitado (não bloqueia CDNs)
- [ ] ⚠️ Demo mode ativo

---

**🎯 Resultado**: Segurança robusta + Experiência fluida para apresentação!
