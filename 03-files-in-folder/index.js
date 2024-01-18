const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
fsPromises
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((results) => {
    results.forEach((result) => {
      if (!result.isDirectory()) {
        const filePath = path.join(__dirname, 'secret-folder', result.name);
        return fsPromises.stat(filePath).then((stats) => {
          const fileSize = stats.size / 1024;
          const fileExt = path.extname(result.name).slice(1);
          const fileName = path.basename(result.name, `.${fileExt}`);

          console.log(`${fileName} - ${fileExt} - ${fileSize.toFixed(3)}kb`);
        });
      }
    });
  })
  .catch((err) => {
    console.error(`Error reading the directory: ${err.message}`);
  });
