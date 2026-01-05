import { useEffect, useState } from "react";
import CrearUsuario from "./CrearUsuario";
import jsPDF from "jspdf";

export default function AdminPanel() {
  const [recibos, setRecibos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [buscarLote, setBuscarLote] = useState("");

  // ================= CARGAR DATOS =================
  const cargarDatos = () => {
    setRecibos(JSON.parse(localStorage.getItem("recibos")) || []);
    setUsuarios(JSON.parse(localStorage.getItem("usuarios")) || []);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ================= GUARDAR EDICIÓN USUARIO =================
  const guardarEdicionUsuario = () => {
    const lista = JSON.parse(localStorage.getItem("usuarios")) || [];

    const nuevaLista = lista.map((u) =>
      u.username === usuarioEditando.username ? usuarioEditando : u
    );

    localStorage.setItem("usuarios", JSON.stringify(nuevaLista));
    setUsuarioEditando(null);
    cargarDatos();
  };

  // ================= PDF COMPLETO =================
  const generarPDF = (r) => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(r.empresa || "-", 20, 20);

    doc.setFontSize(10);
    doc.text(`CUIT: ${r.cuit || "-"}`, 20, 26);
    doc.text(`Dirección: ${r.direccion || "-"}`, 20, 32);

    doc.line(20, 36, 190, 36);

    doc.setFontSize(13);
    doc.text("RECIBO DE LECHE CRUDA", 20, 48);
    doc.setFontSize(10);

    let y = 58;

    doc.text(`Fecha: ${r.fecha || "-"}`, 20, y);
    doc.text(`Lote: ${r.lote || "-"}`, 120, y);
    y += 8;

    doc.text(`Tambo: ${r.tambo || "-"}`, 20, y);
    doc.text(`Litros: ${r.litros || "-"}`, 120, y);
    y += 8;

    doc.text(`Temperatura (°C): ${r.temperatura || "-"}`, 20, y);
    doc.text(`pH: ${r.ph || "-"}`, 120, y);
    y += 8;

    doc.text(`Acidez (°D): ${r.acidez || "-"}`, 20, y);
    y += 8;

    doc.text(`Estado: ${r.estado || "APTO"}`, 20, y);
    y += 10;

    doc.text("Observaciones:", 20, y);
    y += 6;
    doc.text(r.observaciones || "-", 20, y);
    y += 10;

    doc.line(20, y, 190, y);
    y += 10;

    doc.text(`Responsable técnico: ${r.responsable || "-"}`, 20, y);
    y += 8;

    doc.text(
      `Fecha y hora: ${
        r.fechaCarga ? new Date(r.fechaCarga).toLocaleString() : "-"
      }`,
      20,
      y
    );

    doc.save(`Recibo_${r.lote || "sin_lote"}.pdf`);
  };

  // ================= FILTRO POR LOTE =================
  const recibosFiltrados = recibos.filter((r) =>
    (r.lote || "")
      .toString()
      .toLowerCase()
      .includes(buscarLote.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-slate-600">
          <h2 className="text-2xl font-bold text-slate-700">
            Panel Administrador
          </h2>
        </div>

        {/* ===== CREAR USUARIO ===== */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <CrearUsuario onUsuarioCreado={cargarDatos} />
        </div>

        {/* ===== USUARIOS ===== */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">
            Usuarios del sistema
          </h3>

          <table className="w-full border border-slate-300 text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2 border">Usuario</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Rol</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={i} className="text-center hover:bg-slate-50">
                  <td className="p-2 border">{u.username}</td>
                  <td className="p-2 border">
                    {u.nombre} {u.apellido}
                  </td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border font-semibold">{u.rol}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-md"
                      onClick={() => setUsuarioEditando(u)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== EDITAR USUARIO ===== */}
        {usuarioEditando && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Editar usuario
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                className="border p-2 rounded-md"
                value={usuarioEditando.nombre}
                onChange={(e) =>
                  setUsuarioEditando({
                    ...usuarioEditando,
                    nombre: e.target.value,
                  })
                }
                placeholder="Nombre"
              />

              <input
                className="border p-2 rounded-md"
                value={usuarioEditando.apellido}
                onChange={(e) =>
                  setUsuarioEditando({
                    ...usuarioEditando,
                    apellido: e.target.value,
                  })
                }
                placeholder="Apellido"
              />

              <input
                className="border p-2 rounded-md"
                value={usuarioEditando.email}
                onChange={(e) =>
                  setUsuarioEditando({
                    ...usuarioEditando,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
              />

              <select
                className="border p-2 rounded-md"
                value={usuarioEditando.rol}
                onChange={(e) =>
                  setUsuarioEditando({
                    ...usuarioEditando,
                    rol: e.target.value,
                  })
                }
              >
                <option value="operador">Operador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={guardarEdicionUsuario}
              >
                Guardar
              </button>

              <button
                className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-md"
                onClick={() => setUsuarioEditando(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ===== RECIBOS ===== */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">
            Historial de recibos
          </h3>

          <input
            className="border p-2 rounded-md w-full mb-4"
            placeholder="Buscar por número de lote"
            value={buscarLote}
            onChange={(e) => setBuscarLote(e.target.value)}
          />

          <table className="w-full border border-slate-300 text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2 border">Empresa</th>
                <th className="p-2 border">Lote</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Tambo</th>
                <th className="p-2 border">Litros</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">PDF</th>
              </tr>
            </thead>
            <tbody>
              {recibosFiltrados.map((r, i) => (
                <tr key={i} className="text-center hover:bg-slate-50">
                  <td className="p-2 border">{r.empresa}</td>
                  <td className="p-2 border">{r.lote}</td>
                  <td className="p-2 border">{r.fecha}</td>
                  <td className="p-2 border">{r.tambo}</td>
                  <td className="p-2 border">{r.litros}</td>
                  <td className="p-2 border font-semibold text-green-700">
                    {r.estado}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                      onClick={() => generarPDF(r)}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
