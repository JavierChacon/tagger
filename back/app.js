const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3002;

const pg = require("pg");
require("dotenv").config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));

// Ruta para obtener la lista de items
app.get("/items", async (req, res) => {
  const result = await pool.query("SELECT * FROM gift");
  if (!result) {
    console.error("Error al leer la BD");
    res.status(500).send("Error interno del servidor");
    return;
  }
  res.json(result.rows);
});

// Ruta para obtener un item en específico
app.get("/item/:id", async (req, res) => {
  const itemId = req.params.id;
  const result = await pool.query(`SELECT * FROM gift WHERE id = ${itemId}`);
  if (!result) {
    console.error("Error al leer la BD");
    res.status(500).send("Error interno del servidor");
    return;
  }

  const item = result.rows[0];
  if (!item) {
    res.status(404).send("Item no encontrado");
    return;
  }
  if (item.status) {
    res.sendFile(path.join(__dirname, "/static/available.html"));
  } else {
    res.sendFile(path.join(__dirname, "/static/not-available.html"));
  }
});

// Ruta para actualizar el estado de un item
app.put("/items/:id", async (req, res) => {
  const itemId = req.params.id;
  const newStatus = req.body.status;

  await pool.query(
    "UPDATE gift SET status = $1 WHERE id = $2",
    [newStatus, itemId],
    (err, result) => {
      if (err) {
        console.error("Error al leer la BD");
        throw err;
      }
      res.status(200).send(`Regalo modificado con ID: ${itemId}`);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
