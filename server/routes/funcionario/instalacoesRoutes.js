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
// PATCH /instalacoes/:projetoId - Para registrar a execução (início e fim)
router.patch("/:projetoId", autenticar, async (req, res) => {
  const { projetoId } = req.params;
  // Pega as datas de execução do corpo da requisição
  const { Execucao_inicio, Execucao_fim } = req.body;

  if (!Execucao_inicio || !Execucao_fim) {
    return res.status(400).json({
      error: "As datas de início e fim da execução são obrigatórias.",
    });
  }

  try {
    const sqlUpdateInstalacao = `
      UPDATE \`Instalação\` 
      SET Execucao_inicio = ?, Execucao_fim = ?, Status = ? 
      WHERE Projeto_idProjeto = ?
    `;
    const statusExecucao = "Concluída";
    const [result] = await connection
      .promise()
      .query(sqlUpdateInstalacao, [
        Execucao_inicio,
        Execucao_fim,
        statusExecucao,
        projetoId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Nenhum agendamento de instalação encontrado para este projeto.",
      });
    }

    const sqlUpdateProjeto =
      "UPDATE Projeto SET Status = ? WHERE idProjeto = ?";
    await connection
      .promise()
      .query(sqlUpdateProjeto, ["Instalação Concluída", projetoId]);

    res
      .status(200)
      .json({ message: "Execução da instalação registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar execução da instalação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
