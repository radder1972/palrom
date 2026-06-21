const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, '../public/images');

async function optimize() {
  try {
    const sawmillSrc = path.join(imagesDir, 'sawmill.png');
    const sawmillDest = path.join(imagesDir, 'sawmill.webp');
    console.log(`Optimizing sawmill.png...`);
    await sharp(sawmillSrc)
      .webp({ quality: 80 })
      .toFile(sawmillDest);
    console.log(`Saved optimized sawmill.webp: ${fs.statSync(sawmillDest).size} bytes (original: ${fs.statSync(sawmillSrc).size} bytes)`);

    const heroSrc = path.join(imagesDir, 'hero_bg.jpg');
    const heroDest = path.join(imagesDir, 'hero_bg.webp');
    console.log(`Optimizing hero_bg.jpg...`);
    await sharp(heroSrc)
      .webp({ quality: 80 })
      .toFile(heroDest);
    console.log(`Saved optimized hero_bg.webp: ${fs.statSync(heroDest).size} bytes (original: ${fs.statSync(heroSrc).size} bytes)`);
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
}

optimize();
