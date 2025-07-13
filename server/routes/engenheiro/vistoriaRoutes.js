const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar, autorizar } = require("../../middlewares/authMiddleware");

router.post("/", autenticar, autorizar("engenheiro"), async (req, res) => {
  const { projetoId, Lmax, Vmax } = req.body;
  const engenheiroId = req.user.id;

  try {
    // Verifica se projeto existe
    const [projeto] = await connection
      .promise()
      .query("SELECT * FROM Projeto WHERE idProjeto = ?", [projetoId]);

    if (projeto.length === 0)
      return res.status(404).json({ error: "Projeto não encontrado" });

    // Cria vistoria
    const [result] = await connection.promise().query(
      `INSERT INTO Vistorias (Engenheiro_Funcionário_idFuncionário, Lmax, Vmax)
       VALUES (?, ?, ?)`,
      [engenheiroId, Lmax, Vmax]
    );

    // Atualiza status do projeto
    await connection
      .promise()
      .query("UPDATE Projeto SET Status = 'vistoriado' WHERE idProjeto = ?", [
        projetoId,
      ]);

    res.status(201).json({ message: "Vistoria criada e projeto atualizado!" });
  } catch (error) {
    console.error("Erro ao criar vistoria:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
