#! /usr/bin/env node
const yargs = require('yargs');
const utils = require('./utils.js');
const path = require('path');
const fs = require('fs');
const { init } = require('./serve.js');
const { build } = require('./build.js');

yargs
  .option('n', {
    alias: 'new',
    describe: 'initialize a new blog project, type: spili -n your_blog_name',
    type: 'boolean',
    demandOption: false,
  })
  .option('serve', {
    describe: 'open the blog with a local live server with hot-reload',
    type: 'boolean',
    demandOption: false,
  })
  .option('b', {
    alias: 'build',
    describe: 'build the blog and output the rsult in the dist folder',
    type: 'boolean',
    demandOption: false,
  })
  .help(true).argv;

const comand = yargs.argv;

if ((comand.new || comand.new) && comand._[0]) {
  const projectName = comand._[0];
  utils.createFolder(path.join(projectName));
  utils.createFolder(path.join(projectName, 'template'));
  utils.createFolder(path.join(projectName, 'articles'));
  utils.createFolder(path.join(projectName, 'static'));
  const wts = fs.readFileSync(path.join(__dirname, 'project', 'welcome-to-spili.md'), 'utf8');
  const spiliJson = fs.readFileSync(path.join(__dirname, 'project', 'spili.json'), 'utf8');
  fs.writeFileSync(path.join(projectName, 'articles', 'welcome-to-spili.md'), wts, 'utf8');
  fs.writeFileSync(path.join(projectName, 'spili.json'), spiliJson, 'utf8');
  return;
}

if (comand.serve) {
  console.log('scanning project...');
  const port = isNaN(comand._[0]) ? 3333 : comand._[0];
  init(port);
  return;
}

if (comand.build) {
  console.log('build');
  build();
  return;
}
