const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const margins = {
  top: '15mm',
  right: '15mm',
  bottom: '15mm',
  left: '15mm'
};
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`file:${path.resolve(__dirname, "index.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "index.pdf",
    format: "A4",
    margin: margins,
    printBackground: true,
  });

  await page.goto(`file:${path.resolve(__dirname, "man.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "man.pdf",
    format: "A4",
    margin: margins,
    printBackground: true,
  });

  await page.goto(`file:${path.resolve(__dirname, "fe.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "fe.pdf",
    format: "A4",
    margin: margins,
    printBackground: true,
  });

    await page.goto(`file:${path.resolve(__dirname, "large.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "large.pdf",
    format: "A4",
    margin: margins,
    printBackground: true,
  });

    await page.goto(`file:${path.resolve(__dirname, "8man-large.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "8man-large.pdf",
    format: "A4",
    margin: margins,
    printBackground: true,
  });

  await browser.close();
  console.log("PDF generated as resume.pdf");
})();
