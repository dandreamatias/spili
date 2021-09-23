import * as fs from 'fs';

export function createFolder(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.error('The directory: ' + dir + ' already exist');
  }
}
