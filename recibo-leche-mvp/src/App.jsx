import { useEffect, useState } from "react";
import Login from "./Login";
import ReciboLecheForm from "./ReciboLecheForm";
import AdminPanel from "./AdminPanel";

function App() {
  const [usuario, setUsuario] = useState(null);

  // 🔐 Crear admin inicial si no existe
  useEffect(() => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.length === 0) {
      const adminInicial = {
        username: "admin",
        password: "admin123",
        rol: "admin",
        nombre: "Administrador",
        apellido: "Sistema",
        dni: "00000000",
        email: "admin@sistema.com",
        telefono: "000000000",
        direccion: "Planta",
      };

      localStorage.setItem("usuarios", JSON.stringify([adminInicial]));
      console.log("Admin inicial creado");
    }
  }, []);

  // 🔁 Mantener sesión al refrescar
  useEffect(() => {
    const u = localStorage.getItem("usuarioLogueado");
    if (u) {
      setUsuario(JSON.parse(u));
    }
  }, []);

  // 🔐 Si no hay usuario → Login
  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <p className="font-bold">
            Usuario: {usuario.nombre} {usuario.apellido}
          </p>
          <p className="text-sm text-gray-600">
            Rol: {usuario.rol.toUpperCase()}
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("usuarioLogueado");
            setUsuario(null);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* CONTENIDO SEGÚN ROL */}
      {usuario.rol === "admin" ? (
        <AdminPanel />
      ) : (
        <ReciboLecheForm />
      )}
    </div>
  );
}

export default App;
