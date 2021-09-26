import * as fs from 'fs';
import * as path from 'path';
import marked from 'marked';
import { dateToString } from 'date-to-string-js';

export class Article {
  constructor(folderPath) {
    this._header = JSON.parse(
      fs.readFileSync(path.join('articles', ...folderPath, 'info.json'), {
        encoding: 'UTF8',
      })
    );
    this._header.url = folderPath.join('/') + '.html';
    this._body = fs.readFileSync(path.join('articles', ...folderPath, 'body.md'), {
      encoding: 'UTF8',
    });
  }

  get header() {
    return this._header;
  }

  get body() {
    return marked(this._body);
  }

  read(spili) {
    const article = {
      body: this.body,
      ...this.header,
    };
    const articleWrapper = new Function(
      `spili, article`,
      'return ' + '`' + fs.readFileSync(path.join('template', 'article.html'), 'utf8') + '`'
    );
    return articleWrapper(spili, article);
  }

  static create(name) {
    const folderName =
      name
        .toLowerCase()
        .split(' ')
        .filter((s) => s !== '')
        .join('-') + '/';
    try {
      fs.mkdirSync(path.join('articles', folderName), { recursive: true });
    } catch (e) {
      return console.error(
        path.join('articles', folderName) + ' already exist, try with another name'
      );
    }

    const spili = JSON.parse(fs.readFileSync('spili.json', 'utf8'));
    const today = new Date();
    const info = {
      title: name,
      date: dateToString(today, spili.dateFormat),
      description: 'missing description',
      showAfterDate: false,
      highlight: false,
      _id: today.getTime(),
    };
    fs.writeFileSync(
      path.join('articles', folderName, 'info.json'),
      JSON.stringify(info, null, 2),
      'utf8'
    );
    fs.writeFileSync(path.join('articles', folderName, 'body.md'), `${name} works!`, 'utf8');
  }
}
