import { fromBuffer } from 'file-type';
import { archiveDirectory } from './archive';
import find from './find';

function getFilename(path) {
	return path.substring(path.lastIndexOf('/') + 1);
}



async function handle_command(device_id, identifier, action, params, frida_script) {
	let resp = {};

	try {
		switch (action) {
		case 'package_info':
			resp = await frida_script.exports.getPackageInfo();
			break;

		case 'ls':
			if (!params.path) {
				throw new Error('Missing \'path\' parameter for \'ls\' command');
			}
			const fs = await frida_script.exports.ls(params.path);
			resp = fs.files.map(file => ({
				...file,
				file_type: file.isFile ? 'data' : file.isDirectory ? 'directory' : null,
			}));
			break;

		case 'find':
			if (!params.path || !params.query) {
				throw new Error('Missing \'path\' or \'query\' parameter for \'find\' command');
			}
			resp = await find(frida_script.exports.ls, frida_script.exports.readFile, params.path, params.query);
			break;

		case 'read':
			if (!params.path) {
				throw new Error('Missing \'path\' parameter for \'read\' command');
			}

			const path = params.path;

			if (!(await frida_script.exports.fileExists(path))) {
				throw new Error('Invalid file path');
			}

			if (await frida_script.exports.isFile(path)) {
				const fileContent = await frida_script.exports.readFile(path, 0);
				let fileType = await fromBuffer(fileContent);
				resp = {
					filename: getFilename(path),
					type: fileType ? fileType.ext : null,
					content: fileContent.toString('utf-8'),
				};
			} else {
				resp = await archiveDirectory(path, frida_script);
			}
			break;

		case 'database':
			if (!params.path || !params.query) {
				throw new Error('Missing \'path\' or \'query\' parameter for \'database\' command');
			}
			resp = await frida_script.exports.dbQuery(params.path, params.query);
			break;

		default:
			throw new Error(`Unknown action: ${action}`);
		}
	} catch (e) {
		console.error(e);
		resp = { error: e.message };
	}

	return resp;
}

export default handle_command;
