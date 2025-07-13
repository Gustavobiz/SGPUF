const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar, autorizar } = require("../../middlewares/authMiddleware");

// POST /homologacoes/:idProjeto
router.post(
  "/:idProjeto",
  autenticar,
  autorizar("estagiario"),
  async (req, res) => {
    const { idProjeto } = req.params;
    const { id } = req.usuario; // vem do token JWT
    const dataAtual = new Date(); // data/hora exata da homologação

    try {
      // verifica se o projeto existe
      const [projeto] = await connection
        .promise()
        .query("SELECT * FROM Projeto WHERE idProjeto = ?", [idProjeto]);

      if (projeto.length === 0) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      // atualiza o status do projeto
      await connection
        .promise()
        .query("UPDATE Projeto SET Status = 'Homologado' WHERE idProjeto = ?", [
          idProjeto,
        ]);

      // insere o registro de homologação com data
      await connection.promise().query(
        `INSERT INTO Homologa (idEstagiário, Projeto_idProjeto, data)
         VALUES (?, ?, ?)`,
        [id, idProjeto, dataAtual]
      );

      res
        .status(200)
        .json({ message: "Projeto homologado com sucesso", data: dataAtual });
    } catch (error) {
      console.error("Erro ao homologar projeto:", error);
      res.status(500).json({ error: "Erro no servidor" });
    }
  }
);

module.exports = router;
