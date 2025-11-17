const loadUserOrders = async () => {
    if (!currentUser) return;

    try {
        const res = await fetch(API.orders);
        const orders = await res.json();
        const userOrders = orders.filter(o => o.userId == currentUser.id);
        
        const container = document.getElementById('ordersContainer');
        if (userOrders.length === 0) {
            container.innerHTML = '<p class="text-center">No tienes pedidos</p>';
            return;
        }

        container.innerHTML = userOrders.reverse().map(order => `
            <div class="cart-item">
                <div>
                    <h6>Pedido #${order.id}</h6>
                    <small>${order.fecha || 'Fecha no disponible'}</small><br>
                    <small>${order.items?.length || 0} items - Total: $${order.total}</small>
                </div>
                <span class="order-status status-${order.estado.replace(' ', '-')}">${order.estado}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error al cargar pedidos:', err);
        alert('Error al cargar pedidos');
    }
};