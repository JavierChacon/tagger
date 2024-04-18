const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));

// Ruta para obtener la lista de items
app.get("/items", (req, res) => {
  fs.readFile("items.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo items.json:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    const items = JSON.parse(data);
    res.json(items);
  });
});

// Ruta para obtener un item en específico
app.get("/item/:id", (req, res) => {
  const itemId = req.params.id;

  fs.readFile("items.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo items.json:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    const items = JSON.parse(data);
    const item = items.find((item) => item.id === parseInt(itemId));
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
});

// Ruta para actualizar el estado de un item
app.put("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const newStatus = req.body.status;

  fs.readFile("items.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo items.json:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    let items = JSON.parse(data);
    const item = items.find((item) => item.id === parseInt(itemId));
    if (!item) {
      res.status(404).send("Item no encontrado");
      return;
    }
    item.status = newStatus;

    fs.writeFile("items.json", JSON.stringify(items, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo items.json:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.sendFile(path.join(__dirname, "/static/not-available.html"));
      // res.json(item);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
