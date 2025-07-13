const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/publico/authRoutes");
const registerRoutes = require("./routes/publico/registerRoutes");

app.use(express.json());
app.use("/login", authRoutes);
app.use("/register", registerRoutes);

const clienteRoutes = require("./routes/cliente/clienteRoutes");
const unidadeRoutes = require("./routes/funcionario/unidadeRoutes");
const concessionariaRoutes = require("./routes/funcionario/concessionariaRoutes");

app.use("/clientes", clienteRoutes);
app.use("/unidades-consumidoras", unidadeRoutes);
app.use("/concessionarias", concessionariaRoutes);

const projetoRoutes = require("./routes/gerente/projetoRoutes");
app.use("/projetos", projetoRoutes);

const rotaGerente = require("./routes/gerente/rotaGerente");
app.use("/gerente", rotaGerente);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
