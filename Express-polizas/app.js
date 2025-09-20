//modulo de gestion de polizas
const express = require('express');
const app = express();
app.use(express.json());

let polizas = {}; // Almacenamiento simple en memoria

// Ruta para crear una nueva póliza
app.post('/poliza', (req, res) => {
    const { id, titular } = req.body;
    if (!id || !titular) {
        return res.status(400).json({ error: 'Faltan datos: id y titular son requeridos.' });
    }
    if (polizas[id]) {
        return res.status(409).json({ error: 'La póliza ya existe.' });
    }
    polizas[id] = { id, titular };
    res.status(201).json({ mensaje: 'Póliza creada', poliza: polizas[id] });
});

// Ruta para obtener información de una póliza específica
app.get('/poliza/:id', (req, res) => {
    const { id } = req.params;
    const poliza = polizas[id];
    if (!poliza) {
        return res.status(404).json({ error: 'Póliza no encontrada.' });
    }
    res.json(poliza);
});

// ...puedes agregar aquí otras rutas o middlewares...

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servicio de pólizas escuchando en puerto 3000');
}); 