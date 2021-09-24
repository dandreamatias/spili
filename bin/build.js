import * as fs from 'fs';
import * as path from 'path';
import { Article } from './article.js';
import { getSpiliObj, readHome } from './utils.js';

export async function build() {
  const spili = await getSpiliObj();
  if (!fs.existsSync(spili.build.output)) {
    fs.mkdirSync(spili.build.output);
  }

  // minify(home, { collapseWhitespace: true, conservativeCollapse: true }),
  fs.writeFileSync(path.join(spili.build.output, 'index.html'), readHome(spili), 'utf8');

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
      path.join(spili.build.output, filename),
      data,
      utf8ext(extension) ? 'utf8' : undefined
    );
  });

  const fileArticlesnames = fs.readdirSync('articles', (err) => {});
  fileArticlesnames.forEach(async (dirname) => {
    const article = new Article([dirname]);
    // minify(article, { collapseWhitespace: true, conservativeCollapse: true }),
    fs.writeFileSync(
      path.join(spili.build.output, article.header.url),
      article.read(spili),
      'utf8'
    );
  });
}
