const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

(async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  try {
    await fsPromises.mkdir(targetDir, { recursive: true });
    console.log('Folder successfully created.');

    const sourceFiles = await fsPromises.readdir(sourceDir);
    const targetFiles = await fsPromises.readdir(targetDir);

    for (const file of targetFiles) {
      if (!sourceFiles.includes(file)) {
        await fsPromises.unlink(path.join(targetDir, file));
        console.log(`Deleted: ${file}`);
      }
    }

    for (const file of sourceFiles) {
      const srcFilePath = path.join(sourceDir, file);
      const destFilePath = path.join(targetDir, file);
      await fsPromises.copyFile(srcFilePath, destFilePath);
      console.log(`Copied: ${file}`);
    }
  } catch (err) {
    console.error('Error during copying files:', err.message);
  }
})();
