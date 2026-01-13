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
    
    // Mostrar notificación más sutil
    showNotification('Producto agregado al carrito', 'success');
};

const updateCartCount = () => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
};

// Persistencia del carrito en localStorage
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

const clearCartFromStorage = () => {
    if (currentUser) {
        localStorage.removeItem(`cart_${currentUser.id}`);
    }
};

const renderCart = () => {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center">El carrito está vacío</p>';
        document.getElementById('cartTotal').textContent = '0';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h6 class="mb-0">${item.nombre}</h6>
                <small>$${item.precio} x ${item.quantity}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('cartTotal').textContent = total.toFixed(2);
};

const updateQuantity = (productId, change) => {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            renderCart();
            updateCartCount();
        }
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
    updateCartCount();
};

const placeOrder = async () => {
    if (!currentUser) {
        alert('Debes iniciar sesión');
        return;
    }

    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Validar que todos los productos sigan disponibles
    const unavailableItems = cart.filter(item => {
        const menuItem = menuItems.find(m => m.id == item.id);
        return !menuItem || menuItem.disponible === false || menuItem.disponible === 'false';
    });

    if (unavailableItems.length > 0) {
        alert('Algunos productos en tu carrito ya no están disponibles. Por favor, actualiza tu carrito.');
        loadMenu();
        return;
    }

    if (!confirm('¿Confirmar pedido?')) {
        return;
    }

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.precio) * item.quantity), 0);
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

    try {
        showLoading(true);
        const res = await fetch(API.orders, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (res.ok) {
            showNotification('¡Pedido realizado con éxito!', 'success');
            cart = [];
            clearCartFromStorage();
            updateCartCount();
            showSection('orders');
            loadUserOrders();
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert('Error al realizar el pedido: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error('Error al realizar el pedido:', err);
        alert('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
};