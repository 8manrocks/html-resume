const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`file:${path.resolve(__dirname, "fe.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "resume.pdf",
    format: "A4",
     margin: {
      top: '0.4in',
      right: '0.4in',
      bottom: '0.4in',
      left: '0.4in'
    },
    printBackground: true,
  });

  await browser.close();
  console.log("PDF generated as resume.pdf");
})();
