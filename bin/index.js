#! /usr/bin/env node

import { init } from './serve.js';
import { build } from './build.js';
import { newProject } from './init.js';
const [comand, config] = process.argv.slice(2);

if (comand === 'new' && config) {
    newProject(config);
}

if (comand === 'serve') {
    console.log('scanning project...');
    const port = isNaN(config) ? 3333 : config;
    init(port);
}

if (comand === 'build') {
    build();
}