const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar } = require("../../middlewares/authMiddleware");

router.post("/", autenticar, async (req, res) => {
  const {
    Previsão_inicio,
    Previsão_fim,
    Execução_inicio,
    Execução_fim,
    Projeto_idProjeto,
  } = req.body;

  try {
    // Verifica se o projeto existe
    const [projeto] = await connection
      .promise()
      .query("SELECT * FROM Projeto WHERE idProjeto = ?", [Projeto_idProjeto]);

    if (projeto.length === 0) {
      return res.status(400).json({ error: "Projeto não encontrado" });
    }

    // Insere a instalação com status padrão 'marcado'
    const [resultado] = await connection.promise().query(
      `INSERT INTO Instalação 
      (Previsão_inicio, Previsão_fim, Execução_inicio, Execução_fim, Projeto_idProjeto) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        Previsão_inicio,
        Previsão_fim,
        Execução_inicio,
        Execução_fim,
        Projeto_idProjeto,
      ]
    );

    res.status(201).json({
      message: "Instalação cadastrada com sucesso",
      idInstalacao: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro ao cadastrar instalação:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
