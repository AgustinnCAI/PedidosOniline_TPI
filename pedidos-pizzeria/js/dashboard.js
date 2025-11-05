// Verificar autenticación de administrador
const currentUser = checkAuth('ADMIN');

if (currentUser) {
    displayUserName();
    setupLogout();
    setupAdminTabs();
    loadDashboard();
    
    // Inicializar manejadores de formularios
    const addMenuForm = document.getElementById('addMenuForm');
    if (addMenuForm) {
        addMenuForm.addEventListener('submit', addMenuItem);
    }
    
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', addUser);
    }
}

// Configurar las pestañas del admin
function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clase active de todos
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Activar el seleccionado
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById(`${tabName}Tab`).classList.add('active');
            
            // Cargar datos según la pestaña
            switch(tabName) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'menu':
                    loadMenuManagement();
                    break;
                case 'orders':
                    loadOrdersManagement();
                    break;
                case 'users':
                    loadUsersManagement();
                    break;
            }
        });
    });
}

// DASHBOARD
async function loadDashboard() {
    try {
        const orders = await fetchAPI(ENDPOINTS.orders);
        
        // Calcular estadísticas
        const stats = {
            total: orders.length,
            pendiente: orders.filter(o => o.estado === 'pendiente').length,
            preparacion: orders.filter(o => o.estado === 'en preparacion' || o.estado === 'preparacion').length,
            entregado: orders.filter(o => o.estado === 'entregado').length
        };
        
        // Actualizar números
        document.getElementById('totalOrders').textContent = stats.total;
        document.getElementById('pendingOrders').textContent = stats.pendiente;
        document.getElementById('preparingOrders').textContent = stats.preparacion;
        document.getElementById('deliveredOrders').textContent = stats.entregado;
        
        // Crear gráfico
        createOrdersChart(stats);
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

function createOrdersChart(stats) {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.ordersChart) {
        window.ordersChart.destroy();
    }
    
    window.ordersChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'En Preparación', 'Entregados'],
            datasets: [{
                data: [stats.pendiente, stats.preparacion, stats.entregado],
                backgroundColor: ['#ffc107', '#007bff', '#28a745'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Estado de Pedidos',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}

// GESTIÓN DE MENÚ
async function loadMenuManagement() {
    try {
        const menuItems = await fetchAPI(ENDPOINTS.menu);
        displayMenuTable(menuItems);
        
        // Setup form
        document.getElementById('addMenuForm').addEventListener('submit', addMenuItem);
        
    } catch (error) {
        console.error('Error cargando menú:', error);
    }
}

function displayMenuTable(items) {
    const tbody = document.getElementById('menuTableBody');
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td style="text-transform: capitalize">${item.tipo}</td>
            <td>${formatPrice(item.precio)}</td>
            <td>${item.disponible ? '✅ Sí' : '❌ No'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="toggleDisponible('${item.id}', ${!item.disponible})">
                    ${item.disponible ? 'Desactivar' : 'Activar'}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteMenuItem('${item.id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function addMenuItem(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('itemName').value;
    const tipo = document.getElementById('itemType').value;
    const precio = parseFloat(document.getElementById('itemPrice').value);
    
    try {
        await fetchAPI(ENDPOINTS.menu, {
            method: 'POST',
            body: JSON.stringify({
                nombre,
                tipo,
                precio,
                disponible: true
            })
        });
        
        alert('Producto agregado exitosamente');
        e.target.reset();
        loadMenuManagement();
        
    } catch (error) {
        console.error('Error agregando producto:', error);
        alert('Error al agregar el producto');
    }
}

async function toggleDisponible(id, disponible) {
    try {
        await fetchAPI(`${ENDPOINTS.menu}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ disponible })
        });
        
        loadMenuManagement();
        
    } catch (error) {
        console.error('Error actualizando producto:', error);
        alert('Error al actualizar el producto');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        await fetchAPI(`${ENDPOINTS.menu}/${id}`, {
            method: 'DELETE'
        });
        
        alert('Producto eliminado');
        loadMenuManagement();
        
    } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
    }
}

// GESTIÓN DE PEDIDOS
async function loadOrdersManagement() {
    try {
        const orders = await fetchAPI(ENDPOINTS.orders);
        const users = await fetchAPI(ENDPOINTS.users);
        
        displayAdminOrders(orders, users);
        
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

function displayAdminOrders(orders, users) {
    const container = document.getElementById('adminOrdersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay pedidos todavía</p>';
        return;
    }
    
    // Ordenar por fecha
    orders.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    container.innerHTML = orders.map(order => {
        const user = users.find(u => u.id === order.userId);
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Pedido #${order.id}</div>
                        <small style="color: #666;">Cliente: ${user ? user.nombre : 'Desconocido'}</small><br>
                        <small style="color: #666;">${formatDate(order.fecha)}</small>
                    </div>
                    <span class="order-status status-${order.estado.replace(' ', '-')}">
                        ${translateStatus(order.estado)}
                    </span>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.cantidad}x ${item.nombre}</span>
                            <span>${formatPrice(item.precio * item.cantidad)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <span class="order-total">${formatPrice(order.total)}</span>
                    <div class="order-actions">
                        ${order.estado !== 'pendiente' ? '' : `
                            <button class="btn btn-warning btn-sm" onclick="updateOrderStatus('${order.id}', 'en preparacion')">
                                En Preparación
                            </button>
                        `}
                        ${order.estado !== 'en preparacion' && order.estado !== 'preparacion' ? '' : `
                            <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'entregado')">
                                Entregado
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function updateOrderStatus(id, newStatus) {
    try {
        await fetchAPI(`${ENDPOINTS.orders}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ estado: newStatus })
        });
        
        loadOrdersManagement();
        loadDashboard(); // Actualizar estadísticas
        
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        alert('Error al actualizar el pedido');
    }
}

// GESTIÓN DE USUARIOS
async function loadUsersManagement() {
    try {
        const users = await fetchAPI(ENDPOINTS.users);
        displayUsersTable(users);
        
        // Setup form
        document.getElementById('addUserForm').addEventListener('submit', addUser);
        
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

function displayUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td><span class="badge">${user.role}</span></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function addUser(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    try {
        // Verificar email duplicado
        const users = await fetchAPI(ENDPOINTS.users);
        if (users.some(u => u.email === email)) {
            alert('Este email ya está registrado');
            return;
        }
        
        await fetchAPI(ENDPOINTS.users, {
            method: 'POST',
            body: JSON.stringify({
                nombre,
                email,
                password,
                role
            })
        });
        
        alert('Usuario creado exitosamente');
        e.target.reset();
        loadUsersManagement();
        
    } catch (error) {
        console.error('Error creando usuario:', error);
        alert('Error al crear el usuario');
    }
}

async function deleteUser(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    // No permitir eliminar el usuario actual
    if (id === currentUser.id) {
        alert('No puedes eliminar tu propio usuario');
        return;
    }
    
    try {
        await fetchAPI(`${ENDPOINTS.users}/${id}`, {
            method: 'DELETE'
        });
        
        alert('Usuario eliminado');
        loadUsersManagement();
        
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
    }
}