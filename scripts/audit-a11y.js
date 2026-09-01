const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3456;

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Auditing slide decks against WCAG 2.1 / 2.2 AA using axe-core...\n`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const targetDir = process.argv[2] || 'ssc-490';
  
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory '${targetDir}' not found.`);
    await browser.close();
    server.close();
    process.exit(1);
  }

  const htmlFiles = fs.readdirSync(targetDir)
    .filter(f => f.endsWith('.html') && f.startsWith('session-'))
    .sort();

  let totalViolations = 0;

  for (const file of htmlFiles) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    try {
      await page.goto(`http://127.0.0.1:${PORT}/${targetDir}/${file}?print-pdf`, { waitUntil: 'networkidle2' });
      await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });

      const results = await page.evaluate(async () => {
        return await axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
          }
        });
      });

      if (results.violations.length > 0) {
        console.log(`❌ ${file}: ${results.violations.length} violation(s)`);
        totalViolations += results.violations.length;
        for (const v of results.violations) {
          console.log(`   [${v.impact.toUpperCase()}] ${v.id}: ${v.help}`);
          for (const node of v.nodes) {
            console.log(`     Target: ${node.target.join(' ')}`);
            console.log(`     Failure: ${node.failureSummary}`);
          }
        }
      } else {
        console.log(`✅ ${file}: 0 violations`);
      }
    } catch (err) {
      console.error(`Error auditing ${file}:`, err.message);
    } finally {
      await page.close();
    }
  }

  console.log(`\n========================================`);
  if (totalViolations === 0) {
    console.log(`🎉 All ${htmlFiles.length} decks PASSED WCAG 2.1/2.2 AA standards (0 violations).`);
  } else {
    console.log(`⚠️ Completed with ${totalViolations} total violation(s).`);
  }
  console.log(`========================================\n`);

  await browser.close();
  server.close();
  process.exit(totalViolations > 0 ? 1 : 0);
});
