#!/usr/bin/env node

/**
 * Replace Assistant Pastor Image
 * 
 * Converts and replaces the Assistant Pastor image with the new one.
 */

import sharp from 'sharp';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const NEW_IMAGE = join(process.cwd(), 'public/images/new_AssistantPastor.jpg');
const BACKUP_IMAGE = join(process.cwd(), 'public/images/AsstPastor_Olise.backup.webp');
const OUTPUT_IMAGE = join(process.cwd(), 'public/images/AsstPastor_Olise.webp');

async function main() {
  console.log('Replacing Assistant Pastor image...\n');

  // Verify new image exists
  if (!existsSync(NEW_IMAGE)) {
    throw new Error(`New image not found: ${NEW_IMAGE}`);
  }

  // Backup current image if it exists and backup doesn't
  if (existsSync(OUTPUT_IMAGE) && !existsSync(BACKUP_IMAGE)) {
    console.log('Backing up current image...');
    copyFileSync(OUTPUT_IMAGE, BACKUP_IMAGE);
    console.log(`✓ Backup created: ${BACKUP_IMAGE}\n`);
  }

  // Convert and save new image
  console.log('Converting new image to WebP format...');
  await sharp(NEW_IMAGE)
    .webp({ quality: 90 })
    .toFile(OUTPUT_IMAGE);

  const metadata = await sharp(OUTPUT_IMAGE).metadata();
  console.log(`✓ Image replaced successfully!`);
  console.log(`  File: ${OUTPUT_IMAGE}`);
  console.log(`  Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`  Format: ${metadata.format}\n`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

