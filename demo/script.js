// Flag para controlar se é logout manual
let isLoggingOut = false;

// Função de logout GLOBAL
window.doLogout = function() {
    console.log('🚪 Iniciando logout...');
    
    // Marcar que é logout manual
    isLoggingOut = true;
    
    // Limpar dados
    localStorage.clear();
    
    // Resetar transações
    transactions = [];
    
    // Resetar usuário
    currentUser = {
        name: 'João',
        fullName: 'João Silva',
        email: 'joao@exemplo.com'
    };
    
    // Limpar campos de login
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
    
    // Voltar ao login
    window.showScreen('login-screen');
    
    setTimeout(() => {
        isLoggingOut = false;
        console.log('✅ Logout concluído');
    }, 500);
};

// Alias para compatibilidade
window.performLogout = window.doLogout;

// Data
let currentUser = {
    name: 'Paulo',
    fullName: 'Paulo Santos',
    email: 'paulo@exemplo.com'
};

// Restaurar usuário do localStorage se existir
function loadSavedUser() {
    try {
        const savedUser = localStorage.getItem('moneyflow_user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            currentUser = {
                id: userData.id,
                name: userData.name,
                fullName: userData.fullName,
                email: userData.email,
                cpf: userData.cpf || '',
                phone: userData.phone || '',
                birthdate: userData.birthdate || '',
                address: userData.address || {},
                financial_info: userData.financial_info || {}
            };
            
            // Restaurar transações salvas
            const savedTransactions = localStorage.getItem('moneyflow_transactions');
            if (savedTransactions) {
                if (typeof transactions !== 'undefined') {
                    transactions = JSON.parse(savedTransactions);
                }
            }
            
            // Restaurar tracking se tiver token
            if (userData.accessToken && window.MoneyFlowTracker) {
                window.MoneyFlowTracker.setUser(userData.id, userData.accessToken);
            }
            
            console.log('✅ Usuário restaurado:', currentUser);
        }
    } catch (error) {
        // LocalStorage pode estar bloqueado pelo navegador
        console.log('⚠️ LocalStorage não disponível (modo privado?)');
    }
}

// NÃO carregar automaticamente - será chamado no DOMContentLoaded quando necessário

// Se não tem usuário (primeira visita), inicializa tracking em modo visitante
if (!currentUser && window.MoneyFlowTracker) {
    window.MoneyFlowTracker.initialized = false; // Mantém como não inicializado até login
    console.log('🔍 Tracking pronto (aguardando login)');
}

// Transações demo - só usa se não tiver usuário salvo
let demoTransactions = [
    {
        id: 1,
        description: 'Supermercado Extra',
        amount: -156.80,
        type: 'expense',
        category: 'food',
        categoryName: 'Alimentação',
        date: new Date().toISOString().split('T')[0],
        icon: '🛒'
    },
    {
        id: 2,
        description: 'Salário',
        amount: 4500.00,
        type: 'income',
        category: 'salary',
        categoryName: 'Salário',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '💰'
    },
    {
        id: 3,
        description: 'Uber',
        amount: -28.50,
        type: 'expense',
        category: 'transport',
        categoryName: 'Transporte',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🚗'
    },
    {
        id: 4,
        description: 'Netflix',
        amount: -39.90,
        type: 'expense',
        category: 'leisure',
        categoryName: 'Lazer',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🎬'
    },
    {
        id: 5,
        description: 'Farmácia São Paulo',
        amount: -85.00,
        type: 'expense',
        category: 'health',
        categoryName: 'Saúde',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '💊'
    },
    {
        id: 6,
        description: 'Freelancer - Design',
        amount: 800.00,
        type: 'income',
        category: 'freelance',
        categoryName: 'Freelance',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '💼'
    },
    {
        id: 7,
        description: 'Restaurante Italiano',
        amount: -125.00,
        type: 'expense',
        category: 'food',
        categoryName: 'Alimentação',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🍝'
    },
    {
        id: 8,
        description: 'Academia',
        amount: -99.90,
        type: 'expense',
        category: 'health',
        categoryName: 'Saúde',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🏋️'
    },
    {
        id: 9,
        description: 'Aluguel',
        amount: -1200.00,
        type: 'expense',
        category: 'housing',
        categoryName: 'Moradia',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🏠'
    },
    {
        id: 10,
        description: 'Gasolina',
        amount: -180.00,
        type: 'expense',
        category: 'transport',
        categoryName: 'Transporte',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '⛽'
    },
    {
        id: 11,
        description: 'Cinema',
        amount: -60.00,
        type: 'expense',
        category: 'leisure',
        categoryName: 'Lazer',
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🎬'
    },
    {
        id: 12,
        description: 'Padaria',
        amount: -45.50,
        type: 'expense',
        category: 'food',
        categoryName: 'Alimentação',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🥖'
    },
    {
        id: 13,
        description: 'Conta de Luz',
        amount: -245.30,
        type: 'expense',
        category: 'housing',
        categoryName: 'Moradia',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '💡'
    },
    {
        id: 14,
        description: 'Internet',
        amount: -89.90,
        type: 'expense',
        category: 'housing',
        categoryName: 'Moradia',
        date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🌐'
    },
    {
        id: 15,
        description: 'iFood - Jantar',
        amount: -67.50,
        type: 'expense',
        category: 'food',
        categoryName: 'Alimentação',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🍔'
    },
    {
        id: 16,
        description: 'Starbucks',
        amount: -32.90,
        type: 'expense',
        category: 'food',
        categoryName: 'Alimentação',
        date: new Date().toISOString().split('T')[0],
        icon: '☕'
    },
    {
        id: 17,
        description: 'Investimento CDB',
        amount: 1000.00,
        type: 'income',
        category: 'investment',
        categoryName: 'Investimentos',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '📈'
    },
    {
        id: 18,
        description: 'Spotify Premium',
        amount: -21.90,
        type: 'expense',
        category: 'leisure',
        categoryName: 'Lazer',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🎵'
    },
    {
        id: 19,
        description: 'Livros Amazon',
        amount: -89.70,
        type: 'expense',
        category: 'education',
        categoryName: 'Educação',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '📚'
    },
    {
        id: 20,
        description: 'Dentista',
        amount: -350.00,
        type: 'expense',
        category: 'health',
        categoryName: 'Saúde',
        date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🦷'
    },
    {
        id: 21,
        description: 'Shopping - Roupas',
        amount: -280.00,
        type: 'expense',
        category: 'shopping',
        categoryName: 'Compras',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '👕'
    },
    {
        id: 22,
        description: 'Cashback Recebido',
        amount: 45.80,
        type: 'income',
        category: 'cashback',
        categoryName: 'Cashback',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🎁'
    },
    {
        id: 23,
        description: 'Farmácia Droga Raia',
        amount: -67.90,
        type: 'expense',
        category: 'health',
        categoryName: 'Saúde',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '💊'
    },
    {
        id: 24,
        description: 'Pet Shop',
        amount: -142.50,
        type: 'expense',
        category: 'other',
        categoryName: 'Outros',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🐾'
    },
    {
        id: 25,
        description: 'Curso Online Udemy',
        amount: -127.90,
        type: 'expense',
        category: 'education',
        categoryName: 'Educação',
        date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: '🎓'
    }
];

// Inicializar transactions vazio ou com dados salvos
let transactions = [];

// Se não tiver usuário salvo, usar transações demo
if (!localStorage.getItem('moneyflow_user')) {
    transactions = demoTransactions;
}

// Category Icons and Colors
const categoryData = {
    food: { icon: '🛒', color: '#e74c3c', name: 'Alimentação' },
    transport: { icon: '🚗', color: '#3498db', name: 'Transporte' },
    housing: { icon: '🏠', color: '#9b59b6', name: 'Moradia' },
    health: { icon: '💊', color: '#27ae60', name: 'Saúde' },
    education: { icon: '📚', color: '#e67e22', name: 'Educação' },
    leisure: { icon: '🎬', color: '#f39c12', name: 'Lazer' },
    salary: { icon: '💰', color: '#00b894', name: 'Salário' },
    freelance: { icon: '💼', color: '#00cec9', name: 'Freelance' },
    shopping: { icon: '🛍️', color: '#e84393', name: 'Compras' },
    investment: { icon: '📈', color: '#00b894', name: 'Investimentos' },
    cashback: { icon: '🎁', color: '#00b894', name: 'Cashback' },
    other: { icon: '📌', color: '#95a5a6', name: 'Outros' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se tem usuário salvo
    const savedUser = localStorage.getItem('moneyflow_user');
    
    // Show splash screen
    setTimeout(() => {
        // Se tem usuário salvo E não é logout, vai direto pro dashboard
        if (savedUser && !isLoggingOut) {
            console.log('✅ Usuário logado, indo para dashboard');
            loadSavedUser(); // Carregar dados do usuário
            showScreen('dashboard-screen');
            updateUserInterface();
            updateBalanceDisplay();
        } else {
            // Senão, mostra tela de login
            console.log('👤 Nenhum usuário logado, mostrando login');
            showScreen('login-screen');
        }
    }, 2000);

    // Set today's date for transaction form
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.value = today;
    }

    // Initialize all components
    initChart();
    updateBalanceDisplay();
    
    // Initialize exchange rate if on international transfer screen
    if (document.getElementById('from-amount')) {
        updateExchangeRate();
    }
    
    // Console log for demo
    console.log('🎉 MoneyFlow carregado com sucesso!');
    console.log('💰 Saldo total calculado automaticamente');
    console.log('🤖 IA de categorização ativa');
    console.log('🏆 Sistema de pontuação: ' + userPoints + ' pontos');
    console.log('🌍 Multi-moeda disponível: BRL, USD, EUR, GBP');
});

// Garantir que showScreen está disponível globalmente
window.showScreen = function(screenId) {
    console.log('🔄 showScreen chamado com:', screenId);
    
    // Remove active class from all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Add active class to target screen
    const targetScreen = document.getElementById(screenId);
    console.log('🎯 Target screen encontrado:', targetScreen);
    
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Update active nav item
        updateNavigation(screenId);
        
        // Render content based on screen
        if (screenId === 'dashboard-screen') {
            renderRecentTransactions();
        } else if (screenId === 'transactions-screen') {
            renderAllTransactions();
        } else if (screenId === 'personal-data-screen') {
            loadPersonalData();
        } else if (screenId === 'profile-screen') {
            console.log('✅ Atualizando interface do perfil');
            updateUserInterface();
        } else if (screenId === 'budgets-screen') {
            renderBudgets();
        } else if (screenId === 'insurance-screen') {
            renderMyInsurances();
        }
    } else {
        console.error('❌ Screen não encontrado:', screenId);
    }
};

// Carregar dados pessoais do usuário
function loadPersonalData() {
    if (!currentUser) return;
    
    // Nome
    const nameEl = document.getElementById('display-name');
    if (nameEl && currentUser.fullName) {
        nameEl.textContent = currentUser.fullName;
    }
    
    // CPF
    const cpfEl = document.getElementById('display-cpf');
    if (cpfEl && currentUser.cpf) {
        cpfEl.textContent = currentUser.cpf;
    }
    
    // Data de Nascimento
    const birthdateEl = document.getElementById('display-birthdate');
    if (birthdateEl && currentUser.birthdate) {
        birthdateEl.textContent = new Date(currentUser.birthdate).toLocaleDateString('pt-BR');
    }
    
    // Telefone
    const phoneEl = document.getElementById('display-phone');
    if (phoneEl && currentUser.phone) {
        phoneEl.textContent = currentUser.phone;
    }
    
    // Email
    const emailEl = document.getElementById('display-email');
    if (emailEl && currentUser.email) {
        emailEl.textContent = currentUser.email;
    }
    
    // Endereço
    const addressEl = document.getElementById('display-address');
    if (addressEl && currentUser.address) {
        const addr = currentUser.address;
        const addressText = `${addr.street || 'Rua Exemplo, 123'} - ${addr.neighborhood || 'Centro'}<br>${addr.city || 'São Paulo'}, ${addr.state || 'SP'} - ${addr.zipCode || '01234-567'}`;
        addressEl.innerHTML = addressText;
    }
    
    // Renda
    const incomeEl = document.getElementById('display-income');
    if (incomeEl && currentUser.financial_info && currentUser.financial_info.income) {
        incomeEl.textContent = `R$ ${parseFloat(currentUser.financial_info.income).toFixed(2).replace('.', ',')}`;
    }
}

// Scroll to Top
function scrollToTop() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        activeScreen.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Update Navigation Active State
function updateNavigation(screenId) {
    document.querySelectorAll('.bottom-nav .nav-item:not(.fab-nav)').forEach(item => {
        item.classList.remove('active');
    });

    const navMapping = {
        'dashboard-screen': 0,
        'transactions-screen': 1,
        'gamification-screen': 2,
        'profile-screen': 3
    };

    const index = navMapping[screenId];
    if (index !== undefined) {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item:not(.fab-nav)');
        if (navItems[index]) {
            navItems[index].classList.add('active');
        }
    }
}

// Login
async function login() {
    const email = document.getElementById('email-input')?.value;
    const password = document.getElementById('password-input')?.value;
    
    // Se é logout manual, não fazer login automático
    if (isLoggingOut) {
        console.log('⚠️ Logout em andamento, aguarde...');
        return;
    }
    
    // 🔒 SEGURANÇA: Rate limiting
    if (email && password && window.MoneyFlowSecurity) {
        if (!window.MoneyFlowSecurity.checkRateLimit('login', email)) {
            showToast('⏱️ Muitas tentativas. Aguarde 1 minuto.', 'error');
            return;
        }
    }
    
    // Se campos vazios, entrar no modo demo
    if (!email || !password) {
        console.log('🎬 Entrando no modo demo');
        
        // SEMPRE usar Paulo Santos em modo demo (não usar localStorage)
        localStorage.removeItem('moneyflow_user'); // Limpa qualquer usuário antigo
        
        currentUser = {
            id: '25a4b86d-0918-4312-b773-6b5bfc14cd02',
            name: 'Paulo',
            fullName: 'Paulo Santos',
            email: 'paulo@exemplo.com'
        };
        
        console.log('👤 Modo demo - Usuário:', currentUser.fullName, '| ID:', currentUser.id);
        
        // Inicializar tracking mesmo em modo demo
        if (window.MoneyFlowTracker) {
            window.MoneyFlowTracker.setUser(currentUser.id, 'demo_token');
            window.MoneyFlowTracker.track('login', {
                method: 'demo',
                success: true,
                email: 'paulo@exemplo.com'
            });
        }
        
        // Usar transações demo
        transactions = [...demoTransactions];
        
        // Ir para dashboard
        showScreen('dashboard-screen');
        
        setTimeout(() => {
            updateUserInterface();
            updateBalanceDisplay();
            renderRecentTransactions();
            initChart();
        }, 100);
        
        return;
    }
    
    try {
        // Fazer login real na API
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const result = await response.json();
            
            // Atualizar dados completos do usuário
            currentUser = {
                id: result.user.id,
                name: result.user.name.split(' ')[0],
                fullName: result.user.name,
                email: result.user.email,
                cpf: result.user.cpf || '',
                phone: result.user.phone || '',
                birthdate: result.user.birthdate || '',
                address: result.user.address || {},
                financial_info: result.user.financial_info || {}
            };
            
            // Salvar no localStorage
            localStorage.setItem('moneyflow_user', JSON.stringify({
                ...currentUser,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken
            }));
            
            // Inicializar tracking
            if (window.MoneyFlowTracker) {
                window.MoneyFlowTracker.setUser(currentUser.id, result.tokens.accessToken);
                window.MoneyFlowTracker.track('login', {
                    method: 'email',
                    success: true,
                    email: result.user.email
                });
            }
            
            console.log('✅ Login successful:', currentUser);
            
            // Ir para dashboard
            showScreen('dashboard-screen');
            
            // Atualizar interface após um momento
            setTimeout(() => {
                updateUserInterface();
                updateBalanceDisplay();
                renderRecentTransactions();
                initChart();
            }, 100);
        } else {
            const error = await response.json();
            alert(`Erro ao fazer login: ${error.error || 'Email ou senha incorretos'}`);
            return;
        }
    } catch (error) {
        console.warn('⚠️ API login failed:', error);
        alert(`Erro ao conectar com o servidor: ${error.message}`);
        return;
    }
}

// Register
async function register() {
    // Dados Pessoais
    const name = document.getElementById('register-name').value.trim();
    const cpf = document.getElementById('register-cpf').value.replace(/\D/g, '');
    const birthdate = document.getElementById('register-birthdate').value;
    const phone = document.getElementById('register-phone').value.replace(/\D/g, '');
    
    // Endereço
    const cep = document.getElementById('register-cep').value.replace(/\D/g, '');
    const city = document.getElementById('register-city').value.trim();
    const state = document.getElementById('register-state').value.trim().toUpperCase();
    
    // Dados de Acesso
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // Informações Financeiras (opcional)
    const income = document.getElementById('register-income')?.value || '';
    const occupation = document.getElementById('register-occupation')?.value || '';
    
    const termsChecked = document.getElementById('terms-checkbox').checked;

    // Validações Obrigatórias
    if (!name || !cpf || !birthdate || !phone || !cep || !city || !state || !email || !password || !confirm) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validar CPF
    if (cpf.length !== 11) {
        alert('CPF inválido. Digite 11 dígitos.');
        return;
    }

    // Validar telefone
    if (phone.length < 10 || phone.length > 11) {
        alert('Telefone inválido. Digite DDD + número.');
        return;
    }

    // Validar CEP
    if (cep.length !== 8) {
        alert('CEP inválido. Digite 8 dígitos.');
        return;
    }

    // Validar estado
    if (state.length !== 2) {
        alert('Estado inválido. Digite a sigla (ex: SP).');
        return;
    }

    // Validar idade mínima (18 anos)
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        alert('Você precisa ter no mínimo 18 anos para abrir uma conta.');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email inválido.');
        return;
    }

    // Validar senha
    if (password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    if (password !== confirm) {
        alert('As senhas não coincidem.');
        return;
    }

    if (!termsChecked) {
        alert('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
        return;
    }

    try {
        // Registrar na API
        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: name,
                email,
                phone: phone,
                password,
                cpf: cpf,
                birthdate: birthdate,
                address: {
                    cep: cep,
                    city: city,
                    state: state
                },
                financial_info: {
                    income: income,
                    occupation: occupation
                }
            })
        });

        if (response.ok) {
            const result = await response.json();
            
            // Atualizar dados completos do usuário
            currentUser = {
                id: result.user.id,
                name: result.user.name.split(' ')[0],
                fullName: result.user.name,
                email: result.user.email,
                cpf: cpf,
                phone: phone,
                birthdate: birthdate,
                address: {
                    cep: cep,
                    city: city,
                    state: state
                },
                financial_info: {
                    income: income,
                    occupation: occupation
                }
            };
            
            // Salvar no localStorage
            localStorage.setItem('moneyflow_user', JSON.stringify({
                ...currentUser,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken
            }));
            
            // Resetar transações para nova conta
            transactions = [];
            localStorage.setItem('moneyflow_transactions', JSON.stringify([]));
            
            // Inicializar tracking com dados completos
            if (window.MoneyFlowTracker) {
                window.MoneyFlowTracker.setUser(currentUser.id, result.tokens.accessToken);
                window.MoneyFlowTracker.track('register', {
                    method: 'email',
                    success: true,
                    email: result.user.email,
                    has_phone: true,
                    has_cpf: true,
                    age: age,
                    state: state,
                    has_income: !!income,
                    occupation: occupation || 'not_provided'
                });
            }
            
            console.log('✅ Registration successful:', currentUser);
            
            // Ir para dashboard primeiro
            showScreen('dashboard-screen');
            
            // Aguardar um momento para o DOM atualizar e então atualizar a interface
            setTimeout(() => {
                updateUserInterface();
                updateBalanceDisplay();
                renderRecentTransactions();
                initChart();
            }, 100);
            
            // Mensagem de sucesso
            setTimeout(() => {
                alert(`🎉 Conta criada com sucesso!\n\nBem-vindo(a) ao MoneyFlow, ${currentUser.name}!`);
            }, 200);
        } else {
            const error = await response.json();
            alert(`Erro no registro: ${error.error}`);
            return;
        }
    } catch (error) {
        console.warn('⚠️ API registration failed, using demo mode:', error);
        alert(`Erro ao conectar com o servidor: ${error.message}`);
        return;
    }
}

