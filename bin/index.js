#! /usr/bin/env node
const yargs = require('yargs');
const { init } = require('./serve.js');
const { build } = require('./build.js');
const { newProject } = require('./init.js');

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
  newProject(projectName);
}

if (comand.serve) {
  console.log('scanning project...');
  const port = isNaN(comand._[0]) ? 3333 : comand._[0];
  init(port);
}

if (comand.build) {
  build();
}
