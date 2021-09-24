import * as utils from './utils.js';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function newProject(projectName) {
  utils.createFolder(path.join(projectName));

  utils.createFolder(path.join(projectName, 'template'));
  utils.createFolder(path.join(projectName, 'articles'));
  utils.createFolder(path.join(projectName, 'articles', 'welcome-to-spili'));
  utils.createFolder(path.join(projectName, 'static'));

  // spili.json
  const spiliJson = fs.readFileSync(path.join(__dirname, 'project', 'spili.json'), 'utf8');
  fs.writeFileSync(path.join(projectName, 'spili.json'), spiliJson, 'utf8');

  // articles
  const fileArticlesnames = fs.readdirSync(
    path.join(__dirname, 'project', 'articles', 'welcome-to-spili'),
    (err) => {}
  );

  fileArticlesnames.forEach((filename) => {
    const article = fs.readFileSync(
      path.join(__dirname, 'project', 'articles', 'welcome-to-spili', filename),
      'utf8'
    );
    fs.writeFileSync(
      path.join(projectName, 'articles', 'welcome-to-spili', filename),
      article,
      'utf8'
    );
  });

  // theme
  const fileTemplatenames = fs.readdirSync(
    path.join(__dirname, 'project', 'template'),
    (err) => {}
  );
  fileTemplatenames.forEach((filename) => {
    if (filename !== 'components') {
      const template = fs.readFileSync(
        path.join(__dirname, 'project', 'template', filename),
        'utf8'
      );
      fs.writeFileSync(path.join(projectName, 'template', filename), template, 'utf8');
    } else {
      utils.createFolder(path.join(projectName, 'template', 'components'));
      const fileComponentsnames = fs.readdirSync(
        path.join(__dirname, 'project', 'template', 'components'),
        (err) => {}
      );
      fileComponentsnames.forEach((cname) => {
        const comp = fs.readFileSync(
          path.join(__dirname, 'project', 'template', 'components', cname),
          'utf8'
        );
        fs.writeFileSync(path.join(projectName, 'template', 'components', cname), comp, 'utf8');
      });
    }
  });

  // static
  const fileStaticNames = fs.readdirSync(path.join(__dirname, 'project', 'static'), (err) => {});

  fileStaticNames.forEach((filename) => {
    const arr = filename.split('.');
    const extension = arr[arr.length - 1];
    const utf8ext = (ext) => ext === 'html' || ext === 'js' || ext === 'css';
    const staticAssets = fs.readFileSync(path.join(__dirname, 'project', 'static', filename));
    fs.writeFileSync(
      path.join(projectName, 'static', filename),
      staticAssets,
      utf8ext(extension) ? 'utf8' : undefined
    );
  });
}