// Logout
window.logout = function() {
    console.log('🚪 Logout iniciado...');
    
    // Track logout antes de limpar
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('logout', {
            user_id: currentUser.id,
            email: currentUser.email
        });
    }
    
    // Limpar dados salvos
    localStorage.removeItem('moneyflow_user');
    localStorage.removeItem('moneyflow_transactions');
    
    // Resetar para dados demo
    currentUser = {
        name: 'Paulo',
        fullName: 'Paulo Santos',
        email: 'paulo@exemplo.com'
    };
    
    // Resetar transações demo
    transactions = [];
    
    // Voltar para tela de login
    window.showScreen('login-screen');
    
    console.log('✅ Logout realizado');
};

// Atualizar interface com dados do usuário
function updateUserInterface() {
    // Atualizar saudação no dashboard
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
        greetingElement.textContent = `Olá, ${currentUser.name}! 👋`;
    }

    // Atualizar nome no perfil
    const profileNameElement = document.querySelector('#profile-screen h2');
    if (profileNameElement) {
        profileNameElement.textContent = currentUser.fullName;
    }

    // Atualizar email no perfil (se existir)
    const profileEmailElement = document.querySelector('#profile-screen .profile-email');
    if (profileEmailElement) {
        profileEmailElement.textContent = currentUser.email;
    }
}

// Atualizar exibição do saldo
function updateBalanceDisplay() {
    // Calcular totais
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = income - expenses;

    // Atualizar elementos
    const balanceTotalEl = document.getElementById('balance-total');
    const balanceIncomeEl = document.getElementById('balance-income');
    const balanceExpensesEl = document.getElementById('balance-expenses');

    if (balanceTotalEl) {
        balanceTotalEl.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
    }
    if (balanceIncomeEl) {
        balanceIncomeEl.textContent = `R$ ${income.toFixed(2).replace('.', ',')}`;
    }
    if (balanceExpensesEl) {
        balanceExpensesEl.textContent = `R$ ${expenses.toFixed(2).replace('.', ',')}`;
    }
    
    // Atualizar cards de moedas na tela de transferência internacional
    const currencyBalanceBrl = document.getElementById('currency-balance-brl');
    const currencyBalanceUsd = document.getElementById('currency-balance-usd');
    const currencyBalanceEur = document.getElementById('currency-balance-eur');
    const currencyBalanceGbp = document.getElementById('currency-balance-gbp');
    
    if (currencyBalanceBrl) {
        currencyBalanceBrl.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
    }
    
    // Converter saldo BRL para outras moedas usando taxas de câmbio
    if (currencyBalanceUsd) {
        const usdAmount = balance * exchangeRates.BRL.USD;
        currencyBalanceUsd.textContent = `$ ${usdAmount.toFixed(2).replace('.', ',')}`;
    }
    
    if (currencyBalanceEur) {
        const eurAmount = balance * exchangeRates.BRL.EUR;
        currencyBalanceEur.textContent = `€ ${eurAmount.toFixed(2).replace('.', ',')}`;
    }
    
    if (currencyBalanceGbp) {
        const gbpAmount = balance * exchangeRates.BRL.GBP;
        currencyBalanceGbp.textContent = `£ ${gbpAmount.toFixed(2).replace('.', ',')}`;
    }
    
    // Track balance display for security monitoring
    if (window.MoneyFlowTracker && currentUser.id && balance !== undefined) {
        window.MoneyFlowTracker.track('balance_view', {
            balance: balance,
            income: income,
            expenses: expenses,
            screen: document.querySelector('.screen.active')?.id || 'unknown'
        });
    }
}

// Render Recent Transactions (Dashboard)
function renderRecentTransactions() {
    const container = document.getElementById('transactions-list');
    if (!container) return;

    const recentTransactions = transactions.slice(0, 5);
    container.innerHTML = recentTransactions.map(transaction => createTransactionHTML(transaction)).join('');
}

// Render All Transactions
function renderAllTransactions() {
    const container = document.getElementById('all-transactions-list');
    if (!container) return;

    container.innerHTML = transactions.map(transaction => createTransactionHTML(transaction)).join('');
}

// Create Transaction HTML
function createTransactionHTML(transaction) {
    const category = categoryData[transaction.category] || { icon: '💳', color: '#95a5a6' };
    const amountClass = transaction.type === 'income' ? 'income' : 'expense';
    const amountSign = transaction.type === 'income' ? '+' : '';
    const formattedDate = formatDate(transaction.date);

    return `
        <div class="transaction-item">
            <div class="transaction-icon" style="background: ${category.color}20; color: ${category.color};">
                ${category.icon}
            </div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.description}</div>
                <div class="transaction-subtitle">${transaction.categoryName} • ${formattedDate}</div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountSign}R$ ${Math.abs(transaction.amount).toFixed(2)}
            </div>
        </div>
    `;
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ontem';
    } else {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
}

// Add Transaction with AI Categorization
function addTransaction() {
    const description = document.getElementById('transaction-description').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const type = document.getElementById('transaction-type').value;
    const categorySelect = document.getElementById('transaction-category').value;
    const date = document.getElementById('transaction-date').value;

    if (!description || !amount || !date) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // 🔒 SEGURANÇA: Rate limiting para transações
    if (window.MoneyFlowSecurity) {
        if (!window.MoneyFlowSecurity.checkRateLimit('add_transaction', currentUser.id)) {
            showToast('⏱️ Muitas transações rápidas. Aguarde.', 'error');
            return;
        }
        
        // 🔒 SEGURANÇA: Sanitizar descrição
        const sanitizedDescription = window.MoneyFlowSecurity.sanitizeInput(description);
        if (sanitizedDescription !== description) {
            showToast('⚠️ Descrição contém caracteres inválidos', 'error');
            return;
        }
    }

    // AI Auto-categorization simulation with ML confidence
    let category = categorySelect || autoCategorizeByCategorySelect(description);
    const categoryInfo = Object.entries(categoryData).find(([key]) => key === category)?.[1] || categoryData.food;
    const aiConfidence = Math.floor(Math.random() * 10) + 90; // 90-100% confidence

    // Create new transaction
    const newTransaction = {
        id: transactions.length + 1,
        description,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        type,
        category,
        categoryName: categoryInfo.name,
        date,
        icon: categoryInfo.icon,
        aiCategorized: !categorySelect,
        confidence: aiConfidence
    };

    // Add to beginning of array
    transactions.unshift(newTransaction);

    // Track transaction with AI details
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.trackTransaction({
            transaction_id: newTransaction.id,
            amount: Math.abs(amount),
            type: type,
            category: category,
            description: description,
            ai_categorized: !categorySelect,
            ai_confidence: aiConfidence,
            payment_method: 'manual_entry'
        });
        
        // Security monitoring: detect unusual transactions
        const avgTransaction = transactions.length > 0 
            ? transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length 
            : 0;
        
        if (Math.abs(amount) > avgTransaction * 3 && transactions.length > 5) {
            window.MoneyFlowTracker.trackSecurityAlert('high_value_transaction', {
                amount: Math.abs(amount),
                average: avgTransaction,
                multiplier: (Math.abs(amount) / avgTransaction).toFixed(2),
                category: category,
                description: description
            });
        }
    }

    // Update all displays
    updateBalanceDisplay();
    renderRecentTransactions();
    renderAllTransactions();
    initChart();
    updateBudgetProgress();
    updateGamificationPoints(5); // +5 points for adding transaction

    // Show success modal with AI categorization
    showSuccessModal(categoryInfo.name);

    // Clear form
    document.getElementById('transaction-description').value = '';
    document.getElementById('transaction-amount').value = '';
    document.getElementById('transaction-type').value = 'expense';
    document.getElementById('transaction-category').value = '';
}

// Auto-categorize (AI simulation)
function autoCategorizeByCategorySelect(description) {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('supermercado') || lowerDesc.includes('mercado') || lowerDesc.includes('padaria') || lowerDesc.includes('restaurante') || lowerDesc.includes('lanche')) {
        return 'food';
    } else if (lowerDesc.includes('uber') || lowerDesc.includes('taxi') || lowerDesc.includes('bus') || lowerDesc.includes('metrô') || lowerDesc.includes('combustível')) {
        return 'transport';
    } else if (lowerDesc.includes('aluguel') || lowerDesc.includes('condomínio') || lowerDesc.includes('luz') || lowerDesc.includes('água') || lowerDesc.includes('internet')) {
        return 'housing';
    } else if (lowerDesc.includes('farmácia') || lowerDesc.includes('médico') || lowerDesc.includes('hospital') || lowerDesc.includes('academia')) {
        return 'health';
    } else if (lowerDesc.includes('curso') || lowerDesc.includes('livro') || lowerDesc.includes('escola') || lowerDesc.includes('faculdade')) {
        return 'education';
    } else if (lowerDesc.includes('cinema') || lowerDesc.includes('netflix') || lowerDesc.includes('spotify') || lowerDesc.includes('jogo')) {
        return 'leisure';
    } else if (lowerDesc.includes('salário') || lowerDesc.includes('pagamento')) {
        return 'salary';
    } else if (lowerDesc.includes('freelance') || lowerDesc.includes('freelancer')) {
        return 'freelance';
    }
    
    return 'food'; // Default
}

// Show Success Modal
function showSuccessModal(categoryName) {
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    modalTitle.textContent = 'Transação Adicionada!';
    modalMessage.textContent = `A IA categorizou automaticamente como "${categoryName}" com 98% de confiança!`;

    modal.classList.add('active');

    // Auto close after 3 seconds
    setTimeout(() => {
        closeModal();
        showScreen('dashboard-screen');
    }, 3000);
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('active');
}

// Realizar Transferência PIX
function realizarTransferenciaPix() {
    const amountInput = document.getElementById('pix-amount');
    const keyInput = document.getElementById('pix-key');
    
    const amountValue = amountInput.value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const amount = parseFloat(amountValue);
    const key = keyInput.value.trim();
    
    // Validações
    if (!amount || amount <= 0) {
        alert('Por favor, insira um valor válido!');
        return;
    }
    
    if (!key) {
        alert('Por favor, insira uma chave PIX!');
        return;
    }
    
    // Verifica saldo
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    if (amount > balance) {
        alert('Saldo insuficiente!');
        return;
    }
    
    // Detecta tipo de chave
    let keyType = 'random';
    if (key.includes('@')) {
        keyType = 'email';
    } else if (key.replace(/\D/g, '').length === 11 && !key.includes('(')) {
        keyType = 'cpf';
    } else if (key.includes('(') || key.replace(/\D/g, '').length > 10) {
        keyType = 'phone';
    }
    
    // Cria transação
    const newTransaction = {
        id: transactions.length + 1,
        description: `PIX para ${key}`,
        amount: -Math.abs(amount),
        type: 'expense',
        category: 'transfer',
        categoryName: 'Transferência',
        date: new Date().toISOString().split('T')[0],
        icon: '💸',
        aiCategorized: false,
        paymentMethod: 'pix'
    };
    
    transactions.unshift(newTransaction);
    
    // Salva no localStorage se for usuário real
    if (currentUser && currentUser.email) {
        localStorage.setItem('moneyflow_transactions', JSON.stringify(transactions));
    }
    
    // Tracking completo da transferência
    if (window.MoneyFlowTracker) {
        console.log('🎯 Enviando evento de transferência PIX:', amount, keyType);
        
        window.MoneyFlowTracker.trackTransaction({
            transaction_id: newTransaction.id,
            amount: amount,
            type: 'pix_transfer',
            category: 'transfer',
            description: `PIX para ${key}`,
            payment_method: 'pix',
            pix_key_type: keyType,
            pix_key: key.substring(0, 20) + '...', // Parcial por segurança
            success: true
        });
        
        // Track do botão de transferir
        window.MoneyFlowTracker.trackClick({
            button: 'pix_transfer_button',
            amount: amount,
            key_type: keyType,
            screen: 'pix-screen',
            action: 'pix_transfer'
        });
        
        console.log('✅ Eventos de PIX enviados ao tracking');
    }
    
    // Atualiza displays
    updateBalanceDisplay();
    renderRecentTransactions();
    renderAllTransactions();
    initChart();
    updateGamificationPoints(10); // +10 pontos por PIX
    
    // Verifica notificações imediatamente após transação importante (força verificação ignorando cooldown)
    setTimeout(() => {
        checkAndSendSmartNotifications(true);
    }, 500);
    
    // Mostra mensagem de sucesso
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = '✅ Transferência Concluída!';
    modalMessage.textContent = `PIX de R$ ${amount.toFixed(2).replace('.', ',')} realizado com sucesso para ${key}`;
    
    modal.classList.add('active');
    
    // Limpa campos
    amountInput.value = '';
    keyInput.value = '';
    
    // Auto fecha e volta pro dashboard
    setTimeout(() => {
        closeModal();
        showScreen('dashboard-screen');
    }, 3000);
}

