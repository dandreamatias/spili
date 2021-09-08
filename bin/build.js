const fs = require('fs');
const minify = require('html-minifier').minify;
const path = require('path');
const marked = require('marked');

const build = () => {
  function extractBody(data) {
    const headerStart = data.indexOf('|---\r') + 1;
    const headerEnd = data.indexOf('---|\r', headerStart);
    return marked(data.slice(headerEnd + 1).join(''));
  }
  function extractHeader(arr) {
    const headerStart = arr.indexOf('|---') + 1;
    const headerEnd = arr.indexOf('---|', headerStart);
    const array = arr.slice(headerStart, headerEnd).map((str) => str.split(':'));
    return array.reduce((acc, arrString, index) => {
      if (arrString.length === 1) {
        const previousKey = array[index - 1][0];
        return { ...acc, [previousKey]: acc[previousKey] + arrString[0] };
      }
      return { ...acc, [arrString[0]]: arrString[1] };
    }, {});
  }
  const readFiles = (dirname) => {
    const filenames = fs.readdirSync(dirname, (err) => {});
    return filenames.map((filename) => {
      const data = fs.readFileSync(path.join(dirname, filename), 'utf8');
      const header = extractHeader(data.split('\r\n'));
      header.articleLink = filename.replace('md', 'html');
      return header;
    });
  };

  const readPreview = (obj, spiliInfo) => {
    const foo = new Function(
      '{blogName, blogDescription, copyright, articleDescription, articleDate, articleTitle, articleLink}',
      'return ' + '`' + fs.readFileSync(path.join('template', 'article-preview.html'), 'utf8') + '`'
    );
    return foo({ ...spiliInfo, ...obj });
  };

  const readHome = () => {
    const spiliInfo = JSON.parse(fs.readFileSync('spili.json', 'utf8'));
    const articles = readFiles('articles').reduce((acc, obj) => {
      acc += readPreview(obj, spiliInfo);
      return acc;
    }, '');
    const foo = new Function(
      '{blogName, blogDescription, copyright, articles}',
      'return ' + '`' + fs.readFileSync(path.join('template', 'index.html'), 'utf8') + '`'
    );
    return foo({ ...spiliInfo, articles });
  };

  const readArticle = (filePath) => {
    const spiliInfo = JSON.parse(fs.readFileSync('spili.json', 'utf8'));
    const data = fs.readFileSync(filePath, 'utf8');
    const header = extractHeader(data.split('\r\n'));
    const body = extractBody(data.split('\n'));
    const foo = new Function(
      `{blogName, blogDescription, copyright, articleDescription, articleDate, articleTitle, articleLink, articleBody}`,
      'return ' + '`' + fs.readFileSync(path.join('template', 'article.html'), 'utf8') + '`'
    );
    return foo({ ...spiliInfo, ...header, articleBody: body });
  };

  const spiliJson = JSON.parse(fs.readFileSync('spili.json', 'utf8'));
  if (!fs.existsSync(spiliJson.build.output)) {
    fs.mkdirSync(spiliJson.build.output);
  }
  fs.writeFileSync(
    path.join(spiliJson.build.output, 'index.html'),
    minify(readHome(), { collapseWhitespace: true, conservativeCollapse: true }),
    'utf8'
  );
  const filenames = fs.readdirSync('static', (err) => {});
  filenames.forEach((filename) => {
    const arr = filename.split('.');
    const extension = arr[arr.length - 1];
    const utf8ext = (ext) => ext === 'html' || ext === 'js' || ext === 'css';
    const data = fs.readFileSync(
      path.join('static', filename),
      utf8ext(extension) ? 'utf8' : undefined
    );
    fs.writeFileSync(
      path.join(spiliJson.build.output, filename),
      data,
      utf8ext(extension) ? 'utf8' : undefined
    );
  });

  const fileArticlesnames = fs.readdirSync('articles', (err) => {});
  fileArticlesnames.forEach((filename) => {
    const article = readArticle(path.join('articles', filename));
    fs.writeFileSync(
      path.join(spiliJson.build.output, filename.replace('md', 'html')),
      minify(article, { collapseWhitespace: true, conservativeCollapse: true }),
      'utf8'
    );
  });
};

module.exports = { build };
