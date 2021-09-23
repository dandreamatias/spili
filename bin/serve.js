import * as fs from 'fs';
import * as marked from 'marked';
import * as path from 'path';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import express from 'express';

const app = express();

const MIME = {
  jpg: 'image/jpeg',
  ico: 'image/x-icon',
};

const useComponent = (spili) => (file, data) => {
  const foo = new Function(
    'props, spili',
    'return ' +
      '`' +
      fs.readFileSync(path.join('template', 'components', `${file}.component.html`), 'utf8') +
      '`'
  );
  return foo(data, spili);
};

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

function extractBody(data) {
  const headerStart = data.indexOf('|---\r') + 1;
  const headerEnd = data.indexOf('---|\r', headerStart);
  return marked(data.slice(headerEnd + 1).join(''));
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

const getData = async (data) => {
  const promises = [];
  Object.values(data).forEach((d) => promises.push(fetch(d)));
  const res = (await Promise.all(promises)).map((r) => r.json());
  const vals = await Promise.all(res);
  return Object.keys(data).reduce((acc, d, index) => ({ ...acc, [d]: vals[index] }), {});
};

// read the index.html template
const readHome = async () => {
  const spiliInfo = JSON.parse(fs.readFileSync('spili.json', 'utf8'));
  spiliInfo.articles = readFiles('articles');
  spiliInfo.useComponent = useComponent(spiliInfo);
  spiliInfo.data = await getData(spiliInfo.get);
  delete spiliInfo.build;
  delete spiliInfo.get;

  const foo = new Function(
    'spili',
    'return ' + '`' + fs.readFileSync(path.join('template', 'index.html'), 'utf8') + '`'
  );
  return foo(spiliInfo);
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

export function init(port) {
  app.get('*', async (req, res) => {
    const [url, ext] = req.url.split('.');
    try {
      if (req.url.includes('socket.io')) {
        res.writeHead(200);
        return res.write(
          fs.readFileSync(
            path.join(__dirname, '..', 'node_modules', 'socket.io', 'client-dist', 'socket.io.js')
          ),
          'utf8'
        );
      }
      if (req.url === '/index.html' || req.url === '/') {
        res.writeHead(200);
        const home = await readHome();
        return res.write(home);
      }
      if (ext && ext !== 'html' && !MIME[ext]) {
        res.writeHead(200);
        return res.write(fs.readFileSync(path.join('static', req.url.substring(1)), 'utf8'));
      }
      if (ext && MIME[ext]) {
        const file = fs.readFileSync(path.join('static', req.url.substring(1)));
        res.writeHead(200, { 'Content-Type': MIME[ext] });
        return res.write(file);
      }
      res.writeHead(200);
      res.write(readArticle(path.join('articles', req.url.substring(1).replace('html', 'md'))));
    } finally {
      res.end();
    }
  });

  const server = app.listen(port, () => {
    console.error('\n' + "This is a development server, don't use it in production!" + '\n');
    console.log('\n' + `server running on port: http://localhost:${port}` + '\n');
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  fs.watch('articles', { recursive: true }, (eventType, filename) => {
    if (filename) {
      io.emit('refresh', { someProperty: 'some value', otherProperty: 'other value' });
    }
  });
  fs.watch('template', { recursive: true }, (eventType, filename) => {
    if (filename) {
      io.emit('refresh', { someProperty: 'some value', otherProperty: 'other value' });
    }
  });
  fs.watch('static', { recursive: true }, (eventType, filename) => {
    if (filename) {
      io.emit('refresh', { someProperty: 'some value', otherProperty: 'other value' });
    }
  });
  fs.watch('spili.json', { recursive: true }, (eventType, filename) => {
    if (filename) {
      io.emit('refresh', { someProperty: 'some value', otherProperty: 'other value' });
    }
  });
}
