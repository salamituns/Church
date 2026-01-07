#!/usr/bin/env node

/**
 * Generate Favicon Files
 * 
 * Creates optimized square favicon files from the church logo
 * for use in browser tabs, bookmarks, and mobile home screens.
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOGO_PATH = join(process.cwd(), 'public/images/Chruch_logo-shilo2-1-427x213.webp');
const APP_DIR = join(process.cwd(), 'app');
const PUBLIC_DIR = join(process.cwd(), 'public');

// Favicon sizes needed
const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-icon.png' }, // Apple touch icon
  { size: 192, name: 'android-chrome-192x192.png' }, // Android
  { size: 512, name: 'android-chrome-512x512.png' }, // Android
];

async function generateFavicon() {
  console.log('🎨 Generating favicon files from logo...\n');

  // Check if logo exists
  if (!existsSync(LOGO_PATH)) {
    console.error(`❌ Logo not found at: ${LOGO_PATH}`);
    process.exit(1);
  }

  try {
    // Load the logo image
    const image = sharp(LOGO_PATH);
    const metadata = await image.metadata();
    
    console.log(`📐 Original logo dimensions: ${metadata.width}x${metadata.height}`);

    // Process each favicon size
    for (const { size, name } of FAVICON_SIZES) {
      console.log(`  Creating ${name} (${size}x${size})...`);

      // Create square version by:
      // 1. Resizing to fit within square while maintaining aspect ratio
      // 2. Adding transparent padding to make it square
      // 3. Centering the logo
      
      const outputPath = join(APP_DIR, name);
      
      await image
        .clone()
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);

      console.log(`    ✅ Created: ${outputPath}`);
    }

    // Also create a standard favicon.ico (Next.js will use this automatically)
    console.log(`  Creating favicon.ico...`);
    const faviconPath = join(APP_DIR, 'favicon.ico');
    
    // Create a 32x32 ICO file
    await image
      .clone()
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));

    // For ICO format, we'll create a PNG and Next.js will handle it
    // Next.js 13+ supports icon.png/icon.ico in app directory
    const iconPath = join(APP_DIR, 'icon.png');
    await image
      .clone()
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(iconPath);
    
    console.log(`    ✅ Created: ${iconPath}`);

    // Create apple-icon.png (Next.js convention)
    const appleIconPath = join(APP_DIR, 'apple-icon.png');
    await image
      .clone()
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(appleIconPath);
    
    console.log(`    ✅ Created: ${appleIconPath}`);

    console.log('\n✨ Favicon generation complete!');
    console.log('\n📝 Next.js will automatically use:');
    console.log('   - app/icon.png (main favicon)');
    console.log('   - app/apple-icon.png (Apple touch icon)');
    console.log('\n💡 You may need to clear your browser cache to see the new favicon.');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicon();