// Resgatar Cashback
function resgatarCashback() {
    const cashbackElement = document.getElementById('cashback-amount');
    const cashbackText = cashbackElement.textContent;
    const cashbackValue = parseFloat(cashbackText.replace('R$', '').replace('.', '').replace(',', '.').trim());
    
    if (!cashbackValue || cashbackValue <= 0) {
        alert('Você não possui cashback disponível para resgatar!');
        return;
    }
    
    // Cria transação de resgate
    const newTransaction = {
        id: transactions.length + 1,
        description: 'Resgate de Cashback',
        amount: cashbackValue,
        type: 'income',
        category: 'cashback',
        categoryName: 'Cashback',
        date: new Date().toISOString().split('T')[0],
        icon: '💰',
        aiCategorized: false
    };
    
    transactions.unshift(newTransaction);
    
    // Salva no localStorage se for usuário real
    if (currentUser && currentUser.email) {
        localStorage.setItem('moneyflow_transactions', JSON.stringify(transactions));
    }
    
    // Tracking do resgate
    if (window.MoneyFlowTracker) {
        console.log('🎯 Enviando evento de resgate de cashback:', cashbackValue);
        
        window.MoneyFlowTracker.trackTransaction({
            transaction_id: newTransaction.id,
            amount: cashbackValue,
            type: 'cashback_redemption',
            category: 'cashback',
            description: 'Resgate de Cashback',
            success: true
        });
        
        window.MoneyFlowTracker.trackClick({
            button: 'cashback_redeem_button',
            amount: cashbackValue,
            screen: 'cashback-screen',
            action: 'redeem_cashback'
        });
        
        console.log('✅ Eventos de cashback enviados ao tracking');
    }
    
    // Zera o cashback disponível
    cashbackElement.textContent = 'R$ 0,00';
    
    // Atualiza displays
    updateBalanceDisplay();
    renderRecentTransactions();
    renderAllTransactions();
    initChart();
    updateGamificationPoints(15); // +15 pontos por resgatar cashback
    
    // Mostra mensagem de sucesso
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = '🎉 Cashback Resgatado!';
    modalMessage.textContent = `R$ ${cashbackValue.toFixed(2).replace('.', ',')} foi creditado na sua conta!`;
    
    modal.classList.add('active');
    
    // Auto fecha e volta pro dashboard
    setTimeout(() => {
        closeModal();
        showScreen('dashboard-screen');
    }, 3000);
}

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    // Calculate expenses by category
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        if (!expensesByCategory[t.category]) {
            expensesByCategory[t.category] = 0;
        }
        expensesByCategory[t.category] += Math.abs(t.amount);
    });
    
    // Track chart visualization (analytics feature)
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('chart_view', {
            chart_type: 'expenses_by_category',
            categories_count: Object.keys(expensesByCategory).length,
            total_expenses: Object.values(expensesByCategory).reduce((a, b) => a + b, 0),
            top_category: Object.keys(expensesByCategory).reduce((a, b) => 
                expensesByCategory[a] > expensesByCategory[b] ? a : b, Object.keys(expensesByCategory)[0]
            )
        });
    }

    // Prepare chart data
    const labels = Object.keys(expensesByCategory).map(key => categoryData[key]?.name || key);
    const data = Object.values(expensesByCategory);
    const colors = Object.keys(expensesByCategory).map(key => categoryData[key]?.color || '#95a5a6');

    // Update legend
    updateChartLegend(expensesByCategory);

    // Destroy existing chart if exists
    if (window.myPieChart) {
        window.myPieChart.destroy();
    }

    // Create new chart
    window.myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: R$ ${value.toFixed(2)}`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// Gamification System
let userPoints = 3150;
let userLevel = 'Prata';
let userStreak = 12;
let cashbackBalance = 87.40;
let totalSaved = 1520.00;

function updateGamificationPoints(points) {
    const previousPoints = userPoints;
    const previousLevel = userLevel;
    userPoints += points;
    
    // Update level based on points
    if (userPoints < 1000) {
        userLevel = 'Bronze';
    } else if (userPoints < 5000) {
        userLevel = 'Prata';
    } else if (userPoints < 15000) {
        userLevel = 'Ouro';
    } else {
        userLevel = 'Platina';
    }
    
    // Track gamification (unique MoneyFlow feature)
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('gamification_update', {
            points_added: points,
            total_points: userPoints,
            previous_level: previousLevel,
            current_level: userLevel,
            level_up: previousLevel !== userLevel
        });
    }
    
    // Show notification
    showPointsNotification(points);
}

function showPointsNotification(points) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    notification.innerHTML = `
        <span class="material-icons">stars</span>
        <span>+${points} pontos!</span>
    `;
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateBudgetProgress() {
    // Update budget alerts based on spending
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        if (!expensesByCategory[t.category]) {
            expensesByCategory[t.category] = 0;
        }
        expensesByCategory[t.category] += Math.abs(t.amount);
    });
    
    // Check budget limits and send alerts
    const budgetLimits = {
        food: 1000,
        transport: 600,
        housing: 1500,
        leisure: 400
    };
    
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
        const limit = budgetLimits[category];
        if (limit && amount > limit * 0.8) {
            const percentage = ((amount/limit)*100).toFixed(0);
            console.log(`⚠️ Alerta: ${categoryData[category]?.name} atingiu ${percentage}% do orçamento`);
            
            // Track budget alerts for risk monitoring
            if (window.MoneyFlowTracker) {
                window.MoneyFlowTracker.trackSecurityAlert('budget_alert', {
                    category: category,
                    amount: amount,
                    limit: limit,
                    percentage: percentage,
                    severity: percentage >= 100 ? 'high' : 'medium'
                });
            }
        }
    });
}

// Update Chart Legend
function updateChartLegend(expensesByCategory) {
    const legendContainer = document.getElementById('chart-legend');
    if (!legendContainer) return;

    // Sort by amount (descending)
    const sortedCategories = Object.entries(expensesByCategory)
        .sort((a, b) => b[1] - a[1]);

    legendContainer.innerHTML = sortedCategories.map(([category, amount]) => {
        const catData = categoryData[category] || { name: category, color: '#95a5a6' };
        return `
            <div class="legend-item">
                <span class="legend-color" style="background: ${catData.color};"></span>
                <span>${catData.name}</span>
                <strong>R$ ${amount.toFixed(2).replace('.', ',')}</strong>
            </div>
        `;
    }).join('');
}

// Input Masks for Registration
document.addEventListener('DOMContentLoaded', () => {
    // Máscara CPF - formato: 000.000.000-00
    const cpfInput = document.getElementById('register-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Aplica a máscara progressivamente
            if (value.length > 0) {
                value = value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
            }
            if (value.length > 7) {
                value = value.replace(/^(\d{3})\.(\d{3})(\d{0,3})/, '$1.$2.$3');
            }
            if (value.length > 11) {
                value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
            }
            
            e.target.value = value;
        });
    }

    // Máscara Telefone - formato: (00) 00000-0000 ou (00) 0000-0000
    const phoneInput = document.getElementById('register-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Aplica a máscara progressivamente
            if (value.length > 0) {
                // Adiciona parênteses no DDD
                if (value.length <= 2) {
                    value = value.replace(/^(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    // Fixo: (00) 0000-0000
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    // Celular: (00) 00000-0000
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }

    // Máscara CEP - formato: 00000-000
    const cepInput = document.getElementById('register-cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 8 dígitos
            if (value.length > 8) {
                value = value.slice(0, 8);
            }
            
            // Aplica a máscara progressivamente
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
            }
            
            e.target.value = value;
        });

        // Buscar endereço por CEP
        cepInput.addEventListener('blur', async (e) => {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        document.getElementById('register-city').value = data.localidade;
                        document.getElementById('register-state').value = data.uf;
                    }
                } catch (error) {
                    console.log('Erro ao buscar CEP:', error);
                }
            }
        });
    }

    // Máscara Renda - formato: R$ 0.000,00
    const incomeInput = document.getElementById('register-income');
    if (incomeInput) {
        incomeInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value === '' || value === '0') {
                e.target.value = '';
                return;
            }
            
            // Converte centavos para formato decimal
            value = (parseInt(value) / 100).toFixed(2);
            
            // Separa parte inteira e decimal
            let parts = value.split('.');
            
            // Adiciona separador de milhares na parte inteira
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            
            // Junta com vírgula como separador decimal
            value = parts.join(',');
            
            e.target.value = 'R$ ' + value;
        });
    }

    // Máscara PIX - Valor
    const pixAmountInput = document.getElementById('pix-amount');
    if (pixAmountInput) {
        pixAmountInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value === '' || value === '0') {
                e.target.value = '';
                return;
            }
            
            // Converte centavos para formato decimal
            value = (parseInt(value) / 100).toFixed(2);
            
            // Separa parte inteira e decimal
            let parts = value.split('.');
            
            // Adiciona separador de milhares na parte inteira
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            
            // Junta com vírgula como separador decimal
            value = parts.join(',');
            
            e.target.value = 'R$ ' + value;
        });
    }

    // Máscara PIX - Chave (detecta automaticamente o tipo)
    const pixKeyInput = document.getElementById('pix-key');
    if (pixKeyInput) {
        pixKeyInput.addEventListener('input', (e) => {
            let value = e.target.value;
            
            // Se contém @ ou letras, é email ou chave aleatória - não formatar
            if (value.includes('@') || /[a-zA-Z]/.test(value)) {
                return; // Deixa como está
            }
            
            // Remove formatação anterior
            let cleanValue = value.replace(/\D/g, '');
            
            // Se não tem números, limpa o campo
            if (cleanValue.length === 0) {
                e.target.value = '';
                return;
            }
            
            // Detectar tipo de chave e aplicar máscara
            if (cleanValue.length <= 11) {
                // CPF - formato: 000.000.000-00
                let formatted = '';
                
                for (let i = 0; i < cleanValue.length && i < 11; i++) {
                    if (i === 3 || i === 6) {
                        formatted += '.';
                    } else if (i === 9) {
                        formatted += '-';
                    }
                    formatted += cleanValue[i];
                }
                
                e.target.value = formatted;
            } else {
                // Telefone - formato: (00) 00000-0000
                cleanValue = cleanValue.slice(0, 11);
                let formatted = '';
                
                for (let i = 0; i < cleanValue.length; i++) {
                    if (i === 0) {
                        formatted += '(';
                    } else if (i === 2) {
                        formatted += ') ';
                    } else if (i === 7) {
                        formatted += '-';
                    }
                    formatted += cleanValue[i];
                }
                
                e.target.value = formatted;
            }
        });
        
        // Permitir colar email ou chave aleatória
        pixKeyInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                const value = e.target.value;
                // Se contém @ ou letras, é email ou chave aleatória - não formatar
                if (value.includes('@') || /[a-zA-Z]/.test(value)) {
                    e.target.value = value;
                }
            }, 0);
        });
    }
});

// Password Toggle
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-password')) {
        const parent = e.target.closest('.input-group');
        const input = parent.querySelector('input[type="password"], input[type="text"]');
        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
                e.target.textContent = 'visibility';
            } else {
                input.type = 'password';
                e.target.textContent = 'visibility_off';
            }
        }
    }
});

// Filter chips functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip') && e.target.parentElement.classList.contains('filter-chips')) {
        // Remove active from all chips
        e.target.parentElement.querySelectorAll('.chip').forEach(chip => {
            chip.classList.remove('active');
        });
        // Add active to clicked chip
        e.target.classList.add('active');
    }
});

// Achievement card animations
document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('click', () => {
        if (!card.classList.contains('unlocked')) {
            card.style.animation = 'shake 0.5s';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        }
    });
});

// Shake animation for locked achievements
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Touch interactions for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) < swipeThreshold) return;

    const screens = ['dashboard-screen', 'transactions-screen', 'gamification-screen', 'profile-screen'];
    const activeScreen = document.querySelector('.screen.active');
    const currentIndex = screens.indexOf(activeScreen.id);

    if (diff > 0 && currentIndex < screens.length - 1) {
        // Swipe left - next screen
        showScreen(screens[currentIndex + 1]);
    } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous screen
        showScreen(screens[currentIndex - 1]);
    }
}

// Sistema de Notificações - Agora todas as notificações são geradas dinamicamente pelo sistema inteligente
let notifications = [];
let currentNotificationFilter = 'todas';

// Atualizar badge de notificações
function updateNotificationBadge() {
    const badge = document.querySelector('.badge');
    const unreadCount = notifications.filter(n => n.unread).length;
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Atualizar contadores das abas
    const countTodas = document.getElementById('count-todas');
    const countAlertas = document.getElementById('count-alertas');
    const countDicas = document.getElementById('count-dicas');
    
    if (countTodas) countTodas.textContent = notifications.length;
    if (countAlertas) countAlertas.textContent = notifications.filter(n => n.category === 'alertas').length;
    if (countDicas) countDicas.textContent = notifications.filter(n => n.category === 'dicas').length;
}

// Filtrar notificações por categoria
function filterNotifications(category) {
    currentNotificationFilter = category;
    
    // Atualizar abas ativas
    document.querySelectorAll('.notification-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    
    renderNotifications();
}

// Renderizar notificações
function renderNotifications() {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Filtrar notificações baseado na aba selecionada
    let filteredNotifications = notifications;
    if (currentNotificationFilter === 'alertas') {
        filteredNotifications = notifications.filter(n => n.category === 'alertas');
    } else if (currentNotificationFilter === 'dicas') {
        filteredNotifications = notifications.filter(n => n.category === 'dicas');
    }
    
    if (filteredNotifications.length === 0) {
        notificationsList.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #64748b;">
                <span class="material-icons" style="font-size: 48px; opacity: 0.3;">notifications_off</span>
                <p style="margin-top: 16px;">Nenhuma notificação ainda</p>
            </div>
        `;
    } else {
        notificationsList.innerHTML = filteredNotifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}" data-id="${notif.id}">
                <div class="notification-icon ${notif.type}">
                    <span class="material-icons">${notif.icon}</span>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
                <button class="notification-action" onclick="markAsRead(${notif.id})">
                    <span class="material-icons">${notif.unread ? 'circle' : 'check_circle'}</span>
                </button>
            </div>
        `).join('');
    }
    
    updateNotificationBadge();
}

// Marcar notificação como lida
function markAsRead(notifId) {
    const notification = notifications.find(n => n.id === notifId);
    if (notification) {
        notification.unread = false;
        renderNotifications();
        updateNotificationBadge();
    }
}

// Marcar todas como lidas
function markAllAsRead() {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
    updateNotificationBadge();
}

// Adicionar nova notificação
function addNotification(type, icon, title, message) {
    const newId = Math.max(...notifications.map(n => n.id), 0) + 1;
    notifications.unshift({
        id: newId,
        type: type,
        icon: icon,
        title: title,
        message: message,
        time: 'Agora',
        unread: true,
        category: type === 'info' ? 'dicas' : 'alertas'
    });
    updateNotificationBadge();
    
    // Se estiver na tela de notificações, re-renderizar
    const notificationsScreen = document.getElementById('notifications-screen');
    if (notificationsScreen && notificationsScreen.classList.contains('active')) {
        renderNotifications();
    }
}

// Atualizar badge quando mostrar tela de notificações e personalização
const originalShowScreenForNotifications = showScreen;
showScreen = function(screenId) {
    originalShowScreenForNotifications(screenId);
    if (screenId === 'notifications-screen') {
        renderNotifications();
    } else if (screenId === 'personalization-screen') {
        renderPersonalizationScreen();
        loadPersonalizationSettings();
    }
};

// Inicializar badge na carga
updateNotificationBadge();

// Controle de notificações enviadas (evita duplicatas)
let lastNotificationSent = null;
let lastNotificationTime = 0;

// Sistema de notificações inteligentes baseado na situação da conta
function checkAndSendSmartNotifications(forceCheck = false) {
    console.log('🔔 Verificando notificações inteligentes...', {
        transacoes: transactions.length,
        notificacoes: notifications.length,
        forcado: forceCheck
    });
    
    const now = Date.now();
    
    // Não enviar mesma notificação em menos de 5 minutos (exceto se forçado)
    if (!forceCheck && now - lastNotificationTime < 300000) {
        console.log('⏳ Cooldown ativo, aguardando...');
        return;
    }
    
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0);
    const income = transactions.filter(t => t.amount > 0);
    const totalExpenses = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    // Calcular gastos por categoria
    const categorySpending = {};
    expenses.forEach(t => {
        const cat = t.categoryName || t.category || 'Outros';
        categorySpending[cat] = (categorySpending[cat] || 0) + Math.abs(t.amount);
    });
    
    // Mapeamento de categorias para os limites de orçamento
    const categoryToBudgetKey = {
        'Alimentação': 'food',
        'Transporte': 'transport',
        'Moradia': 'housing',
        'Lazer': 'leisure'
    };
    
    // Limites de orçamento mensal
    const budgetLimits = {
        food: 1000,
        transport: 600,
        housing: 1500,
        leisure: 400
    };
    
    let notificationKey = null;
    
    // Notificação: Saldo negativo (PRIORIDADE ALTA)
    if (balance < 0) {
        notificationKey = 'saldo_negativo';
        if (lastNotificationSent !== notificationKey) {
            addNotification('alert', 'error', '🚨 Saldo Negativo', 
                `Atenção! Seu saldo está negativo em R$ ${Math.abs(balance).toFixed(2).replace('.', ',')}. Evite novas despesas até regularizar.`);
            lastNotificationSent = notificationKey;
            lastNotificationTime = now;
        }
        return;
    }
    
    // Notificação: Saldo crítico (< R$ 100)
    if (balance < 100 && balance > 0) {
        notificationKey = 'saldo_critico';
        if (lastNotificationSent !== notificationKey) {
            addNotification('alert', 'warning', '⚠️ Saldo Crítico', 
                `Seu saldo está muito baixo: R$ ${balance.toFixed(2).replace('.', ',')}. Priorize apenas gastos essenciais.`);
            lastNotificationSent = notificationKey;
            lastNotificationTime = now;
        }
        return;
    }
    
    // Notificação: Saldo baixo (< R$ 500)
    if (balance < 500) {
        notificationKey = 'saldo_baixo';
        if (lastNotificationSent !== notificationKey) {
            addNotification('alert', 'trending_down', '💰 Saldo Baixo', 
                `Seu saldo está em R$ ${balance.toFixed(2).replace('.', ',')}. Considere reduzir gastos não essenciais como delivery e streaming.`);
            lastNotificationSent = notificationKey;
            lastNotificationTime = now;
        }
        return;
    }
    
    // Notificação: Orçamento da categoria atingido (>= 100%)
    for (const [categoryName, spent] of Object.entries(categorySpending)) {
        const budgetKey = categoryToBudgetKey[categoryName];
        if (budgetKey && budgetLimits[budgetKey]) {
            const limit = budgetLimits[budgetKey];
            const percentage = (spent / limit) * 100;
            
            console.log(`📊 ${categoryName}: R$ ${spent.toFixed(2)} de R$ ${limit} (${percentage.toFixed(0)}%)`);
            
            // Orçamento 100% atingido (prioridade alta)
            if (percentage >= 100) {
                notificationKey = `budget_100_${categoryName}`;
                console.log(`🚨 Orçamento ${categoryName} atingido 100%!`);
                if (lastNotificationSent !== notificationKey) {
                    addNotification('alert', 'error', `⚠️ Orçamento de ${categoryName} Atingido`, 
                        `Você já gastou R$ ${spent.toFixed(2).replace('.', ',')} (${percentage.toFixed(0)}%) do orçamento mensal de R$ ${limit.toFixed(2).replace('.', ',')}. Cuidado para não ultrapassar!`);
                    lastNotificationSent = notificationKey;
                    lastNotificationTime = now;
                }
                return;
            }
            
            // Orçamento 80% atingido (aviso)
            if (percentage >= 80) {
                notificationKey = `budget_80_${categoryName}`;
                if (lastNotificationSent !== notificationKey) {
                    const remaining = limit - spent;
                    addNotification('alert', 'warning', `📊 ${categoryName}: ${percentage.toFixed(0)}% do Orçamento`, 
                        `Você já gastou R$ ${spent.toFixed(2).replace('.', ',')} de R$ ${limit.toFixed(2).replace('.', ',')}. Restam apenas R$ ${remaining.toFixed(2).replace('.', ',')} para este mês.`);
                    lastNotificationSent = notificationKey;
                    lastNotificationTime = now;
                }
                return;
            }
        }
    }
    
    // Notificação: Categoria com gasto muito alto (> 40% da renda)
    const highestCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    if (highestCategory && totalIncome > 0 && highestCategory[1] > totalIncome * 0.4) {
        notificationKey = `gasto_alto_${highestCategory[0]}`;
        if (lastNotificationSent !== notificationKey) {
            const percentage = ((highestCategory[1] / totalIncome) * 100).toFixed(0);
            const ideal = (totalIncome * 0.3).toFixed(2);
            addNotification('alert', 'trending_up', '📊 Gasto Elevado', 
                `Seus gastos com ${highestCategory[0]} (${percentage}%) estão acima do recomendado. Tente manter em até R$ ${ideal.replace('.', ',')}/mês.`);
            lastNotificationSent = notificationKey;
            lastNotificationTime = now;
        }
        return;
    }
    
    // Notificação: Excelente economia (> 30%)
    if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        if (savingsRate > 30) {
            notificationKey = 'economia_excelente';
            if (lastNotificationSent !== notificationKey) {
                const saved = totalIncome - totalExpenses;
                addNotification('success', 'celebration', '🎉 Parabéns pela Economia!', 
                    `Você está economizando ${savingsRate.toFixed(0)}% da sua renda (R$ ${saved.toFixed(2).replace('.', ',')})! Que tal investir esse valor?`);
                lastNotificationSent = notificationKey;
                lastNotificationTime = now;
            }
            return;
        }
        
        // Notificação: Boa economia (> 20%)
        if (savingsRate > 20) {
            notificationKey = 'economia_boa';
            if (lastNotificationSent !== notificationKey) {
                addNotification('success', 'thumb_up', '👍 Ótima Gestão Financeira!', 
                    `Você está economizando ${savingsRate.toFixed(0)}% da sua renda! Continue assim e considere criar uma meta de investimento.`);
                lastNotificationSent = notificationKey;
                lastNotificationTime = now;
            }
            return;
        }
    }
    
    // Notificação: Dica baseada em transações recentes
    const lastExpense = expenses[0];
    if (lastExpense && lastExpense.categoryName) {
        const categoryTips = {
            'Alimentação': 'Use o MoneyFlow Cashback em supermercados e ganhe 3% de volta! Também considere fazer lista de compras para evitar gastos desnecessários.',
            'Transporte': 'Que tal usar apps de carona compartilhada ou transporte público? Economia de até 40% no mês!',
            'Lazer': 'Aproveite programas gratuitos da cidade e use cashback em cinemas e restaurantes. Economia garantida!',
            'Compras': 'Ative alertas de promoção e use cashback. Economize até 10% em todas as compras online!'
        };
        
        const tip = categoryTips[lastExpense.categoryName];
        if (tip) {
            notificationKey = `dica_${lastExpense.categoryName}`;
            if (lastNotificationSent !== notificationKey) {
                addNotification('info', 'tips_and_updates', `💡 Dica: ${lastExpense.categoryName}`, tip);
                lastNotificationSent = notificationKey;
                lastNotificationTime = now;
            }
        }
    }
    
    console.log('✅ Verificação concluída. Notificações:', notifications.length);
}

// Verificar notificações inteligentes periodicamente (não muito frequente)
if (!window.smartNotificationInterval) {
    // Roda imediatamente ao carregar
    setTimeout(checkAndSendSmartNotifications, 2000);
    // E depois a cada 2 minutos
    window.smartNotificationInterval = setInterval(checkAndSendSmartNotifications, 120000);
}

// AI Chat functionality
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    sendAIMessage(message);
    input.value = '';
}

function sendAIMessage(message) {
    const chatContainer = document.getElementById('chat-messages');
    
    // Add user message
    const userMessage = `
        <div class="chat-message user">
            <div class="message-avatar">😊</div>
            <div class="message-bubble">
                <p>${message}</p>
                <span class="message-time">Agora</span>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', userMessage);
    
    // Simulate AI response
    setTimeout(() => {
        const responses = {
            '1': 'Baseado na análise dos seus gastos, aqui estão minhas dicas personalizadas:\n\n💰 <strong>Dicas de Economia:</strong>\n\n<strong>1.</strong> Reduza gastos com alimentação\n   • Você está 15% acima da média\n   • Economize R$ 200/mês cozinhando em casa\n   • Use lista de compras para evitar impulsos\n\n<strong>2.</strong> Otimize seu transporte\n   • Considere apps de carona compartilhada\n   • Economia estimada: R$ 150/mês\n   • Planeje rotas para economizar combustível\n\n<strong>3.</strong> Lazer mais econômico\n   • Aproveite promoções e programas gratuitos\n   • Economia: R$ 100/mês\n   • Use cashback em entretenimento\n\n💡 <strong>Total de economia potencial: R$ 450/mês!</strong>\n\nQuer que eu crie um plano detalhado? Digite:\n<strong>6</strong> - Criar plano de economia personalizado',
            '2': 'Análise completa dos seus gastos realizada! 📊\n\n<strong>Principais categorias:</strong>\n\n<strong>1.</strong> 🛒 Alimentação: R$ 850,00 (41%)\n   • 15% acima do recomendado\n   • Gasto médio: R$ 28,33/dia\n\n<strong>2.</strong> 🏠 Moradia: R$ 1.200,00 (29%)\n   • Orçamento atingido (100%)\n   • Inclui: aluguel, condomínio, água, luz\n\n<strong>3.</strong> 🚗 Transporte: R$ 420,00 (20%)\n   • Dentro do orçamento ✓\n   • 70% do limite mensal\n\n<strong>4.</strong> 🎬 Lazer: R$ 300,00 (15%)\n   • Dentro do orçamento ✓\n   • 75% do limite mensal\n\n⚠️ <strong>Alertas importantes:</strong>\n• Alimentação precisa de atenção\n• Moradia no limite máximo\n\n✅ <strong>Pontos positivos:</strong>\n• Você economizou R$ 950 este mês!\n• Taxa de economia: 18%\n\nPróximos passos:\n<strong>1</strong> - Dicas de economia\n<strong>3</strong> - Criar orçamento otimizado',
            '3': 'Vou criar um orçamento inteligente personalizado! 🎯\n\n<strong>Análise da sua situação:</strong>\n• Renda mensal: R$ 4.500,00\n• Gastos atuais: R$ 2.049,20\n• Taxa de economia: 18%\n\n📝 <strong>Orçamento Recomendado (Regra 50-30-20 adaptada):</strong>\n\n<strong>ESSENCIAIS (50% - R$ 2.250):</strong>\n<strong>1.</strong> Moradia: R$ 1.350 (30%)\n<strong>2.</strong> Alimentação: R$ 900 (20%)\n\n<strong>QUALIDADE DE VIDA (30% - R$ 1.350):</strong>\n<strong>3.</strong> Transporte: R$ 675 (15%)\n<strong>4.</strong> Lazer: R$ 450 (10%)\n<strong>5.</strong> Educação: R$ 225 (5%)\n\n<strong>FUTURO (20% - R$ 900):</strong>\n<strong>6.</strong> Investimentos: R$ 675 (15%)\n<strong>7.</strong> Reserva emergência: R$ 225 (5%)\n\n💡 <strong>Benefícios deste orçamento:</strong>\n• Reduz gastos com alimentação em 15%\n• Cria reserva de emergência\n• Aumenta economia para 20%\n• Permite começar a investir\n\n<strong>Quer que eu:</strong>\n<strong>7</strong> - Ativar este orçamento automaticamente\n<strong>8</strong> - Personalizar valores',
            '4': 'Estratégia para reduzir dívidas! 💳\n\n<strong>Método Bola de Neve:</strong>\n\n<strong>1.</strong> Liste todas as dívidas\n   • Do menor para o maior saldo\n   • Priorize a menor primeiro\n\n<strong>2.</strong> Pagamentos mínimos\n   • Pague o mínimo de todas\n   • Exceto a menor (pague o máximo)\n\n<strong>3.</strong> Efeito cascata\n   • Quando quitar a menor\n   • Use esse valor na próxima\n\n<strong>4.</strong> Negocie taxas\n   • Ligue para os credores\n   • Peça redução de juros\n\n<strong>5.</strong> Evite novas dívidas\n   • Use apenas dinheiro disponível\n   • Corte gastos supérfluos\n\nQuer simular um plano de quitação? Digite <strong>9</strong>',
            '5': 'Investimentos para Iniciantes! 📈\n\n<strong>Passo a passo:</strong>\n\n<strong>1.</strong> Construa reserva de emergência\n   • 6 meses de despesas (R$ 12.000)\n   • Deixe em conta que rende 100% CDI\n\n<strong>2.</strong> Comece devagar\n   • Invista R$ 100-500/mês\n   • Aumente gradualmente\n\n<strong>3.</strong> Diversifique\n   • 70% Renda Fixa (Tesouro Direto, CDB)\n   • 20% Fundos de Investimento\n   • 10% Ações (longo prazo)\n\n<strong>4.</strong> Estude antes\n   • Entenda cada produto\n   • Conheça os riscos\n\n<strong>5.</strong> Seja consistente\n   • Invista todo mês\n   • Pense no longo prazo\n\n💰 <strong>Simulação:</strong>\nInvestindo R$ 300/mês a 10% a.a.:\n• 1 ano: R$ 3.762\n• 5 anos: R$ 23.363\n• 10 anos: R$ 61.453\n\nQuer criar uma carteira personalizada? Digite <strong>10</strong>',
            '6': 'Criando plano de economia detalhado... ✨\n\n<strong>Seu Plano Personalizado:</strong>\n\n<strong>MÊS 1-2 (Adaptação):</strong>\n• Reduza alimentação em 10% (-R$ 85)\n• Mapeie todos os gastos fixos\n• Meta: economizar R$ 200/mês\n\n<strong>MÊS 3-6 (Consolidação):</strong>\n• Reduza alimentação em 15% (-R$ 127)\n• Otimize transporte (-R$ 100)\n• Negocie contas fixas (-R$ 50)\n• Meta: economizar R$ 450/mês\n\n<strong>MÊS 7-12 (Aceleração):</strong>\n• Mantenha novos hábitos\n• Aumente renda com freelas\n• Meta: economizar R$ 900/mês\n\n📊 <strong>Resultados esperados em 1 ano:</strong>\n• Total economizado: R$ 7.200\n• Novos hábitos consolidados\n• Reserva de emergência criada\n\nAtivar este plano? Digite <strong>sim</strong>',
            '7': 'Ativando orçamento automaticamente... ⚙️\n\n✅ <strong>Orçamento ativado com sucesso!</strong>\n\n<strong>Configurações aplicadas:</strong>\n\n<strong>1.</strong> Alertas automáticos criados\n   • 80% do orçamento: aviso amarelo\n   • 100% do orçamento: alerta vermelho\n\n<strong>2.</strong> Categorização inteligente\n   • IA vai categorizar automaticamente\n   • 98% de precisão\n\n<strong>3.</strong> Relatórios semanais\n   • Toda segunda-feira às 9h\n   • Resumo da semana anterior\n\n<strong>4.</strong> Dicas personalizadas\n   • Baseadas no seu comportamento\n   • Notificações push ativadas\n\n💡 <strong>Próximos passos:</strong>\n• Comece a registrar transações\n• Acompanhe progresso diário\n• Ajuste quando necessário\n\nSeu orçamento está pronto para usar! 🎉',
            '8': 'Personalizando orçamento... 🎨\n\nDigite os novos valores ou escolha:\n\n<strong>Categorias principais:</strong>\n<strong>1.</strong> Moradia (atual: R$ 1.350)\n<strong>2.</strong> Alimentação (atual: R$ 900)\n<strong>3.</strong> Transporte (atual: R$ 675)\n<strong>4.</strong> Lazer (atual: R$ 450)\n<strong>5.</strong> Investimentos (atual: R$ 675)\n\nExemplo: "1 = 1200" para mudar moradia\n\nOu digite <strong>voltar</strong> para menu anterior',
            '9': 'Simulador de quitação de dívidas 💳\n\n<strong>Suas dívidas:</strong>\n<strong>1.</strong> Cartão A: R$ 850 (18% a.m.)\n<strong>2.</strong> Cartão B: R$ 1.200 (15% a.m.)\n<strong>3.</strong> Empréstimo: R$ 3.500 (8% a.m.)\n\nTotal: R$ 5.550\n\n<strong>Plano de Quitação (Método Bola de Neve):</strong>\n\nAportando R$ 800/mês:\n\n<strong>Mês 1-2:</strong> Quita Cartão A\n<strong>Mês 3-5:</strong> Quita Cartão B\n<strong>Mês 6-12:</strong> Quita Empréstimo\n\n🎯 <strong>Livre de dívidas em 12 meses!</strong>\n\nEconomia em juros: R$ 2.180\n\nQuer ativar este plano? Digite <strong>sim</strong>',
            '10': 'Criando carteira de investimentos... 💼\n\n<strong>Seu Perfil:</strong> Conservador/Moderado\n<strong>Valor inicial:</strong> R$ 1.000\n<strong>Aporte mensal:</strong> R$ 300\n\n<strong>Carteira Recomendada:</strong>\n\n<strong>RENDA FIXA (70% - R$ 700):</strong>\n<strong>1.</strong> Tesouro Selic: R$ 300 (43%)\n<strong>2.</strong> CDB 110% CDI: R$ 250 (36%)\n<strong>3.</strong> LCI/LCA: R$ 150 (21%)\n\n<strong>MULTIMERCADO (20% - R$ 200):</strong>\n<strong>4.</strong> Fundos conservadores: R$ 200\n\n<strong>AÇÕES (10% - R$ 100):</strong>\n<strong>5.</strong> ETFs (BOVA11, IVVB11): R$ 100\n\n📊 <strong>Projeção 5 anos (10% a.a.):</strong>\n• Total investido: R$ 19.000\n• Rendimento: R$ 4.363\n• Patrimônio final: R$ 23.363\n\nAbrir conta e começar? Digite <strong>sim</strong>'
        };
        
        // Check if message is a number (option)
        const option = message.trim();
        let botResponse = responses[option];
        
        // If not a predefined option, show default menu
        if (!botResponse) {
            botResponse = 'Entendi! Como assistente financeiro, posso ajudar você com:\n\n<strong>Escolha uma opção:</strong>\n\n<strong>1️⃣</strong> Dicas de economia personalizadas\n<strong>2️⃣</strong> Analisar meus gastos detalhadamente\n<strong>3️⃣</strong> Criar orçamento inteligente\n<strong>4️⃣</strong> Como reduzir dívidas (Método Bola de Neve)\n<strong>5️⃣</strong> Investimentos para iniciantes\n\nDigite o número da opção desejada ou faça uma pergunta! 😊';
        }
        
        const botMessage = `
            <div class="chat-message bot">
                <div class="message-avatar">🤖</div>
                <div class="message-bubble">
                    <p style="white-space: pre-line; line-height: 1.8;">${botResponse}</p>
                    <span class="message-time">Agora</span>
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', botMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// International Transfer Functions
const exchangeRates = {
    BRL: { USD: 0.20, EUR: 0.18, GBP: 0.16, BRL: 1 },
    USD: { BRL: 5.00, EUR: 0.92, GBP: 0.79, USD: 1 },
    EUR: { BRL: 5.45, USD: 1.09, GBP: 0.86, EUR: 1 },
    GBP: { BRL: 6.30, USD: 1.27, EUR: 1.16, GBP: 1 }
};

let selectedFromCurrency = 'BRL';
let selectedToCurrency = 'USD';

function selectCurrency(currency) {
    // Update UI - mark selected card
    document.querySelectorAll('.currency-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.currency-card').classList.add('active');
}

// Máscaras para IBAN e SWIFT
function formatIBAN(value) {
    // Remove tudo que não é letra ou número
    const clean = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // Adiciona espaço a cada 4 caracteres
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
    return formatted.substring(0, 34); // IBAN máximo 34 caracteres (sem espaços)
}

function formatSWIFT(value) {
    // Remove tudo que não é letra ou número
    const clean = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // SWIFT tem 8 ou 11 caracteres
    return clean.substring(0, 11);
}

function updateExchangeRate() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;

    // Get exchange rate
    const rate = exchangeRates[fromCurrency][toCurrency];
    const toAmount = fromAmount * rate;

    // Update display
    document.getElementById('to-amount').value = toAmount.toFixed(2);
    document.getElementById('exchange-rate').textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;

    // Calculate fees
    const fee = fromAmount * 0.01; // 1% fee
    const total = fromAmount + fee;

    // Get currency symbols
    const symbols = { BRL: 'R$', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[fromCurrency];

    document.getElementById('transaction-fee').textContent = `${symbol} ${fee.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `${symbol} ${total.toFixed(2)}`;
}

function swapCurrencies() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    updateExchangeRate();
}

function loadRecipient(name, account) {
    document.getElementById('recipient-name').value = name;
    document.getElementById('recipient-account').value = account;
}

function processInternationalTransfer() {
    console.log('🌎 Iniciando transferência internacional...');
    
    const fromAmount = parseFloat(document.getElementById('from-amount').value);
    const toAmount = document.getElementById('to-amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const recipientName = document.getElementById('recipient-name').value;
    const recipientAccount = document.getElementById('recipient-account').value;
    const recipientSwift = document.getElementById('recipient-swift').value;

    console.log('Dados:', { fromAmount, toAmount, fromCurrency, toCurrency, recipientName, recipientAccount, recipientSwift });

    if (!recipientName || !recipientAccount || !fromAmount) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    if (fromAmount <= 0) {
        alert('O valor deve ser maior que zero!');
        return;
    }

    // Criar transação
    const transaction = {
        id: transactions.length + 1,
        description: `Transferência Internacional para ${recipientName}`,
        amount: -fromAmount,
        type: 'expense',
        category: 'international',
        categoryName: 'Internacional',
        date: new Date().toISOString().split('T')[0],
        icon: '🌎',
        details: {
            currency: fromCurrency,
            toCurrency: toCurrency,
            toAmount: toAmount,
            recipient: recipientName,
            account: recipientAccount,
            swift: recipientSwift
        }
    };

    transactions.unshift(transaction);
    
    // Salvar no localStorage
    try {
        localStorage.setItem('moneyflow_transactions', JSON.stringify(transactions));
    } catch (error) {
        console.log('⚠️ LocalStorage não disponível');
    }

    // Tracking
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('international_transfer', {
            amount: fromAmount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            recipient: recipientName
        });
    }

    // Atualizar interface
    updateBalanceDisplay();
    renderRecentTransactions();
    renderAllTransactions();
    initChart();
    updateGamificationPoints(15); // +15 pontos por transferência internacional

    // Verificar notificações
    setTimeout(() => {
        checkAndSendSmartNotifications(true);
    }, 500);

    // Mostrar modal de sucesso
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    const symbols = { BRL: 'R$', USD: '$', EUR: '€', GBP: '£' };
    
    modalTitle.textContent = '✅ Transferência Internacional Confirmada!';
    modalMessage.innerHTML = `
        <strong>Você enviou:</strong> ${symbols[fromCurrency]} ${fromAmount.toFixed(2).replace('.', ',')}<br>
        <strong>Destinatário recebe:</strong> ${symbols[toCurrency]} ${toAmount}<br>
        <strong>Para:</strong> ${recipientName}<br>
        <strong>Conta:</strong> ${recipientAccount}<br>
        ${recipientSwift ? `<strong>SWIFT:</strong> ${recipientSwift}<br>` : ''}
        <br>
        <strong>Tempo estimado:</strong> 1-3 dias úteis
    `;
    
    modal.classList.add('active');

    // Limpar formulário
    document.getElementById('from-amount').value = '';
    document.getElementById('recipient-name').value = '';
    document.getElementById('recipient-account').value = '';
    document.getElementById('recipient-swift').value = '';
    
    setTimeout(() => {
        modal.classList.remove('active');
        showScreen('dashboard-screen');
    }, 4000);
}

// Initialize exchange rate on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('from-amount')) {
        updateExchangeRate();
    }
    
    // Adicionar máscaras para IBAN e SWIFT
    const ibanInput = document.getElementById('recipient-account');
    const swiftInput = document.getElementById('recipient-swift');
    
    if (ibanInput) {
        ibanInput.addEventListener('input', (e) => {
            const cursorPos = e.target.selectionStart;
            const oldLength = e.target.value.length;
            e.target.value = formatIBAN(e.target.value);
            const newLength = e.target.value.length;
            const diff = newLength - oldLength;
            e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
        });
    }
    
    if (swiftInput) {
        swiftInput.addEventListener('input', (e) => {
            e.target.value = formatSWIFT(e.target.value);
        });
    }
});

