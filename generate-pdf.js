const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { getBundleName, selectFiles } = require('./bundle-target');

const templatesDir = path.join(__dirname, 'generated-templates');
const outputDir = path.join(__dirname, 'generated-pdfs');

const margins = {
  top: '15mm',
  right: '15mm',
  bottom: '15mm',
  left: '15mm'
};

async function main() {
  const bundleName = getBundleName(process.argv.slice(2));
  fs.mkdirSync(outputDir, { recursive: true });

  const files = selectFiles(templatesDir, '.html', bundleName);
  const browser = await puppeteer.launch();

  try {
    for (const file of files) {
      const page = await browser.newPage();
      const templatePath = path.join(templatesDir, file);
      const pdfName = path.basename(file, '.html') + '.pdf';
      const pdfPath = path.join(outputDir, pdfName);

      try {
        console.log(`Generating PDF for ${file}...`);

        await page.goto(pathToFileURL(templatePath).href, {
          waitUntil: "networkidle0",
        });

        await page.pdf({
          path: pdfPath,
          format: "A4",
          margin: margins,
          printBackground: true,
        });

        console.log(`Generated ${pdfName}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log(bundleName
    ? `PDF generated successfully for ${bundleName}.`
    : "All PDFs generated successfully.");
}

main().catch(error => {
  console.error("Error generating PDFs:", error.message);
  process.exit(1);
});
