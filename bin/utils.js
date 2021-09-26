import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { Article } from './article.js';

export function createFolder(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.error('The directory: ' + dir + ' already exist');
  }
}

export function readHome(spiliObj) {
  const homeWrapper = new Function(
    'spili',
    'return ' + '`' + fs.readFileSync(path.join('template', 'index.html'), 'utf8') + '`'
  );
  return homeWrapper(spiliObj);
}

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

const getData = async (data) => {
  const promises = [];
  Object.values(data).forEach((d) => promises.push(fetch(d)));
  const res = (await Promise.all(promises)).map((r) => r.json());
  const vals = await Promise.all(res);
  return Object.keys(data).reduce((acc, d, index) => ({ ...acc, [d]: vals[index] }), {});
};

export async function getSpiliObj() {
  const spili = JSON.parse(fs.readFileSync('spili.json', 'utf8'));
  spili.useComponent = useComponent(spili);
  const dirNames = fs.readdirSync('articles', (err) => {});
  spili.articles = dirNames.map((d) => new Article([d]).header).sort((a, b) => b._id - a._id);
  spili.data = await getData(spili.get);
  return spili;
}

export function appendSockedIO(htmlPage) {
  const endBodyTag = htmlPage.indexOf('</body>');
  const socket = `<script src="socket.io.js"></script>
  <script>
      const socket = io();
      socket.on('refresh', (msg) => window.location.reload(false));
  </script>`;
  return `${htmlPage.slice(0, endBodyTag)}${socket}${htmlPage.slice(endBodyTag)}`;
}
