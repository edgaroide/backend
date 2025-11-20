// index.js
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI (cambia por tu URI correcto)
const uri = "mongodb+srv://eaarongonzalez_db_user:bmwmrA39QiIfQG3k@cluster0.eqh40eb.mongodb.net/";
const client = new MongoClient(uri);

let usuariosCollection;

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// GET /usuarios
app.get("/usuarios", async (req, res) => {
  try {
    if (!usuariosCollection) throw new Error("No conectado a la base de datos");
    const usuarios = await usuariosCollection.find({}).toArray();
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios: " + err.message);
  }
});

// POST /usuarios
app.post("/usuarios", async (req, res) => {
  try {
    if (!usuariosCollection) throw new Error("No conectado a la base de datos");
    const { nombre, email } = req.body;
    if (!nombre || !email) return res.status(400).send("Faltan datos");
    
    const result = await usuariosCollection.insertOne({ nombre, email, creado: new Date() });
    res.json({ id: result.insertedId, nombre, email });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al agregar usuario: " + err.message);
  }
});

// Función para iniciar servidor y conectar MongoDB
async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB conectado correctamente");

    const db = client.db("miDB");
    usuariosCollection = db.collection("usuarios");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    console.error("Verifica tu URI y la whitelist de IPs en MongoDB Atlas.");
    process.exit(1); // Detener servidor si no hay conexión
  }
}

startServer();
