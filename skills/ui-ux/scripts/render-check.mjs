#!/usr/bin/env node
// render-check.mjs — rendered evidence capture for UI/UX audits (source: BROWSER/TOOL).
// Uses Playwright ONLY if it is already installed in the current project (or resolvable from cwd).
// It never installs anything. If Playwright is missing, it exits with instructions.
//
// For each URL × viewport it saves a screenshot and measures:
//   - horizontal overflow and the elements causing it
//   - interactive targets smaller than 24×24 CSS px (WCAG 2.5.8 candidates — check exceptions)
//   - controls without an accessible name (heuristic)
//   - images without alt attribute
//   - heading outline and landmarks
//   - first N Tab stops: element, and whether a visible focus indicator appears (heuristic)
//
// Usage:
//   node render-check.mjs --url http://localhost:3000/ [--url http://localhost:3000/settings]
//        [--viewports 390x844,768x1024,1440x900] [--out .claude/ui-ux/audits/render]
//        [--full-page] [--wait 500] [--tabs 15] [--color-scheme light|dark] [--reduced-motion]
//
// Only point it at local/test environments you are allowed to load. It does not click or submit anything.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const argv = process.argv.slice(2);
const many = n => argv.flatMap((a, i) => (a === n && argv[i + 1] ? [argv[i + 1]] : []));
const one = (n, d) => many(n)[0] ?? d;
const has = n => argv.includes(n);

const urls = many('--url');
if (!urls.length) {
  console.error('Usage: node render-check.mjs --url <url> [--url <url>] [--viewports 390x844,768x1024,1440x900] [--out dir] [--full-page] [--wait ms] [--tabs n] [--color-scheme light|dark] [--reduced-motion]');
  process.exit(1);
}
const viewports = one('--viewports', '390x844,768x1024,1440x900').split(',').map(v => {
  const [w, h] = v.toLowerCase().split('x').map(Number);
  return { width: w, height: h || Math.round(w * 1.6) };
});
const outDir = resolve(one('--out', '.claude/ui-ux/audits/render'));
const waitMs = Number(one('--wait', 500));
const tabs = Number(one('--tabs', 15));

let chromium;
try {
  const req = createRequire(join(process.cwd(), 'noop.js'));
  let pw;
  try { pw = req('playwright'); } catch { pw = req('@playwright/test'); }
  chromium = pw.chromium;
} catch {
  console.error('Playwright is not installed in this project. render-check.mjs does not install dependencies.\n' +
    'Options: use the browser tool available in your session, ask the user to install Playwright\n' +
    '(e.g. as a devDependency plus browsers), or continue in static mode and lower confidence accordingly.');
  process.exit(2);
}

const slug = s => s.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'page';

