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
    }
};