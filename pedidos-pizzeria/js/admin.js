const loadDashboard = async () => {
    try {
        showLoading(true);
        const res = await fetch(API.orders);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        allOrders = await res.json();
        
        // Esperar a que Chart.js esté cargado
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkAndRender = () => {
            attempts++;
            if (typeof Chart !== 'undefined') {
                // Esperar a que la sección sea visible
                setTimeout(() => {
                    renderChart();
                }, 300);
            } else if (attempts < maxAttempts) {
                setTimeout(checkAndRender, 100);
            } else {
                console.error('Chart.js no se pudo cargar después de varios intentos');
                const dashboardCard = document.querySelector('#dashboardSection .dashboard-card');
                if (dashboardCard) {
                    dashboardCard.innerHTML = '<p class="text-danger">Error: Chart.js no está disponible. Por favor, recarga la página.</p>';
                }
            }
        };
        
        checkAndRender();
    } catch (err) {
        console.error('Error al cargar dashboard:', err);
        const dashboardCard = document.querySelector('#dashboardSection .dashboard-card');
        if (dashboardCard) {
            dashboardCard.innerHTML = '<p class="text-danger">Error al cargar el dashboard. Por favor, intenta nuevamente.</p>';
        }
    } finally {
        showLoading(false);
    }
};

const renderChart = () => {
    console.log('=== Iniciando renderizado del gráfico ===');
    
    const ctx = document.getElementById('ordersChart');
    
    if (!ctx) {
        console.error('❌ Canvas element not found');
        return;
    }
    console.log('✅ Canvas encontrado');
    
    // Verificar que Chart esté disponible
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js no está cargado');
        return;
    }
    console.log('✅ Chart.js está disponible');
    
    // Verificar que el canvas sea visible
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection && dashboardSection.classList.contains('hidden')) {
        console.warn('⚠️ Dashboard section está oculta, reintentando...');
        setTimeout(renderChart, 200);
        return;
    }
    console.log('✅ Dashboard section es visible');
    
    // Calcular datos
    const pending = allOrders ? allOrders.filter(o => o.estado === 'pendiente').length : 0;
    const inProgress = allOrders ? allOrders.filter(o => o.estado === 'en preparacion').length : 0;
    const delivered = allOrders ? allOrders.filter(o => o.estado === 'entregado').length : 0;
    
    console.log('📊 Datos del gráfico:', { pending, inProgress, delivered });
    console.log('📦 Total de pedidos:', allOrders ? allOrders.length : 0);

    // Destruir instancia anterior si existe
    if (chartInstance) {
        console.log('🗑️ Destruyendo instancia anterior del gráfico');
        chartInstance.destroy();
        chartInstance = null;
    }

    // Crear nuevo gráfico
    try {
        console.log('🎨 Creando nuevo gráfico...');
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
                animation: {
                    duration: 1000
                },
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    }
                }
            }
        });
        console.log('✅ Gráfico renderizado exitosamente');
    } catch (error) {
        console.error('❌ Error al crear el gráfico:', error);
        console.error('Stack trace:', error.stack);
    }
};

