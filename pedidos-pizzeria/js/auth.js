const checkAuth = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
        try {
            currentUser = JSON.parse(user);
            updateNavbar();
            loadCartFromStorage(); // Cargar carrito guardado
            showSection('menu');
            loadMenu();
        } catch (err) {
            console.error('Error al cargar usuario:', err);
            localStorage.removeItem('currentUser');
            showSection('login');
        }
    } else {
        showSection('login');
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validación básica
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }

    try {
        showLoading(true);
        const res = await fetch(API.users);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        const users = await res.json();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            loadCartFromStorage(); // Cargar carrito guardado
            updateNavbar();
            showSection('menu');
            loadMenu();
            showNotification('¡Bienvenido ' + user.nombre + '!', 'success');
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        alert('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    // Validaciones
    if (!nombre || !email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (nombre.length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }

    if (password.length < 4) {
        alert('La contraseña debe tener al menos 4 caracteres');
        return;
    }

    try {
        showLoading(true);
        // Check if email already exists
        const res = await fetch(API.users);
        if (!res.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        const users = await res.json();
        const emailExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (emailExists) {
            alert('El email ya está registrado');
            return;
        }

        const response = await fetch(API.users, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                email: email.toLowerCase(),
                password,
                role: 'USUARIO'
            })
        });

        if (response.ok) {
            showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
            document.getElementById('registerForm').reset();
            showSection('login');
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert('Error al registrar usuario: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error('Error al registrar:', err);
        alert('Error al registrar. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
    }
};

// Función auxiliar para validar email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const logout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar carrito antes de eliminar usuario
        if (currentUser && typeof clearCartFromStorage === 'function') {
            clearCartFromStorage();
        }
        currentUser = null;
        cart = [];
        localStorage.removeItem('currentUser');
        showSection('login');
        updateNavbar();
    }
};