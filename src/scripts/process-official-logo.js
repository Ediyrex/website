const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_IMAGE = 'C:/Users/dasgy/.gemini/antigravity/brain/38c339c4-64e8-456f-b59a-94860f4eaec6/.user_uploaded/media_1794988460636_a3fa972f.png';
const LOGO_DIR = 'public/images/logo';

async function main() {
  if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true });
  }

  // 1. Copy original source
  fs.copyFileSync(SOURCE_IMAGE, path.join(LOGO_DIR, 'ediyrex-logo-original.png'));
  console.log('Saved ediyrex-logo-original.png');

  // 2. Full trimmed logo (emblem + text)
  const fullTrimmed = await sharp(SOURCE_IMAGE)
    .extract({ left: 30, top: 70, width: 430, height: 320 })
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(LOGO_DIR, 'ediyrex-logo.png'), fullTrimmed);
  console.log('Saved ediyrex-logo.png');

  // 3. Standalone 3D Emblem (extract rows 70 to 295, width 240, centered)
  const emblemOnly = await sharp(SOURCE_IMAGE)
    .extract({ left: 120, top: 75, width: 235, height: 220 })
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(LOGO_DIR, 'ediyrex-emblem.png'), emblemOnly);
  console.log('Saved ediyrex-emblem.png');

  // 4. Standalone Wordmark (extract rows 315 to 390, width 425)
  const wordmarkOnly = await sharp(SOURCE_IMAGE)
    .extract({ left: 32, top: 315, width: 422, height: 72 })
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(LOGO_DIR, 'ediyrex-wordmark.png'), wordmarkOnly);
  console.log('Saved ediyrex-wordmark.png');

  // 5. Square 512x512 emblem icon for web app & manifest
  const emblemSquare512 = await sharp(emblemOnly)
    .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 56,
      bottom: 56,
      left: 56,
      right: 56,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(LOGO_DIR, 'ediyrex-emblem-512.png'), emblemSquare512);
  fs.writeFileSync('public/icon.png', emblemSquare512);
  console.log('Saved ediyrex-emblem-512.png and public/icon.png');

  // 6. 192x192 PWA icon
  const emblem192 = await sharp(emblemSquare512).resize(192, 192).toBuffer();
  fs.writeFileSync(path.join(LOGO_DIR, 'ediyrex-emblem-192.png'), emblem192);

  // 7. 180x180 Apple touch icon
  const emblem180 = await sharp(emblemSquare512).resize(180, 180).toBuffer();
  fs.writeFileSync('public/apple-icon.png', emblem180);

  // 8. 32x32 Favicon
  const favicon32 = await sharp(emblemSquare512).resize(32, 32).toBuffer();
  fs.writeFileSync(path.join(LOGO_DIR, 'ediyrex-emblem-32.png'), favicon32);
  fs.writeFileSync('public/favicon.ico', favicon32);
  console.log('Saved favicon.ico and apple-icon.png');

  console.log('All official EDYREX logo assets processed successfully!');
}

main().catch(err => {
  console.error('Processing failed:', err);
  process.exit(1);
});
