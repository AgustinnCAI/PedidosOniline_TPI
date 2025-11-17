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

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    alert('Producto agregado al carrito');
};

const updateCartCount = () => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
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
            renderCart();
            updateCartCount();
        }
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
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

    const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const order = {
        userId: currentUser.id,
        userName: currentUser.nombre,
        items: cart,
        total: total.toFixed(2),
        estado: 'pendiente',
        fecha: new Date().toLocaleString('es-AR')
    };

    try {
        const res = await fetch(API.orders, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (res.ok) {
            alert('¡Pedido realizado con éxito!');
            cart = [];
            updateCartCount();
            showSection('orders');
        } else {
            alert('Error al realizar el pedido');
        }
    } catch (err) {
        console.error('Error al realizar el pedido:', err);
        alert('Error al realizar el pedido');
    }
};