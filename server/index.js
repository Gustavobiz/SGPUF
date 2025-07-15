const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend React t
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

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
const pdfRoutes = require("./routes/estagiario/homoPdfRoutes");
const vistoriaPdfRoutes = require("./routes/engenheiro/vistoriaPdfRoute");

app.use("/vistorias", vistoriaPdfRoutes);
app.use("/pdf", pdfRoutes);
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
