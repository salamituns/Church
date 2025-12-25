#!/usr/bin/env node

/**
 * Composite Assistant Pastor Image
 * 
 * Replaces the person in the existing Assistant Pastor image with a new image
 * while preserving the original background.
 */

import sharp from 'sharp';
import { existsSync, copyFileSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';

const ORIGINAL_IMAGE = join(process.cwd(), 'public/images/AsstPastor_Olise.webp');
const NEW_IMAGE = join(process.cwd(), 'public/images/new_AssistantPastor.jpg');
const NEW_IMAGE_PNG = join(process.cwd(), 'public/images/new_AssistantPastor.png');
// Check for common remove.bg naming patterns
const NEW_IMAGE_PNG_ALT1 = join(process.cwd(), 'public/images/new_AssistantPastor-removebg-preview.png');
const NEW_IMAGE_PNG_ALT2 = join(process.cwd(), 'public/images/new_AssistantPastor-removebg.png');
const BACKGROUND_PNG = join(process.cwd(), 'public/images/AsstPastor_Olise.backup.png');
const BACKUP_IMAGE = join(process.cwd(), 'public/images/AsstPastor_Olise.backup.webp');
const TEMP_OUTPUT = join(process.cwd(), 'public/images/AsstPastor_Olise.temp.webp');
const OUTPUT_IMAGE = ORIGINAL_IMAGE;

/**
 * Smooth alpha channel using morphological operations for cleaner edges
 */
function smoothAlphaChannel(data: Buffer, width: number, height: number, iterations: number = 1): Buffer {
  let result = Buffer.from(data);
  
  for (let iter = 0; iter < iterations; iter++) {
    const smoothed = Buffer.from(result);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Get average alpha of 3x3 neighborhood
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            sum += result[nIdx + 3];
          }
        }
        
        smoothed[idx + 3] = Math.round(sum / 9);
      }
    }
    
    result = smoothed;
  }
  
  return result;
}

