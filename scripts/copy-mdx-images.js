const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PUBLIC_MDX_IMAGES = path.join(__dirname, '..', 'public', 'mdx-images');

function encodeImagePath(mdxFile, imagePath) {
  // Get the absolute path to the image
  const mdxDir = path.dirname(mdxFile);
  const absImagePath = path.resolve(mdxDir, imagePath);
  // Get the path relative to the docs root
  let relPath = path.relative(DOCS_DIR, absImagePath);
  // Replace path separators with dashes
  relPath = relPath.replace(/[\\/]/g, '-');
  return relPath;
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
}

function copyImages() {
  ensureDirExists(PUBLIC_MDX_IMAGES);

  // Find all MDX files in docs/
  const mdxFiles = glob.sync(path.join(DOCS_DIR, '**/*.mdx'));
  console.log(`Found ${mdxFiles.length} MDX files`);

  // Match both ./img/ and ../img/ patterns
  const imageRegex = /!\[[^\]]*\]\((\.\.?\/img\/[^")]+)\)/g;

  let copied = 0;
  mdxFiles.forEach(mdxFile => {
    const content = fs.readFileSync(mdxFile, 'utf8');
    const matches = [...content.matchAll(imageRegex)];
    for (const match of matches) {
      const imagePath = match[1];
      const encodedName = encodeImagePath(mdxFile, imagePath);
      const src = path.resolve(path.dirname(mdxFile), imagePath);
      const dest = path.join(PUBLIC_MDX_IMAGES, encodedName);

      if (fs.existsSync(src)) {
        // Create the destination directory if it doesn't exist
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, {recursive: true});
        }
        fs.copyFileSync(src, dest);
        copied++;
        console.log(`Copied: ${src} -> ${dest}`);
      } else {
        console.warn(`Image not found: ${src} (referenced in ${mdxFile})`);
      }
    }
  });

  // Also copy all images from img directories directly
  const imgDirs = glob.sync(path.join(DOCS_DIR, '**/img'));
  console.log(`\nFound ${imgDirs.length} img directories:`);
  imgDirs.forEach(dir => console.log(`- ${path.relative(DOCS_DIR, dir)}`));

  imgDirs.forEach(imgDir => {
    const files = fs.readdirSync(imgDir);
    const imageFiles = files.filter(file => file.match(/\.(png|jpg|jpeg|gif)$/i));
    console.log(
      `\nFound ${imageFiles.length} images in ${path.relative(DOCS_DIR, imgDir)}:`
    );
    imageFiles.forEach(file => console.log(`- ${file}`));

    imageFiles.forEach(file => {
      const src = path.join(imgDir, file);
      // The MDX plugin expects paths like /mdx-images/img-filename.png
      const encodedName = `img-${file}`;
      const dest = path.join(PUBLIC_MDX_IMAGES, encodedName);

      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        copied++;
        console.log(`Copied: ${src} -> ${dest}`);
      } else {
        console.log(`Skipped (already exists): ${src}`);
      }
    });
  });

  console.log(`\nTotal images copied: ${copied}`);
  console.log(`Images are in: ${PUBLIC_MDX_IMAGES}`);
}

copyImages();
