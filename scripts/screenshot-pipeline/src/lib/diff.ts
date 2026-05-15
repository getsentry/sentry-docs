/**
 * Image Diffing Module
 *
 * Wraps pixelmatch to compare existing screenshots against new captures.
 * Supports ignore regions to mask dynamic content areas (nav bars, etc.).
 */

import * as fs from 'fs';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import {IgnoreRegion} from './types';

export interface DiffOptions {
  /** Regions to mask/ignore during comparison */
  ignoreRegions?: IgnoreRegion[];
  /** pixelmatch threshold (0-1, lower = more sensitive, default: 0.1) */
  threshold?: number;
  /** Whether to generate a diff visualization image */
  generateDiffImage?: boolean;
}

export interface DiffOutput {
  /** Percentage of pixels that differ (0.0 - 1.0) */
  diffPct: number;
  /** Absolute count of changed pixels */
  changedPixels: number;
  /** Total pixel count compared */
  totalPixels: number;
  /** Path to diff visualization image (if generated) */
  diffImagePath: string | null;
}

/**
 * Compare two PNG images and compute pixel diff percentage.
 *
 * If the images are different sizes, the new image is resized to match
 * the old image dimensions before comparison. If resize is not possible,
 * the diff is set to 100%.
 *
 * @param existingImagePath Path to the current/existing screenshot
 * @param newCapturePath Path to the newly captured screenshot
 * @param diffOutputPath Path where the diff visualization should be saved (optional)
 * @param options Diff configuration options
 */
export async function computeDiff(
  existingImagePath: string,
  newCapturePath: string,
  diffOutputPath: string | null = null,
  options: DiffOptions = {}
): Promise<DiffOutput> {
  const {ignoreRegions = [], threshold = 0.1, generateDiffImage = false} = options;

  // Read both images
  const existingPng = readPng(existingImagePath);
  let newPng = readPng(newCapturePath);

  // Handle size mismatch by resizing the new capture to match the existing dimensions
  if (existingPng.width !== newPng.width || existingPng.height !== newPng.height) {
    console.log(
      `  Resizing capture: ${newPng.width}x${newPng.height} -> ${existingPng.width}x${existingPng.height}`
    );
    try {
      const resizedBuffer = await sharp(newCapturePath)
        .resize(existingPng.width, existingPng.height, {fit: 'cover', position: 'top'})
        .png()
        .toBuffer();
      // Overwrite the capture with the resized version
      fs.writeFileSync(newCapturePath, resizedBuffer);
      newPng = PNG.sync.read(resizedBuffer);
    } catch (err) {
      console.warn(`  Could not resize: ${err}. Treating as 100% diff.`);
      return {
        diffPct: 1.0,
        changedPixels: existingPng.width * existingPng.height,
        totalPixels: existingPng.width * existingPng.height,
        diffImagePath: null,
      };
    }
  }

  const {width, height} = existingPng;
  const totalPixels = width * height;

  // Apply ignore region masking
  // We mask by painting both images the same color in those regions
  const existingData = Buffer.from(existingPng.data);
  const newData = Buffer.from(newPng.data);

  for (const region of ignoreRegions) {
    maskRegion(existingData, width, height, region);
    maskRegion(newData, width, height, region);
  }

  // Create diff output buffer
  const shouldGenerateDiff = generateDiffImage && diffOutputPath;
  const diffData = shouldGenerateDiff ? new PNG({width, height}) : null;

  // Run pixelmatch
  const changedPixels = pixelmatch(
    existingData,
    newData,
    diffData?.data ?? null,
    width,
    height,
    {threshold, alpha: 0.3, diffColor: [255, 0, 0], diffColorAlt: [0, 255, 0]}
  );

  const diffPct = changedPixels / totalPixels;

  // Save diff image if requested
  let savedDiffPath: string | null = null;
  if (diffData && diffOutputPath) {
    const buffer = PNG.sync.write(diffData);
    fs.writeFileSync(diffOutputPath, buffer);
    savedDiffPath = diffOutputPath;
  }

  return {
    diffPct,
    changedPixels,
    totalPixels,
    diffImagePath: savedDiffPath,
  };
}

/**
 * Read a PNG file and return parsed data.
 */
function readPng(filePath: string): PNG {
  const buffer = fs.readFileSync(filePath);
  return PNG.sync.read(buffer);
}

/**
 * Paint a rectangular region with a uniform gray color in the image data buffer.
 * This effectively masks the region so pixelmatch ignores it.
 */
function maskRegion(
  data: Buffer,
  imgWidth: number,
  imgHeight: number,
  region: IgnoreRegion
): void {
  const {x, y, width, height} = region;
  const maskColor = {r: 128, g: 128, b: 128, a: 255};

  for (let row = y; row < Math.min(y + height, imgHeight); row++) {
    for (let col = x; col < Math.min(x + width, imgWidth); col++) {
      const idx = (row * imgWidth + col) * 4;
      data[idx] = maskColor.r;
      data[idx + 1] = maskColor.g;
      data[idx + 2] = maskColor.b;
      data[idx + 3] = maskColor.a;
    }
  }
}
