import { useState } from "react";
import "./App.css";

const BASE_POLIZAS = import.meta.env.VITE_POLIZAS_URL || "http://localhost:4000";
const BASE_ASISTENCIA = import.meta.env.VITE_ASISTENCIA_URL || "http://localhost:5000";

export default function App() {
  const [id, setId] = useState("");
  const [titular, setTitular] = useState("");
  const [log, setLog] = useState([]);

  const appendLog = (line) => setLog((l) => [JSON.stringify(line, null, 2), ...l]);

  const crearPoliza = async () => {
    const r = await fetch(`${BASE_POLIZAS}/poliza`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, titular }),
    });
    appendLog(await r.json());
  };

  const pedirAsistencia = async () => {
    const r = await fetch(`${BASE_ASISTENCIA}/asistencia/${id}`);
    appendLog(await r.json());
  };

  return (
    <div className="container">
      <div className="header">
        <h1 style={{margin:0}}>Aseguradora — Demo</h1>
        <p style={{opacity:.9, marginTop:8}}>
          <span className="badge">Paleta Verde</span> basada en #142C14 · #2D5128 · #537B2F · #8DA750 · #E4EB9C
        </p>
      </div>

      <div className="card" style={{marginTop:20}}>
        <h2 style={{marginTop:0}}>Operaciones</h2>
        <div className="stack">
          <input placeholder="ID de póliza" value={id} onChange={e => setId(e.target.value)} />
          <input placeholder="Titular (solo para crear)" value={titular} onChange={e => setTitular(e.target.value)} />
          <div className="row">
            <button onClick={crearPoliza}>Crear póliza</button>
            <button className="button--ghost" onClick={pedirAsistencia}>Pedir asistencia</button>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:20}}>
        <h3 style={{marginTop:0}}>Respuestas</h3>
        <pre style={{whiteSpace:"pre-wrap"}}>{log.join("\n\n")}</pre>
      </div>
    </div>
  );
}