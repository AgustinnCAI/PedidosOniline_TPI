const loadMenu = async () => {
    try {
        showLoading(true);
        const res = await fetch(API.menu);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        menuItems = await res.json();
        renderMenu();
    } catch (err) {
        console.error('Error al cargar el menú:', err);
        const container = document.getElementById('menuContainer');
        if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-white text-center">Error al cargar el menú. Por favor, recarga la página.</p></div>';
        }
    } finally {
        showLoading(false);
    }
};

const renderMenu = () => {
    const container = document.getElementById('menuContainer');
    const available = menuItems.filter(item => item.disponible === true || item.disponible === 'true');
    
    if (available.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-white text-center">No hay productos disponibles</p></div>';
        return;
    }

    container.innerHTML = available.map(item => `
        <div class="col-md-4">
            <div class="card product-card">
                <div class="product-img">
                    <i class="fas fa-${getIconByType(item.tipo)}"></i>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="card-text">
                        <span class="badge bg-secondary">${item.tipo}</span>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <h4 class="text-primary mb-0">$${item.precio}</h4>
                        <button class="btn btn-primary" onclick="addToCart('${item.id}')">
                            <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const getIconByType = (type) => {
    const icons = {
        pizza: 'pizza-slice',
        bebida: 'glass-whiskey',
        postre: 'ice-cream'
    };
    return icons[type] || 'utensils';
};