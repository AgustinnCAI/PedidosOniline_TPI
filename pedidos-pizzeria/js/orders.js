const loadUserOrders = async () => {
    if (!currentUser) return;

    try {
        showLoading(true);
        const res = await fetch(API.orders);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        const orders = await res.json();
        const userOrders = orders.filter(o => o.userId == currentUser.id);
        
        const container = document.getElementById('ordersContainer');
        if (userOrders.length === 0) {
            container.innerHTML = '<p class="text-center">No tienes pedidos aún</p>';
            return;
        }

        container.innerHTML = userOrders.reverse().map(order => {
            const itemsList = order.items ? order.items.map(item => 
                `${item.nombre} (x${item.quantity || 1})`
            ).join(', ') : 'Sin items';
            
            return `
                <div class="cart-item">
                    <div>
                        <h6>Pedido #${order.id}</h6>
                        <small>${order.fecha || 'Fecha no disponible'}</small><br>
                        <small>${itemsList}</small><br>
                        <strong>Total: $${order.total || '0.00'}</strong>
                    </div>
                    <span class="order-status status-${(order.estado || 'pendiente').replace(/\s+/g, '-')}">${order.estado || 'pendiente'}</span>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error al cargar pedidos:', err);
        const container = document.getElementById('ordersContainer');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error al cargar pedidos. Por favor, intenta nuevamente.</p>';
        }
    } finally {
        showLoading(false);
    }
};