const loadDashboard = async () => {
    try {
        const res = await fetch(API.orders);
        allOrders = await res.json();
        
        const total = allOrders.length;
        const pending = allOrders.filter(o => o.estado === 'pendiente').length;
        const completed = allOrders.filter(o => o.estado === 'entregado').length;
        
        document.getElementById('totalOrders').textContent = total;
        document.getElementById('pendingOrders').textContent = pending;
        document.getElementById('completedOrders').textContent = completed;
        
        renderChart();
    } catch (err) {
        console.error('Error al cargar dashboard:', err);
        alert('Error al cargar dashboard');
    }
};

const renderChart = () => {
    const pending = allOrders.filter(o => o.estado === 'pendiente').length;
    const inProgress = allOrders.filter(o => o.estado === 'en preparacion').length;
    const delivered = allOrders.filter(o => o.estado === 'entregado').length;

    const ctx = document.getElementById('ordersChart');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pendiente', 'En Preparación', 'Entregado'],
            datasets: [{
                label: 'Pedidos',
                data: [pending, inProgress, delivered],
                backgroundColor: ['#ffeaa7', '#74b9ff', '#55efc4'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
};

const loadAdminOrders = async () => {
    try {
        const res = await fetch(API.orders);
        allOrders = await res.json();
        
        const container = document.getElementById('adminOrdersContainer');
        
        if (allOrders.length === 0) {
            container.innerHTML = '<p class="text-center">No hay pedidos</p>';
            return;
        }

        container.innerHTML = allOrders.reverse().map(order => `
            <div class="cart-item">
                <div>
                    <h6>Pedido #${order.id} - ${order.userName || 'Usuario ' + order.userId}</h6>
                    <small>${order.fecha || 'Sin fecha'}</small><br>
                    <small>${order.items?.length || 0} items - Total: ${order.total}</small>
                </div>
                <div>
                    <select class="form-select form-select-sm" onchange="updateOrderStatus('${order.id}', this.value)" style="width: 150px;">
                        <option value="pendiente" ${order.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="en preparacion" ${order.estado === 'en preparacion' ? 'selected' : ''}>En Preparación</option>
                        <option value="entregado" ${order.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                    </select>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error al cargar pedidos:', err);
        alert('Error al cargar pedidos');
    }
};

const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const res = await fetch(`${API.orders}/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: newStatus })
        });

        if (res.ok) {
            alert('Estado actualizado correctamente');
            loadAdminOrders();
        } else {
            alert('Error al actualizar el estado');
        }
    } catch (err) {
        console.error('Error al actualizar estado:', err);
        alert('Error al actualizar el estado');
    }
};

const loadAdminMenu = async () => {
    try {
        const res = await fetch(API.menu);
        menuItems = await res.json();
        
        const container = document.getElementById('adminMenuContainer');
        
        if (menuItems.length === 0) {
            container.innerHTML = '<p class="text-center">No hay productos en el menú</p>';
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Disponible</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${menuItems.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.nombre}</td>
                                <td><span class="badge bg-secondary">${item.tipo}</span></td>
                                <td>${item.precio}</td>
                                <td>
                                    <span class="badge bg-${item.disponible === true || item.disponible === 'true' ? 'success' : 'danger'}">
                                        ${item.disponible === true || item.disponible === 'true' ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="editProduct('${item.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${item.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        console.error('Error al cargar menú:', err);
        alert('Error al cargar el menú');
    }
};

const showAddProductModal = () => {
    document.getElementById('productModalTitle').textContent = 'Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
};

const editProduct = (productId) => {
    const product = menuItems.find(p => p.id == productId);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.nombre;
    document.getElementById('productType').value = product.tipo;
    document.getElementById('productPrice').value = product.precio;
    document.getElementById('productAvailable').value = product.disponible.toString();

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
};

const saveProduct = async () => {
    const id = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value;
    const tipo = document.getElementById('productType').value;
    const precio = parseFloat(document.getElementById('productPrice').value);
    const disponible = document.getElementById('productAvailable').value === 'true';

    if (!nombre || !tipo || !precio) {
        alert('Completa todos los campos');
        return;
    }

    const productData = { nombre, tipo, precio, disponible };

    try {
        let res;
        if (id) {
            // Update existing product
            res = await fetch(`${API.menu}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            res = await fetch(API.menu, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (res.ok) {
            alert(id ? 'Producto actualizado' : 'Producto creado');
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            loadAdminMenu();
            loadMenu();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (err) {
        console.error('Error al guardar producto:', err);
        alert('Error al guardar el producto');
    }
};

const deleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const res = await fetch(`${API.menu}/${productId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert('Producto eliminado');
            loadAdminMenu();
            loadMenu();
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('Error al eliminar el producto');
    }
};

const loadUsers = async () => {
    try {
        const res = await fetch(API.users);
        const users = await res.json();
        
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === 'ADMIN' ? 'danger' : 'primary'}">${user.role}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="showChangePasswordModal('${user.id}')">
                        <i class="fas fa-key"></i> Cambiar Contraseña
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error al cargar usuarios:', err);
        alert('Error al cargar usuarios');
    }
};

const showChangePasswordModal = (userId) => {
    document.getElementById('changePasswordUserId').value = userId;
    document.getElementById('newPassword').value = '';
    const modal = new bootstrap.Modal(document.getElementById('passwordModal'));
    modal.show();
};

const changePassword = async () => {
    const userId = document.getElementById('changePasswordUserId').value;
    const newPassword = document.getElementById('newPassword').value;

    if (!newPassword || newPassword.length < 4) {
        alert('La contraseña debe tener al menos 4 caracteres');
        return;
    }

    try {
        const res = await fetch(`${API.users}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword })
        });

        if (res.ok) {
            alert('Contraseña actualizada correctamente');
            bootstrap.Modal.getInstance(document.getElementById('passwordModal')).hide();
            loadUsers();
        } else {
            alert('Error al cambiar la contraseña');
        }
    } catch (err) {
        console.error('Error al cambiar contraseña:', err);
        alert('Error al cambiar la contraseña');
    }
};