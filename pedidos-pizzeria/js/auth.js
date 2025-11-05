// Manejo del formulario de Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Obtener todos los usuarios
            const users = await fetchAPI(ENDPOINTS.users);
            
            // Buscar usuario con credenciales correctas
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                Storage.setUser(user);
                
                // Redirigir según el rol
                if (user.role === 'ADMIN') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'catalogo.html';
                }
            } else {
                alert('Email o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error al intentar iniciar sesión. Por favor, intenta de nuevo.');
        }
    });
}

// Manejo del formulario de Registro
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Verificar si el email ya existe
            const users = await fetchAPI(ENDPOINTS.users);
            const emailExists = users.some(u => u.email === email);
            
            if (emailExists) {
                alert('Este email ya está registrado');
                return;
            }
            
            // Crear nuevo usuario
            const newUser = await fetchAPI(ENDPOINTS.users, {
                method: 'POST',
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    role: 'USUARIO'
                })
            });
            
            alert('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Error en registro:', error);
            alert('Error al registrar usuario. Por favor, intenta de nuevo.');
        }
    });
}

// Función de logout (se usa en todas las páginas)
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Storage.removeUser();
            Storage.clearCart();
            window.location.href = 'index.html';
        });
    }
}

// Función para mostrar el nombre del usuario en el navbar
function displayUserName() {
    const user = Storage.getUser();
    const userNameElement = document.getElementById('userName');
    
    if (user && userNameElement) {
        userNameElement.textContent = `Hola, ${user.nombre}`;
    }
}