// Appearance & Language Functions
function setTheme(theme) {
    console.log('🎨 Alterando tema para:', theme);
    
    // Atualizar checks visuais
    document.querySelectorAll('.theme-check').forEach(check => {
        check.style.opacity = '0.3';
    });
    
    const selectedCheck = document.getElementById(`theme-${theme}`);
    if (selectedCheck) {
        selectedCheck.style.opacity = '1';
    }
    
    // Aplicar tema escuro com cores otimizadas
    if (theme === 'dark') {
        // Cores principais - tema escuro profissional
        document.documentElement.style.setProperty('--background', '#0a0a0a');
        document.documentElement.style.setProperty('--surface', '#1a1a1a');
        document.documentElement.style.setProperty('--card', '#252525');
        document.documentElement.style.setProperty('--text', '#e8e8e8');
        document.documentElement.style.setProperty('--text-secondary', '#a8a8a8');
        document.documentElement.style.setProperty('--border', '#2a2a2a');
        document.documentElement.style.setProperty('--gray', '#707070');
        document.documentElement.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.8)');
        
        // Adicionar classe dark ao body
        document.body.classList.add('dark-theme');
        
        // Ajustar body
        document.body.style.backgroundColor = '#0a0a0a';
        
        // Ajustar inputs e selects
        document.querySelectorAll('.input-group input, .input-group select, .input-group textarea').forEach(input => {
            input.style.backgroundColor = '#1a1a1a';
            input.style.color = '#ffffff';
            input.style.border = '1px solid #2a2a2a';
        });
        
        // Ajustar placeholders e estilos globais
        let darkStyle = document.getElementById('dark-theme-placeholders');
        if (darkStyle) darkStyle.remove();
        
        darkStyle = document.createElement('style');
        darkStyle.id = 'dark-theme-placeholders';
        darkStyle.textContent = `
            .dark-theme input::placeholder,
            .dark-theme textarea::placeholder,
            .dark-theme select {
                color: #808080 !important;
            }
            .dark-theme .section-title,
            .dark-theme h1, .dark-theme h2, .dark-theme h3, .dark-theme h4 {
                color: #ffffff !important;
            }
            .dark-theme small {
                color: #b0b0b0 !important;
            }
            .dark-theme .info-label,
            .dark-theme .balance-sublabel {
                color: #b0b0b0 !important;
            }
            .dark-theme .info-value,
            .dark-theme .balance-subamount,
            .dark-theme .balance-amount {
                color: #ffffff !important;
            }
            .dark-theme .screen {
                background: #0a0a0a !important;
            }
            .dark-theme .content {
                background: transparent !important;
            }
            .dark-theme .menu-item span:not(.material-icons) {
                color: #ffffff !important;
            }
            .dark-theme .menu-item div span {
                color: #ffffff !important;
            }
            .dark-theme .profile-header {
                background: #252525 !important;
                box-shadow: none !important;
            }
            .dark-theme .profile-header h2 {
                color: #ffffff !important;
            }
            .dark-theme .profile-email {
                color: #b0b0b0 !important;
            }
            .dark-theme .stats-grid .stat-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
                box-shadow: none !important;
            }
            .dark-theme .stat-card h3 {
                color: #ffffff !important;
            }
            .dark-theme .stat-card p {
                color: #b0b0b0 !important;
            }
            .dark-theme .profile-avatar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
            }
            .dark-theme .header {
                background: #1a1a1a !important;
                border-bottom: 1px solid #2a2a2a !important;
            }
            .dark-theme .greeting {
                color: #ffffff !important;
            }
            .dark-theme .header-subtitle {
                color: #b0b0b0 !important;
            }
            .dark-theme .quick-actions .action-btn {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
                box-shadow: none !important;
            }
            .dark-theme .action-btn span:not(.material-icons) {
                color: #ffffff !important;
            }
            .dark-theme .chart-container {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
                box-shadow: none !important;
            }
            .dark-theme .chart-legend {
                background: transparent !important;
            }
            .dark-theme .legend-item span {
                color: #ffffff !important;
            }
            .dark-theme .legend-percentage {
                color: #b0b0b0 !important;
            }
            .dark-theme .personalization-header h3,
            .dark-theme .profile-analysis-card h4,
            .dark-theme .profile-analysis-card p {
                color: #ffffff !important;
            }
            .dark-theme .personalization-subtitle {
                color: #b0b0b0 !important;
            }
            .dark-theme .profile-analysis-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .metric-label {
                color: #b0b0b0 !important;
            }
            .dark-theme .metric-value {
                color: #ffffff !important;
            }
            .dark-theme .recommendation-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .recommendation-card .recommendation-title {
                color: #ffffff !important;
            }
            .dark-theme .recommendation-description {
                color: #b0b0b0 !important;
            }
            .dark-theme .recommendation-action {
                color: #ffffff !important;
            }
            .dark-theme .insight-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .insight-label {
                color: #b0b0b0 !important;
            }
            .dark-theme .insight-value {
                color: #ffffff !important;
            }
            .dark-theme .insight-change {
                color: #b0b0b0 !important;
            }
            .dark-theme .goal-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .goal-card h4 {
                color: #ffffff !important;
            }
            .dark-theme .goal-card p {
                color: #b0b0b0 !important;
            }
            .dark-theme .goal-amount {
                color: #ffffff !important;
            }
            .dark-theme .pattern-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .pattern-card h4 {
                color: #ffffff !important;
            }
            .dark-theme .pattern-card p {
                color: #b0b0b0 !important;
            }
            .dark-theme .product-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .product-card h4 {
                color: #ffffff !important;
            }
            .dark-theme .product-card p {
                color: #b0b0b0 !important;
            }
            .dark-theme .product-benefit {
                color: #b0b0b0 !important;
            }
            .dark-theme .personalization-setting strong {
                color: #ffffff !important;
            }
            .dark-theme .personalization-setting p {
                color: #b0b0b0 !important;
            }
            .dark-theme .model-stats-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .model-stats-card h4 {
                color: #ffffff !important;
            }
            .dark-theme .model-metric strong {
                color: #ffffff !important;
            }
            .dark-theme .model-metric span:not(.material-icons) {
                color: #b0b0b0 !important;
            }
            .dark-theme .personalization-setting {
                border-bottom: 1px solid #2a2a2a !important;
            }
            .dark-theme .card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .model-stats-card .accuracy-text .accuracy-number {
                color: #ffffff !important;
            }
            .dark-theme .model-stats-card .accuracy-text .accuracy-label {
                color: #b0b0b0 !important;
            }
            .dark-theme .goals-list .goal-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .goal-progress-bar {
                background: #1a1a1a !important;
            }
            .dark-theme .patterns-grid .pattern-card {
                background: #252525 !important;
                border: 1px solid #2a2a2a !important;
            }
            .dark-theme .products-carousel .product-card {
                background: #252525 !important;
                border: 2px solid #2a2a2a !important;
            }
            .dark-theme .product-card:hover {
                border-color: var(--primary) !important;
            }
        `;
        document.head.appendChild(darkStyle);
        
        // Ajustar cards e itens
        document.querySelectorAll('.card, .info-card, .notification-item, .transaction-item, .currency-card').forEach(card => {
            card.style.backgroundColor = '#252525';
            card.style.color = '#ffffff';
            card.style.border = '1px solid #2a2a2a';
        });
        
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.backgroundColor = '#252525';
            item.style.border = '1px solid #2a2a2a';
        });
        
        // Ajustar texto secundário
        document.querySelectorAll('.balance-sublabel, .info-label, small').forEach(el => {
            el.style.color = '#b0b0b0';
        });
        
        // Ajustar valores e títulos
        document.querySelectorAll('.balance-amount, .balance-subamount, .info-value, h1, h2, h3, h4').forEach(el => {
            el.style.color = '#ffffff';
        });
        
        // Ajustar textos dos menu items
        document.querySelectorAll('.menu-item span:not(.material-icons)').forEach(el => {
            el.style.color = '#ffffff';
        });
        
        // Ajustar profile header
        document.querySelectorAll('.profile-header').forEach(header => {
            header.style.backgroundColor = '#252525';
            header.style.boxShadow = 'none';
        });
        
        document.querySelectorAll('.profile-header h2').forEach(h2 => {
            h2.style.color = '#ffffff';
        });
        
        document.querySelectorAll('.profile-email').forEach(email => {
            email.style.color = '#b0b0b0';
        });
        
        // Ajustar stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.style.backgroundColor = '#252525';
            card.style.border = '1px solid #2a2a2a';
            card.style.boxShadow = 'none';
        });
        
        document.querySelectorAll('.stat-card h3').forEach(h3 => {
            h3.style.color = '#ffffff';
        });
        
        document.querySelectorAll('.stat-card p').forEach(p => {
            p.style.color = '#b0b0b0';
        });
        
        // Ajustar header do dashboard
        document.querySelectorAll('.header').forEach(header => {
            header.style.backgroundColor = '#1a1a1a';
            header.style.borderBottom = '1px solid #2a2a2a';
        });
        
        document.querySelectorAll('.greeting').forEach(el => {
            el.style.color = '#ffffff';
        });
        
        document.querySelectorAll('.header-subtitle').forEach(el => {
            el.style.color = '#b0b0b0';
        });
        
        // Ajustar quick actions
        document.querySelectorAll('.quick-actions .action-btn').forEach(btn => {
            btn.style.backgroundColor = '#252525';
            btn.style.border = '1px solid #2a2a2a';
            btn.style.boxShadow = 'none';
        });
        
        document.querySelectorAll('.action-btn span:not(.material-icons)').forEach(span => {
            span.style.color = '#ffffff';
        });
        
        // Ajustar chart container
        document.querySelectorAll('.chart-container').forEach(container => {
            container.style.backgroundColor = '#252525';
            container.style.border = '1px solid #2a2a2a';
            container.style.boxShadow = 'none';
        });
        
        // Ajustar legend
        document.querySelectorAll('.chart-legend').forEach(legend => {
            legend.style.background = 'transparent';
        });
        
        document.querySelectorAll('.legend-item span').forEach(span => {
            span.style.color = '#ffffff';
        });
        
        document.querySelectorAll('.legend-percentage').forEach(perc => {
            perc.style.color = '#b0b0b0';
        });
        
        // Ajustar screen header
        document.querySelectorAll('.screen-header').forEach(header => {
            header.style.backgroundColor = '#1a1a1a';
            header.style.borderBottom = '1px solid #2a2a2a';
        });
        
        // Ajustar bottom nav
        document.querySelectorAll('.bottom-nav').forEach(nav => {
            nav.style.backgroundColor = '#1a1a1a';
            nav.style.borderTop = '1px solid #2a2a2a';
        });
        
        // Ajustar todas as screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.backgroundColor = '#0a0a0a';
        });
        
        // Ajustar cards de configuração
        document.querySelectorAll('.personalization-setting').forEach(setting => {
            setting.style.borderBottom = '1px solid #2a2a2a';
        });
        
        document.querySelectorAll('.card').forEach(card => {
            if (!card.classList.contains('balance-card')) {
                card.style.backgroundColor = '#252525';
                card.style.border = '1px solid #2a2a2a';
            }
        });
        
    } else if (theme === 'light') {
        // Restaurar tema claro
        document.documentElement.style.setProperty('--background', '#f8f9fa');
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--card', '#ffffff');
        document.documentElement.style.setProperty('--text', '#1a1a1a');
        document.documentElement.style.setProperty('--text-secondary', '#64748b');
        document.documentElement.style.setProperty('--border', '#e2e8f0');
        document.documentElement.style.setProperty('--gray', '#94a3b8');
        document.documentElement.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
        
        // Remover classe dark
        document.body.classList.remove('dark-theme');
        
        // Remover style de placeholders
        const darkStyle = document.getElementById('dark-theme-placeholders');
        if (darkStyle) darkStyle.remove();
        
        // Restaurar body
        document.body.style.backgroundColor = '';
        
        // Remover estilos inline de todos os elementos
        document.querySelectorAll('.input-group input, .input-group select, .input-group textarea').forEach(input => {
            input.style.backgroundColor = '';
            input.style.color = '';
            input.style.border = '';
        });
        
        document.querySelectorAll('.card, .info-card, .notification-item, .transaction-item, .menu-item, .currency-card').forEach(card => {
            card.style.backgroundColor = '';
            card.style.color = '';
            card.style.border = '';
            card.style.borderColor = '';
            card.style.boxShadow = '';
        });
        
        document.querySelectorAll('.balance-sublabel, .info-label, small, .balance-amount, .balance-subamount, .info-value, h1, h2, h3, h4').forEach(el => {
            el.style.color = '';
        });
        
        document.querySelectorAll('.menu-item span:not(.material-icons)').forEach(el => {
            el.style.color = '';
        });
        
        document.querySelectorAll('.profile-header').forEach(header => {
            header.style.backgroundColor = '';
            header.style.boxShadow = '';
        });
        
        document.querySelectorAll('.profile-header h2').forEach(h2 => {
            h2.style.color = '';
        });
        
        document.querySelectorAll('.profile-email').forEach(email => {
            email.style.color = '';
        });
        
        document.querySelectorAll('.stat-card').forEach(card => {
            card.style.backgroundColor = '';
            card.style.border = '';
            card.style.boxShadow = '';
        });
        
        document.querySelectorAll('.stat-card h3').forEach(h3 => {
            h3.style.color = '';
        });
        
        document.querySelectorAll('.stat-card p').forEach(p => {
            p.style.color = '';
        });
        
        document.querySelectorAll('.header').forEach(header => {
            header.style.backgroundColor = '';
            header.style.borderBottom = '';
        });
        
        document.querySelectorAll('.greeting').forEach(el => {
            el.style.color = '';
        });
        
        document.querySelectorAll('.header-subtitle').forEach(el => {
            el.style.color = '';
        });
        
        document.querySelectorAll('.quick-actions .action-btn').forEach(btn => {
            btn.style.backgroundColor = '';
            btn.style.border = '';
            btn.style.boxShadow = '';
        });
        
        document.querySelectorAll('.action-btn span:not(.material-icons)').forEach(span => {
            span.style.color = '';
        });
        
        document.querySelectorAll('.chart-container').forEach(container => {
            container.style.backgroundColor = '';
            container.style.border = '';
            container.style.boxShadow = '';
        });
        
        document.querySelectorAll('.chart-legend').forEach(legend => {
            legend.style.background = '';
        });
        
        document.querySelectorAll('.legend-item span').forEach(span => {
            span.style.color = '';
        });
        
        document.querySelectorAll('.legend-percentage').forEach(perc => {
            perc.style.color = '';
        });
        
        document.querySelectorAll('.screen-header').forEach(header => {
            header.style.backgroundColor = '';
            header.style.borderBottom = '';
        });
        
        document.querySelectorAll('.bottom-nav').forEach(nav => {
            nav.style.backgroundColor = '';
            nav.style.borderTop = '';
        });
        
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.backgroundColor = '';
        });
        
        document.querySelectorAll('.personalization-setting').forEach(setting => {
            setting.style.borderBottom = '';
        });
        
        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = '';
            card.style.border = '';
        });
        
        document.querySelectorAll('.balance-sublabel, .info-label, small').forEach(el => {
            el.style.color = '';
        });
        
        document.querySelectorAll('.screen-header').forEach(header => {
            header.style.backgroundColor = '';
            header.style.borderColor = '';
        });
        
        document.querySelectorAll('.bottom-nav').forEach(nav => {
            nav.style.backgroundColor = '';
            nav.style.borderTop = '';
        });
    }
    
    // Salvar preferência
    try {
        localStorage.setItem('moneyflow_theme', theme);
    } catch (error) {
        console.log('⚠️ LocalStorage não disponível');
    }
}

