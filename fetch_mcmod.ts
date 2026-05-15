import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const URL = 'https://www.mcmod.cn/';
const OUT = 'mcmod_rendered';

async function fetch() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0');
  console.log('Navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('Page loaded');
  const html = await page.content();
  writeFileSync(OUT + '.html', html);
  console.log(`Saved ${html.length} chars to ${OUT}.html`);
  const classes = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const cls = new Set();
    all.forEach(el => { const c = el.className; if (typeof c === 'string' && c.trim()) c.split(/\s+/).forEach(x => cls.add(x)); });
    return [...cls].sort();
  });
  writeFileSync(OUT + '_classes.txt', classes.join('\n'));
  console.log(`Found ${classes.length} unique classes`);
  const ids = await page.evaluate(() => {
    const all = document.querySelectorAll('[id]');
    return [...all].map(el => el.id).filter(Boolean).sort();
  });
  writeFileSync(OUT + '_ids.txt', ids.join('\n'));
  console.log(`Found ${ids.length} elements with ids`);
  await browser.close();
}

fetch().catch(e => { console.error(e); process.exit(1); });
