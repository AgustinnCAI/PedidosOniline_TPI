import { useState } from "react";

export default function CrearUsuario() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    rol: "operador",
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push(form);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario creado correctamente");

    setForm({
      username: "",
      password: "",
      rol: "operador",
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      telefono: "",
      direccion: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <h3 className="font-bold mb-3">Crear usuario</h3>

      <input name="nombre" placeholder="Nombre" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="apellido" placeholder="Apellido" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="dni" placeholder="DNI" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} className="w-full border p-2 mb-2" />

      <input name="username" placeholder="Usuario" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="password" placeholder="Contraseña" onChange={handleChange} className="w-full border p-2 mb-2" />

      <select name="rol" onChange={handleChange} className="w-full border p-2 mb-3">
        <option value="operador">Operador</option>
        <option value="admin">Administrador</option>
      </select>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Crear usuario
      </button>
    </form>
  );
}
