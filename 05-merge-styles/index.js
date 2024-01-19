const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

async function buildCssBundle() {
  const stylesDir = path.join(__dirname, 'styles');
  const distDir = path.join(__dirname, 'project-dist');
  const bundlePath = path.join(distDir, 'bundle.css');

  try {
    const files = await fsPromises.readdir(stylesDir, { withFileTypes: true });
    let bundleContent = '';

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const fileContent = await fsPromises.readFile(filePath, 'utf-8');
        bundleContent += fileContent + '\n';
      }
    }

    await fsPromises.mkdir(distDir, { recursive: true });
    await fsPromises.writeFile(bundlePath, bundleContent);
    console.log('CSS bundle created successfully!');
  } catch (err) {
    console.error('Error creating CSS bundle:', err);
  }
}

buildCssBundle();