function setAccentColor(color) {
    console.log('🎨 Alterando cor de destaque para:', color);
    document.documentElement.style.setProperty('--primary', color);
    
    try {
        localStorage.setItem('moneyflow_accent', color);
    } catch (error) {
        console.log('⚠️ LocalStorage não disponível');
    }
}

function setLanguage(lang) {
    console.log('🌍 Alterando idioma para:', lang);
    
    // Mostrar mensagem de confirmação
    const langNames = {
        'pt-BR': 'Português (Brasil)',
        'en-US': 'English (US)',
        'es-ES': 'Español',
        'fr-FR': 'Français',
        'de-DE': 'Deutsch'
    };
    
    alert(`Idioma alterado para ${langNames[lang]}!\n\nEssa é uma funcionalidade de demonstração. A tradução completa será implementada em breve.`);
    
    try {
        localStorage.setItem('moneyflow_language', lang);
    } catch (error) {
        console.log('⚠️ LocalStorage não disponível');
    }
}

// Payments - Boleto Functions
function scanBarcode() {
    // Simular escaneamento de código de barras
    const sampleCodes = [
        '34191.79001 01043.510047 91020.150008 1 96610000050000',
        '23793.38128 60000.123456 78901.234567 2 96620000120000'
    ];
    const randomCode = sampleCodes[Math.floor(Math.random() * sampleCodes.length)];
    document.getElementById('barcode-input').value = randomCode;
    loadBoleto(randomCode);
}

function loadBoleto(barcode) {
    document.getElementById('barcode-input').value = barcode;
    
    // Simular dados do boleto baseado no código
    const boletoData = {
        '34191.79001 01043.510047 91020.150008 1 96610000050000': {
            beneficiary: 'CEMIG - Companhia Energética de Minas Gerais',
            amount: 185.50,
            dueDate: '28/11/2025',
            status: 'Pendente'
        },
        '23793.38128 60000.123456 78901.234567 2 96620000120000': {
            beneficiary: 'COPASA - Companhia de Saneamento de MG',
            amount: 95.30,
            dueDate: '30/11/2025',
            status: 'Pendente'
        }
    };
    
    const data = boletoData[barcode] || {
        beneficiary: 'Empresa XYZ',
        amount: 150.00,
        dueDate: '30/11/2025',
        status: 'Pendente'
    };
    
    // Exibir detalhes
    document.getElementById('boleto-beneficiary').textContent = data.beneficiary;
    document.getElementById('boleto-amount').textContent = `R$ ${data.amount.toFixed(2).replace('.', ',')}`;
    document.getElementById('boleto-due-date').textContent = data.dueDate;
    document.getElementById('boleto-status').textContent = data.status;
    
    // Mostrar seção de detalhes
    document.getElementById('boleto-details').style.display = 'block';
}

function payBoleto() {
    const amount = document.getElementById('boleto-amount').textContent;
    const beneficiary = document.getElementById('boleto-beneficiary').textContent;
    
    if (confirm(`Confirmar pagamento de ${amount} para ${beneficiary}?`)) {
        alert('Pagamento realizado com sucesso! ✅\n\nO boleto foi pago e a transação foi registrada.');
        
        // Limpar formulário
        const barcodeInput = document.getElementById('barcode-input');
        const barcode = barcodeInput.value;
        barcodeInput.value = '';
        document.getElementById('boleto-details').style.display = 'none';
        
        // Adicionar transação
        const amountValue = parseFloat(document.getElementById('boleto-amount').textContent.replace('R$ ', '').replace(',', '.'));
        const newTransaction = {
            id: transactions.length + 1,
            description: beneficiary.split(' - ')[0],
            amount: -amountValue,
            type: 'expense',
            category: 'housing',
            categoryName: 'Moradia',
            date: new Date().toISOString().split('T')[0],
            icon: '🏠'
        };
        transactions.unshift(newTransaction);
        
        // Track boleto payment
        if (window.MoneyFlowTracker) {
            window.MoneyFlowTracker.trackTransaction({
                transaction_id: newTransaction.id,
                amount: amountValue,
                type: 'bill_payment',
                category: 'housing',
                description: beneficiary.split(' - ')[0],
                payment_method: 'boleto',
                barcode: barcode.substring(0, 10) + '...' // Partial for security
            });
        }
        
        updateBalanceDisplay();
        renderRecentTransactions();
    }
}

// Recharge Functions
let selectedRechargeType = 'phone';
let selectedOperator = '';
let selectedRechargeValue = 0;
let selectedTransport = '';

