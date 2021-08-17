var fs = require('fs');
const chalk = require('chalk');

function createFolder(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(chalk.red('The directory: ' + dir + ' already exist'));
  }
}



module.exports = { createFolder: createFolder };
