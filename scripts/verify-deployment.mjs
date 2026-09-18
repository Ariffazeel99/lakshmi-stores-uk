#!/usr/bin/env node
/**
 * Automated Playwright Headless Verification Suite for Deployments
 * 
 * Scans all images across desktop & mobile viewports, modals, and product shelves.
 * Fails the deployment build (exit code 1) if any broken or unrendered images are detected.
 */

import { chromium } from 'playwright';
import http from 'http';
import https from 'https';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Resolve target URL
let targetUrl = process.env.TARGET_URL || process.env.DEPLOYMENT_URL || process.env.VERCEL_URL || 'http://localhost:3000';
if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
  targetUrl = `https://${targetUrl}`;
}

async function isServerReachable(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const client = u.protocol === 'https:' ? https : http;
      const req = client.request(
        {
          hostname: u.hostname,
          port: u.port || (u.protocol === 'https:' ? 443 : 80),
          path: '/',
          method: 'HEAD',
          timeout: 4000,
        },
        (res) => {
          resolve(res.statusCode >= 200 && res.statusCode < 400);
        }
      );
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function main() {
  console.log('\n======================================================');
  console.log('🔍 PRE-DEPLOYMENT VERIFICATION: Playwright Image Suite');
  console.log('======================================================');
  console.log(`Target URL: ${targetUrl}`);

  let spawnedServer = null;
  const isReachable = await isServerReachable(targetUrl);

  if (!isReachable) {
    if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
      console.log('⚠️  Local server not currently running. Starting temporary Next.js instance on port 3000...');
      const isWindows = process.platform === 'win32';
      const cmd = isWindows ? 'npx.cmd' : 'npx';
      
      spawnedServer = spawn(cmd, ['next', 'start', '-p', '3000'], {
        stdio: 'ignore',
        detached: false,
      });

      // Wait up to 15s for server to become reachable
      let ready = false;
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        if (await isServerReachable(targetUrl)) {
          ready = true;
          break;
        }
      }

      if (!ready) {
        console.log('Next.js start fallback: Trying next dev on port 3000...');
        if (spawnedServer) spawnedServer.kill();
        spawnedServer = spawn(cmd, ['next', 'dev', '-p', '3000'], {
          stdio: 'ignore',
          detached: false,
        });
        for (let i = 0; i < 20; i++) {
          await new Promise((r) => setTimeout(r, 1000));
          if (await isServerReachable(targetUrl)) {
            ready = true;
            break;
          }
        }
      }

      if (!ready) {
        console.error('❌ Could not start a local test server for Playwright verification.');
        process.exit(1);
      }
    } else {
      console.error(`❌ Target remote URL ${targetUrl} is not reachable.`);
      process.exit(1);
    }
  }

  console.log('🚀 Launching headless Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  let totalTested = 0;
  let totalFailed = 0;
  const failures = [];

  try {
    // ----------------------------------------------------
    // TEST 1: Desktop Viewport (1280x800)
    // ----------------------------------------------------
    console.log('\n[1/3] Testing Desktop Viewport (1280x800)...');
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await desktopPage.waitForTimeout(2000);

    // Scroll down gradually to trigger lazy-loaded images
    await desktopPage.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    await desktopPage.waitForTimeout(1500);

    const desktopResults = await desktopPage.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt || '(No alt text)',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
      }));
    });

    desktopResults.forEach((img) => {
      totalTested++;
      if (!img.complete || img.naturalWidth === 0) {
        totalFailed++;
        failures.push({ viewport: 'Desktop 1280x800', ...img });
      }
    });
    console.log(`      Found ${desktopResults.length} images on desktop homepage.`);
    await desktopContext.close();

    // ----------------------------------------------------
    // TEST 2: Mobile Viewport (375x667 iPhone)
    // ----------------------------------------------------
    console.log('\n[2/3] Testing Mobile Viewport (375x667 Mobile)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await mobilePage.waitForTimeout(2000);

    // Scroll to categories and shelves on mobile
    await mobilePage.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 120);
      });
    });

    await mobilePage.waitForTimeout(1500);

    const mobileResults = await mobilePage.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt || '(No alt text)',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
      }));
    });

    mobileResults.forEach((img) => {
      totalTested++;
      if (!img.complete || img.naturalWidth === 0) {
        totalFailed++;
        failures.push({ viewport: 'Mobile 375x667', ...img });
      }
    });
    console.log(`      Found ${mobileResults.length} images on mobile layout.`);
    await mobileContext.close();

    // ----------------------------------------------------
    // TEST 3: Interactive Search Modal & Quick View
    // ----------------------------------------------------
    console.log('\n[3/3] Testing Modals & Dynamic Overlays...');
    const modalContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const modalPage = await modalContext.newPage();
    await modalPage.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await modalPage.waitForTimeout(1000);

    // Test Search Modal by clicking search input trigger
    const searchTrigger = modalPage.locator('input[placeholder*="Search Sona Masoori"]').first();
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();
      await modalPage.waitForTimeout(800);
      const searchImgs = await modalPage.evaluate(() => {
        const modal = document.querySelector('.fixed.z-50');
        if (!modal) return [];
        return Array.from(modal.querySelectorAll('img')).map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
        }));
      });

      searchImgs.forEach((img) => {
        totalTested++;
        if (!img.complete || img.naturalWidth === 0) {
          totalFailed++;
          failures.push({ viewport: 'Search Modal', ...img });
        }
      });
      console.log(`      Verified ${searchImgs.length} images inside Search Modal.`);

      // Close modal explicitly by clicking ESC button or pressing Escape
      const escBtn = modalPage.locator('button:has-text("ESC")').first();
      if (await escBtn.isVisible()) {
        await escBtn.click();
      } else {
        await modalPage.keyboard.press('Escape');
      }
      await modalPage.waitForTimeout(600);
    }

    // Test Quick View Modal by clicking a product card in curated shelves
    const firstProduct = modalPage.locator('#curated-shelves .group .aspect-square').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.scrollIntoViewIfNeeded();
      await modalPage.waitForTimeout(400);
      await firstProduct.click({ force: true });
      await modalPage.waitForTimeout(800);
      const qvImgs = await modalPage.evaluate(() => {
        const modal = document.querySelector('.fixed.z-50');
        if (!modal) return [];
        return Array.from(modal.querySelectorAll('img')).map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
        }));
      });

      qvImgs.forEach((img) => {
        totalTested++;
        if (!img.complete || img.naturalWidth === 0) {
          totalFailed++;
          failures.push({ viewport: 'Quick View Modal', ...img });
        }
      });
      console.log(`      Verified ${qvImgs.length} images inside Quick View Modal.`);
    }

    await modalContext.close();

  } finally {
    await browser.close();
    if (spawnedServer) {
      console.log('🧹 Stopping temporary test server...');
      spawnedServer.kill();
    }
  }

  // ----------------------------------------------------
  // REPORTING & VERDICT
  // ----------------------------------------------------
  console.log('\n======================================================');
  console.log('📊 VERIFICATION SUMMARY:');
  console.log(`   Total Image Checks Performed: ${totalTested}`);
  console.log(`   Successfully Loaded & Rendered: ${totalTested - totalFailed}`);
  console.log(`   Broken / Unrendered Images:     ${totalFailed}`);
  console.log('======================================================');

  if (totalFailed > 0) {
    console.error('\n❌ VERIFICATION FAILED: The following images failed to load:');
    console.table(failures);
    console.error('\nDeployment aborted. Please fix broken images before proceeding.\n');
    process.exit(1);
  } else {
    console.log('\n✅ VERIFICATION PASSED: All images rendered with 100% success rate!');
    console.log('🚀 Ready for production deployment.\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
