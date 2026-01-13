# 🍕 Pizza al Toque - Sistema de Pedidos Online

Sistema web completo para gestión de pedidos de pizzería desarrollado con HTML5, CSS3 y JavaScript vanilla. Incluye panel de administración, carrito de compras, dashboard con estadísticas en tiempo real y persistencia de datos mediante MockAPI.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Funcionalidades por Rol](#-funcionalidades-por-rol)
- [API y Métodos HTTP](#-api-y-métodos-http)
- [Código y Arquitectura](#-código-y-arquitectura)
- [Uso del Sistema](#-uso-del-sistema)
- [Autores](#-autores)

---

## 🚀 Características

### Para Usuarios (ROL: USUARIO)
- ✅ Sistema de registro y login con validación
- ✅ Catálogo de productos con cards dinámicas
- ✅ Carrito de compras funcional con persistencia en localStorage
- ✅ Gestión de cantidades en el carrito (aumentar/disminuir)
- ✅ Realizar pedidos con validación de disponibilidad
- ✅ Ver historial de pedidos propios
- ✅ Seguimiento de estado de pedidos en tiempo real
- ✅ Notificaciones de éxito/error

### Para Administradores (ROL: ADMIN)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gráficos interactivos con Chart.js (gráfico de barras)
- ✅ ABM completo del menú (Crear, Leer, Actualizar, Eliminar)
- ✅ Gestión de pedidos con cambio de estado
- ✅ Gestión de usuarios (ver lista y cambiar contraseñas)
- ✅ Vista de todos los pedidos del sistema
- ✅ Actualización automática de gráficos al cambiar estados

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | - | Estructura semántica del sitio |
| CSS3 | - | Estilos y diseño responsivo |
| JavaScript (ES6+) | - | Lógica de negocio y manipulación del DOM |
| Bootstrap | 5.3.0 | Framework CSS y componentes UI |
| Font Awesome | 6.4.0 | Iconos vectoriales |
| Chart.js | 4.4.0 | Gráficos estadísticos interactivos |
| MockAPI | - | Backend simulado (API REST) |

---

## 📁 Estructura del Proyecto

```
PedidosOniline_TPI/
│
├── pedidos-pizzeria/
│   ├── index.html                 # Página principal SPA (Single Page Application)
│   │
│   ├── css/
│   │   └── styles.css            # Estilos personalizados y diseño responsivo
│   │
│   └── js/
│       ├── config.js             # Configuración de APIs y estado global
│       ├── auth.js               # Autenticación (login, registro, logout)
│       ├── menu.js               # Carga y renderizado del menú de productos
│       ├── cart.js               # Carrito de compras y gestión de pedidos
│       ├── orders.js             # Visualización de pedidos del usuario
│       ├── admin.js              # Panel de administración completo
│       └── main.js               # Inicialización de la aplicación
│
└── README.md                     # Documentación del proyecto
```

### 📄 Descripción de Archivos JavaScript

- **config.js**: Define las URLs de las APIs de MockAPI, variables globales compartidas, funciones de utilidad (notificaciones, loading, navegación)
- **auth.js**: Maneja el sistema de autenticación, validación de formularios, sesiones con localStorage
- **menu.js**: Obtiene productos de la API y los renderiza dinámicamente con filtrado por disponibilidad
- **cart.js**: Gestiona el carrito de compras, persistencia en localStorage, validaciones y proceso de pedidos
- **orders.js**: Muestra el historial de pedidos del usuario logueado con detalles
- **admin.js**: Funciones del panel administrativo (dashboard, ABM de productos, gestión de pedidos y usuarios, gráficos)
- **main.js**: Punto de entrada, inicializa la aplicación y configura event listeners

---

## 💻 Instalación

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (VS Code recomendado)
- Extensión Live Server (opcional pero recomendada)

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
```bash
git clone https://github.com/tu-usuario/PedidosOniline_TPI.git
cd PedidosOniline_TPI/pedidos-pizzeria
```

2. **Abrir el proyecto**
   - **Opción 1**: Doble click en `index.html`
   - **Opción 2**: Click derecho → Abrir con → Navegador
   - **Opción 3** (recomendada): Usar Live Server en VS Code

---

## 👥 Funcionalidades por Rol

### 🔵 ROL: USUARIO

| Funcionalidad | Descripción | Archivo |
|---------------|-------------|---------|
| **Registro** | Crear cuenta nueva con validación de email y contraseña (mínimo 4 caracteres) | `auth.js` |
| **Login** | Iniciar sesión con email y contraseña, validación de credenciales | `auth.js` |
| **Ver Menú** | Visualizar catálogo de productos disponibles filtrados por disponibilidad | `menu.js` |
| **Carrito** | Agregar, modificar cantidades y eliminar productos del carrito | `cart.js` |
| **Persistencia Carrito** | El carrito se guarda en localStorage y se restaura al iniciar sesión | `cart.js` |
| **Realizar Pedido** | Enviar pedido al sistema con validación de disponibilidad de productos | `cart.js` |
| **Mis Pedidos** | Ver historial completo de pedidos propios con detalles de items y estados | `orders.js` |
| **Cerrar Sesión** | Salir del sistema limpiando sesión y carrito | `auth.js` |

### 🔴 ROL: ADMIN

| Funcionalidad | Descripción | Archivo |
|---------------|-------------|---------|
| **Dashboard** | Ver estadísticas en tiempo real con gráfico de barras (Chart.js) mostrando distribución de estados de pedidos | `admin.js` |
| **Gestión Pedidos** | Ver todos los pedidos del sistema y actualizar su estado (Pendiente, En Preparación, Entregado) | `admin.js` |
| **ABM Menú - Crear** | Agregar nuevos productos al menú con validación de campos (nombre, tipo, precio, disponibilidad) | `admin.js` |
| **ABM Menú - Editar** | Modificar productos existentes del menú | `admin.js` |
| **ABM Menú - Eliminar** | Eliminar productos del menú con confirmación | `admin.js` |
| **ABM Menú - Listar** | Ver tabla completa de todos los productos con sus detalles | `admin.js` |
| **Gestión Usuarios** | Ver lista de todos los usuarios registrados en el sistema | `admin.js` |
| **Cambiar Contraseñas** | Modificar contraseñas de cualquier usuario del sistema | `admin.js` |
| **Actualización Automática** | Los gráficos se actualizan automáticamente al cambiar estados de pedidos | `admin.js` |

---

## 🔗 API y Métodos HTTP

### Configuración de Endpoints

El proyecto utiliza **MockAPI** como backend simulado. Las URLs están definidas en `config.js`:

```javascript
const API = {
    users: 'https://690bc1036ad3beba00f616a7.mockapi.io/pedidos/main/users',
    orders: 'https://690bc1036ad3beba00f616a7.mockapi.io/pedidos/main/orders',
    menu: 'https://6913bf71f34a2ff1170d1355.mockapi.io/menu'
};
```

### 📡 Endpoints y Métodos Implementados

#### 👤 **Users API** (`/users`)

| Método | Endpoint | Descripción | Código |
|--------|----------|-------------|--------|
| **GET** | `/users` | Obtener todos los usuarios | `auth.js:37` |
| **POST** | `/users` | Crear nuevo usuario | `auth.js:95` |
| **PUT** | `/users/:id` | Actualizar usuario (cambiar contraseña) | `admin.js:459` |

**Ejemplo de código - GET Users (Login):**
```javascript
const res = await fetch(API.users);
const users = await res.json();
const user = users.find(u => u.email === email && u.password === password);
```

**Ejemplo de código - POST User (Registro):**
```javascript
const response = await fetch(API.users, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nombre,
        email: email.toLowerCase(),
        password,
        role: 'USUARIO'
    })
});
```

**Ejemplo de código - PUT User (Cambiar Contraseña):**
```javascript
const getRes = await fetch(`${API.users}/${userId}`);
const user = await getRes.json();
const updatedUser = { ...user, password: newPassword };

const res = await fetch(`${API.users}/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser)
});
```

#### 🍕 **Menu API** (`/menu`)

| Método | Endpoint | Descripción | Código |
|--------|----------|-------------|--------|
| **GET** | `/menu` | Obtener todos los productos | `menu.js:4`, `admin.js:221` |
| **POST** | `/menu` | Crear nuevo producto | `admin.js:351` |
| **PUT** | `/menu/:id` | Actualizar producto existente | `admin.js:344` |
| **DELETE** | `/menu/:id` | Eliminar producto | `admin.js:390` |

**Ejemplo de código - GET Menu:**
```javascript
const res = await fetch(API.menu);
menuItems = await res.json();
const available = menuItems.filter(item => item.disponible === true);
```

**Ejemplo de código - POST Product (Crear):**
```javascript
const productData = { nombre, tipo, precio, disponible };
const res = await fetch(API.menu, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
});
```

**Ejemplo de código - PUT Product (Actualizar):**
```javascript
const res = await fetch(`${API.menu}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
});
```

**Ejemplo de código - DELETE Product:**
```javascript
const res = await fetch(`${API.menu}/${productId}`, {
    method: 'DELETE'
});
```

#### 📦 **Orders API** (`/orders`)

| Método | Endpoint | Descripción | Código |
|--------|----------|-------------|--------|
| **GET** | `/orders` | Obtener todos los pedidos | `orders.js:6`, `admin.js:4` |
| **POST** | `/orders` | Crear nuevo pedido | `cart.js:168` |
| **PUT** | `/orders/:id` | Actualizar estado de pedido | `admin.js:191` |

**Ejemplo de código - GET Orders (Usuario):**
```javascript
const res = await fetch(API.orders);
const orders = await res.json();
const userOrders = orders.filter(o => o.userId == currentUser.id);
```

**Ejemplo de código - POST Order (Realizar Pedido):**
```javascript
const order = {
    userId: currentUser.id,
    userName: currentUser.nombre,
    items: cart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo,
        precio: item.precio,
        quantity: item.quantity
    })),
    total: total.toFixed(2),
    estado: 'pendiente',
    fecha: new Date().toLocaleString('es-AR')
};

const res = await fetch(API.orders, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
});
```

**Ejemplo de código - PUT Order (Actualizar Estado):**
```javascript
// Primero obtener el pedido completo
const getRes = await fetch(`${API.orders}/${orderId}`);
const order = await getRes.json();

// Actualizar manteniendo todos los datos
const updatedOrder = { ...order, estado: newStatus };

const res = await fetch(`${API.orders}/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedOrder)
});
```

---

## 💻 Código y Arquitectura

### Estructura de Datos

#### Usuario
```javascript
{
    id: "1",
    nombre: "Juan Pérez",
    email: "juan@example.com",
    password: "1234",
    role: "USUARIO" | "ADMIN"
}
```

#### Producto (Menu)
```javascript
{
    id: "1",
    nombre: "Pizza Margarita",
    tipo: "pizza" | "bebida" | "postre",
    precio: 1500.00,
    disponible: true | false
}
```

#### Pedido (Order)
```javascript
{
    id: "1",
    userId: "1",
    userName: "Juan Pérez",
    items: [
        {
            id: "1",
            nombre: "Pizza Margarita",
            tipo: "pizza",
            precio: 1500.00,
            quantity: 2
        }
    ],
    total: "3000.00",
    estado: "pendiente" | "en preparacion" | "entregado",
    fecha: "15/12/2024, 20:30:00"
}
```

### Funciones Principales

#### Autenticación (`auth.js`)

```javascript
// Validar email con regex
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Login con validación
const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validaciones
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }
    
    // Buscar usuario en API
    const res = await fetch(API.users);
    const users = await res.json();
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loadCartFromStorage();
        updateNavbar();
        showSection('menu');
        loadMenu();
    }
};
```

#### Carrito (`cart.js`)

```javascript
// Persistencia en localStorage
const saveCartToStorage = () => {
    if (currentUser) {
        localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
    }
};

