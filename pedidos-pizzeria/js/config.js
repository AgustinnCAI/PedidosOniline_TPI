// Configuración global de la API
const API_URL = 'https://690bc1036ad3beba00f616a7.mockapi.io/pedidos/main';

// Endpoints
const ENDPOINTS = {
    users: `${API_URL}/users`,
    menu: `${API_URL}/menu`,
    orders: `${API_URL}/orders`
};

// Funciones de utilidad para localStorage
const Storage = {
    setUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    getUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    removeUser: () => {
        localStorage.removeItem('currentUser');
    },
    
    setCart: (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    
    getCart: () => {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    
    clearCart: () => {
        localStorage.removeItem('cart');
    }
};

// Función para verificar autenticación
function checkAuth(requiredRole = null) {
    const user = Storage.getUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = user.role === 'ADMIN' ? 'admin.html' : 'catalogo.html';
        return null;
    }
    
    return user;
}

// Función para hacer peticiones a la API
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Función para formatear precios
function formatPrice(price) {
    return `$${parseFloat(price).toLocaleString('es-AR')}`;
}

// Función para formatear fechas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Traducción de estados
const STATUS_TRANSLATIONS = {
    'pendiente': 'Pendiente',
    'en preparacion': 'En Preparación',
    'preparacion': 'En Preparación',
    'entregado': 'Entregado'
};

function translateStatus(status) {
    return STATUS_TRANSLATIONS[status.toLowerCase()] || status;
}