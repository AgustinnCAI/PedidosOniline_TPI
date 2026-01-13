const API = {
    users: 'https://690bc1036ad3beba00f616a7.mockapi.io/pedidos/main/users',
    orders: 'https://690bc1036ad3beba00f616a7.mockapi.io/pedidos/main/orders',
    menu: 'https://6913bf71f34a2ff1170d1355.mockapi.io/menu'
};

// Global State
let currentUser = null;
let cart = [];
let allOrders = [];
let menuItems = [];
let chartInstance = null;

// Utility Functions
const showSection = (section) => {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    
    const sections = {
        login: 'loginSection',
        register: 'registerSection',
        menu: 'menuSection',
        cart: 'cartSection',
        orders: 'ordersSection',
        dashboard: 'dashboardSection',
        adminOrders: 'adminOrdersSection',
        adminMenu: 'adminMenuSection',
        adminUsers: 'adminUsersSection'
    };

    const sectionId = sections[section];
    if (sectionId) {
        document.getElementById(sectionId).classList.remove('hidden');
        
        // Load data for specific sections
        if (section === 'orders') loadUserOrders();
        if (section === 'dashboard') loadDashboard();
        if (section === 'adminOrders') loadAdminOrders();
        if (section === 'adminMenu') loadAdminMenu();
        if (section === 'adminUsers') loadUsers();
        if (section === 'cart') renderCart();
    }
};

const updateNavbar = () => {
    const navMenu = document.getElementById('navMenu');
    if (currentUser) {
        if (currentUser.role === 'ADMIN') {
            navMenu.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('dashboard')">Dashboard</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('adminOrders')">Pedidos</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('adminMenu')">Menú</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('adminUsers')">Usuarios</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Cerrar Sesión</a></li>
            `;
        } else {
            navMenu.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('menu')">Menú</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('orders')">Mis Pedidos</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Cerrar Sesión</a></li>
            `;
        }
    } else {
        navMenu.innerHTML = '';
    }
};

// Funciones de utilidad para notificaciones y loading
const showNotification = (message, type = 'info') => {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
};

const showLoading = (show) => {
    let loader = document.getElementById('globalLoader');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
            loader.style.cssText = 'background: rgba(0,0,0,0.5); z-index: 9999;';
            loader.innerHTML = `
                <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            `;
            document.body.appendChild(loader);
        }
    } else {
        if (loader) {
            loader.remove();
        }
    }
};