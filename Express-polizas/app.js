import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// "BD" en memoria
// Estructura: { [idPoliza]: { id, titular } }
const polizas = {};

// POST /poliza  -> crea póliza { id, titular }
app.post("/poliza", (req, res) => {
  const { id, titular } = req.body || {};
  if (!id || !titular) {
    return res.status(400).json({ error: "id y titular son requeridos" });
  }
  if (polizas[id]) {
    return res.status(409).json({ error: "La póliza ya existe" });
  }
  polizas[id] = { id, titular };
  res.status(201).json(polizas[id]);
});

// GET /polizas/:id  -> devuelve póliza específica
app.get("/polizas/:id", (req, res) => {
  const { id } = req.params;
  const poliza = polizas[id];
  if (!poliza) return res.status(404).json({ error: "Póliza no encontrada" });
  res.json(poliza);
});

app.listen(PORT, () => {
  console.log(`Servicio de pólizas escuchando en http://localhost:${PORT}`);
});