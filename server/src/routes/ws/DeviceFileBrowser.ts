import { ChildProcess, fork } from 'child_process';
import { Socket } from 'socket.io';
// testing, delete later


export default class DeviceFileBrowser {
	deviceId: string;
	private subprocessDirectory: ChildProcess;
	private subprocessFile: ChildProcess;
	private socket: Socket;

	constructor(deviceId: string, socket: Socket) {
		this.deviceId = deviceId;
		this.socket = socket;


		socket.on('listDirectories', (path) => {
			this.getDirectory(path);
		});
		socket.on('fileContent', (path) => {
			this.getFile(path);
		});

		this.subprocessDirectory = fork(__dirname + '\\..\\frida-services\\shellChild.js', [deviceId]);
		this.subprocessDirectory.on('message', (data) => {
			// todo: Разобраться, что не так с data
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			socket.emit('directoryContent', this.prepareDirectories(Buffer.from(data).toString()));
		});

		this.subprocessFile = fork(__dirname + '\\..\\frida-services\\shellChild.js', [deviceId]);
		this.subprocessFile.on('message', (data) => {
			// concat received data
			// todo: Разобраться, что не так с data
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			socket.emit('fileContent', this.prepareFile(Buffer.from(data).toString()));
		});
	}

	getDirectory(path: string) {
		this.subprocessDirectory.send(`ls -l ${path}`);
	}

	// base64 немного костыль, но должно работать, правда декодить на сервере или на клиенте пока не ясно,
	// для сейва - на клиенте, НО возможно это будет не так просто
	getFile(path: string) {
		this.subprocessFile.send(`cat ${path} | base64`);
	}

	private prepareFile(file: string) {
		return file;
	}

	private prepareDirectories(dirs: string) {
		const dirList = dirs.split('\n');
		const dirTypes: Record<string, string> = {
			'd': 'directory',
			'l': 'link',
			'-': 'file'
		};
		return dirList.map(dir => {
			// split by all spaces!
			const data = dir.split(/\s+/);
			if (data.length < 3) return;
			else {
				// string -> JSON
				const [typeAndRules, numberOfLinksToTheContent, owner, ownerGroup, size, modifiedDate, modifiedTime, fileName, arrow, link] = data;
				const objectType = typeAndRules[0];
				const rules = typeAndRules.slice(1);
				return {
					objectType: dirTypes[objectType],
					rules,
					numberOfLinksToTheContent,
					owner,
					ownerGroup,
					size,
					modifiedDate,
					modifiedTime,
					fileName,
					arrow,
					link
				};
			}
		}).filter(dirs => dirs);
	}

	clear() {
		this.socket.removeAllListeners();
		this.subprocessFile.kill(9);
		this.subprocessDirectory.kill(9);
	}
}