async function main() {
  console.log('Starting image compositing process...\n');

  // Step 1: Verify files exist
  if (!existsSync(ORIGINAL_IMAGE)) {
    throw new Error(`Original image not found: ${ORIGINAL_IMAGE}`);
  }
  if (!existsSync(NEW_IMAGE)) {
    throw new Error(`New image not found: ${NEW_IMAGE}`);
  }

  // Step 2: Backup original image
  console.log('Backing up original image...');
  if (!existsSync(BACKUP_IMAGE)) {
    copyFileSync(ORIGINAL_IMAGE, BACKUP_IMAGE);
    console.log(`✓ Backup created: ${BACKUP_IMAGE}\n`);
  } else {
    console.log(`✓ Backup already exists: ${BACKUP_IMAGE}\n`);
  }

  // Step 3: Load background image (check for pre-processed PNG first)
  console.log('Loading background image...');
  
  let backgroundImage: sharp.Sharp;
  let originalWidth: number;
  let originalHeight: number;
  
  // Check if there's a pre-processed background PNG (person removed, background only)
  if (existsSync(BACKGROUND_PNG)) {
    console.log('✓ Found pre-processed background PNG - cleaning up dark shadows only...\n');
    
    // Load and process background to remove only very dark shadows (not flowers)
    const { data: bgData, info: bgInfo } = await sharp(BACKGROUND_PNG)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const cleanedBgData = Buffer.from(bgData);
    
    // Remove only very dark shadows while preserving colorful flowers
    // Flowers are bright and colorful, shadows are dark and desaturated
    for (let i = 0; i < bgData.length; i += 4) {
      const r = bgData[i];
      const g = bgData[i + 1];
      const b = bgData[i + 2];
      const alpha = bgData[i + 3];
      
      // Only process visible pixels
      if (alpha > 0) {
        const brightness = (r + g + b) / 3;
        const maxChannel = Math.max(r, g, b);
        const minChannel = Math.min(r, g, b);
        const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;
        
        // Shadows are: very dark (brightness < 100) AND low saturation (grayish)
        // Flowers are: bright OR colorful (high saturation)
        const isDarkShadow = brightness < 100 && saturation < 0.2;
        const isMediumShadow = brightness < 150 && saturation < 0.15 && brightness > 100;
        
        if (isDarkShadow) {
          // Very dark shadow - replace with white
          cleanedBgData[i] = 255;
          cleanedBgData[i + 1] = 255;
          cleanedBgData[i + 2] = 255;
          cleanedBgData[i + 3] = 255;
        } else if (isMediumShadow) {
          // Medium shadow - lighten towards white but preserve some color
          const lightenFactor = (150 - brightness) / 50; // 0 to 1
          cleanedBgData[i] = Math.min(255, Math.round(r + (255 - r) * lightenFactor * 0.5));
          cleanedBgData[i + 1] = Math.min(255, Math.round(g + (255 - g) * lightenFactor * 0.5));
          cleanedBgData[i + 2] = Math.min(255, Math.round(b + (255 - b) * lightenFactor * 0.5));
          cleanedBgData[i + 3] = 255;
        } else {
          // Keep original (flowers, white background, etc.)
          cleanedBgData[i] = r;
          cleanedBgData[i + 1] = g;
          cleanedBgData[i + 2] = b;
          cleanedBgData[i + 3] = alpha;
        }
      } else {
        // Keep transparent pixels as-is
        cleanedBgData[i] = r;
        cleanedBgData[i + 1] = g;
        cleanedBgData[i + 2] = b;
        cleanedBgData[i + 3] = alpha;
      }
    }
    
    backgroundImage = sharp(cleanedBgData, {
      raw: {
        width: bgInfo.width,
        height: bgInfo.height,
        channels: 4
      }
    });
    
    originalWidth = bgInfo.width;
    originalHeight = bgInfo.height;
    console.log(`Background dimensions: ${originalWidth}x${originalHeight}`);
    console.log('✓ Dark shadows removed, flowers preserved\n');
  } else {
    // Use the original backup image directly as background
    // The new person will be composited on top, covering the old person
    console.log('Using original backup image as background...');
    console.log('   The new person will be composited on top\n');
    
    backgroundImage = sharp(BACKUP_IMAGE);
    const originalMetadata = await backgroundImage.metadata();
    originalWidth = originalMetadata.width!;
    originalHeight = originalMetadata.height!;
    
    console.log(`Background dimensions: ${originalWidth}x${originalHeight}`);
    console.log('✓ Using original background\n');
  }

  // Step 4: Load the new person image (check for PNG with transparency first)
  console.log('Loading new person image...');
  
  let personImage: sharp.Sharp;
  
  // Check for pre-processed PNG files (try multiple naming patterns)
  const personPngPath = existsSync(NEW_IMAGE_PNG) ? NEW_IMAGE_PNG :
                        existsSync(NEW_IMAGE_PNG_ALT1) ? NEW_IMAGE_PNG_ALT1 :
                        existsSync(NEW_IMAGE_PNG_ALT2) ? NEW_IMAGE_PNG_ALT2 : null;
  
  if (personPngPath) {
    console.log(`✓ Found pre-processed person PNG - using for clean results!`);
    console.log(`  Using: ${personPngPath}\n`);
    personImage = sharp(personPngPath);
  } else if (existsSync(NEW_IMAGE)) {
    console.log('⚠ JPEG image found. Automatic background removal will be used.');
    console.log('   For PERFECT results, please create a PNG with transparent background:');
    console.log('   1. Go to https://www.remove.bg');
    console.log('   2. Upload new_AssistantPastor.jpg');
    console.log('   3. Download and save as new_AssistantPastor.png');
    console.log('   4. Run this script again\n');
    console.log('   Attempting automatic extraction (may not be perfect)...\n');
    
    // Extract person from new image (remove colorful floral background)
    // Background is pink/orange flowers, person is less saturated
    const { data, info } = await sharp(NEW_IMAGE)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    let processedData = Buffer.alloc(data.length);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const brightness = (r + g + b) / 3;
      const maxChannel = Math.max(r, g, b);
      const minChannel = Math.min(r, g, b);
      const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;
      
      // Floral background characteristics:
      // - High saturation (colorful pink/orange flowers)
      // - Medium to high brightness
      // - Pink/orange colors (high red, medium green, low blue)
      const isPinkOrange = r > 150 && r > g && (r - b) > 40; // Pink/orange tones
      const isFloralBackground = saturation > 0.3 && brightness > 100 && isPinkOrange;
      
      // Person characteristics:
      // - Lower saturation (skin, clothing)
      // - Or darker areas (hair, shadows)
      // - Blue clothing (royal blue blazer)
      const isPerson = brightness < 100 || // Dark areas (hair, shadows)
                       saturation < 0.25 || // Low saturation (skin, neutral colors)
                       (b > r && b > g && b > 120); // Blue clothing
      
      // Create soft alpha edges for smoother transitions
      let alpha = 0;
      if (isPerson) {
        alpha = 255; // Definitely person
      } else if (isFloralBackground) {
        alpha = 0; // Definitely background
      } else {
        // Edge case - use gradient based on how "person-like" it is
        const personScore = Math.max(0, Math.min(1, (0.25 - saturation) / 0.1));
        alpha = Math.round(255 * personScore);
      }
      
      processedData[i] = r;
      processedData[i + 1] = g;
      processedData[i + 2] = b;
      processedData[i + 3] = alpha;
    }
    
    // Smooth the alpha channel for cleaner edges
    console.log('Smoothing person edges...');
    processedData = smoothAlphaChannel(processedData, info.width, info.height, 2);
    
    // Create new image with alpha channel
    personImage = sharp(processedData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    });
    console.log('✓ Person extracted from floral background\n');
  } else {
    throw new Error(`Neither ${NEW_IMAGE} nor ${NEW_IMAGE_PNG} found`);
  }

  // Step 5: Process the person image
  console.log('Processing person image...');
  const personMetadata = await personImage.metadata();
  const personWidth = personMetadata.width!;
  const personHeight = personMetadata.height!;
  
  console.log(`Person image dimensions: ${personWidth}x${personHeight}`);

  // Calculate scaling to ensure new person covers the old person completely
  // Use 'cover' mode to fill the canvas while maintaining aspect ratio
  // This ensures the person covers the entire area where the old person was
  const scale = Math.max(originalWidth / personWidth, originalHeight / personHeight);
  const scaledWidth = Math.round(personWidth * scale);
  const scaledHeight = Math.round(personHeight * scale);
  
  // Center the person horizontally and vertically
  const leftOffset = Math.round((originalWidth - scaledWidth) / 2);
  const topOffset = Math.round((originalHeight - scaledHeight) / 2);

  console.log(`Scaling to cover canvas: ${originalWidth}x${originalHeight}`);
  console.log(`Using 'cover' mode to ensure full coverage\n`);

  // Step 6: Resize the person image to ensure complete coverage
  // Scale significantly larger than canvas, then extract center portion to ensure person covers entire area
  const overscale = 1.3; // Scale to 130% to ensure complete coverage including edges
  const scaledW = Math.round(originalWidth * overscale);
  const scaledH = Math.round(originalHeight * overscale);
  
  let resizedPersonBuffer = await personImage
    .resize(scaledW, scaledH, {
      fit: 'cover',
      position: 'center',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3'
    })
    .extract({
      left: Math.round((scaledW - originalWidth) / 2),
      top: Math.round((scaledH - originalHeight) / 2),
      width: originalWidth,
      height: originalHeight
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Ensure all non-transparent pixels have fully opaque alpha for complete coverage
  const { data, info } = resizedPersonBuffer;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) {
      // Make any semi-transparent pixel fully opaque
      data[i] = 255;
    }
  }
  
  const resizedPerson = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  // Step 7: Composite the new person onto the extracted background
  console.log('Compositing new person onto extracted background...');
  
  const compositeOptions = {
    input: resizedPerson,
    left: 0,
    top: 0,
    blend: 'over' as const
  };

  // Write to temp file first
  await backgroundImage
    .png() // Ensure background is in proper format
    .composite([compositeOptions])
    .webp({ quality: 90 })
    .toFile(TEMP_OUTPUT);

  // Replace original with composited image
  if (existsSync(OUTPUT_IMAGE)) {
    unlinkSync(OUTPUT_IMAGE);
  }
  renameSync(TEMP_OUTPUT, OUTPUT_IMAGE);

  console.log('✓ Image composited successfully\n');

  // Step 8: Verify output
  const outputMetadata = await sharp(OUTPUT_IMAGE).metadata();
  const fileStats = await import('fs/promises').then(fs => fs.stat(OUTPUT_IMAGE));
  console.log('Output image details:');
  console.log(`  File: ${OUTPUT_IMAGE}`);
  console.log(`  Dimensions: ${outputMetadata.width}x${outputMetadata.height}`);
  console.log(`  Format: ${outputMetadata.format}`);
  console.log(`  Size: ${(fileStats.size / 1024).toFixed(2)} KB\n`);

  console.log('✓ Process completed successfully!');
  console.log(`\nNote: Original image backed up to: ${BACKUP_IMAGE}`);
  console.log('\n💡 TIP: For perfect results, use remove.bg to create PNG files with');
  console.log('   transparent backgrounds. See scripts/BACKGROUND_REMOVAL_GUIDE.md');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