function measure() {
  const vw = document.documentElement.clientWidth;
  const describe = el => {
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}`;
  };
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const all = [...document.querySelectorAll('body *')];
  // Report the outermost overflowing elements (their descendants usually overflow for the same reason).
  const over = all.filter(el => visible(el) && el.getBoundingClientRect().right > vw + 1);
  const overSet = new Set(over);
  const overflowing = over.filter(el => !overSet.has(el.parentElement))
    .slice(0, 20).map(el => ({ el: describe(el), right: Math.round(el.getBoundingClientRect().right) }));
  const interactive = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=checkbox],[role=tab],[role=menuitem],[tabindex]:not([tabindex="-1"])')].filter(visible);
  const smallTargets = interactive.map(el => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width < 24 || r.height < 24)
    .slice(0, 40).map(({ el, r }) => ({ el: describe(el), text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40), size: `${Math.round(r.width)}x${Math.round(r.height)}` }));
  const unnamed = interactive.filter(el => {
    const name = (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || el.value || el.getAttribute('placeholder') || '').trim();
    const labelled = el.labels && el.labels.length > 0;
    const imgAlt = el.querySelector && el.querySelector('img[alt]:not([alt=""]), svg[aria-label], [role=img][aria-label]');
    return !name && !labelled && !imgAlt;
  }).slice(0, 30).map(el => el.outerHTML.slice(0, 160));
  const imgsNoAlt = [...document.querySelectorAll('img:not([alt])')].filter(visible).slice(0, 30).map(i => i.getAttribute('src')?.slice(0, 120));
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(h => `${h.tagName.toLowerCase()}: ${h.innerText.trim().slice(0, 80)}`).slice(0, 60);
  const landmarks = [...document.querySelectorAll('header,nav,main,aside,footer,[role=banner],[role=navigation],[role=main],[role=complementary],[role=contentinfo],[role=search],form[aria-label],section[aria-label]')]
    .map(el => `${el.getAttribute('role') || el.tagName.toLowerCase()}${el.getAttribute('aria-label') ? ` "${el.getAttribute('aria-label')}"` : ''}`);
  return {
    viewportWidth: vw,
    documentScrollWidth: document.documentElement.scrollWidth,
    horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - vw),
    overflowingElements: overflowing,
    smallTargets, unnamedControls: unnamed, imagesWithoutAlt: imgsNoAlt,
    headings, h1Count: headings.filter(h => h.startsWith('h1')).length, landmarks,
    lang: document.documentElement.getAttribute('lang') || null,
    title: document.title,
  };
}

function focusSnapshot() {
  const el = document.activeElement;
  if (!el || el === document.body) return { el: 'body', visibleIndicator: false };
  const s = getComputedStyle(el);
  const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
  const shadow = s.boxShadow && s.boxShadow !== 'none';
  const r = el.getBoundingClientRect();
  const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
  return {
    el: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}`,
    text: (el.innerText || el.getAttribute('aria-label') || el.value || '').trim().slice(0, 40),
    visibleIndicator: outline || shadow,
    indicator: outline ? `outline ${s.outlineWidth} ${s.outlineStyle}` : shadow ? 'box-shadow' : 'none detected (check screenshot: may use border/background)',
    inViewport: r.bottom > 0 && r.top < innerHeight,
  };
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const url of urls) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: vp,
        colorScheme: one('--color-scheme', 'light'),
        reducedMotion: has('--reduced-motion') ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      const entry = { url, viewport: `${vp.width}x${vp.height}` };
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => page.goto(url, { waitUntil: 'load', timeout: 30000 }));
        await page.waitForTimeout(waitMs);
        const file = join(outDir, `${vp.width}-${slug(url)}.png`);
        await page.screenshot({ path: file, fullPage: has('--full-page') });
        entry.screenshot = file;
        entry.metrics = await page.evaluate(measure);
        const stops = [];
        for (let i = 0; i < tabs; i++) { await page.keyboard.press('Tab'); stops.push(await page.evaluate(focusSnapshot)); }
        entry.focusStops = stops;
        const firstFocus = stops.findIndex(s => s.el !== 'body');
        if (firstFocus >= 0) {
          await page.keyboard.press('Shift+Tab');
          for (let i = 0; i <= firstFocus; i++) await page.keyboard.press('Tab');
          const ff = join(outDir, `${vp.width}-${slug(url)}-focus.png`);
          await page.screenshot({ path: ff });
          entry.focusScreenshot = ff;
        }
      } catch (e) {
        entry.error = String(e?.message || e);
      }
      results.push(entry);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

writeFileSync(join(outDir, 'render-check.json'), JSON.stringify(results, null, 2));
const lines = ['# Render check', '', `Output: ${outDir}`, ''];
for (const r of results) {
  lines.push(`## ${r.url} @ ${r.viewport}`);
  if (r.error) { lines.push(`- ERROR: ${r.error}`, ''); continue; }
  const m = r.metrics;
  lines.push(`- Screenshot: ${r.screenshot}`);
  lines.push(`- Horizontal overflow: ${m.horizontalOverflowPx}px${m.overflowingElements.length ? ` — e.g. ${m.overflowingElements.slice(0, 5).map(o => `${o.el} (right ${o.right})`).join('; ')}` : ''}`);
  lines.push(`- Targets < 24px: ${m.smallTargets.length}${m.smallTargets.length ? ` — e.g. ${m.smallTargets.slice(0, 5).map(t => `${t.el} "${t.text}" ${t.size}`).join('; ')}` : ''}`);
  lines.push(`- Controls without accessible name (heuristic): ${m.unnamedControls.length}`);
  lines.push(`- Images without alt: ${m.imagesWithoutAlt.length}`);
  lines.push(`- h1 count: ${m.h1Count}; headings: ${m.headings.length}; landmarks: ${m.landmarks.join(', ') || 'none'}; lang: ${m.lang ?? 'missing'}`);
  const noInd = r.focusStops.filter(s => s.el !== 'body' && !s.visibleIndicator).length;
  lines.push(`- Tab stops checked: ${r.focusStops.length}; without detected outline/shadow: ${noInd} (verify visually in ${r.focusScreenshot ?? 'screenshots'})`);
  lines.push('');
}
lines.push('_Heuristic measurements. Confirm by viewing screenshots and the accessibility tree before reporting findings._');
console.log(lines.join('\n'));
