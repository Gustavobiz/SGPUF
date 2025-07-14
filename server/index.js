const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/publico/authRoutes");
const registerRoutes = require("./routes/publico/registerRoutes");
const clienteRoutes = require("./routes/cliente/clienteRoutes");
const unidadeRoutes = require("./routes/funcionario/unidadeRoutes");
const concessionariaRoutes = require("./routes/funcionario/concessionariaRoutes");
const homologacoesRoutes = require("./routes/estagiario/homologacoesRoutes");
const vistoriaRoutes = require("./routes/engenheiro/vistoriaRoutes");
const projetoRoutes = require("./routes/gerente/projetoRoutes");
const rotaGerente = require("./routes/gerente/rotaGerente");
const instalacoesRoutes = require("./routes/funcionario/instalacoesRoutes");

app.use(express.json());
app.use("/login", authRoutes);
app.use("/register", registerRoutes);
app.use("/clientes", clienteRoutes);
app.use("/unidades", unidadeRoutes);
app.use("/concessionarias", concessionariaRoutes);
app.use("/homologacoes", homologacoesRoutes);
app.use("/vistorias", vistoriaRoutes);
app.use("/projetos", projetoRoutes);
app.use("/gerente", rotaGerente);
app.use("/instalacoes", instalacoesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
