const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const templatesDir = path.join(__dirname, 'generated-templates');
const outputDir = path.join(__dirname, 'generated-pdfs');

const margins = {
  top: '15mm',
  right: '15mm',
  bottom: '15mm',
  left: '15mm'
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    const browser = await puppeteer.launch();
    const files = fs.readdirSync(templatesDir);

    for (const file of files) {
      if (path.extname(file) === '.html') {
        const page = await browser.newPage();
        const templatePath = path.join(templatesDir, file);
        const pdfName = path.basename(file, '.html') + '.pdf';
        const pdfPath = path.join(outputDir, pdfName);

        console.log(`Generating PDF for ${file}...`);

        await page.goto(`file:${templatePath}`, {
          waitUntil: "networkidle0",
        });

        await page.pdf({
          path: pdfPath,
          format: "A4",
          margin: margins,
          printBackground: true,
        });

        console.log(`Generated ${pdfName}`);
        await page.close();
      }
    }

    await browser.close();
    console.log("All PDFs generated successfully.");
  } catch (err) {
    console.error("Error generating PDFs:", err);
    process.exit(1);
  }
})();
