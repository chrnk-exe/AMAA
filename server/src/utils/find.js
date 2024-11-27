import { fromBuffer } from 'file-type';
function getFilename(path) {
	return path.substring(path.lastIndexOf('/') + 1);
}

async function find(ls_func, readFile_func, path, query) {
	const fs = await ls_func(path, true, query);
	let results = [];

	for (let file of fs.files) {
		file['file_type'] = null;

		if (file.isFile && file.size > 0 && file.path && getFilename(file.path).includes(query)) {
			file['file_type'] = 'data';

			if (readFile_func !== null) {
				const fileContent = await readFile_func(file.path, 0x100); // Читаем частично
				const fileType = await fromBuffer(new Uint8Array(fileContent));
				if (fileType !== undefined) {
					file['file_type'] = fileType.mime.startsWith('image') ? fileType.mime : fileType.ext;
				}
			}

			results.push(file);
		}

		if (file.isDirectory) {
			const recursiveResults = await find(
				ls_func,
				readFile_func,
				file.path,
				getFilename(file.path).includes(query) ? '' : query,
			);
			results = results.concat(recursiveResults);
		}
	}

	return results;
}

export default find;
