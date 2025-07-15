const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar, autorizar } = require("../../middlewares/authMiddleware");

// Rota: Criar projeto (somente gerente)d
router.post("/", autenticar, autorizar("gerente"), async (req, res) => {
  const {
    Nome,
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
       (Nome, Status, PreçoFinal,VOC, Isc, Lmax, Vmax, Data_Solicitaçao, UniConsID, ConcessionáriaID, Cliente_CPF)
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Nome,
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
//Get todos projetos
router.get("/", autenticar, async (req, res) => {
  try {
    const [projetos] = await connection.promise().query(`
      SELECT 
        P.idProjeto,
        P.Nome,
        P.Status,
        P.PreçoFinal,
        P.VOC,
        P.Isc,
        P.Lmax,
        P.Vmax,
        P.Data_Solicitaçao,
        U.Nome AS UnidadeNome,
        C.razaosocial AS ConcessionariaNome,
        CL.Nome AS ClienteNome
      FROM Projeto P
      JOIN \`Unidade Consumidora\` U ON P.UniConsID = U.NumeroID
      JOIN Concessionária C ON P.ConcessionáriaID = C.CNPJ
      JOIN Cliente CL ON P.Cliente_CPF = CL.CPF
    `);

    res.status(200).json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
});

module.exports = router;