const loadCartFromStorage = () => {
    if (currentUser) {
        const savedCart = localStorage.getItem(`cart_${currentUser.id}`);
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCartCount();
            } catch (err) {
                console.error('Error al cargar el carrito:', err);
                cart = [];
            }
        }
    }
};

// Agregar producto con validación de disponibilidad
const addToCart = (productId) => {
    if (!currentUser) {
        alert('Debes iniciar sesión para agregar productos');
        showSection('login');
        return;
    }
    
    const product = menuItems.find(p => p.id == productId);
    if (!product) {
        alert('Producto no encontrado');
        return;
    }
    
    // Verificar disponibilidad
    if (product.disponible === false || product.disponible === 'false') {
        alert('Este producto no está disponible');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification('Producto agregado al carrito', 'success');
};
```

#### Administración (`admin.js`)

```javascript
// Dashboard con Chart.js
const renderChart = () => {
    const ctx = document.getElementById('ordersChart');
    
    const pending = allOrders.filter(o => o.estado === 'pendiente').length;
    const inProgress = allOrders.filter(o => o.estado === 'en preparacion').length;
    const delivered = allOrders.filter(o => o.estado === 'entregado').length;
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pendiente', 'En Preparación', 'Entregado'],
            datasets: [{
                label: 'Cantidad de Pedidos',
                data: [pending, inProgress, delivered],
                backgroundColor: ['#ffeaa7', '#74b9ff', '#55efc4'],
                borderColor: ['#fdcb6e', '#0984e3', '#00b894'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, precision: 0 }
                }
            }
        }
    });
};

