import { useEffect, useState } from "react";

export default function ReciboLecheForm() {
  const [form, setForm] = useState({
    empresa: "",
    cuit: "",
    direccion: "",
    lote: "",
    fecha: "",
    tambo: "",
    litros: "",
    temperatura: "",
    ph: "",
    acidez: "",
    observaciones: "",
    responsable: "",
    aprobado: false,
  });

  const [parametros, setParametros] = useState([]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("parametros")) || [];
    setParametros(p);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const temperatura = Number(form.temperatura);
  const ph = Number(form.ph);
  const acidez = Number(form.acidez);

  const rangoTemp = parametros.find((p) => p.nombre === "Temperatura");
  const rangoPH = parametros.find((p) => p.nombre === "pH");
  const rangoAcidez = parametros.find((p) => p.nombre === "Acidez");

  const temperaturaOK =
    rangoTemp &&
    form.temperatura !== "" &&
    temperatura >= rangoTemp.min &&
    temperatura <= rangoTemp.max;

  const phOK =
    rangoPH &&
    form.ph !== "" &&
    ph >= rangoPH.min &&
    ph <= rangoPH.max;

  const acidezOK =
    rangoAcidez &&
    form.acidez !== "" &&
    acidez >= rangoAcidez.min &&
    acidez <= rangoAcidez.max;

  const apto = Boolean(temperaturaOK && phOK && acidezOK);

  const mostrarResultado =
    form.temperatura !== "" &&
    form.ph !== "" &&
    form.acidez !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.empresa || !form.cuit || !form.direccion || !form.lote) {
      alert("Debe completar los datos de la empresa y el número de lote");
      return;
    }

    if (!apto) {
      alert("El recibo NO es apto para descarga");
      return;
    }

    if (!form.responsable || !form.aprobado) {
      alert("Debe indicar el responsable técnico y confirmar la conformidad");
      return;
    }

    const recibos = JSON.parse(localStorage.getItem("recibos")) || [];

    recibos.push({
      ...form,
      estado: "APTO",
      fechaCarga: new Date().toISOString(),
    });

    localStorage.setItem("recibos", JSON.stringify(recibos));
    alert("Recibo guardado correctamente");

    setForm({
      empresa: "",
      cuit: "",
      direccion: "",
      lote: "",
      fecha: "",
      tambo: "",
      litros: "",
      temperatura: "",
      ph: "",
      acidez: "",
      observaciones: "",
      responsable: "",
      aprobado: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-700 text-center border-b pb-3">
          Recibo de Leche – Operario
        </h2>

        {/* PASO 1 */}
        <section className="border border-slate-300 rounded-lg p-4">
          <h3 className="font-semibold text-slate-600 mb-3">
            1. Datos de la empresa
          </h3>

          <input className="w-full border border-slate-300 rounded-md p-2 mb-2 focus:ring-2 focus:ring-slate-400" name="empresa" placeholder="Empresa" value={form.empresa} onChange={handleChange} />
          <input className="w-full border border-slate-300 rounded-md p-2 mb-2" name="cuit" placeholder="CUIT" value={form.cuit} onChange={handleChange} />
          <input className="w-full border border-slate-300 rounded-md p-2 mb-2" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
          <input className="w-full border border-slate-300 rounded-md p-2" name="lote" placeholder="Número de lote" value={form.lote} onChange={handleChange} />
        </section>

        {/* PASO 2 */}
        <section className="border border-slate-300 rounded-lg p-4">
          <h3 className="font-semibold text-slate-600 mb-3">
            2. Datos del recibo
          </h3>

          <input className="w-full border border-slate-300 rounded-md p-2 mb-2" type="date" name="fecha" value={form.fecha} onChange={handleChange} />
          <input className="w-full border border-slate-300 rounded-md p-2 mb-2" name="tambo" placeholder="Tambo" value={form.tambo} onChange={handleChange} />
          <input className="w-full border border-slate-300 rounded-md p-2 mb-2" type="number" name="litros" placeholder="Litros" value={form.litros} onChange={handleChange} />

          <div className="grid grid-cols-3 gap-2">
            <input className="border border-slate-300 rounded-md p-2" type="number" name="temperatura" placeholder="°C" value={form.temperatura} onChange={handleChange} />
            <input className="border border-slate-300 rounded-md p-2" type="number" step="0.01" name="ph" placeholder="pH" value={form.ph} onChange={handleChange} />
            <input className="border border-slate-300 rounded-md p-2" type="number" name="acidez" placeholder="°D" value={form.acidez} onChange={handleChange} />
          </div>

          <textarea className="w-full border border-slate-300 rounded-md p-2 mt-2" name="observaciones" placeholder="Observaciones" value={form.observaciones} onChange={handleChange} />
        </section>

        {/* PASO 3 */}
        <section className="border border-slate-300 rounded-lg p-4">
          <h3 className="font-semibold text-slate-600 mb-3">
            3. Validación técnica
          </h3>

          <input className="w-full border border-slate-300 rounded-md p-2 mb-2" name="responsable" placeholder="Responsable técnico" value={form.responsable} onChange={handleChange} />

          <label className="flex items-center gap-2 text-slate-600 mb-3">
            <input
              type="checkbox"
              checked={form.aprobado}
              onChange={(e) => setForm({ ...form, aprobado: e.target.checked })}
            />
            Conforme (firma del responsable técnico)
          </label>

          {mostrarResultado && (
            <div
              className={`text-center font-semibold rounded-md p-2 ${
                apto
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {apto ? "APTO PARA DESCARGA" : "NO APTO PARA DESCARGA"}
            </div>
          )}
        </section>

        <button
          type="submit"
          className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition"
        >
          Guardar Recibo
        </button>
      </form>
    </div>
  );
}
