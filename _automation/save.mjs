import puppeteer from "puppeteer-core";
const browser = await puppeteer.connect({ browserURL: "http://localhost:9222", defaultViewport: null });
const pages = await browser.pages();
const page = pages.find((p) => p.url().includes("total_set")) || pages[pages.length - 1];
await page.bringToFront().catch(() => {});
await page.setViewport({ width: 1440, height: 1600 });

// Auto-accept any native confirm/alert dialogs.
page.on("dialog", async (d) => {
  console.log("DIALOG:", d.type(), "|", d.message());
  await d.accept().catch(() => {});
});

const r = await page.evaluate(() => {
  const a = [...document.querySelectorAll("a,button")].find(
    (e) => (e.getAttribute("onclick") || "").includes("saveRecordEvent"),
  );
  if (!a) return "no-save-button";
  a.click();
  return "save clicked";
});
console.log("save:", r);

await new Promise((r) => setTimeout(r, 3000));
await page.screenshot({ path: process.argv[2] });
console.log("SAVED-SHOT");
await browser.disconnect();
