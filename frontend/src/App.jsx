import { useState } from "react";
import "./App.css";
import React from "react";


const BASE_POLIZAS   = import.meta.env.VITE_POLIZAS_URL   || "http://localhost:4000";
const BASE_ASISTENCIA = import.meta.env.VITE_ASISTENCIA_URL || "http://localhost:5000";

export default function App() {
  const [id, setId] = useState("");
  const [titular, setTitular] = useState("");
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const appendLog = (label, payload) => {
    const line = {
      time: new Date().toLocaleTimeString(),
      action: label,
      ...payload
    };
    setLog((l) => [JSON.stringify(line, null, 2), ...l]);
  };

  const readJsonSafe = async (r) => {
    const ct = r.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try { return await r.json(); } catch { return null; }
    }
    const text = await r.text();
    return { raw: text };
  };

  const crearPoliza = async () => {
    if (!id.trim() || !titular.trim()) {
      appendLog("crearPoliza", { error: "Debe ingresar id y titular" });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${BASE_POLIZAS}/poliza`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim(), titular: titular.trim() })
      });
      const body = await readJsonSafe(r);
      appendLog("crearPoliza", { status: r.status, statusText: r.statusText, body });
    } catch (err) {
      appendLog("crearPoliza", { error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const pedirAsistencia = async () => {
    if (!id.trim()) {
      appendLog("pedirAsistencia", { error: "Debe ingresar id de póliza" });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${BASE_ASISTENCIA}/asistencia/${encodeURIComponent(id.trim())}`);
      const body = await readJsonSafe(r);
      appendLog("pedirAsistencia", { status: r.status, statusText: r.statusText, body });
    } catch (err) {
      appendLog("pedirAsistencia", { error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const listarAsistencias = async () => {
    if (!id.trim()) {
      appendLog("listarAsistencias", { error: "Debe ingresar id de póliza" });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${BASE_ASISTENCIA}/asistencias/${encodeURIComponent(id.trim())}`);
      const body = await readJsonSafe(r);
      appendLog("listarAsistencias", { status: r.status, statusText: r.statusText, body });
    } catch (err) {
      appendLog("listarAsistencias", { error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const limpiarLog = () => setLog([]);

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>Aseguradora — Demo</h1>
        <p style={{ opacity: .9, marginTop: 8 }}>
          <span className="badge">Paleta Verde</span> #142C14 · #2D5128 · #537B2F · #8DA750 · #E4EB9C
        </p>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Operaciones</h2>
        <div className="stack">
          <input placeholder="ID de póliza" value={id} onChange={e => setId(e.target.value)} />
          <input placeholder="Titular (solo para crear)" value={titular} onChange={e => setTitular(e.target.value)} />
          <div className="row">
            <button onClick={crearPoliza} disabled={loading}>Crear póliza</button>
            <button className="button--ghost" onClick={pedirAsistencia} disabled={loading}>Pedir asistencia</button>
            <button className="button--ghost" onClick={listarAsistencias} disabled={loading}>Ver asistencias</button>
            <button onClick={limpiarLog}>Limpiar</button>
          </div>
        </div>
        {loading && <p style={{ marginTop: 8 }}>Procesando...</p>}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Respuestas</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{log.join("\n\n")}</pre>
      </div>
    </div>
  );
}
