// Verificar autenticación
const currentUser = checkAuth();

if (currentUser) {
    displayUserName();
    setupLogout();
    loadMyOrders();
}

// Cargar los pedidos del usuario
async function loadMyOrders() {
    try {
        const orders = await fetchAPI(ENDPOINTS.orders);
        const myOrders = orders.filter(order => order.userId === currentUser.id);
        
        displayOrders(myOrders);
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        alert('Error al cargar los pedidos');
    }
}

// Mostrar los pedidos
function displayOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-message">
                <p>No tienes pedidos todavía</p>
                <a href="catalogo.html" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">Ver Menú</a>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    orders.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    ordersContainer.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Pedido #${order.id}</div>
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
                <span style="font-weight: 600;">Total:</span>
                <span class="order-total">${formatPrice(order.total)}</span>
            </div>
        </div>
    `).join('');
}