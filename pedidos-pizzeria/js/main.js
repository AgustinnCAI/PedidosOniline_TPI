document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Pedidos Online - Pizza al Toque');
    console.log('Inicializando aplicación...');
    
    // Check authentication on page load
    checkAuth();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Aplicación lista');
});

const setupEventListeners = () => {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Prevent default form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.id || (form.id !== 'loginForm' && form.id !== 'registerForm')) {
                e.preventDefault();
            }
        });
    });
};

// Handle page refresh - restore cart and user
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        // You could save cart to localStorage here if needed
        // localStorage.setItem('cart', JSON.stringify(cart));
    }
});

// Error handler for fetch requests
window.addEventListener('unhandledrejection', (event) => {
    console.error('Error no manejado:', event.reason);
});