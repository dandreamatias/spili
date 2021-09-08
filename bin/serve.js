const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const { Server } = require('socket.io');
const express = require('express');
const app = express();

const MIME = {
  jpg: 'image/jpeg',
  ico: 'image/x-icon',
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

const readPreview = (obj, spiliInfo) => {
  const foo = new Function(
    '{blogName, blogDescription, copyright, articleDescription, articleDate, articleTitle, articleLink}',
    'return ' + '`' + fs.readFileSync(path.join('template', 'article-preview.html'), 'utf8') + '`'
  );
  return foo({ ...spiliInfo, ...obj });
};

// read the index.html template
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

const init = (port) => {
  app.get('*', (req, res) => {
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
        return res.write(readHome());
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
    console.log(
      boxen(chalk.red('\n' + "This is a development server, don't use it in production!" + '\n'), {
        padding: 1,
        borderColor: 'red',
        dimBorder: true,
      })
    );
    console.log(chalk.green('\n' + `server running on port: http://localhost:${port}` + '\n'));
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
};

module.exports = { init };
