const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar } = require("../../middlewares/authMiddleware");

router.post("/", autenticar, async (req, res) => {
  const { Previsão_inicio, Previsão_fim, Projeto_idProjeto } = req.body;

  // Validação dos campos recebidos
  if (!Previsão_inicio || !Previsão_fim || !Projeto_idProjeto) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Verifica se o projeto existe
    const [projeto] = await connection
      .promise()
      .query("SELECT * FROM Projeto WHERE idProjeto = ?", [Projeto_idProjeto]);

    if (projeto.length === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    const [instalacaoExistente] = await connection
      .promise()
      .query("SELECT * FROM `Instalação` WHERE Projeto_idProjeto = ?", [
        Projeto_idProjeto,
      ]);

    if (instalacaoExistente.length > 0) {
      return res
        .status(409)
        .json({ error: "Este projeto já possui uma instalação agendada." });
    }

    // Insere as previsões e deixa os campos de execução como NULL
    const [resultado] = await connection.promise().query(
      `INSERT INTO \`Instalação\` 
        (Previsão_inicio, Previsão_fim, Execução_inicio, Execução_fim, Projeto_idProjeto, Status) 
      VALUES (?, ?, NULL, NULL, ?, ?)`,
      [Previsão_inicio, Previsão_fim, Projeto_idProjeto, "Agendada"]
    );

    await connection
      .promise()
      .query("UPDATE Projeto SET Status = ? WHERE idProjeto = ?", [
        "Instalação Agendada",
        Projeto_idProjeto,
      ]);

    res.status(201).json({
      message: "Instalação agendada com sucesso",
      idInstalacao: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro ao cadastrar instalação:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
