const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const generatePDF = require("../../utils/generateVistoriaPDF");
const path = require("path");

router.get("/:id/pdf", async (req, res) => {
  const idVistoria = req.params.id;

  try {
    const [vistoriaRows] = await connection.promise().query(
      `SELECT v.*, p.VOC, p.Isc, p.Data_Solicitaçao, p.UniConsID, p.ConcessionáriaID, p.Cliente_CPF
       FROM Vistorias v
       JOIN Projeto p ON v.Projeto_idProjeto = p.idProjeto
       WHERE v.idVistorias = ?`,
      [idVistoria]
    );

    if (vistoriaRows.length === 0)
      return res.status(404).json({ error: "Vistoria não encontrada" });

    const vistoria = vistoriaRows[0];

    const [[UC]] = await connection
      .promise()
      .query(`SELECT * FROM \`Unidade Consumidora\` WHERE NumeroID = ?`, [
        vistoria.UniConsID,
      ]);

    const [[concessionaria]] = await connection
      .promise()
      .query(`SELECT * FROM Concessionária WHERE CNPJ = ?`, [
        vistoria.ConcessionáriaID,
      ]);

    const [[cliente]] = await connection
      .promise()
      .query(`SELECT * FROM Cliente WHERE CPF = ?`, [vistoria.Cliente_CPF]);

    const [[engenheiro]] = await connection
      .promise()
      .query(`SELECT nome FROM Funcionário WHERE idFuncionário = ?`, [
        vistoria.Engenheiro_Funcionário_idFuncionário,
      ]);

    const outputPath = path.join(
      __dirname,
      `../../pdfs/vistoria-${idVistoria}.pdf`
    );
    const data = {
      idVistoria: vistoria.idVistorias,
      Data_Solicitacao: vistoria.Data_Solicitaçao,
      VOC: vistoria.VOC,
      Isc: vistoria.Isc,
      Lmax: vistoria.Lmax,
      Vmax: vistoria.Vmax,
      UC_Nome: UC.Nome,
      TipoCabo: UC.TipoCabo,
      Potência: UC.Potência,
      Bitola: UC.Bitola,
      razaosocial: concessionaria.razaosocial,
      email: concessionaria.email,
      telefone: concessionaria.telefone,
      NomeEngenheiro: engenheiro.nome,
      NomeCliente: cliente.Nome,
    };

    await generatePDF(data, outputPath);
    res.download(outputPath);
  } catch (error) {
    console.error("Erro ao gerar PDF de vistoria:", error);
    res.status(500).json({ error: "Erro ao gerar o PDF" });
  }
});

module.exports = router;