const loadAdminOrders = async () => {
    try {
        showLoading(true);
        const res = await fetch(API.orders);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        allOrders = await res.json();
        
        const container = document.getElementById('adminOrdersContainer');
        
        if (allOrders.length === 0) {
            container.innerHTML = '<p class="text-center">No hay pedidos</p>';
            return;
        }

        container.innerHTML = allOrders.reverse().map(order => {
            const itemsCount = order.items ? order.items.length : 0;
            const itemsList = order.items ? order.items.map(item => 
                `${item.nombre} (x${item.quantity || 1})`
            ).join(', ') : 'Sin items';
            
            return `
                <div class="cart-item">
                    <div style="flex: 1;">
                        <h6>Pedido #${order.id} - ${order.userName || 'Usuario ' + order.userId}</h6>
                        <small>${order.fecha || 'Sin fecha'}</small><br>
                        <small>${itemsList}</small><br>
                        <strong>Total: $${order.total || '0.00'}</strong>
                    </div>
                    <div>
                        <select class="form-select form-select-sm" onchange="updateOrderStatus('${order.id}', this.value)" style="width: 150px;">
                            <option value="pendiente" ${(order.estado || 'pendiente') === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="en preparacion" ${(order.estado || 'pendiente') === 'en preparacion' ? 'selected' : ''}>En Preparación</option>
                            <option value="entregado" ${(order.estado || 'pendiente') === 'entregado' ? 'selected' : ''}>Entregado</option>
                        </select>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error al cargar pedidos:', err);
        const container = document.getElementById('adminOrdersContainer');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error al cargar pedidos. Por favor, intenta nuevamente.</p>';
        }
    } finally {
        showLoading(false);
    }
};

const updateOrderStatus = async (orderId, newStatus) => {
    try {
        // Primero obtener el pedido completo
        const getRes = await fetch(`${API.orders}/${orderId}`);
        if (!getRes.ok) {
            alert('Error al obtener el pedido');
            return;
        }
        const order = await getRes.json();
        
        // Actualizar el estado manteniendo todos los demás datos
        const updatedOrder = { ...order, estado: newStatus };
        
        const res = await fetch(`${API.orders}/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOrder)
        });

        if (res.ok) {
            // Actualizar también en allOrders para mantener consistencia
            const index = allOrders.findIndex(o => o.id == orderId);
            if (index !== -1) {
                allOrders[index] = updatedOrder;
            }
            alert('Estado actualizado correctamente');
            loadAdminOrders();
            // Si el dashboard está visible, actualizar el gráfico
            if (!document.getElementById('dashboardSection').classList.contains('hidden')) {
                renderChart();
            }
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
        showLoading(true);
        const res = await fetch(API.menu);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
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
                                <td><span class="badge bg-secondary">${item.tipo || 'N/A'}</span></td>
                                <td>$${parseFloat(item.precio || 0).toFixed(2)}</td>
                                <td>
                                    <span class="badge bg-${item.disponible === true || item.disponible === 'true' ? 'success' : 'danger'}">
                                        ${item.disponible === true || item.disponible === 'true' ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary me-1" onclick="editProduct('${item.id}')" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${item.id}')" title="Eliminar">
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
        const container = document.getElementById('adminMenuContainer');
        if (container) {
            container.innerHTML = '<p class="text-center text-danger">Error al cargar el menú. Por favor, intenta nuevamente.</p>';
        }
    } finally {
        showLoading(false);
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
    const nombre = document.getElementById('productName').value.trim();
    const tipo = document.getElementById('productType').value;
    const precio = parseFloat(document.getElementById('productPrice').value);
    const disponible = document.getElementById('productAvailable').value === 'true';

    // Validaciones
    if (!nombre || nombre.length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return;
    }

    if (!tipo) {
        alert('Selecciona un tipo de producto');
        return;
    }

    if (!precio || precio <= 0 || isNaN(precio)) {
        alert('Ingresa un precio válido mayor a 0');
        return;
    }

    const productData = { nombre, tipo, precio, disponible };

    try {
        showLoading(true);
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
            showNotification(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            loadAdminMenu();
            loadMenu();
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert('Error al guardar el producto: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error('Error al guardar producto:', err);
        alert('Error al guardar el producto. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
};

const deleteProduct = async (productId) => {
    const product = menuItems.find(p => p.id == productId);
    const productName = product ? product.nombre : 'este producto';
    
    if (!confirm(`¿Estás seguro de eliminar "${productName}"? Esta acción no se puede deshacer.`)) return;

    try {
        showLoading(true);
        const res = await fetch(`${API.menu}/${productId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            showNotification('Producto eliminado correctamente', 'success');
            loadAdminMenu();
            loadMenu();
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('Error al eliminar el producto. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
};

const loadUsers = async () => {
    try {
        showLoading(true);
        const res = await fetch(API.users);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        const users = await res.json();
        
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.nombre || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="badge bg-${user.role === 'ADMIN' ? 'danger' : 'primary'}">${user.role || 'USUARIO'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="showChangePasswordModal('${user.id}')" title="Cambiar contraseña">
                        <i class="fas fa-key"></i> Cambiar Contraseña
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error al cargar usuarios:', err);
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar usuarios. Por favor, intenta nuevamente.</td></tr>';
        }
    } finally {
        showLoading(false);
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
        showLoading(true);
        // Obtener usuario completo primero
        const getRes = await fetch(`${API.users}/${userId}`);
        if (!getRes.ok) {
            alert('Error al obtener el usuario');
            return;
        }
        const user = await getRes.json();
        
        // Actualizar solo la contraseña manteniendo los demás datos
        const updatedUser = { ...user, password: newPassword };
        
        const res = await fetch(`${API.users}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });

        if (res.ok) {
            showNotification('Contraseña actualizada correctamente', 'success');
            bootstrap.Modal.getInstance(document.getElementById('passwordModal')).hide();
            document.getElementById('newPassword').value = '';
            loadUsers();
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert('Error al cambiar la contraseña: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error('Error al cambiar contraseña:', err);
        alert('Error al cambiar la contraseña. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
};