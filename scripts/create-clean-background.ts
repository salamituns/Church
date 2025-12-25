#!/usr/bin/env node

/**
 * Create Clean Background Image
 * 
 * Removes the person from the backup image to create a clean background
 * for compositing the new person image.
 */

import sharp from 'sharp';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const BACKUP_IMAGE = join(process.cwd(), 'public/images/AsstPastor_Olise.backup.webp');
const OUTPUT_BACKGROUND = join(process.cwd(), 'public/images/AsstPastor_Olise.backup.png');

/**
 * Smooth alpha channel using morphological operations for cleaner edges
 */
function smoothAlphaChannel(data: Buffer, width: number, height: number, iterations: number = 2): Buffer {
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

/**
 * Inpaint missing areas by averaging nearby background colors for smooth blending
 */
function inpaintBackground(data: Buffer, mask: Buffer, width: number, height: number): Buffer {
  const result = Buffer.from(data);
  const radius = 10; // Larger search radius for smoother results
  
  // First pass: identify all background pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // If this pixel is masked (person area), fill it
      if (mask[idx + 3] < 128) {
        // Collect background colors from surrounding area
        let bgRSum = 0, bgGSum = 0, bgBSum = 0;
        let bgCount = 0;
        const weights: number[] = [];
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const nIdx = (ny * width + nx) * 4;
              // If this neighbor is background (not masked)
              if (mask[nIdx + 3] > 128) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                const weight = 1 / (1 + dist * 0.5); // Weight by distance
                
                bgRSum += data[nIdx] * weight;
                bgGSum += data[nIdx + 1] * weight;
                bgBSum += data[nIdx + 2] * weight;
                weights.push(weight);
                bgCount++;
              }
            }
          }
        }
        
        // Average the background colors
        if (bgCount > 0) {
          const totalWeight = weights.reduce((a, b) => a + b, 0);
          result[idx] = Math.round(bgRSum / totalWeight);
          result[idx + 1] = Math.round(bgGSum / totalWeight);
          result[idx + 2] = Math.round(bgBSum / totalWeight);
        } else {
          // Fallback to white if no background found
          result[idx] = 255;
          result[idx + 1] = 255;
          result[idx + 2] = 255;
        }
        result[idx + 3] = 255; // Fully opaque
      } else {
        // Keep original background pixels
        result[idx] = data[idx];
        result[idx + 1] = data[idx + 1];
        result[idx + 2] = data[idx + 2];
        result[idx + 3] = 255;
      }
    }
  }
  
  // Second pass: smooth transitions at edges
  const smoothed = Buffer.from(result);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const wasMasked = mask[idx + 3] < 128;
      
      // If this was a masked pixel, smooth with neighbors
      if (wasMasked) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            rSum += result[nIdx];
            gSum += result[nIdx + 1];
            bSum += result[nIdx + 2];
            count++;
          }
        }
        
        smoothed[idx] = Math.round(rSum / count);
        smoothed[idx + 1] = Math.round(gSum / count);
        smoothed[idx + 2] = Math.round(bSum / count);
      }
    }
  }
  
  return smoothed;
}

async function main() {
  console.log('Creating clean background image...\n');

  // Step 1: Verify backup image exists
  if (!existsSync(BACKUP_IMAGE)) {
    throw new Error(`Backup image not found: ${BACKUP_IMAGE}`);
  }

  console.log('Loading original backup image...');
  const originalImage = sharp(BACKUP_IMAGE);
  const metadata = await originalImage.metadata();
  const width = metadata.width!;
  const height = metadata.height!;
  
  console.log(`Image dimensions: ${width}x${height}\n`);

  // Step 2: Load image data
  console.log('Analyzing image to detect person...');
  const { data, info } = await originalImage
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Step 3: Create mask to identify person vs background
  // Person characteristics: darker skin, clothing, hair
  // Background: light tiles, white surfaces, plants
  const mask = Buffer.alloc(data.length);
  let personPixels = 0;
  let backgroundPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = (r + g + b) / 3;
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;
    
    // Background characteristics:
    // - Very bright (white tiles, light surfaces)
    // - Medium brightness with high saturation (green plants)
    // - Light beige/tan (clock, surfaces)
    const isVeryBright = brightness > 200;
    const isLightSurface = brightness > 180 && saturation < 0.3;
    const isGreenPlant = g > r && g > b && g > 120 && saturation > 0.3;
    const isLightBeige = brightness > 150 && brightness < 200 && saturation < 0.2 && r > g && r > b;
    
    // Person characteristics:
    // - Dark skin/hair (low brightness)
    // - Dark clothing
    // - Medium brightness with specific color patterns (green headwrap, patterned clothing)
    // - Any green that's not plant-like (green headwrap is brighter and more saturated than plants)
    const isDarkPerson = brightness < 100;
    const isMediumDarkPerson = brightness < 140 && brightness > 100;
    const isGreenHeadwrap = g > 120 && g > r && g > b && saturation > 0.35 && brightness < 200;
    const isPatternedClothing = brightness < 160 && saturation > 0.25;
    // Detect person in center/right area (where person typically is in portrait)
    const isCenterRightArea = x > width * 0.3 && x < width * 0.9 && y > height * 0.1 && y < height * 0.9;
    const isPersonLikeColor = (brightness < 150 && saturation > 0.2) || 
                               (brightness < 180 && saturation > 0.4 && isCenterRightArea);
    
    let isPerson = false;
    if (isDarkPerson || isMediumDarkPerson) {
      isPerson = true;
    } else if (isGreenHeadwrap || isPatternedClothing) {
      isPerson = true;
    } else if (isPersonLikeColor && isCenterRightArea && !isGreenPlant && !isLightBeige) {
      // Additional check: if it's in the person area and not clearly background
      isPerson = true;
    }
    
    // Create mask: 0 = person (remove), 255 = background (keep)
    if (isPerson) {
      mask[i] = 0;
      mask[i + 1] = 0;
      mask[i + 2] = 0;
      mask[i + 3] = 0; // Transparent = person area
      personPixels++;
    } else {
      mask[i] = 255;
      mask[i + 1] = 255;
      mask[i + 2] = 255;
      mask[i + 3] = 255; // Opaque = background area
      backgroundPixels++;
    }
  }

  console.log(`Detected ${personPixels} person pixels, ${backgroundPixels} background pixels`);
  
  // Step 4: Smooth the mask for cleaner edges
  console.log('Smoothing mask edges...');
  const smoothedMask = smoothAlphaChannel(mask, width, height, 3);
  
  // Step 5: Inpaint the person area with background colors
  console.log('Filling person area with background colors...');
  const cleanedData = inpaintBackground(data, smoothedMask, width, height);
  
  // Step 6: Create final image
  console.log('Creating clean background image...');
  const cleanBackground = sharp(cleanedData, {
    raw: {
      width: width,
      height: height,
      channels: 4
    }
  });

  // Step 7: Save the clean background
  await cleanBackground
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUTPUT_BACKGROUND);

  console.log(`✓ Clean background created successfully!`);
  console.log(`  File: ${OUTPUT_BACKGROUND}`);
  console.log(`  Dimensions: ${width}x${height}`);
  console.log(`\nYou can now run 'npm run composite-pastor' to use this clean background.\n`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

