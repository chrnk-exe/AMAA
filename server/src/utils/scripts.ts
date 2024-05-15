import fs from 'fs';

const capitalyze = (word: string) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

export function getAvailableScripts() {
	const filenames = fs.readdirSync(__dirname + '\\..\\frida-core-scripts');
	const names = filenames.map(filename => {
		return filename.split('.')[0].split('-').map(word => capitalyze(word)).join(' ');
	});
	return [names, filenames];
}

export function getScriptByName(scriptName: string) {
	const filename = scriptName.split(' ').map(word => word.toLowerCase()).join('-') + '.js';
	return fs.readFileSync(__dirname + `\\..\\frida-core-scripts\\${filename}`, 'utf8');
}



