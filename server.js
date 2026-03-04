const express = require('express');
const { Pool } = require('pg'); // Conector para PostgreSQL
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json()); // Para entender datos en formato JSON
app.use(cors()); // Permite que tu Frontend se comunique con el Backend

// Configuración de conexión a la Base de Datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- RUTA 1: CREAR UNA NUEVA RESERVA ---
app.post('/api/reservas', async (req, res) => {
  const { nombre, whatsapp, tipo, fecha, nro_vuelo, direccion, monto } = req.body;

  try {
    const nuevaReserva = await pool.query(
      `INSERT INTO reservas (cliente_nombre, cliente_whatsapp, tipo, fecha_servicio, nro_vuelo, direccion_destino, monto_total) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, whatsapp, tipo, fecha, nro_vuelo, direccion, monto]
    );
    
    res.status(201).json({
      success: true,
      message: "Reserva creada con éxito para Black Airport",
      data: nuevaReserva.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error en el servidor al procesar la reserva" });
  }
});

// --- RUTA 2: OBTENER TODAS LAS RESERVAS (Para el Panel Admin) ---
app.get('/api/reservas', async (req, res) => {
  try {
    const todasLasReservas = await pool.query("SELECT * FROM reservas ORDER BY fecha_servicio DESC");
    res.json(todasLasReservas.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor de Black Airport corriendo en puerto ${PORT}`);
});
