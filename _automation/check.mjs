// Set a desktop viewport, report login state, and screenshot the active tab.
// Usage: node check.mjs <outPath>
import puppeteer from "puppeteer-core";

const outPath = process.argv[2] || "/tmp/cdp_shot.png";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: null,
});

const pages = await browser.pages();
const httpPages = pages.filter((p) => p.url().startsWith("http"));
const page = httpPages[httpPages.length - 1] || pages[0];

await page.setViewport({ width: 1440, height: 900 });
await new Promise((r) => setTimeout(r, 1000));

const info = await page.evaluate(() => {
  const t = document.body.innerText || "";
  return {
    hasLogout: t.includes("로그아웃"),
    hasLoginWord: t.includes("로그인"),
    myGabia: t.includes("My가비아") || t.includes("MY가비아"),
  };
});

console.log("URL:", page.url());
console.log("loggedIn(로그아웃 present):", info.hasLogout);
console.log("login word present:", info.hasLoginWord);
console.log("My가비아 present:", info.myGabia);
await page.screenshot({ path: outPath });
console.log("SAVED:", outPath);

await browser.disconnect();
