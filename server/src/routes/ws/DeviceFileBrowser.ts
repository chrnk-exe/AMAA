import {ChildProcess, fork} from 'child_process';
import {Socket} from 'socket.io';
import fs from 'fs';

let sum = 0;
const temp_dir = '/data/local/tmp/temp_zip_archives';

export default class DeviceFileBrowser {
	deviceId: string;
	private subprocessDirectory: ChildProcess;
	private subprocessFile: ChildProcess;
	private subprocessCreate: ChildProcess;
	private subprocessDownload: ChildProcess;
	private downloadFilename: string;
	private socket: Socket;
	private fileData: {
		name: string,
		data: any
	};

	constructor(deviceId: string, socket: Socket) {
		this.deviceId = deviceId as string;
		this.socket = socket;
		this.fileData = {
			name: '',
			data: ''
		};
		this.downloadFilename = 'super file not predictable string';

		this.setSubprocessDirectory(deviceId);
		this.setSubprocessFile(deviceId);

		this.subprocessCreate = fork(__dirname + '\\..\\..\\frida-services\\shellChild.js', [deviceId]);
		this.subprocessCreate.on('message', (data) => {
			socket.emit('message', data);
		});

		// папка, куда буду складывать все зип ахривы
		this.subprocessCreate.send(`mkdir ${temp_dir}`);

		this.subprocessDownload = fork(__dirname + '\\..\\..\\frida-services\\shellChild.js', [deviceId]);
		this.subprocessDownload.on('message', (data) => {
			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const stringdata = Buffer.from(data).toString();
				sum += stringdata.length;
				if (stringdata.includes(this.downloadFilename)){
					console.log(`Filename is ${this.downloadFilename}`);
				}
				console.log(`Data received: ${sum}`);
				console.log(stringdata);
			} catch {
				console.log('Some error occured with data...');
			}

		});

		socket.on('listDirectories', (path) => {
			this.getDirectory(path);
		});

		socket.on('fileContent', (path) => {
			this.getFile(path);
		});

		socket.on('touchFile', (path) => {
			this.createFile(path);
		});
		socket.on('makeDirectory', (path) => {
			this.createDirectory(path);
		});
		socket.on('deleteFile', (path) => {
			this.deleteFile(path);
		});
		socket.on('deleteDirectory', (path) => {
			this.deleteDirectory(path);
		});
		socket.on('downloadFile', (path) => {
			this.downloadFile(path);
		});
	}

	private setSubprocessDirectory(deviceId: string) {
		this.subprocessDirectory = fork(__dirname + '\\..\\..\\frida-services\\shellChild.js', [deviceId]);
		this.subprocessDirectory.on('message', (data) => {
			console.log('subprocessDirectory', data);
			try {
				// todo: Разобраться, что не так с data
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				this.socket.emit('directoryContent', this.prepareDirectories(Buffer.from(data).toString()));
			} catch {
				console.log('Some error occured with data...');
			}

		});


		// todo: сделать хуйню чтоб отправлялся эмит с уведомлением проверь тельчик!
		this.subprocessDirectory.on('error', (err) => {
			console.log('ERROR', err);
		});
		this.subprocessDirectory.on('exit', (signal) => {
			console.log('Signal', signal);
		});
	}

	private setSubprocessFile(deviceId: string) {
		this.subprocessFile = fork(__dirname + '\\..\\..\\frida-services\\shellChild.js', [deviceId]);
		this.subprocessFile.on('message', (data) => {

			let prepared_data = '';
			try {
				// todo: Разобраться, что не так с data
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				prepared_data = Buffer.from(data).toString();
				this.socket.emit('fileContent', {
					name: this.fileData.name,
					data: this.prepareFile(prepared_data)
				});
			} catch {
				console.log('some error...');
			}
		});

		this.subprocessFile.on('error', (err) => {
			console.log('ERROR', err);
		});
		this.subprocessFile.on('exit', (signal) => {
			console.log('Signal', signal);
		});
	}

	getDirectory(path: string) {
		this.subprocessDirectory.send(`ls -l ${path}`);
	}

	// base64 немного костыль, но должно работать, правда декодить на сервере или на клиенте пока не ясно,
	// для сейва - на клиенте, НО возможно это будет не так просто
	getFile(path: string) {
		this.subprocessFile.send(`cat ${path} | base64`);
		const pathname = path.split('/');
		this.fileData.name = pathname[pathname.length - 1];
	}

	createFile(path: string) {
		this.subprocessCreate.send(`touch ${path}`);
	}

	createDirectory(path: string) {
		this.subprocessCreate.send(`mkdir -p ${path}`);
	}

	deleteDirectory(path: string) {
		this.subprocessCreate.send(`rm -rf ${path}`);
	}

	deleteFile(path: string) {
		this.subprocessCreate.send(`rm ${path}`);
	}

	downloadFile(path: string) {
		this.downloadFilename = path.split('/')[path.split('/').length - 1];
		this.subprocessDownload.send(`echo ${path} && cat ${path} | base64`);
	}

	// todo: oстальные действия
	// modify file (rm + echo {content} >> file)

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
