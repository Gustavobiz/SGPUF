const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const { autenticar, autorizar } = require("../../middlewares/authMiddleware");

// Rota: Criar projeto (somente gerente)
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
   (Nome, Status, PreçoFinal, VOC, Isc, Lmax, Vmax, Data_Solicitaçao, UniConsID, ConcessionáriaID, Cliente_CPF)
   VALUES (?, 'em análise', ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [
        Nome,
        PreçoFinal,
        VOC,
        Isc,
        Lmax,
        Vmax,
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
        CL.Nome AS ClienteNome,
        R.Vistorias_idVistorias AS idVistoria
      FROM Projeto P
      JOIN \`Unidade Consumidora\` U ON P.UniConsID = U.NumeroID
      JOIN Concessionária C ON P.ConcessionáriaID = C.CNPJ
      JOIN Cliente CL ON P.Cliente_CPF = CL.CPF
      LEFT JOIN Revisa R ON P.idProjeto = R.IDProjeto
    `);

    res.status(200).json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
});

// Get projeto por ID
router.get("/:id", autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const [projetos] = await connection.promise().query(
      `
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
    U.Longitude,
    U.Latitude,
    U.TipoCabo,
    U.Potência,
    U.Bitola,
    C.razaosocial AS ConcessionariaNome,
    C.CNPJ,
    CL.Nome AS ClienteNome,
    CL.CPF AS ClienteCPF,
    I.Previsão_inicio AS PrevisaoInicio,
    I.Previsão_fim AS PrevisaoFim,
    I.Execução_inicio AS ExecucaoInicio,
    I.Execução_fim AS ExecucaoFim
  FROM Projeto P
  JOIN \`Unidade Consumidora\` U ON P.UniConsID = U.NumeroID
  JOIN \`Concessionária\` C ON P.ConcessionáriaID = C.CNPJ
  JOIN Cliente CL ON P.Cliente_CPF = CL.CPF
  LEFT JOIN \`Instalação\` I ON I.Projeto_idProjeto = P.idProjeto
  WHERE P.idProjeto = ?
  `,
      [id]
    );

    if (projetos.length === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.status(200).json(projetos[0]);
  } catch (error) {
    console.error("Erro ao buscar projeto por ID:", error);
    res.status(500).json({ error: "Erro ao buscar projeto" });
  }
});

// Rota PATCH corrigida e simplificada

router.patch("/:id/status", autenticar, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Corrigido para 'status' para bater com o frontend

  // Verificação para garantir que o status foi enviado
  if (!status) {
    return res.status(400).json({ error: "O novo status é obrigatório." });
  }

  try {
    // Uma única query que atualiza apenas o status do projeto
    const query = `
      UPDATE Projeto 
      SET Status = ? 
      WHERE idProjeto = ?
    `;
    const params = [status, id];

    const [resultado] = await connection.promise().query(query, params);

    // Verifica se alguma linha foi realmente atualizada
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }

    res.json({ message: "Status atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar status do projeto:", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

module.exports = router;