// Actualizar estado de pedido (manteniendo integridad de datos)
const updateOrderStatus = async (orderId, newStatus) => {
    // Obtener pedido completo primero
    const getRes = await fetch(`${API.orders}/${orderId}`);
    const order = await getRes.json();
    
    // Actualizar solo el estado manteniendo todos los demás datos
    const updatedOrder = { ...order, estado: newStatus };
    
    const res = await fetch(`${API.orders}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
    });
    
    if (res.ok) {
        // Actualizar también en memoria para mantener consistencia
        const index = allOrders.findIndex(o => o.id == orderId);
        if (index !== -1) {
            allOrders[index] = updatedOrder;
        }
        loadAdminOrders();
        // Actualizar gráfico si el dashboard está visible
        if (!document.getElementById('dashboardSection').classList.contains('hidden')) {
            renderChart();
        }
    }
};
```

### Utilidades (`config.js`)

```javascript
// Sistema de notificaciones
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

// Indicador de carga
const showLoading = (show) => {
    let loader = document.getElementById('globalLoader');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
            loader.style.cssText = 'background: rgba(0,0,0,0.5); z-index: 9999;';
            loader.innerHTML = '<div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Cargando...</span></div>';
            document.body.appendChild(loader);
        }
    } else {
        if (loader) loader.remove();
    }
};
```

---

## 📖 Uso del Sistema

### 🔐 Inicio de Sesión

#### Como Usuario
1. Ve a la sección "Registro"
2. Completa: Nombre, Email, Contraseña (mínimo 4 caracteres)
3. Click en "Registrarse"
4. Inicia sesión con tus credenciales

#### Como Administrador
1. Usa las credenciales del usuario ADMIN creado en MockAPI
2. El sistema diferencia automáticamente el rol y muestra el menú correspondiente

### 🛒 Realizar un Pedido (Usuario)

1. **Navegar por el Menú**
   - Ve a la sección "Menú"
   - Visualiza productos disponibles (solo se muestran los disponibles)

2. **Agregar al Carrito**
   - Click en "Agregar" en el producto deseado
   - El contador del carrito se actualiza automáticamente
   - El carrito se guarda en localStorage

3. **Gestionar Carrito**
   - Click en el icono del carrito
   - Aumentar/disminuir cantidades con botones +/-
   - Eliminar productos con el botón de basura

4. **Finalizar Pedido**
   - Click en "Realizar Pedido"
   - Se valida que todos los productos sigan disponibles
   - El pedido se envía a MockAPI
   - Puedes ver tu pedido en "Mis Pedidos"

### 👨‍💼 Panel de Administración

#### Dashboard
- Visualiza estadísticas en tiempo real
- Gráfico de barras con distribución de estados de pedidos
- Se actualiza automáticamente al cambiar estados

#### Gestión de Pedidos
1. Ve a "Pedidos"
2. Ve todos los pedidos del sistema con detalles
3. Cambia el estado usando el dropdown:
   - Pendiente
   - En Preparación
   - Entregado
4. El gráfico se actualiza automáticamente

#### Gestión del Menú
1. Ve a "Menú"
2. **Agregar Producto**:
   - Click en "Agregar Producto"
   - Completa el formulario (nombre, tipo, precio, disponibilidad)
   - Validación automática de campos
   - Click en "Guardar"

3. **Editar Producto**:
   - Click en el botón de editar (lápiz)
   - Modifica los datos
   - Click en "Guardar"

4. **Eliminar Producto**:
   - Click en el botón de eliminar (basura)
   - Confirma la eliminación

#### Gestión de Usuarios
1. Ve a "Usuarios"
2. Ve la lista de todos los usuarios con sus roles
3. Cambia contraseñas usando "Cambiar Contraseña"
   - Se actualiza manteniendo todos los demás datos del usuario

---

## ✅ Características Técnicas Implementadas

### Manejo de Errores
- ✅ Try-catch en todas las operaciones asíncronas
- ✅ Validación de respuestas del servidor (`res.ok`)
- ✅ Mensajes de error descriptivos al usuario
- ✅ Manejo de errores de red y conexión

### Validaciones
- ✅ Validación de email con regex
- ✅ Validación de longitud de contraseña
- ✅ Validación de campos requeridos
- ✅ Validación de precios (números positivos)
- ✅ Validación de disponibilidad de productos

### Persistencia
- ✅ localStorage para sesión de usuario
- ✅ localStorage para carrito de compras (por usuario)
- ✅ Restauración automática al iniciar sesión

### UX/UI
- ✅ Indicadores de carga durante operaciones
- ✅ Notificaciones de éxito/error
- ✅ Confirmaciones para acciones destructivas
- ✅ Diseño responsivo para móviles, tablets y desktop
- ✅ Transiciones y animaciones suaves

---

## 👨‍💻 Autores

**Proyecto Universitario - TPI (Trabajo Práctico Integrador)**

Desarrollado para la materia de Programación III

---

## 📄 Licencia

Este proyecto fue desarrollado como Trabajo Práctico Integrador para la materia Programación III.

**Uso Educativo** - Universidad Tecnológica Nacional

---

⭐ **Si te gustó el proyecto, no olvides darle una estrella en GitHub!**

---

**Desarrollado con ❤️ para Programación III**
