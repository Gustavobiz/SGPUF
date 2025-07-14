const fs = require("fs-extra");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

async function generateVistoriaPDF(data, outputPath) {
  const templatePath = path.join(__dirname, "../routes/templates/vistoria.hbs");
  const html = await fs.readFile(templatePath, "utf-8");
  const compileTemplate = handlebars.compile(html);
  const finalHtml = compileTemplate(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(finalHtml);
  await page.pdf({ path: outputPath, format: "A4" });
  await browser.close();
}

module.exports = generateVistoriaPDF;
