// Verificar autenticación
const currentUser = checkAuth();

if (currentUser) {
    setupCartModal();
}

// Configurar el modal del carrito
function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.querySelector('.close-modal');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    
    // Abrir modal
    cartBtn.addEventListener('click', () => {
        displayCart();
        cartModal.classList.add('active');
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Cerrar al hacer click fuera del modal
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Enviar pedido
    submitOrderBtn.addEventListener('click', submitOrder);
}

// Mostrar contenido del carrito
function displayCart() {
    const cart = Storage.getCart();
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-message">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.nombre}</h4>
                <p class="cart-item-price">${formatPrice(item.precio)} c/u</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="cart-item-quantity">${item.cantidad}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="btn-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
                <div class="cart-item-total">${formatPrice(item.precio * item.cantidad)}</div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotal.textContent = formatPrice(total);
}

// Actualizar cantidad de un item
function updateQuantity(itemId, change) {
    let cart = Storage.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        item.cantidad += change;
        
        if (item.cantidad <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
        
        Storage.setCart(cart);
        displayCart();
        updateCartCount();
    }
}

// Eliminar item del carrito
function removeFromCart(itemId) {
    let cart = Storage.getCart();
    cart = cart.filter(i => i.id !== itemId);
    
    Storage.setCart(cart);
    displayCart();
    updateCartCount();
}

// Enviar pedido
async function submitOrder() {
    const cart = Storage.getCart();
    
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const order = {
        userId: currentUser.id,
        items: cart.map(item => ({
            menuId: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
        })),
        total: total,
        estado: 'pendiente',
        fecha: new Date().toISOString()
    };
    
    try {
        await fetchAPI(ENDPOINTS.orders, {
            method: 'POST',
            body: JSON.stringify(order)
        });
        
        Storage.clearCart();
        updateCartCount();
        
        document.getElementById('cartModal').classList.remove('active');
        
        alert('¡Pedido realizado con éxito! Puedes ver el estado en "Mis Pedidos"');
        
    } catch (error) {
        console.error('Error enviando pedido:', error);
        alert('Error al realizar el pedido. Por favor, intenta de nuevo.');
    }
}