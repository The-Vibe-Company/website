// Isolated bounded Lighthouse worker. Never serialize the LHR: it can contain sensitive headers.
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import { bypassHeaders, previewOrigin, PROD, readMetrics } from './lighthouse';

const target = new URL(process.argv[2]);
const isPreview = process.argv[3] === 'preview';
if (isPreview ? !previewOrigin(target.href) : target.origin !== PROD) process.exit(2);
const secret = isPreview ? process.env.VERCEL_AUTOMATION_BYPASS_SECRET : undefined;
let chrome: Awaited<ReturnType<typeof launch>> | undefined;
let closing = false;
async function close() { if (!closing) { closing = true; await chrome?.kill(); } }
const alarm = setTimeout(async () => { await close(); process.exit(2); }, 95_000);
process.on('SIGTERM', async () => { await close(); process.exit(2); });
try {
  const response = await fetch(target, {
    headers: bypassHeaders(target.href, target.origin, secret), redirect: isPreview ? 'manual' : 'follow', signal: AbortSignal.timeout(15_000),
  });
  await response.body?.cancel();
  if (response.status !== 200) throw new Error('Unavailable');
  chrome = await launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
  const page = await browser.newPage();
  // Request-scoped injection prevents sending the bypass header to analytics, CDNs or auth redirects.
  await page.setRequestInterception(true);
  page.on('request', request => {
    const headers = { ...request.headers(), ...bypassHeaders(request.url(), target.origin, secret) };
    if (new URL(request.url()).origin !== target.origin) delete headers['x-vercel-protection-bypass'];
    void request.continue({ headers }).catch(() => {});
  });
  let documentStatus = 0;
  page.on('response', response => {
    if (response.request().isNavigationRequest() && response.frame() === page.mainFrame()) documentStatus = response.status();
  });
  const result = await lighthouse(target.href, {
    logLevel: 'silent', onlyCategories: ['performance'], formFactor: 'mobile',
    throttlingMethod: 'simulate', maxWaitForLoad: 45_000, maxWaitForFcp: 30_000,
    disableFullPageScreenshot: true,
  }, undefined, page);
  const final = new URL(page.url());
  const metrics = result && readMetrics(result.lhr);
  if (!metrics || documentStatus !== 200 || (isPreview ? final.origin !== target.origin : ![PROD, 'https://www.thevibecompany.co'].includes(final.origin)) || final.pathname.replace(/\/$/, '') !== target.pathname.replace(/\/$/, '')) throw new Error('Unavailable');
  const preloads = isPreview ? await page.evaluate(() => Array.from(document.head.querySelectorAll('link[rel~="preload"][as="image"]')).map(link => {
    // Strip query strings (including tokens) and bound every field before returning it.
    const raw = link.getAttribute('href') || link.getAttribute('imagesrcset')?.split(' ')[0] || '(responsive image)';
    try { return new URL(raw, location.href).pathname.slice(0, 180); } catch { return '(image)'; }
  })) : [];
  process.stdout.write(JSON.stringify({ metrics, preloads }));
} catch {
  // Do not print exception messages, browser output, headers, HTML or reports.
  process.exitCode = 2;
} finally { clearTimeout(alarm); await close(); }
