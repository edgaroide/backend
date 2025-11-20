// index.js
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 URI COMPLETA DE MONGODB ATLAS (CORREGIDA)
const uri = "const uri = "mongodb+srv://edg_user:kyogre@cluster0.eqh40eb.mongodb.net/vulnerabilidades?retryWrites=true&w=majority&appName=Cluster0";";

const client = new MongoClient(uri);

let usuariosCollection;

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// GET /usuarios → obtener usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await usuariosCollection.find({}).toArray();
    res.json(usuarios);
  } catch (err) {
    console.error("❌ Error GET /usuarios:", err);
    res.status(500).send("Error al obtener usuarios");
  }
});

// POST /usuarios → agregar usuario nuevo
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).send("Faltan datos");
    }

    const result = await usuariosCollection.insertOne({
      nombre,
      email,
      creado: new Date()
    });

    res.json({ id: result.insertedId, nombre, email });
  } catch (err) {
    console.error("❌ Error POST /usuarios:", err);
    res.status(500).send("Error al agregar usuario");
  }
});

// Conectar DB + iniciar servidor
async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB conectado correctamente");

    const db = client.db("miDB");
    usuariosCollection = db.collection("usuarios");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
}

startServer();


