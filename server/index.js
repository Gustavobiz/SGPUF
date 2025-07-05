const express = require("express");
const cors = require("cors");
const db = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Teste de rota
app.get("/", (req, res) => {
  res.send("API do SGPUF funcionando!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
