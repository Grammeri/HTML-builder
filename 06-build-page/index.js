const fs = require('fs').promises;
const path = require('path');

async function readTemplate(templatePath) {
  return fs.readFile(templatePath, 'utf-8');
}

function getTemplateTags(template) {
  const tagPattern = /{{\w+}}/g;
  return template.match(tagPattern) || [];
}

async function replaceTemplateTags(template, tags, componentsDir) {
  for (const tag of tags) {
    const componentName = tag.slice(2, -2);
    const componentPath = path.join(componentsDir, componentName + '.html');
    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      template = template.replace(new RegExp(tag, 'g'), componentContent);
    } catch (err) {
      console.error('Error reading component ' + componentName + ':', err);
    }
  }
  return template;
}

async function writeHTML(distPath, html) {
  await fs.writeFile(path.join(distPath, 'index.html'), html);
}

async function buildCssBundle(stylesDir, distDir) {
  const bundlePath = path.join(distDir, 'style.css');
  const files = await fs.readdir(stylesDir, { withFileTypes: true });
  let bundleContent = '';

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesDir, file.name);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      bundleContent += fileContent + '\n';
    }
  }

  await fs.writeFile(bundlePath, bundleContent);
}

async function copyAssets(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyAssets(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

async function buildPage() {
  const rootDir = __dirname;
  const templatePath = path.join(rootDir, 'template.html');
  const componentsDir = path.join(rootDir, 'components');
  const stylesDir = path.join(rootDir, 'styles');
  const assetsSourceDir = path.join(rootDir, 'assets');
  const distDir = path.join(rootDir, 'project-dist');
  const assetsDestDir = path.join(distDir, 'assets');

  try {
    await fs.mkdir(distDir, { recursive: true });

    const template = await readTemplate(templatePath);
    const tags = getTemplateTags(template);
    const html = await replaceTemplateTags(template, tags, componentsDir);
    await writeHTML(distDir, html);

    await buildCssBundle(stylesDir, distDir);
    await copyAssets(assetsSourceDir, assetsDestDir);
  } catch (err) {
    console.error('Error:', err);
  }
}

buildPage();
