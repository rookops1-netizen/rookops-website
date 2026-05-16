#!/usr/bin/env node
/**
 * Link Instagram to Facebook Page using the user's existing Chrome session.
 * Opens Facebook Settings → Instagram → Connect.
 */
const { chromium } = require('playwright');
const path = require('path');

const CHROME_PROFILE = path.join(process.env.HOME, 'Library', 'Application Support', 'Google', 'Chrome');

async function main() {
  console.log('🌐 Opening Facebook with your Chrome profile...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--profile-directory=Default'],
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });

  // Navigate to Facebook Page settings
  const page = await context.newPage();
  console.log('📱 Navigating to Page settings...');
  await page.goto('https://www.facebook.com/profile.php?id=61572338206135/settings/');
  await page.waitForTimeout(3000);
  
  console.log('✅ Browser is open. If you see the page settings, look for "Instagram" in the left sidebar and click "Connect".');
  console.log('⏳ Waiting for you to finish... Press ENTER in this terminal when done.');
  
  // Wait for user input
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('', async () => {
    await browser.close();
    console.log('✅ Done!');
    process.exit(0);
  });
}

main().catch(console.error);