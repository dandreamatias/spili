const utils = require('./utils.js');
const path = require('path');
const fs = require('fs');

const newProject = (projectName) => {
  utils.createFolder(path.join(projectName));

  utils.createFolder(path.join(projectName, 'template'));
  utils.createFolder(path.join(projectName, 'articles'));
  utils.createFolder(path.join(projectName, 'static'));

  // spili.json
  const spiliJson = fs.readFileSync(path.join(__dirname, 'project', 'spili.json'), 'utf8');
  fs.writeFileSync(path.join(projectName, 'spili.json'), spiliJson, 'utf8');

  // articles
  const fileArticlesnames = fs.readdirSync(
    path.join(__dirname, 'project', 'articles'),
    (err) => {}
  );
  fileArticlesnames.forEach((filename) => {
    const article = fs.readFileSync(path.join(__dirname, 'project', 'articles', filename), 'utf8');
    fs.writeFileSync(path.join(projectName, 'articles', filename), article, 'utf8');
  });

  // theme
  const fileTemplatenames = fs.readdirSync(
    path.join(__dirname, 'project', 'template'),
    (err) => {}
  );
  fileTemplatenames.forEach((filename) => {
    const template = fs.readFileSync(path.join(__dirname, 'project', 'template', filename), 'utf8');
    fs.writeFileSync(path.join(projectName, 'template', filename), template, 'utf8');
  });

  // static
  const fileStaticNames = fs.readdirSync(path.join(__dirname, 'project', 'static'), (err) => {});

  fileStaticNames.forEach((filename) => {
    const arr = filename.split('.');
    const extension = arr[arr.length - 1];
    const utf8ext = (ext) => ext === 'html' || ext === 'js' || ext === 'css';
    const static = fs.readFileSync(path.join(__dirname, 'project', 'static', filename));
    fs.writeFileSync(
      path.join(projectName, 'static', filename),
      static,
      utf8ext(extension) ? 'utf8' : undefined
    );
  });
};

module.exports = { newProject };
