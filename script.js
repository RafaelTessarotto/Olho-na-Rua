// ==========================================
// STATE MANAGEMENT
// ==========================================

const appState = {
    currentUser: null,
    reports: [
        {
            id: 0,
            type: 'Crime',
            address: 'Rua Clarentino, 312',
            date: '2010 - 16:12',
            description: 'Hoje, por volta das 19h00, vi dois homens entrarem no mercadinho da São Féres. Um deles sacou uma arma e levou todo o caixa, enquanto o outro pegava o dinheiro. Saí correndo logo depois. Todo eu estava armado, mas não tenho certeza porque foi tudo muito rápido.',
            verifications: 0,
            verified: false
        },
        {
            id: 1,
            type: 'Acidente',
            address: 'Av. Paulista, 1578',
            date: '2010 - 14:30',
            description: 'Colisão entre dois carros na esquina. Trânsito interrompido. Ambulância já foi chamada.',
            verifications: 3,
            verified: false
        }
    ],
    currentReport: null,
    selectedCategory: 'crime',
    settings: {
        alerts: true,
        accidents: true,
        theme: 'claro',
        language: 'português'
    }
};

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav item
    updateActiveNav(pageId);
    
    // Hide bottom nav on login page
    const bottomNav = document.querySelector('.bottom-nav');
    if (pageId === 'login-page') {
        bottomNav.style.display = 'none';
    } else {
        bottomNav.style.display = 'flex';
    }
}

function updateActiveNav(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
    if (activeNavItem && activeNavItem.classList.contains('nav-item')) {
        activeNavItem.classList.add('active');
    }
}

// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================

function handleLogin() {
    const username = document.getElementById('login-input').value;
    const password = document.getElementById('password-input').value;
    
    if (username && password) {
        appState.currentUser = {
            name: username,
            memberSince: '22/05/2010',
            neighborhood: 'Tatuapé',
            phone: '(11) 94723-8293',
            rating: 4
        };
        
        updateProfileInfo();
        navigateTo('map-page');
    } else {
        alert('Por favor, preencha todos os campos');
    }
}

function handleSocialLogin() {
    appState.currentUser
