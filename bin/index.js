#! /usr/bin/env node

import { serve } from './serve.js';
import { build } from './build.js';
import { newProject } from './init.js';
import { Article } from './article.js';
const [comand, config] = process.argv.slice(2);

switch (comand) {
  case 'new':
    if (config) newProject(config);
    else console.error('\nmissing configuration \nthe syntax should be: spili new my-blog-name\n');
    break;
  case 'article':
    if (config) {
      Article.create(config);
    } else {
      console.error(
        'missing name for Article \n the syntax should be: spili article "My article Title"'
      );
    }
    break;
  case 'serve':
    console.log('scanning project...');
    const port = isNaN(config) ? 3333 : config;
    serve(port);
    break;
  case 'build':
    build();
    break;
  default:
    console.log(
      `
Avaible comands in spili: 

  new

  article

  serve

  build
    
*-----------------------------------------------------*
|                                                     |
| visit https://spili.netlify.app/ for documentation  |
|                                                     |
*-----------------------------------------------------*`
    );
}