function selectRechargeType(type) {
    selectedRechargeType = type;
    
    // Update active state
    document.querySelectorAll('.recharge-type-card').forEach(card => {
        card.classList.remove('active');
    });
    document.getElementById(type + '-recharge').classList.add('active');
    
    // Show/hide content
    document.querySelectorAll('.recharge-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(type + '-content').style.display = 'block';
}

function selectOperator(operator) {
    selectedOperator = operator;
    const cards = document.querySelectorAll('.operator-card');
    cards.forEach(card => card.style.transform = 'scale(1)');
    event.target.closest('.operator-card').style.transform = 'scale(1.1)';
}

function selectRechargeValue(value) {
    selectedRechargeValue = value;
    
    // Update active state
    document.querySelectorAll('.value-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.value-card').classList.add('selected');
    
    // Calculate bonus
    let bonus = 0;
    if (value >= 20) bonus = 2;
    if (value >= 30) bonus = 5;
    if (value >= 50) bonus = 10;
    if (value >= 100) bonus = 25;
    
    // Update summary
    document.getElementById('selected-value').textContent = `R$ ${value.toFixed(2)}`;
    document.getElementById('bonus-value').textContent = `R$ ${bonus.toFixed(2)}`;
    document.getElementById('total-value').textContent = `R$ ${value.toFixed(2)}`;
}

function processRecharge() {
    const phoneNumber = document.getElementById('phone-number').value;
    
    if (!selectedOperator) {
        alert('Por favor, selecione uma operadora.');
        return;
    }
    
    if (!phoneNumber) {
        alert('Por favor, digite o número do celular.');
        return;
    }
    
    if (selectedRechargeValue === 0) {
        alert('Por favor, selecione o valor da recarga.');
        return;
    }
    
    if (confirm(`Confirmar recarga de R$ ${selectedRechargeValue.toFixed(2)} para ${phoneNumber}?`)) {
        // Calculate bonus
        let bonus = 0;
        if (selectedRechargeValue >= 20) bonus = 2;
        if (selectedRechargeValue >= 30) bonus = 5;
        if (selectedRechargeValue >= 50) bonus = 10;
        if (selectedRechargeValue >= 100) bonus = 25;
        
        alert(`✅ Recarga realizada com sucesso!\n\nValor: R$ ${selectedRechargeValue.toFixed(2)}\nBônus: R$ ${bonus.toFixed(2)}\nOperadora: ${selectedOperator.toUpperCase()}\nNúmero: ${phoneNumber}\n\n+5 pontos na pontuação! 🎯`);
        
        // Add points
        if (typeof updatePoints === 'function') {
            updatePoints(5, 'Recarga de celular');
        }
        
        // Add transaction
        const newTransaction = {
            id: transactions.length + 1,
            description: `Recarga ${selectedOperator.toUpperCase()}`,
            amount: -selectedRechargeValue,
            type: 'expense',
            category: 'other',
            categoryName: 'Outros',
            date: new Date().toISOString().split('T')[0],
            icon: '📱'
        };
        transactions.unshift(newTransaction);
        
        // Track recharge transaction
        if (window.MoneyFlowTracker) {
            window.MoneyFlowTracker.trackTransaction({
                transaction_id: newTransaction.id,
                amount: selectedRechargeValue,
                type: 'recharge',
                category: 'other',
                description: `Recarga ${selectedOperator.toUpperCase()}`,
                payment_method: 'mobile_recharge',
                operator: selectedOperator,
                phone_number: phoneNumber.substring(0, 6) + '...', // Partial for privacy
                bonus: bonus
            });
        }
        
        updateBalanceDisplay();
        renderRecentTransactions();
        
        // Reset form
        document.getElementById('phone-number').value = '';
        selectedOperator = '';
        selectedRechargeValue = 0;
        document.querySelectorAll('.value-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.getElementById('selected-value').textContent = 'R$ 0,00';
        document.getElementById('bonus-value').textContent = 'R$ 0,00';
        document.getElementById('total-value').textContent = 'R$ 0,00';
    }
}

function selectTransport(type) {
    selectedTransport = type;
    
    // Update active state
    document.querySelectorAll('.transport-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.transport-card').classList.add('selected');
}

function selectTransportValue(value) {
    selectedRechargeValue = value;
    
    // Update active state
    const transportContent = document.getElementById('transport-content');
    transportContent.querySelectorAll('.value-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.value-card').classList.add('selected');
}

function processTransportRecharge() {
    const cardNumber = document.getElementById('transport-card-number').value;
    
    if (!selectedTransport) {
        alert('Por favor, selecione o tipo de cartão.');
        return;
    }
    
    if (!cardNumber) {
        alert('Por favor, digite o número do cartão.');
        return;
    }
    
    if (selectedRechargeValue === 0) {
        alert('Por favor, selecione o valor da recarga.');
        return;
    }
    
    const transportName = selectedTransport === 'bilhete' ? 'Bilhete Único' : 'Cartão BOM';
    
    if (confirm(`Confirmar recarga de R$ ${selectedRechargeValue.toFixed(2)} no ${transportName}?`)) {
        alert(`✅ Recarga realizada com sucesso!\n\nValor: R$ ${selectedRechargeValue.toFixed(2)}\nCartão: ${transportName}\nNúmero: ${cardNumber}\n\n+5 pontos na pontuação! 🎯`);
        
        // Add points
        if (typeof updatePoints === 'function') {
            updatePoints(5, 'Recarga de transporte');
        }
        
        // Add transaction
        const newTransaction = {
            id: transactions.length + 1,
            description: `Recarga ${transportName}`,
            amount: -selectedRechargeValue,
            type: 'expense',
            category: 'transport',
            categoryName: 'Transporte',
            date: new Date().toISOString().split('T')[0],
            icon: '🚌'
        };
        transactions.unshift(newTransaction);
        updateBalanceDisplay();
        renderRecentTransactions();
        
        // Reset form
        document.getElementById('transport-card-number').value = '';
        selectedTransport = '';
        selectedRechargeValue = 0;
        document.querySelectorAll('.transport-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.value-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
}

// TV Recharge Functions
let selectedTvOperator = '';

function selectTvOperator(operator) {
    selectedTvOperator = operator;
    const cards = document.querySelectorAll('#tv-content .operator-card');
    cards.forEach(card => card.style.transform = 'scale(1)');
    event.target.closest('.operator-card').style.transform = 'scale(1.1)';
}

function selectTvValue(value) {
    selectedRechargeValue = value;
    
    const tvContent = document.getElementById('tv-content');
    tvContent.querySelectorAll('.value-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.value-card').classList.add('selected');
}

function processTvRecharge() {
    const tvNumber = document.getElementById('tv-number').value;
    
    if (!selectedTvOperator) {
        showToast('Por favor, selecione uma operadora de TV.', '#e74c3c');
        return;
    }
    
    if (!tvNumber) {
        showToast('Por favor, digite o número do contrato.', '#e74c3c');
        return;
    }
    
    if (selectedRechargeValue === 0) {
        showToast('Por favor, selecione o valor da recarga.', '#e74c3c');
        return;
    }
    
    const packageNames = {
        50: 'Básico',
        80: 'Intermediário',
        120: 'Premium',
        200: 'Ultra HD'
    };
    
    showToast(`✅ Recarga realizada com sucesso! R$ ${selectedRechargeValue.toFixed(2)} - Pacote ${packageNames[selectedRechargeValue]} | ${selectedTvOperator.toUpperCase()}`, '#00b894');
    
    if (typeof updateGamificationPoints === 'function') {
        updateGamificationPoints(5);
    }
    
    const newTransaction = {
        id: transactions.length + 1,
        description: `Recarga ${selectedTvOperator.toUpperCase()} TV`,
        amount: -selectedRechargeValue,
        type: 'expense',
        category: 'other',
        categoryName: 'Outros',
        date: new Date().toISOString().split('T')[0],
        icon: '📺'
    };
    transactions.unshift(newTransaction);
    
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.trackTransaction({
            transaction_id: newTransaction.id,
            amount: selectedRechargeValue,
            type: 'recharge',
            category: 'other',
            description: `Recarga ${selectedTvOperator.toUpperCase()} TV`,
            payment_method: 'tv_recharge',
            operator: selectedTvOperator,
            package: packageNames[selectedRechargeValue]
        });
    }
    
    updateBalanceDisplay();
    renderRecentTransactions();
    
    document.getElementById('tv-number').value = '';
    selectedTvOperator = '';
    selectedRechargeValue = 0;
    document.querySelectorAll('#tv-content .value-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Games Recharge Functions
let selectedGamesPlatform = '';

function selectGamesPlatform(platform) {
    selectedGamesPlatform = platform;
    const cards = document.querySelectorAll('#games-content .operator-card');
    cards.forEach(card => card.style.transform = 'scale(1)');
    event.target.closest('.operator-card').style.transform = 'scale(1.1)';
}

function selectGamesValue(value) {
    selectedRechargeValue = value;
    
    const gamesContent = document.getElementById('games-content');
    gamesContent.querySelectorAll('.value-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.value-card').classList.add('selected');
}

function processGamesRecharge() {
    const gamesAccount = document.getElementById('games-account').value;
    
    if (!selectedGamesPlatform) {
        showToast('Por favor, selecione uma plataforma.', '#e74c3c');
        return;
    }
    
    if (!gamesAccount) {
        showToast('Por favor, digite o email ou ID da conta.', '#e74c3c');
        return;
    }
    
    if (selectedRechargeValue === 0) {
        showToast('Por favor, selecione o valor da recarga.', '#e74c3c');
        return;
    }
    
    const platformNames = {
        'steam': 'Steam',
        'psn': 'PlayStation Network',
        'xbox': 'Xbox Live',
        'nintendo': 'Nintendo eShop'
    };
    
    showToast(`✅ Recarga realizada com sucesso! R$ ${selectedRechargeValue.toFixed(2)} - ${platformNames[selectedGamesPlatform]}`, '#00b894');
    
    if (typeof updateGamificationPoints === 'function') {
        updateGamificationPoints(5);
    }
    
    const newTransaction = {
        id: transactions.length + 1,
        description: `Recarga ${platformNames[selectedGamesPlatform]}`,
        amount: -selectedRechargeValue,
        type: 'expense',
        category: 'leisure',
        categoryName: 'Lazer',
        date: new Date().toISOString().split('T')[0],
        icon: '🎮'
    };
    transactions.unshift(newTransaction);
    
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.trackTransaction({
            transaction_id: newTransaction.id,
            amount: selectedRechargeValue,
            type: 'recharge',
            category: 'leisure',
            description: `Recarga ${platformNames[selectedGamesPlatform]}`,
            payment_method: 'games_recharge',
            platform: selectedGamesPlatform
        });
    }
    
    updateBalanceDisplay();
    renderRecentTransactions();
    
    document.getElementById('games-account').value = '';
    selectedGamesPlatform = '';
    selectedRechargeValue = 0;
    document.querySelectorAll('#games-content .value-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Budget Management
let budgets = JSON.parse(localStorage.getItem('moneyflow_budgets')) || [
    { id: 1, category: 'food', categoryName: 'Alimentação', icon: '🍔', amount: 1000, period: 'monthly' },
    { id: 2, category: 'transport', categoryName: 'Transporte', icon: '🚗', amount: 600, period: 'monthly' },
    { id: 3, category: 'housing', categoryName: 'Moradia', icon: '🏠', amount: 1200, period: 'monthly' },
    { id: 4, category: 'leisure', categoryName: 'Lazer', icon: '🎬', amount: 400, period: 'monthly' }
];

function showCreateBudgetModal() {
    document.getElementById('create-budget-modal').classList.add('active');
}

function closeBudgetModal() {
    document.getElementById('create-budget-modal').classList.remove('active');
    document.getElementById('budget-category').value = '';
    document.getElementById('budget-amount').value = '';
    document.getElementById('budget-period').value = 'monthly';
}

function createBudget() {
    const categorySelect = document.getElementById('budget-category');
    const category = categorySelect.value;
    const amount = parseFloat(document.getElementById('budget-amount').value);
    const period = document.getElementById('budget-period').value;
    
    if (!category) {
        showToast('Por favor, selecione uma categoria.', '#e74c3c');
        return;
    }
    
    if (!amount || amount <= 0) {
        showToast('Por favor, insira um valor válido.', '#e74c3c');
        return;
    }
    
    // Verificar se já existe orçamento para essa categoria
    const existingBudget = budgets.find(b => b.category === category);
    if (existingBudget) {
        showToast('Já existe um orçamento para esta categoria. Edite o existente.', '#f39c12');
        return;
    }
    
    const categoryNames = {
        'food': 'Alimentação',
        'transport': 'Transporte',
        'housing': 'Moradia',
        'health': 'Saúde',
        'leisure': 'Lazer',
        'shopping': 'Compras',
        'education': 'Educação',
        'other': 'Outros'
    };
    
    const categoryIcons = {
        'food': '🍔',
        'transport': '🚗',
        'housing': '🏠',
        'health': '💊',
        'leisure': '🎬',
        'shopping': '🛍️',
        'education': '📚',
        'other': '📝'
    };
    
    const newBudget = {
        id: budgets.length + 1,
        category: category,
        categoryName: categoryNames[category],
        icon: categoryIcons[category],
        amount: amount,
        period: period
    };
    
    budgets.push(newBudget);
    localStorage.setItem('moneyflow_budgets', JSON.stringify(budgets));
    
    showToast(`✅ Orçamento de R$ ${amount.toFixed(2)} criado para ${categoryNames[category]}!`, '#00b894');
    
    if (typeof updateGamificationPoints === 'function') {
        updateGamificationPoints(10);
    }
    
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('budget_created', {
            category: category,
            amount: amount,
            period: period
        });
    }
    
    closeBudgetModal();
    renderBudgets();
}

function renderBudgets() {
    const budgetsList = document.getElementById('budgets-list');
    if (!budgetsList) return;
    
    if (budgets.length === 0) {
        budgetsList.innerHTML = '<p style="text-align: center; color: #666; padding: 32px;">Nenhum orçamento criado. Clique no + para adicionar.</p>';
        return;
    }
    
    // Calcular gastos por categoria
    const spentByCategory = {};
    transactions.forEach(t => {
        if (t.type === 'expense' && t.category) {
            if (!spentByCategory[t.category]) {
                spentByCategory[t.category] = 0;
            }
            spentByCategory[t.category] += Math.abs(t.amount);
        }
    });
    
    budgetsList.innerHTML = budgets.map(budget => {
        const spent = spentByCategory[budget.category] || 0;
        const percentage = Math.min((spent / budget.amount) * 100, 100);
        
        let statusClass = 'success';
        let statusMessage = '✓ Dentro do orçamento';
        let barColor = '#00b894';
        
        if (percentage >= 100) {
            statusClass = 'danger';
            statusMessage = '🚨 Orçamento atingido!';
            barColor = '#d63031';
        } else if (percentage >= 80) {
            statusClass = 'warning';
            statusMessage = `⚠️ ${percentage.toFixed(0)}% do orçamento usado`;
            barColor = '#f39c12';
        }
        
        const periodText = {
            'monthly': 'Mensal',
            'weekly': 'Semanal',
            'yearly': 'Anual'
        };
        
        return `
            <div class="budget-item">
                <div class="budget-header">
                    <span>${budget.icon} ${budget.categoryName}</span>
                    <span class="budget-amount">R$ ${spent.toFixed(2)} / R$ ${budget.amount.toFixed(2)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background: ${barColor};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="budget-status ${statusClass}">${statusMessage}</p>
                    <button onclick="deleteBudget(${budget.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 4px 8px;">
                        <span class="material-icons" style="font-size: 20px;">delete</span>
                    </button>
                </div>
                <small style="color: #666;">Período: ${periodText[budget.period]}</small>
            </div>
        `;
    }).join('');
    
    // Atualizar resumo total
    updateBudgetSummary();
}

function updateBudgetSummary() {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const spentByCategory = {};
    
    transactions.forEach(t => {
        if (t.type === 'expense' && t.category) {
            if (!spentByCategory[t.category]) {
                spentByCategory[t.category] = 0;
            }
            spentByCategory[t.category] += Math.abs(t.amount);
        }
    });
    
    const totalSpent = budgets.reduce((sum, b) => {
        return sum + (spentByCategory[b.category] || 0);
    }, 0);
    
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    const summaryDiv = document.querySelector('.budget-summary');
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <h3>Orçamento Total</h3>
            <h1>R$ ${totalBudget.toFixed(2)}</h1>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${percentage >= 100 ? '#e74c3c' : percentage >= 80 ? '#f39c12' : '#00b894'};"></div>
            </div>
            <p>R$ ${totalSpent.toFixed(2)} gastos (${percentage.toFixed(0)}%)</p>
        `;
    }
}

function deleteBudget(budgetId) {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        budgets = budgets.filter(b => b.id !== budgetId);
        localStorage.setItem('moneyflow_budgets', JSON.stringify(budgets));
        showToast('Orçamento excluído com sucesso!', '#00b894');
        renderBudgets();
    }
}

// Insurance Management
let myInsurances = JSON.parse(localStorage.getItem('moneyflow_insurances')) || [];
let currentInsuranceQuote = null;

function showInsuranceQuote(type) {
    currentInsuranceQuote = { type };
    const modal = document.getElementById('insurance-quote-modal');
    const formContent = document.getElementById('insurance-form-content');
    const modalTitle = document.getElementById('insurance-modal-title');
    
    const insuranceData = {
        'auto': {
            title: '🚗 Seguro Auto',
            fields: `
                <div class="input-group">
                    <label>Marca do Veículo</label>
                    <input type="text" id="ins-brand" placeholder="Ex: Toyota" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Modelo</label>
                    <input type="text" id="ins-model" placeholder="Ex: Corolla" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Ano</label>
                    <input type="number" id="ins-year" placeholder="2023" min="1990" max="2025" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Plano</label>
                    <select id="ins-plan" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="basic">Básico - Cobertura terceiros</option>
                        <option value="complete">Completo - Cobertura total</option>
                        <option value="premium">Premium - Carro reserva incluído</option>
                    </select>
                </div>`,
            basePrice: 89.90
        },
        'home': {
            title: '🏠 Seguro Residencial',
            fields: `
                <div class="input-group">
                    <label>Tipo de Imóvel</label>
                    <select id="ins-property-type" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="apartment">Apartamento</option>
                        <option value="house">Casa</option>
                        <option value="condo">Condomínio</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Valor do Imóvel (R$)</label>
                    <input type="number" id="ins-property-value" placeholder="500000" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Cobertura</label>
                    <select id="ins-plan" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="basic">Básico - Incêndio e roubo</option>
                        <option value="complete">Completo - + Danos elétricos</option>
                        <option value="premium">Premium - Cobertura total</option>
                    </select>
                </div>`,
            basePrice: 45.90
        },
        'life': {
            title: '❤️ Seguro Vida',
            fields: `
                <div class="input-group">
                    <label>Idade</label>
                    <input type="number" id="ins-age" placeholder="30" min="18" max="80" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Cobertura Desejada (R$)</label>
                    <input type="number" id="ins-coverage" placeholder="100000" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Plano</label>
                    <select id="ins-plan" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="basic">Individual</option>
                        <option value="complete">Familiar - Até 4 pessoas</option>
                        <option value="premium">Premium - Cobertura ampliada</option>
                    </select>
                </div>`,
            basePrice: 29.90
        },
        'phone': {
            title: '📱 Seguro Celular',
            fields: `
                <div class="input-group">
                    <label>Marca</label>
                    <input type="text" id="ins-brand" placeholder="Ex: Apple" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Modelo</label>
                    <input type="text" id="ins-model" placeholder="Ex: iPhone 14" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Valor do Aparelho (R$)</label>
                    <input type="number" id="ins-phone-value" placeholder="3000" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="input-group">
                    <label>Cobertura</label>
                    <select id="ins-plan" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="basic">Básico - Roubo</option>
                        <option value="complete">Completo - Roubo + Quebra</option>
                        <option value="premium">Premium - Cobertura total</option>
                    </select>
                </div>`,
            basePrice: 19.90
        }
    };
    
    const data = insuranceData[type];
    modalTitle.textContent = data.title;
    formContent.innerHTML = data.fields + `
        <button class="btn-primary" onclick="calculateInsuranceQuote()" style="width: 100%; margin-top: 16px;">
            <span class="material-icons">calculate</span>
            Calcular Cotação
        </button>
    `;
    
    currentInsuranceQuote.basePrice = data.basePrice;
    document.getElementById('insurance-quote-result').style.display = 'none';
    modal.classList.add('active');
}

function closeInsuranceModal() {
    document.getElementById('insurance-quote-modal').classList.remove('active');
    currentInsuranceQuote = null;
}

function calculateInsuranceQuote() {
    const plan = document.getElementById('ins-plan').value;
    const planMultipliers = {
        'basic': 1,
        'complete': 1.5,
        'premium': 2.2
    };
    
    const monthlyPrice = currentInsuranceQuote.basePrice * planMultipliers[plan];
    const coverage = monthlyPrice * 500; // Simulação de cobertura
    const firstPayment = monthlyPrice * 1.1; // Taxa de adesão
    
    currentInsuranceQuote.monthlyPrice = monthlyPrice;
    currentInsuranceQuote.coverage = coverage;
    currentInsuranceQuote.firstPayment = firstPayment;
    currentInsuranceQuote.plan = plan;
    
    document.getElementById('insurance-monthly-price').textContent = `R$ ${monthlyPrice.toFixed(2)}`;
    document.getElementById('insurance-coverage').textContent = `R$ ${coverage.toFixed(2)}`;
    document.getElementById('insurance-first-payment').textContent = `R$ ${firstPayment.toFixed(2)}`;
    document.getElementById('insurance-quote-result').style.display = 'block';
}

function contractInsurance() {
    if (!currentInsuranceQuote || !currentInsuranceQuote.monthlyPrice) {
        showToast('Por favor, calcule a cotação primeiro.', '#e74c3c');
        return;
    }
    
    const insuranceNames = {
        'auto': 'Seguro Auto',
        'home': 'Seguro Residencial',
        'life': 'Seguro Vida',
        'phone': 'Seguro Celular'
    };
    
    const insuranceIcons = {
        'auto': '🚗',
        'home': '🏠',
        'life': '❤️',
        'phone': '📱'
    };
    
    const planNames = {
        'basic': 'Básico',
        'complete': 'Completo',
        'premium': 'Premium'
    };
    
    const newInsurance = {
        id: myInsurances.length + 1,
        type: currentInsuranceQuote.type,
        name: insuranceNames[currentInsuranceQuote.type],
        icon: insuranceIcons[currentInsuranceQuote.type],
        plan: planNames[currentInsuranceQuote.plan],
        monthlyPrice: currentInsuranceQuote.monthlyPrice,
        coverage: currentInsuranceQuote.coverage,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    myInsurances.push(newInsurance);
    localStorage.setItem('moneyflow_insurances', JSON.stringify(myInsurances));
    
    // Adicionar transação
    const transaction = {
        id: transactions.length + 1,
        description: `${newInsurance.name} - ${newInsurance.plan}`,
        amount: -newInsurance.firstPayment,
        type: 'expense',
        category: 'other',
        categoryName: 'Outros',
        date: new Date().toISOString().split('T')[0],
        icon: newInsurance.icon
    };
    transactions.unshift(transaction);
    localStorage.setItem('moneyflow_transactions', JSON.stringify(transactions));
    
    showToast(`✅ ${newInsurance.name} contratado com sucesso!`, '#00b894');
    
    if (typeof updateGamificationPoints === 'function') {
        updateGamificationPoints(15);
    }
    
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('insurance_contracted', {
            type: newInsurance.type,
            plan: newInsurance.plan,
            monthly_price: newInsurance.monthlyPrice,
            coverage: newInsurance.coverage
        });
    }
    
    updateBalanceDisplay();
    renderRecentTransactions();
    closeInsuranceModal();
    renderMyInsurances();
}

function renderMyInsurances() {
    const list = document.getElementById('my-insurances-list');
    if (!list) return;
    
    if (myInsurances.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 32px;">Nenhum seguro contratado ainda.</p>';
        return;
    }
    
    list.innerHTML = myInsurances.map(ins => `
        <div class="insurance-card" style="opacity: 1; border: 2px solid #00b894;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-size: 24px;">${ins.icon}</span>
                        <h4 style="margin: 0;">${ins.name}</h4>
                    </div>
                    <span style="display: inline-block; background: #00b894; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Plano ${ins.plan}</span>
                </div>
                <button onclick="cancelInsurance(${ins.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 4px;">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Mensalidade:</span>
                <strong style="color: #00b894;">R$ ${ins.monthlyPrice.toFixed(2)}/mês</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Cobertura:</span>
                <strong>R$ ${ins.coverage.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Contratado em:</span>
                <span>${new Date(ins.startDate).toLocaleDateString('pt-BR')}</span>
            </div>
        </div>
    `).join('');
}

function cancelInsurance(insuranceId) {
    if (confirm('Tem certeza que deseja cancelar este seguro?')) {
        myInsurances = myInsurances.filter(ins => ins.id !== insuranceId);
        localStorage.setItem('moneyflow_insurances', JSON.stringify(myInsurances));
        showToast('Seguro cancelado com sucesso!', '#00b894');
        renderMyInsurances();
    }
}

// Loan Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const installments = parseInt(document.getElementById('loan-installments').value);
    const rate = 0.025; // 2.5% a.m.
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, installments)) / (Math.pow(1 + rate, installments) - 1);
    const totalPayment = monthlyPayment * installments;
    
    const resultDiv = document.getElementById('loan-result');
    resultDiv.innerHTML = `
        <h4>Resultado da Simulação</h4>
        <div class="loan-detail">
            <span>Parcela mensal:</span>
            <strong>R$ ${monthlyPayment.toFixed(2)}</strong>
        </div>
        <div class="loan-detail">
            <span>Taxa de juros:</span>
            <strong>2,5% a.m.</strong>
        </div>
        <div class="loan-detail">
            <span>Total a pagar:</span>
            <strong>R$ ${totalPayment.toFixed(2)}</strong>
        </div>
    `;
}

// Mark all notifications as read
function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // Update badge
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
    
    // Update tab count
    const allTab = document.querySelector('.tab-btn.active');
    if (allTab && allTab.textContent.includes('(')) {
        allTab.textContent = 'Todas (0)';
    }
    
    // Show success message
    setTimeout(() => {
        const lastNotification = document.querySelector('.notification-item:last-child');
        if (lastNotification) {
            const message = document.createElement('div');
            message.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #00b894; color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
            message.textContent = '✓ Todas as notificações marcadas como lidas';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 2000);
        }
    }, 100);
}

// Enter key for chat
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('chat-input') === document.activeElement) {
        sendChatMessage();
    }
});

// ========== AI PERSONALIZATION ENGINE ==========
// Load saved personalization settings
let personalizationData = JSON.parse(localStorage.getItem('personalizationData')) || {
    learningEnabled: true,
    smartNotifications: true,
    proactiveRecommendations: true,
    lastUpdate: new Date().toISOString()
};

// Apply saved settings to UI
function loadPersonalizationSettings() {
    const learningToggle = document.getElementById('learning-enabled');
    const smartNotifToggle = document.getElementById('smart-notifications');
    const proactiveToggle = document.getElementById('proactive-recommendations');
    
    if (learningToggle) learningToggle.checked = personalizationData.learningEnabled;
    if (smartNotifToggle) smartNotifToggle.checked = personalizationData.smartNotifications;
    if (proactiveToggle) proactiveToggle.checked = personalizationData.proactiveRecommendations;
}

// Analyze user spending patterns using heuristics
function analyzeSpendingPatterns() {
    const patterns = {
        categories: {},
        timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        dayOfWeek: { weekday: 0, weekend: 0 },
        averageAmount: 0,
        frequency: 0,
        topCategory: '',
        spendingTrend: 'stable'
    };
    
    // Analyze category frequency
    transactions.forEach(t => {
        patterns.categories[t.category] = (patterns.categories[t.category] || 0) + 1;
        
        // Time analysis (simulate based on transaction dates)
        const hour = new Date(t.date).getHours();
        if (hour >= 5 && hour < 12) patterns.timeOfDay.morning++;
        else if (hour >= 12 && hour < 17) patterns.timeOfDay.afternoon++;
        else if (hour >= 17 && hour < 22) patterns.timeOfDay.evening++;
        else patterns.timeOfDay.night++;
        
        // Day of week analysis
        const dayOfWeek = new Date(t.date).getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) patterns.dayOfWeek.weekday++;
        else patterns.dayOfWeek.weekend++;
    });
    
    // Calculate top category
    patterns.topCategory = Object.keys(patterns.categories).reduce((a, b) => 
        patterns.categories[a] > patterns.categories[b] ? a : b
    );
    
    // Calculate average amount
    const amounts = transactions.map(t => Math.abs(parseFloat(t.amount)));
    patterns.averageAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    patterns.frequency = transactions.length;
    
    return patterns;
}

// Calculate user financial profile
function calculateUserProfile() {
    const patterns = analyzeSpendingPatterns();
    const totalExpenses = transactions.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    const totalIncome = transactions.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Calculate consistency (variation in spending)
    const amounts = transactions.filter(t => t.type === 'expense')
        .map(t => Math.abs(parseFloat(t.amount)));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - (stdDev / avg) * 100);
    
    // Calculate impulse control (transactions above average)
    const impulseTransactions = amounts.filter(a => a > avg * 1.5).length;
    const impulseControl = Math.max(0, 100 - (impulseTransactions / amounts.length) * 200);
    
    // Determine profile type
    let profileType = 'Equilibrado';
    let profileDescription = 'Você mantém um equilíbrio entre gastos e economia';
    
    if (savingsRate > 50) {
        profileType = 'Poupador Consciente';
        profileDescription = 'Você mantém controle sobre seus gastos e busca economia';
    } else if (savingsRate < 20) {
        profileType = 'Gastador Ativo';
        profileDescription = 'Você prioriza experiências e possui gastos elevados';
    } else if (consistency > 70) {
        profileType = 'Planejador Metódico';
        profileDescription = 'Você tem gastos consistentes e previsíveis';
    }
    
    return {
        type: profileType,
        description: profileDescription,
        savingsRate: Math.round(savingsRate),
        consistency: Math.round(consistency),
        impulseControl: Math.round(impulseControl),
        patterns
    };
}

// Generate intelligent recommendations
function generateRecommendations() {
    const profile = calculateUserProfile();
    const recommendations = [];
    
    // Savings recommendation
    if (profile.savingsRate < 30) {
        recommendations.push({
            title: 'Aumente sua Taxa de Economia',
            description: `Sua taxa de economia está em ${profile.savingsRate}%. Recomendamos estabelecer uma meta de 30% para construir uma reserva financeira sólida.`,
            priority: 'high',
            icon: 'savings',
            action: 'Criar Meta de Economia',
            actionHandler: 'showSavingsGoalModal()'
        });
    }
    
    // Impulse control recommendation
    if (profile.impulseControl < 60) {
        recommendations.push({
            title: 'Controle Compras por Impulso',
            description: `Detectamos ${Math.round((100 - profile.impulseControl) / 10)} transações acima da sua média. Configure alertas antes de grandes compras.`,
            priority: 'medium',
            icon: 'warning',
            action: 'Configurar Alertas',
            actionHandler: 'showAlertSettings()'
        });
    }
    
    // Category-specific recommendation
    const topCategory = profile.patterns.topCategory;
    const categoryCount = profile.patterns.categories[topCategory];
    if (categoryCount > transactions.length * 0.4) {
        recommendations.push({
            title: `Otimize Gastos em ${topCategory}`,
            description: `${Math.round((categoryCount / transactions.length) * 100)}% dos seus gastos são em ${topCategory}. Veja dicas de economia nesta categoria.`,
            priority: 'low',
            icon: 'lightbulb',
            action: 'Ver Dicas',
            actionHandler: 'showCategoryTips("' + topCategory + '")'
        });
    }
    
    // Cashback recommendation
    if (cashbackBalance < 100) {
        recommendations.push({
            title: 'Maximize seu Cashback',
            description: 'Você tem apenas R$ ' + cashbackBalance.toFixed(2) + ' em cashback. Use nossos parceiros para ganhar até 15% de volta!',
            priority: 'medium',
            icon: 'local_offer',
            action: 'Ver Parceiros',
            actionHandler: 'showScreen(\'cashback-screen\')'
        });
    }
    
    // Investment recommendation
    if (profile.savingsRate > 40 && userLevel !== 'Bronze') {
        recommendations.push({
            title: 'Considere Investimentos',
            description: 'Com sua boa taxa de economia, você pode começar a investir. Simule rendimentos e diversifique seu patrimônio.',
            priority: 'low',
            icon: 'trending_up',
            action: 'Simular Investimento',
            actionHandler: 'showInvestmentSimulator()'
        });
    }
    
    return recommendations;
}

// Generate intelligent insights
function generateInsights() {
    const profile = calculateUserProfile();
    const currentMonth = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === new Date().getMonth();
    });
    
    const currentExpenses = currentMonth.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    // Predict next month expenses
    const monthlyAvg = profile.patterns.averageAmount * profile.patterns.frequency;
    const prediction = monthlyAvg * 1.05; // 5% buffer
    
    // Track AI predictive insights (unique MoneyFlow feature)
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('ai_predictive_insights', {
            current_expenses: currentExpenses,
            predicted_next_month: prediction,
            monthly_avg: monthlyAvg,
            transaction_frequency: profile.patterns.frequency
        });
    }
    
    return [
        {
            icon: 'attach_money',
            label: 'Gasto Médio',
            value: `R$ ${profile.patterns.averageAmount.toFixed(2)}`,
            change: '+12% vs mês anterior',
            positive: false
        },
        {
            icon: 'calendar_today',
            label: 'Frequência Mensal',
            value: `${profile.patterns.frequency} transações`,
            change: '+3 vs mês anterior',
            positive: true
        },
        {
            icon: 'trending_down',
            label: 'Previsão Próximo Mês',
            value: `R$ ${prediction.toFixed(2)}`,
            change: 'Baseado em padrões',
            positive: null
        },
        {
            icon: 'schedule',
            label: 'Horário Preferido',
            value: Object.keys(profile.patterns.timeOfDay).reduce((a, b) => 
                profile.patterns.timeOfDay[a] > profile.patterns.timeOfDay[b] ? a : b
            ),
            change: `${Math.round((profile.patterns.timeOfDay[Object.keys(profile.patterns.timeOfDay).reduce((a, b) => 
                profile.patterns.timeOfDay[a] > profile.patterns.timeOfDay[b] ? a : b
            )] / profile.patterns.frequency) * 100)}% das transações`,
            positive: null
        }
    ];
}

// Suggest financial goals
function suggestGoals() {
    const profile = calculateUserProfile();
    const monthlyExpenses = transactions.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    // Calculate current balance
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    const currentBalance = income - expenses;
    
    return [
        {
            icon: 'savings',
            title: 'Fundo de Emergência',
            description: '6 meses de despesas',
            target: monthlyExpenses * 6,
            current: Math.max(0, currentBalance * 0.3),
            progress: Math.min(100, Math.max(0, (currentBalance * 0.3) / (monthlyExpenses * 6) * 100))
        },
        {
            icon: 'flight',
            title: 'Viagem Internacional',
            description: 'Meta para 2026',
            target: 15000,
            current: 3200,
            progress: (3200 / 15000) * 100
        },
        {
            icon: 'home',
            title: 'Entrada do Imóvel',
            description: '20% do valor',
            target: 80000,
            current: 12500,
            progress: (12500 / 80000) * 100
        }
    ];
}

// Detect spending patterns
function detectPatterns() {
    const profile = calculateUserProfile();
    const patterns = [];
    
    // Weekend vs weekday pattern
    const weekendRatio = profile.patterns.dayOfWeek.weekend / 
        (profile.patterns.dayOfWeek.weekend + profile.patterns.dayOfWeek.weekday);
    
    if (weekendRatio > 0.4) {
        patterns.push({
            icon: 'weekend',
            title: 'Gastador de Fim de Semana',
            description: `${Math.round(weekendRatio * 100)}% dos seus gastos ocorrem nos finais de semana`
        });
    }
    
    // Time pattern
    const timeKey = Object.keys(profile.patterns.timeOfDay).reduce((a, b) => 
        profile.patterns.timeOfDay[a] > profile.patterns.timeOfDay[b] ? a : b
    );
    const timeLabels = {
        morning: 'Comprador Matinal',
        afternoon: 'Gastador da Tarde',
        evening: 'Comprador Noturno',
        night: 'Consumidor Noturno'
    };
    patterns.push({
        icon: 'schedule',
        title: timeLabels[timeKey],
        description: `Você faz a maioria das compras no período da ${timeKey === 'morning' ? 'manhã' : timeKey === 'afternoon' ? 'tarde' : 'noite'}`
    });
    
    // Category concentration
    const topCategory = profile.patterns.topCategory;
    const concentration = (profile.patterns.categories[topCategory] / transactions.length) * 100;
    if (concentration > 40) {
        patterns.push({
            icon: 'category',
            title: 'Foco em ' + topCategory,
            description: `${Math.round(concentration)}% dos gastos concentrados em uma categoria`
        });
    }
    
    // Consistency pattern
    if (profile.consistency > 75) {
        patterns.push({
            icon: 'check_circle',
            title: 'Gastos Previsíveis',
            description: 'Alta consistência nos valores das transações'
        });
    } else if (profile.consistency < 40) {
        patterns.push({
            icon: 'show_chart',
            title: 'Gastos Variáveis',
            description: 'Valores de transações muito irregulares'
        });
    }
    
    return patterns;
}

// Recommend products based on profile
function recommendProducts() {
    const profile = calculateUserProfile();
    const products = [];
    
    // Track product recommendation generation (unique MoneyFlow AI feature)
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('ai_product_recommendation', {
            profile_type: profile.type,
            savings_rate: profile.savingsRate,
            impulse_control: profile.impulseControl,
            transaction_count: transactions.length
        });
    }
    
    // High savings rate -> Investment products
    if (profile.savingsRate > 40) {
        products.push({
            badge: 'Recomendado',
            title: 'MoneyFlow Investimentos',
            description: 'Renda fixa e variável com consultoria gratuita. Ideal para quem já tem disciplina financeira.',
            benefits: [
                'Rendimento acima da poupança',
                'Consultoria personalizada',
                'Sem taxa de manutenção'
            ],
            match: 95
        });
    }
    
    // Frequent shopper -> Cashback card
    if (transactions.length > 10) {
        products.push({
            badge: 'Popular',
            title: 'Cartão MoneyFlow Premium',
            description: 'Cashback de até 5% em todas as compras. Perfeito para quem compra frequentemente.',
            benefits: [
                '5% de cashback ilimitado',
                'Anuidade gratuita',
                'Programa de pontos'
            ],
            match: 88
        });
    }
    
    // Low impulse control -> Budget app
    if (profile.impulseControl < 60) {
        products.push({
            badge: 'Essencial',
            title: 'MoneyFlow Budget Pro',
            description: 'Controle avançado de orçamento com alertas inteligentes e análise preditiva.',
            benefits: [
                'Alertas antes de compras',
                'Análise de padrões',
                'Metas personalizadas'
            ],
            match: 92
        });
    }
    
    // General recommendation
    products.push({
        badge: 'Novo',
        title: 'Seguro Proteção Financeira',
        description: 'Proteção completa para imprevistos financeiros com cobertura até R$ 50.000.',
        benefits: [
            'Cobertura de emergências',
            'Assistência 24/7',
            'Primeira mensalidade grátis'
        ],
        match: 75
    });
    
    return products;
}

// Render personalization screen
function renderPersonalizationScreen() {
    const profile = calculateUserProfile();
    
    // Track AI profile analysis (unique MoneyFlow feature)
    if (window.MoneyFlowTracker) {
        window.MoneyFlowTracker.track('ai_profile_analysis', {
            profile_type: profile.type,
            savings_rate: profile.savingsRate,
            consistency: profile.consistency,
            impulse_control: profile.impulseControl,
            risk_level: profile.riskLevel,
            top_category: profile.patterns.topCategory
        });
    }
    
    // Update profile type
    document.getElementById('user-profile-type').textContent = profile.type;
    document.getElementById('user-profile-description').textContent = profile.description;
    
    // Update metrics
    document.getElementById('savings-rate').style.width = profile.savingsRate + '%';
    document.getElementById('savings-rate-value').textContent = profile.savingsRate + '%';
    document.getElementById('consistency-rate').style.width = profile.consistency + '%';
    document.getElementById('consistency-rate-value').textContent = profile.consistency + '%';
    document.getElementById('impulse-control').style.width = profile.impulseControl + '%';
    document.getElementById('impulse-control-value').textContent = profile.impulseControl + '%';
    
    // Render recommendations
    const recommendations = generateRecommendations();
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card ${rec.priority}-priority">
            <div class="recommendation-header">
                <div class="recommendation-title">
                    <span class="material-icons">${rec.icon}</span>
                    ${rec.title}
                </div>
                <span class="priority-badge ${rec.priority}">${rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}</span>
            </div>
            <p class="recommendation-description">${rec.description}</p>
            <div class="recommendation-action" onclick="${rec.actionHandler}" style="cursor: pointer;">
                <span>${rec.action}</span>
                <span class="material-icons">arrow_forward</span>
            </div>
        </div>
    `).join('');
    
    // Render insights
    const insights = generateInsights();
    const insightsGrid = document.getElementById('insights-grid');
    insightsGrid.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon">
                <span class="material-icons">${insight.icon}</span>
            </div>
            <span class="insight-label">${insight.label}</span>
            <div class="insight-value">${insight.value}</div>
            ${insight.change ? `<div class="insight-change ${insight.positive === true ? 'positive' : insight.positive === false ? 'negative' : ''}">
                ${insight.positive !== null ? `<span class="material-icons">${insight.positive ? 'arrow_upward' : 'arrow_downward'}</span>` : ''}
                ${insight.change}
            </div>` : ''}
        </div>
    `).join('');
    
    // Render goals
    const goals = suggestGoals();
    console.log('🎯 Metas Sugeridas:', goals);
    const goalsContainer = document.getElementById('suggested-goals');
    if (!goalsContainer) {
        console.error('❌ Container suggested-goals não encontrado!');
        return;
    }
    goalsContainer.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-header">
                <div class="goal-title">
                    <div class="goal-icon">
                        <span class="material-icons">${goal.icon}</span>
                    </div>
                    <div class="goal-info">
                        <h4>${goal.title}</h4>
                        <p>${goal.description}</p>
                    </div>
                </div>
                <div class="goal-amount">R$ ${goal.target.toLocaleString('pt-BR')}</div>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="goal-progress-text">
                    <span>R$ ${goal.current.toLocaleString('pt-BR')}</span>
                    <span>${Math.round(goal.progress)}%</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Render patterns
    const patterns = detectPatterns();
    console.log('🔍 Padrões Detectados:', patterns);
    const patternsGrid = document.getElementById('patterns-grid');
    if (!patternsGrid) {
        console.error('❌ Container patterns-grid não encontrado!');
        return;
    }
    patternsGrid.innerHTML = patterns.map(pattern => `
        <div class="pattern-card">
            <div class="pattern-icon-wrapper">
                <span class="material-icons">${pattern.icon}</span>
            </div>
            <div class="pattern-content">
                <h4>${pattern.title}</h4>
                <p>${pattern.description}</p>
            </div>
        </div>
    `).join('');
    
    // Render products
    const products = recommendProducts();
    console.log('🛍️ Produtos Recomendados:', products);
    const productsCarousel = document.getElementById('recommended-products');
    if (!productsCarousel) {
        console.error('❌ Container recommended-products não encontrado!');
        return;
    }
    productsCarousel.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-badge">
                <span class="material-icons">stars</span>
                ${product.badge}
            </div>
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <div class="product-benefits">
                ${product.benefits.map(benefit => `
                    <div class="product-benefit">
                        <span class="material-icons">check_circle</span>
                        ${benefit}
                    </div>
                `).join('')}
            </div>
            <div class="product-cta">
                <div class="product-match">
                    <span class="material-icons">favorite</span>
                    ${product.match}% compatível
                </div>
                <span class="material-icons product-arrow">arrow_forward</span>
            </div>
        </div>
    `).join('');
}

// Refresh personalization data
function refreshPersonalization() {
    personalizationData.lastUpdate = new Date().toISOString();
    renderPersonalizationScreen();
    
    // Show feedback
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #00b894; color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
    message.innerHTML = '<span class="material-icons" style="vertical-align: middle; margin-right: 8px;">refresh</span>Personalização atualizada!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Toggle settings
function toggleLearning() {
    personalizationData.learningEnabled = document.getElementById('learning-enabled').checked;
    const status = personalizationData.learningEnabled ? 'ativado' : 'desativado';
    showToast(`Aprendizado Contínuo ${status}`, personalizationData.learningEnabled ? '#00b894' : '#636e72');
    
    // Save to localStorage
    localStorage.setItem('personalizationData', JSON.stringify(personalizationData));
}

function toggleSmartNotifications() {
    personalizationData.smartNotifications = document.getElementById('smart-notifications').checked;
    const status = personalizationData.smartNotifications ? 'ativadas' : 'desativadas';
    showToast(`Notificações Inteligentes ${status}`, personalizationData.smartNotifications ? '#00b894' : '#636e72');
    
    // Save to localStorage
    localStorage.setItem('personalizationData', JSON.stringify(personalizationData));
}

function toggleProactive() {
    personalizationData.proactiveRecommendations = document.getElementById('proactive-recommendations').checked;
    const status = personalizationData.proactiveRecommendations ? 'ativadas' : 'desativadas';
    showToast(`Recomendações Proativas ${status}`, personalizationData.proactiveRecommendations ? '#00b894' : '#636e72');
    
    // Save to localStorage
    localStorage.setItem('personalizationData', JSON.stringify(personalizationData));
}

function showToast(message, color = '#00b894') {
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: ${color}; color: white; padding: 12px 24px; border-radius: 8px; z-index: 10000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideDown 0.3s ease;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Recommendation action handlers
function showInvestmentSimulator() {
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #252525; color: white; padding: 32px; border-radius: 16px; z-index: 10000; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);';
    message.innerHTML = `
        <div style="text-align: center;">
            <span class="material-icons" style="font-size: 64px; color: var(--primary); margin-bottom: 16px;">trending_up</span>
            <h3 style="margin: 0 0 12px 0; font-size: 20px;">Simulador de Investimentos</h3>
            <p style="color: #b0b0b0; margin-bottom: 24px; font-size: 14px;">Com base no seu perfil, você poderia investir R$ 500/mês e ter:</p>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <div style="margin-bottom: 12px;">
                    <span style="color: #b0b0b0; font-size: 12px;">Em 1 ano</span>
                    <div style="font-size: 24px; font-weight: 700; color: #00b894;">R$ 6.420</div>
                </div>
                <div style="margin-bottom: 12px;">
                    <span style="color: #b0b0b0; font-size: 12px;">Em 5 anos</span>
                    <div style="font-size: 24px; font-weight: 700; color: #00b894;">R$ 35.680</div>
                </div>
                <div>
                    <span style="color: #b0b0b0; font-size: 12px;">Em 10 anos</span>
                    <div style="font-size: 24px; font-weight: 700; color: #00b894;">R$ 82.150</div>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Entendi</button>
        </div>
    `;
    document.body.appendChild(message);
}

function showSavingsGoalModal() {
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #252525; color: white; padding: 32px; border-radius: 16px; z-index: 10000; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);';
    message.innerHTML = `
        <div style="text-align: center;">
            <span class="material-icons" style="font-size: 64px; color: #00b894; margin-bottom: 16px;">savings</span>
            <h3 style="margin: 0 0 12px 0; font-size: 20px;">Meta de Economia</h3>
            <p style="color: #b0b0b0; margin-bottom: 24px; font-size: 14px;">Recomendamos guardar 30% da sua renda mensal para criar uma reserva de emergência sólida.</p>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: left;">
                <div style="margin-bottom: 12px;">
                    <span style="color: #b0b0b0; font-size: 12px;">Meta mensal sugerida</span>
                    <div style="font-size: 24px; font-weight: 700; color: #00b894;">R$ 1.350</div>
                </div>
                <div>
                    <span style="color: #b0b0b0; font-size: 12px;">Fundo de emergência em 6 meses</span>
                    <div style="font-size: 20px; font-weight: 700; color: #ffffff;">R$ 8.100</div>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 14px; background: #00b894; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Criar Meta</button>
        </div>
    `;
    document.body.appendChild(message);
}

function showAlertSettings() {
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #252525; color: white; padding: 32px; border-radius: 16px; z-index: 10000; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);';
    message.innerHTML = `
        <div>
            <div style="text-align: center; margin-bottom: 24px;">
                <span class="material-icons" style="font-size: 64px; color: #f59e0b; margin-bottom: 16px;">notifications_active</span>
                <h3 style="margin: 0 0 12px 0; font-size: 20px;">Alertas Inteligentes</h3>
                <p style="color: #b0b0b0; font-size: 14px;">Configure alertas para compras acima de um valor</p>
            </div>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; color: #b0b0b0; font-size: 14px;">Alertar quando compra for maior que:</label>
                <input type="number" value="200" style="width: 100%; padding: 12px; background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 8px; color: white; font-size: 16px;" />
                <p style="color: #b0b0b0; font-size: 12px; margin-top: 8px;">Você receberá uma notificação antes de confirmar</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 14px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Salvar Configuração</button>
        </div>
    `;
    document.body.appendChild(message);
}

function showCategoryTips(category) {
    const tips = {
        'Alimentação': ['Use aplicativos de cupons', 'Faça lista antes de comprar', 'Cozinhe em casa mais vezes'],
        'Transporte': ['Use transporte público', 'Considere carona compartilhada', 'Planeje rotas eficientes'],
        'Lazer': ['Busque eventos gratuitos', 'Use programas de fidelidade', 'Aproveite descontos de grupo'],
        'Compras': ['Compare preços online', 'Espere promoções', 'Evite compras por impulso']
    };
    
    const categoryTips = tips[category] || ['Monitore seus gastos', 'Defina um orçamento', 'Busque alternativas mais econômicas'];
    
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #252525; color: white; padding: 32px; border-radius: 16px; z-index: 10000; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);';
    message.innerHTML = `
        <div>
            <div style="text-align: center; margin-bottom: 24px;">
                <span class="material-icons" style="font-size: 64px; color: #667eea; margin-bottom: 16px;">lightbulb</span>
                <h3 style="margin: 0 0 12px 0; font-size: 20px;">Dicas para ${category}</h3>
                <p style="color: #b0b0b0; font-size: 14px;">Sugestões personalizadas para economizar</p>
            </div>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                ${categoryTips.map(tip => `
                    <div style="display: flex; gap: 12px; margin-bottom: 12px; align-items: start;">
                        <span class="material-icons" style="color: #00b894; font-size: 20px;">check_circle</span>
                        <span style="color: #e8e8e8; font-size: 14px;">${tip}</span>
                    </div>
                `).join('')}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 14px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Entendi</button>
        </div>
    `;
    document.body.appendChild(message);
}

// ========== VIRTUAL CARD CREATION ==========
let virtualCards = JSON.parse(localStorage.getItem('virtualCards')) || [];

function selectCardType(type) {
    document.querySelectorAll('.card-type-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function generateCardNumber() {
    // Generate a fake card number starting with 5269 (MoneyFlow BIN)
    let number = '5269';
    for (let i = 0; i < 12; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

function generateCVV() {
    return String(Math.floor(100 + Math.random() * 900));
}

function generateExpiry() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear() + 5).slice(-2);
    return `${month}/${year}`;
}

function formatCardNumber(number) {
    return number.match(/.{1,4}/g).join(' ');
}

function createVirtualCard() {
    const cardType = document.querySelector('.card-type-option.selected strong').textContent;
    
    if (cardType === 'Físico') {
        showCardCreationModal('physical');
        return;
    }
    
    // Generate card details
    const cardNumber = generateCardNumber();
    const cvv = generateCVV();
    const expiry = generateExpiry();
    
    // Show loading animation
    const button = event.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">autorenew</span> Criando...';
    button.disabled = true;
    
    setTimeout(() => {
        // Animate card reveal
        document.getElementById('preview-card-number').textContent = formatCardNumber(cardNumber);
        document.getElementById('preview-card-expiry').textContent = expiry;
        document.getElementById('preview-card-cvv').textContent = cvv;
        
        // Save card
        const newCard = {
            id: Date.now(),
            type: 'virtual',
            number: cardNumber,
            cvv: cvv,
            expiry: expiry,
            holder: 'PAULO SANTOS',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        virtualCards.push(newCard);
        localStorage.setItem('virtualCards', JSON.stringify(virtualCards));
        
        // Show success modal
        button.innerHTML = originalText;
        button.disabled = false;
        showCardCreationModal('success', newCard);
    }, 2000);
}

function showCardCreationModal(type, cardData) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
    
    if (type === 'success') {
        modal.innerHTML = `
            <div style="background: #252525; border-radius: 20px; padding: 40px; max-width: 400px; width: 100%; text-align: center; animation: slideUp 0.3s ease;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #00b894, #00d2d3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                    <span class="material-icons" style="color: white; font-size: 48px;">check</span>
                </div>
                <h2 style="margin: 0 0 12px 0; color: white; font-size: 24px;">Cartão Criado!</h2>
                <p style="color: #b0b0b0; margin: 0 0 32px 0; font-size: 15px;">Seu cartão virtual está pronto para usar</p>
                
                <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: left;">
                    <div style="margin-bottom: 16px;">
                        <span style="color: #b0b0b0; font-size: 12px; display: block; margin-bottom: 4px;">Número do Cartão</span>
                        <div style="font-family: 'Courier New', monospace; font-size: 18px; color: white; letter-spacing: 2px;">${formatCardNumber(cardData.number)}</div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <span style="color: #b0b0b0; font-size: 12px; display: block; margin-bottom: 4px;">Validade</span>
                            <div style="font-size: 16px; color: white; font-weight: 600;">${cardData.expiry}</div>
                        </div>
                        <div>
                            <span style="color: #b0b0b0; font-size: 12px; display: block; margin-bottom: 4px;">CVV</span>
                            <div style="font-size: 16px; color: white; font-weight: 600;">${cardData.cvv}</div>
                        </div>
                    </div>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove(); showScreen('dashboard-screen')" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #00b894, #00856f); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; margin-bottom: 12px;">
                    Começar a Usar
                </button>
                <button onclick="copyCardData('${cardData.number}', '${cardData.expiry}', '${cardData.cvv}')" style="width: 100%; padding: 16px; background: transparent; color: white; border: 2px solid #2a2a2a; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    Copiar Dados
                </button>
            </div>
        `;
    } else if (type === 'physical') {
        modal.innerHTML = `
            <div style="background: #252525; border-radius: 20px; padding: 40px; max-width: 400px; width: 100%; text-align: center;">
                <span class="material-icons" style="color: #00b894; font-size: 64px; margin-bottom: 16px;">local_shipping</span>
                <h2 style="margin: 0 0 12px 0; color: white; font-size: 24px;">Cartão Físico</h2>
                <p style="color: #b0b0b0; margin: 0 0 32px 0; font-size: 15px;">Seu cartão físico será enviado em até 7 dias úteis para o endereço cadastrado.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #00b894, #00856f); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    Solicitar Cartão
                </button>
            </div>
        `;
    }
    
    document.body.appendChild(modal);
}

function copyCardData(number, expiry, cvv) {
    const text = `Número: ${formatCardNumber(number)}\nValidade: ${expiry}\nCVV: ${cvv}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Dados copiados!', '#00b894');
    });
}

// ========== ACCESSIBILITY FEATURES ==========
let accessibilitySettings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {
    blindMode: false,
    deafMode: false,
    seniorMode: false,
    fontSize: 'normal',
    contrast: 'default',
    spacing: 'normal'
};

function activateBlindMode() {
    accessibilitySettings.blindMode = !accessibilitySettings.blindMode;
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    if (accessibilitySettings.blindMode) {
        // Enable screen reader announcements
        document.body.setAttribute('aria-live', 'polite');
        document.body.setAttribute('role', 'application');
        
        showToast('Modo Cego Ativado - Leitor de tela habilitado', '#00b894');
        
        // Announce current screen
        setTimeout(() => {
            announceContent('Modo acessibilidade para pessoas cegas ativado. Use comandos de voz ou navegação por teclado.');
        }, 1000);
    } else {
        document.body.removeAttribute('aria-live');
        showToast('Modo Cego Desativado', '#636e72');
    }
}

function activateDeafMode() {
    accessibilitySettings.deafMode = !accessibilitySettings.deafMode;
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    if (accessibilitySettings.deafMode) {
        // Enable visual notifications
        document.body.classList.add('deaf-mode');
        showToast('Modo Surdo Ativado - Notificações visuais habilitadas', '#00b894');
        
        // Show visual alert example
        setTimeout(() => {
            showVisualAlert('Modo surdo ativo! Todas as notificações serão visuais com flashes coloridos.');
        }, 1000);
    } else {
        document.body.classList.remove('deaf-mode');
        showToast('Modo Surdo Desativado', '#636e72');
    }
}

function activateSeniorMode() {
    accessibilitySettings.seniorMode = !accessibilitySettings.seniorMode;
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    if (accessibilitySettings.seniorMode) {
        // Apply senior-friendly styles
        document.body.classList.add('senior-mode');
        document.body.style.fontSize = '18px';
        
        // Make buttons larger
        document.querySelectorAll('button, .action-btn').forEach(btn => {
            btn.style.minHeight = '56px';
            btn.style.fontSize = '18px';
        });
        
        showToast('Modo Terceira Idade Ativado', '#00b894');
        
        // Show tutorial
        setTimeout(() => {
            showSeniorTutorial();
        }, 1000);
    } else {
        document.body.classList.remove('senior-mode');
        document.body.style.fontSize = '';
        document.querySelectorAll('button, .action-btn').forEach(btn => {
            btn.style.minHeight = '';
            btn.style.fontSize = '';
        });
        showToast('Modo Terceira Idade Desativado', '#636e72');
    }
}

function setFontSize(size) {
    accessibilitySettings.fontSize = size;
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    // Remove all active states
    event.currentTarget.parentElement.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    const sizes = {
        'small': '14px',
        'normal': '16px',
        'large': '20px',
        'xlarge': '24px'
    };
    
    document.body.style.fontSize = sizes[size];
    showToast(`Tamanho da fonte: ${size === 'small' ? 'Pequeno' : size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Extra Grande'}`, '#00b894');
}

function setContrast(mode) {
    accessibilitySettings.contrast = mode;
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    // Remove all active states
    event.currentTarget.parentElement.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Remove previous contrast classes
    document.body.classList.remove('contrast-default', 'contrast-bw', 'contrast-yb');
    
    if (mode === 'bw') {
        document.body.classList.add('contrast-bw');
        document.body.style.filter = 'contrast(1.5)';
        showToast('Alto Contraste: Preto e Branco', '#000000');
    } else if (mode === 'yb') {
        document.body.classList.add('contrast-yb');
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffff00';
        showToast('Alto Contraste: Amarelo e Preto', '#ffff00');
    } else {
        document.body.style.filter = '';
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        showToast('Contraste: Padrão', '#00b894');
    }
}

function setSpacing(spacing) {
    accessibilitySettings.spacing = spacing;
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    // Remove all active states
    event.currentTarget.parentElement.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    const spacings = {
        'compact': '0.8',
        'normal': '1',
        'wide': '1.5'
    };
    
    document.body.style.lineHeight = spacings[spacing];
    document.querySelectorAll('.section').forEach(section => {
        section.style.marginBottom = spacing === 'compact' ? '16px' : spacing === 'wide' ? '40px' : '24px';
    });
    
    showToast(`Espaçamento: ${spacing === 'compact' ? 'Compacto' : spacing === 'normal' ? 'Normal' : 'Amplo'}`, '#00b894');
}

function announceContent(text) {
    // Create screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = text;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 3000);
}

function showVisualAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ff6b6b; color: white; padding: 32px; border-radius: 16px; z-index: 10000; text-align: center; font-size: 20px; font-weight: 700; box-shadow: 0 0 0 5px rgba(255, 107, 107, 0.5); animation: flash 0.5s infinite;';
    alert.innerHTML = `
        <span class="material-icons" style="font-size: 64px; display: block; margin-bottom: 16px;">notification_important</span>
        ${message}
        <button onclick="this.parentElement.remove()" style="margin-top: 24px; padding: 12px 32px; background: white; color: #ff6b6b; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">OK</button>
    `;
    
    // Add flash animation
    const style = document.createElement('style');
    style.textContent = '@keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }';
    document.head.appendChild(style);
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentElement) alert.remove();
    }, 5000);
}

function showSeniorTutorial() {
    const tutorial = document.createElement('div');
    tutorial.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
    tutorial.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center;">
            <span class="material-icons" style="font-size: 80px; color: #00b894; margin-bottom: 24px;">elderly</span>
            <h2 style="margin: 0 0 16px 0; font-size: 28px;">Bem-vindo ao Modo Sênior!</h2>
            <p style="font-size: 20px; line-height: 1.6; color: #555; margin-bottom: 32px;">
                Ativamos uma interface mais simples com botões maiores, letras grandes e menos opções em cada tela. 
                Se precisar de ajuda, nosso telefone é: <strong>0800-123-4567</strong>
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; padding: 20px; background: #00b894; color: white; border: none; border-radius: 12px; font-size: 22px; font-weight: 700; cursor: pointer;">
                Entendi, Obrigado!
            </button>
        </div>
    `;
    document.body.appendChild(tutorial);
}

// Console welcome message
console.log('%c🎉 MoneyFlow AI - Demo Interativo COMPLETO', 'font-size: 20px; font-weight: bold; color: #667EEA;');
console.log('%cHackathon FMU 2025.2 | Hub Financeiro Inteligente', 'font-size: 14px; color: #636E72;');
console.log('%cBackend: Node.js + Express + PostgreSQL + MongoDB + Redis', 'font-size: 12px; color: #00B894;');
console.log('%cFrontend: React Native + Expo', 'font-size: 12px; color: #0984E3;');
console.log('%cAI: OpenAI GPT-4 + Categorização Automática', 'font-size: 12px; color: #E67E22;');
console.log('%c✅ Todas as funcionalidades do backend implementadas!', 'font-size: 12px; font-weight: bold; color: #00B894;');
console.log('%c🧠 Sistema de Personalização com Heurísticas Ativado!', 'font-size: 12px; font-weight: bold; color: #667EEA;');
