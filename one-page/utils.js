const marked = require('marked');

function extractHeader(arr) {
	const headerStart = arr.indexOf('----') + 1;
	const headerEnd = arr.indexOf('----', headerStart);
	const array = arr.slice(headerStart, headerEnd).map((str) => str.split(':'));
	return array.reduce((acc, arrString, index) => {
		if (arrString.length === 1) {
			const previousKey = array[index - 1][0];
			return { ...acc, [previousKey]: acc[previousKey] + arrString[0] };
		}
		return { ...acc, [arrString[0]]: arrString[1] };
	}, {});
}

function extractBody(data) {
	const headerStart = data.indexOf('----\r') + 1;
	const headerEnd = data.indexOf('----\r', headerStart);
	return marked(data.slice(headerEnd + 1).join(''));
}

const readFiles = (dirname) => {
	const filenames = fs.readdirSync(dirname, (err) => {});
	return filenames.map((filename) => {
		const data = fs.readFileSync(path.join(dirname, filename), 'utf8');
		const header = extractHeader(data.split('\r\n'));
		header.articleLink = filename.replace('md', 'html');
		return header;
	});
};

module.exports = { extractHeader: extractHeader, readFiles: readFiles, extractBody: extractBody};