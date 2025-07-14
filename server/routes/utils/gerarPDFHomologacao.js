const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

async function gerarPDFHomologacao(dados, nomeArquivo) {
  const filePath = path.join(
    __dirname,
    "..",
    "templates",
    "homologacaoTemplate.hbs"
  );
  const htmlTemplate = fs.readFileSync(filePath, "utf8");

  const template = handlebars.compile(htmlTemplate);
  const htmlFinal = template(dados);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlFinal);
  await page.pdf({
    path: nomeArquivo,
    format: "A4",
    printBackground: true,
  });
  await browser.close();
}

module.exports = gerarPDFHomologacao;
