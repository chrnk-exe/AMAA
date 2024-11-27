const fs = require('fs');
const Archiver = require('archiver');
const os = require('os');
const find = require('./find');

function getFilename(path) {
	return path.substring(path.lastIndexOf('/') + 1);
}

async function archiveDirectory(path, frida_script) {
	return new Promise(async (resolve, reject) => {
		const zip = Archiver('zip');
		const tmp = os.tmpdir();
		const destination = `${tmp}/${Date.now()}.zip`;
		const destinationStream = fs.createWriteStream(destination);

		destinationStream.on('close', async () => {
			try {
				const fileContent = fs.readFileSync(destination);
				fs.unlinkSync(destination);
				resolve({
					filename: `${getFilename(path)}.zip`,
					type: 'zip',
					content: fileContent.toString('base64'),
				});
			} catch (e) {
				reject(e);
			}
		});

		try {
			const dirTree = await find(
				frida_script.exports.ls,
				frida_script.exports.readFile,
				path,
				''
			);
			for (const item of dirTree) {
				const fileContent = await frida_script.exports.readFile(item.path, 0);
				zip.append(Buffer.from(fileContent), { name: item.path.substring(path.length + 1) });
			}
			zip.finalize();
		} catch (e) {
			reject(e);
		}
	});
}

module.exports = { archiveDirectory };
