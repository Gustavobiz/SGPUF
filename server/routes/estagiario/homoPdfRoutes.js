const express = require("express");
const router = express.Router();
const connection = require("../../config/db");
const handlebars = require("handlebars");
const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const path = require("path");

router.get("/homologacao/pdf/:idProjeto", async (req, res) => {
  const { idProjeto } = req.params;

  try {
    const [projetos] = await connection.promise().query(
      `
      SELECT 
        Projeto.*, 
        Cliente.Nome AS nomeCliente 
      FROM Projeto
      JOIN Cliente ON Projeto.Cliente_CPF = Cliente.CPF
      WHERE Projeto.idProjeto = ?
    `,
      [idProjeto]
    );

    if (projetos.length === 0)
      return res.status(404).json({ error: "Projeto não encontrado" });

    const dados = projetos[0];

    // Leitura e compilação do template
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "homologacao.hbs"
    );
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(templateContent);
    const html = template(dados);

    // Geração do PDF
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=homologacao_projeto_${idProjeto}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({ error: "Erro ao gerar documento" });
  }
});

module.exports = router;
