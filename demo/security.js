// 🔒 MoneyFlow Security Module
// Implementa segurança básica sem atrapalhar a apresentação

class MoneyFlowSecurity {
    constructor() {
        this.rateLimits = new Map();
        this.maxAttempts = 5;
        this.timeWindow = 60000; // 1 minuto
        this.init();
    }

    init() {
        console.log('🔒 Security module initialized');
        this.setupCSP();
        this.preventXSS();
        this.secureLocalStorage();
    }

    // Content Security Policy básico
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https:; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com;";
        
        // Não adiciona se já existir (modo apresentação)
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            // document.head.appendChild(meta); // Comentado para não bloquear recursos na apresentação
        }
    }

    // Prevenir XSS básico
    preventXSS() {
        // Sanitiza inputs quando necessário
        this.sanitizeInput = (input) => {
            if (typeof input !== 'string') return input;
            
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        };
    }

    // Proteger dados no localStorage
    secureLocalStorage() {
        // Encriptar dados sensíveis (básico)
        this.encode = (data) => {
            try {
                return btoa(encodeURIComponent(JSON.stringify(data)));
            } catch (e) {
                console.warn('⚠️ Encoding error:', e);
                return data;
            }
        };

        this.decode = (data) => {
            try {
                return JSON.parse(decodeURIComponent(atob(data)));
            } catch (e) {
                console.warn('⚠️ Decoding error:', e);
                return data;
            }
        };
    }

    // Rate limiting para prevenir spam
    checkRateLimit(action, identifier = 'general') {
        const key = `${action}_${identifier}`;
        const now = Date.now();
        
        if (!this.rateLimits.has(key)) {
            this.rateLimits.set(key, []);
        }

        const attempts = this.rateLimits.get(key);
        
        // Remover tentativas antigas (fora da janela de tempo)
        const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
        
        if (recentAttempts.length >= this.maxAttempts) {
            const oldestAttempt = Math.min(...recentAttempts);
            const timeToWait = this.timeWindow - (now - oldestAttempt);
            
            console.warn(`⏱️ Rate limit: aguarde ${Math.ceil(timeToWait / 1000)}s`);
            return false;
        }

        recentAttempts.push(now);
        this.rateLimits.set(key, recentAttempts);
        return true;
    }

    // Validar email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar senha (mínimo 6 caracteres para demo)
    validatePassword(password) {
        return password && password.length >= 6;
    }

    // Limpar dados sensíveis dos logs
    sanitizeForLog(data) {
        if (typeof data !== 'object') return data;
        
        const sanitized = { ...data };
        const sensitiveFields = ['password', 'token', 'accessToken', 'cvv', 'cardNumber', 'cpf'];
        
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***';
            }
        });
        
        return sanitized;
    }

    // Proteger contra clickjacking
    preventClickjacking() {
        if (window.self !== window.top) {
            console.warn('⚠️ Possível clickjacking detectado');
            // Em produção, redirecionaria: window.top.location = window.self.location;
        }
    }

    // Validar URL antes de navegação
    validateURL(url) {
        try {
            const parsed = new URL(url, window.location.origin);
            const allowedProtocols = ['http:', 'https:'];
            return allowedProtocols.includes(parsed.protocol);
        } catch (e) {
            return false;
        }
    }

    // Gerar ID seguro
    generateSecureId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${random}`;
    }

    // Validar CPF (formato brasileiro)
    validateCPF(cpf) {
        if (!cpf) return false;
        
        // Remove formatação
        cpf = cpf.replace(/[^\d]/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais (CPFs inválidos)
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        return true; // Validação básica (completa em produção)
    }

    // Mascarar dados sensíveis para exibição
    maskData(data, type) {
        if (!data) return '';
        
        switch (type) {
            case 'email':
                const [user, domain] = data.split('@');
                return `${user[0]}***@${domain}`;
            
            case 'cpf':
                return data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$2.***-**');
            
            case 'phone':
                return data.replace(/(\d{2})(\d{5})(\d{4})/, '(**) *****-$3');
            
            case 'card':
                return data.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 **** **** $4');
            
            default:
                return '***';
        }
    }

    // Prevenir injeção de código
    escapeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Verificar se está em ambiente seguro (HTTPS)
    checkSecureContext() {
        const isSecure = window.isSecureContext || window.location.protocol === 'https:';
        if (!isSecure && window.location.hostname !== 'localhost') {
            console.warn('⚠️ Conexão não segura. Use HTTPS em produção.');
        }
        return isSecure;
    }

    // Limpar dados sensíveis na saída
    clearSensitiveData() {
        // Limpar console
        if (typeof console.clear === 'function') {
            // console.clear(); // Comentado para debug na apresentação
        }

        // Limpar dados temporários
        sessionStorage.clear();
        
        console.log('🧹 Dados temporários limpos');
    }

    // Log seguro (esconde dados sensíveis)
    secureLog(message, data = null) {
        if (data) {
            console.log(message, this.sanitizeForLog(data));
        } else {
            console.log(message);
        }
    }

    // Verificar força da senha
    checkPasswordStrength(password) {
        let strength = 0;
        
        if (!password) return 'Muito fraca';
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'Fraca';
        if (strength <= 4) return 'Média';
        return 'Forte';
    }

    // Proteger contra CSRF (básico)
    generateCSRFToken() {
        return this.generateSecureId();
    }

    validateCSRFToken(token) {
        const savedToken = sessionStorage.getItem('csrf_token');
        return token === savedToken;
    }

    // Timeout de sessão (30 minutos)
    setupSessionTimeout(callback, minutes = 30) {
        const timeout = minutes * 60 * 1000;
        
        let timer = setTimeout(() => {
            console.log('⏱️ Sessão expirada por inatividade');
            if (callback) callback();
        }, timeout);

        // Resetar timer em atividade
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                console.log('⏱️ Sessão expirada por inatividade');
                if (callback) callback();
            }, timeout);
        };

        // Escutar eventos de atividade
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        return timer;
    }
}

// Instanciar globalmente
window.MoneyFlowSecurity = new MoneyFlowSecurity();

// Prevenir clickjacking
window.MoneyFlowSecurity.preventClickjacking();

// Verificar contexto seguro
window.MoneyFlowSecurity.checkSecureContext();

console.log('✅ MoneyFlow Security Module carregado');
