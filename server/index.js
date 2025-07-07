const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/publico/authRoutes");
const registerRoutes = require("./routes/publico/registerRoutes");

app.use(express.json());
app.use("/login", authRoutes);
app.use("/register", registerRoutes);

const rotaGerente = require("./routes/gerente/rotaGerente");
app.use("/gerente", rotaGerente);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
