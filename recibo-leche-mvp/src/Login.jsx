import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (!usuario) {
      alert("Usuario o contraseña incorrectos");
      return;
    }

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
    onLogin(usuario);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Ingreso al sistema</h2>

      <input
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <button className="w-full bg-blue-600 text-white p-2 rounded">
        Ingresar
      </button>
    </form>
  );
}
