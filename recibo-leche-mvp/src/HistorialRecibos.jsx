import { useEffect, useState } from "react";

export default function HistorialRecibos() {
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("recibos")) || [];
    setRecibos(datos);
  }, []);

  if (recibos.length === 0) {
    return <p className="text-center mt-4">No hay recibos guardados</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-3">Historial de Recibos</h3>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Tambo</th>
            <th className="border p-2">Temp</th>
            <th className="border p-2">pH</th>
            <th className="border p-2">Acidez</th>
          </tr>
        </thead>
        <tbody>
          {recibos.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{r.fecha}</td>
              <td className="border p-2">{r.tambo}</td>
              <td className="border p-2">{r.temperatura}</td>
              <td className="border p-2">{r.ph}</td>
              <td className="border p-2">{r.acidez}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
