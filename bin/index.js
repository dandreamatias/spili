#! /usr/bin/env node
import { init } from './serve.js';
import { build } from './build.js';
import { newProject } from './init.js';
const comand = process.argv.slice(2);

if (comand[0] === 'new' && comand[1]) {
  const projectName = comand[1];
  newProject(projectName);
}

if (comand[0] === 'serve') {
  console.log('scanning project...');
  const port = isNaN(comand[1]) ? 3333 : comand[1];
  init(port);
}

if (comand[0] === 'build') {
  build();
}
