import * as fs from 'fs';
import * as path from 'path';
import { Server } from 'socket.io';
import express from 'express';
import { fileURLToPath } from 'url';
import { appendSockedIO, getSpiliObj, readHome } from './utils.js';
import { Article } from './article.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME = {
  jpg: 'image/jpeg',
  png: 'image/jpeg',
  ico: 'image/x-icon',
};

async function handleHTTP(req, res) {
  const spili = await getSpiliObj();
  const [url, ext] = req.url.split('.');
  try {
    if (req.url.includes('socket.io')) {
      res.writeHead(200);
      let socketPath;

      if (fs.existsSync(path.join('..', 'node_modules', 'socket.io'))) {
        socketPath = path.join(
          __dirname,
          '..',
          'node_modules',
          'socket.io',
          'client-dist',
          'socket.io.js'
        );
      }

      if (fs.existsSync(path.join('..', '..', 'node_modules', 'socket.io'))) {
        socketPath = path.join(
          __dirname,
          '..',
          '..',
          'node_modules',
          'socket.io',
          'client-dist',
          'socket.io.js'
        );
      }
      return res.write(fs.readFileSync(socketPath), 'utf8');
    }
    if (req.url === '/index.html' || req.url === '/') {
      res.writeHead(200);
      const home = await readHome(spili);
      return res.write(appendSockedIO(home));
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
    const article = new Article(req.url.replace('.html', '').split('/'));
    res.write(appendSockedIO(article.read(spili)));
  } finally {
    res.end();
  }
}

export function serve(port) {
  app.get('*', handleHTTP);

  // server
  const server = app.listen(port, () => {
    console.error('\n' + "This is a development server, don't use it in production!");
    console.log(`server running on port: http://localhost:${port}` + '\n');
  });

  // socket
  const io = new Server(server);
  io.on('connection', (socket) => {
    console.log('refreshing...');
    socket.on('disconnect', () => {});
  });

  // watch for changes
  ['articles', 'template', 'static', 'spili.json'].forEach((path) => {
    fs.watch(path, { recursive: true }, (eventType, filename) => {
      if (filename) {
        io.emit('refresh', { someProperty: 'some value', otherProperty: 'other value' });
      }
    });
  });
}
