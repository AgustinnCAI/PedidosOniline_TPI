// Verificar autenticación al cargar la página
const currentUser = checkAuth();

if (currentUser) {
    displayUserName();
    setupLogout();
    loadMenu();
}

// Cargar el menú desde la API
async function loadMenu() {
    try {
        const menuItems = await fetchAPI(ENDPOINTS.menu);
        displayMenu(menuItems.filter(item => item.disponible));
    } catch (error) {
        console.error('Error cargando el menú:', error);
        alert('Error al cargar el menú');
    }
}

// Mostrar los items del menú
function displayMenu(items) {
    const menuGrid = document.getElementById('menuGrid');
    
    if (items.length === 0) {
        menuGrid.innerHTML = '<p class="empty-message">No hay productos disponibles en este momento</p>';
        return;
    }
    
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-card">
            <div class="menu-card-image">
                ${item.tipo === 'pizza' ? '🍕' : '🥤'}
            </div>
            <div class="menu-card-content">
                <h3>${item.nombre}</h3>
                <p class="menu-card-type">${item.tipo}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">${formatPrice(item.precio)}</span>
                    <button class="btn btn-primary" onclick="addToCart('${item.id}')">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Agregar item al carrito
async function addToCart(itemId) {
    try {
        const menuItems = await fetchAPI(ENDPOINTS.menu);
        const item = menuItems.find(i => i.id === itemId);
        
        if (!item) {
            alert('Producto no encontrado');
            return;
        }
        
        let cart = Storage.getCart();
        const existingItem = cart.find(i => i.id === itemId);
        
        if (existingItem) {
            existingItem.cantidad++;
        } else {
            cart.push({
                ...item,
                cantidad: 1
            });
        }
        
        Storage.setCart(cart);
        updateCartCount();
        
        // Mostrar notificación
        alert(`${item.nombre} agregado al carrito`);
        
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        alert('Error al agregar el producto');
    }
}

// Actualizar contador del carrito
function updateCartCount() {
    const cart = Storage.getCart();
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Inicializar contador del carrito al cargar
updateCartCount();