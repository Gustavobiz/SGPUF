const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar } = require("../../middlewares/authMiddleware");

// Função para gerar código aleatório do cliente
function gerarCodigoCliente() {
  const prefixo = "CLI";
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return prefixo + random;
}

router.post("/", autenticar, async (req, res) => {
  const { CPF, endereco, Nome } = req.body;
  const codigoCliente = gerarCodigoCliente();

  try {
    await connection
      .promise()
      .query(
        "INSERT INTO Cliente (CPF, endereco, Nome, codigoCliente) VALUES (?, ?, ?, ?)",
        [CPF, endereco, Nome, codigoCliente]
      );

    res.status(201).json({
      message: "Cliente cadastrado com sucesso",
      codigoCliente: codigoCliente,
    });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

//rota para o cliente acompanhar os projetos via
router.get("/:codigoCliente/projetos", autenticar, async (req, res) => {
  const { codigoCliente } = req.params;

  try {
    const [clienteResult] = await connection
      .promise()
      .query("SELECT CPF FROM Cliente WHERE codigoCliente = ?", [
        codigoCliente,
      ]);

    if (clienteResult.length === 0) {
      return res
        .status(404)
        .json({ error: "Código de cliente não encontrado" });
    }

    const cpf = clienteResult[0].CPF;

    const [projetos] = await connection
      .promise()
      .query("SELECT * FROM Projeto WHERE Cliente_CPF = ?", [cpf]);

    res.json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
});

module.exports = router;
