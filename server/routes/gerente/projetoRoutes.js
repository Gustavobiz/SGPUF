const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar, autorizar } = require("../../middlewares/authMiddleware");

// Rota: Criar projeto (somente gerente)
router.post("/", autenticar, autorizar("gerente"), async (req, res) => {
  const {
    Status,
    PreçoFinal,
    VOC,
    Isc,
    Lmax,
    Vmax,
    Data_Solicitaçao,
    UniConsID,
    ConcessionáriaID,
    Cliente_CPF,
  } = req.body;

  try {
    const [cliente] = await connection
      .promise()
      .query(`SELECT * FROM Cliente WHERE CPF = ?`, [Cliente_CPF]);
    if (cliente.length === 0)
      return res.status(400).json({ error: "Cliente não encontrado" });

    const [unidade] = await connection
      .promise()
      .query(`SELECT * FROM \`Unidade Consumidora\` WHERE NumeroID = ?`, [
        UniConsID,
      ]);
    if (unidade.length === 0)
      return res
        .status(400)
        .json({ error: "Unidade Consumidora não encontrada" });

    const [concessionaria] = await connection
      .promise()
      .query(`SELECT * FROM Concessionária WHERE CNPJ = ?`, [ConcessionáriaID]);
    if (concessionaria.length === 0)
      return res.status(400).json({ error: "Concessionária não encontrada" });

    const [result] = await connection.promise().query(
      `INSERT INTO Projeto 
       (Status, PreçoFinal, VOC, Isc, Lmax, Vmax, Data_Solicitaçao, UniConsID, ConcessionáriaID, Cliente_CPF)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Status,
        PreçoFinal,
        VOC,
        Isc,
        Lmax,
        Vmax,
        Data_Solicitaçao,
        UniConsID,
        ConcessionáriaID,
        Cliente_CPF,
      ]
    );

    res.status(201).json({
      message: "Projeto criado com sucesso",
      idProjeto: result.insertId,
    });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
