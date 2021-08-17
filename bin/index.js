#! /usr/bin/env node
const yargs = require('yargs');
const utils = require('./utils.js');
const chalk = require('chalk');
const boxen = require('boxen');

yargs
	.option('init', { describe: 'initialize a new blog project', type: 'boolean', demandOption: false })
	.option('serve', {
		describe: 'open the blog with a local live server with hot-reload',
		type: 'boolean',
		demandOption: false
	})
	.option('build', {
		describe: 'build the blog and output the rsult in the dist folder',
		type: 'boolean',
		demandOption: false
	})
	.help(true).argv;

const comand = yargs.argv;

if (comand.init) {
	console.log('init');
	return;
}

if (comand.serve) {
  console.log('scanning project...')
	console.log('\n');
	console.log(
		boxen(chalk.red('\n' + "This is a development server, don't use it in production!" + '\n'), {
			padding: 1,
			borderColor: 'red',
			dimBorder: true
		})
	);
  console.log('\n');
  console.log(chalk.green('\n' + "Server running on http://localhost:3333" + '\n'));
	return;
}

if (comand.build) {
	console.log('build');
	return;
}
