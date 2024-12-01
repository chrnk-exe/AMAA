import { Script } from 'frida';
import { fridaScriptCommands } from '../../routes/http/filesOverFridaApi';

export const readAnyFile = async (file: FileInfoFrida, script: Script) => {
	const { path, size } = file;
	if (+size === 0) {
		return Buffer.from('0');
	}
	const chunkSize = 8 * 1024 * 1024;
	const downloadableSize = +size + 1;
	const chunks = Math.ceil(downloadableSize / chunkSize);
	if (chunks > 1) {
		const buffers = [];

		for (let chunkNumber = 0; chunkNumber < chunks; chunkNumber++) {
			const offset = chunkSize * chunkNumber;
			const chunk = await script.exports[fridaScriptCommands.readFile](...([path, chunkSize, offset] || []));
			buffers.push(chunk);
		}
		return Buffer.concat(buffers);
	} else {
		return await script.exports[fridaScriptCommands.readFile](...([path, downloadableSize] || []));
	}
};