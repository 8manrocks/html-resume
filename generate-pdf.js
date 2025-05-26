const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  await page.goto(`file:${path.resolve(__dirname, "index.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "resume.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("PDF generated as resume.pdf");
})();
