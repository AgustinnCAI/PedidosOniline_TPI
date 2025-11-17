const checkAuth = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateNavbar();
        showSection('menu');
        loadMenu();
    } else {
        showSection('login');
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(API.users);
        const users = await res.json();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateNavbar();
            showSection('menu');
            loadMenu();
            alert('¡Bienvenido ' + user.nombre + '!');
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        alert('Error al iniciar sesión');
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        // Check if email already exists
        const res = await fetch(API.users);
        const users = await res.json();
        const emailExists = users.find(u => u.email === email);

        if (emailExists) {
            alert('El email ya está registrado');
            return;
        }

        const response = await fetch(API.users, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                email,
                password,
                role: 'USUARIO'
            })
        });

        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            document.getElementById('registerForm').reset();
            showSection('login');
        } else {
            alert('Error al registrar usuario');
        }
    } catch (err) {
        console.error('Error al registrar:', err);
        alert('Error al registrar');
    }
};

const logout = () => {
    currentUser = null;
    cart = [];
    localStorage.removeItem('currentUser');
    showSection('login');
    updateNavbar();
};