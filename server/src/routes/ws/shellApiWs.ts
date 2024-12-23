import {Server, Socket} from 'socket.io';
import {ChildProcess, fork} from 'child_process';
import myCookieParse from '../../globalUtils/cookieParse';

interface shell {
	subprocess: ChildProcess;
	pid: number;
	output: string;
	deviceId: string;
}

// Просто потому что могу
// А иначе никак и не сделать, не могу же я child process в бд каком-нибудь хранить))
let count = 0;
const shells: shell[] = [];

export default function shellHandlers(io: Server, socket: Socket) {
	if (socket.request.headers.cookie) {
		const cookies = myCookieParse(socket.request.headers.cookie);
		const deviceId = decodeURIComponent(cookies.deviceId as string);

		socket.on('spawn', async () => {
			console.log('DEVICE ID ON SPAWN:', deviceId);
			count = count + 1;
			const subprocess = fork(__dirname + '\\..\\..\\frida-services\\shellChild.js', [deviceId]);
			const shellInstance: shell = {output: '', subprocess, pid: count, deviceId};
			shells.push(shellInstance);

			subprocess.on('message', (data) => {
				let commandOutput = '';
				try {
					console.log('DATA ON SUBPROCESS MESSAGE EVENT!', data);
					// todo: Разобраться, что не так с data
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					commandOutput = Buffer.from(data as Buffer).toString();
				} catch {
					console.log('Some error occured with data...');
				}

				shellInstance.output = commandOutput;
				socket.emit('commandResult', {commandOutput, pid: shellInstance.pid});
			});

			// todo: сделать хуйню чтоб отправлялся эмит с уведомлением проверь тельчик!
			subprocess.on('error', (err) => {
				console.log('ERROR', err);
			});
			subprocess.on('exit', (signal) => {
				console.log('[shell] Signal', signal);
			});

			socket.emit('spawnedShell', JSON.stringify({pid: count, deviceId, output: ''}));
		});

		socket.on('shells', () => {
			const shellToSend = shells.map(shell => ({...shell, subprocess: undefined}));
			socket.emit('shellsList', shellToSend);
		});


		socket.on('command', async ({cmd, pid}: { cmd?: string, pid: string }) => {
			console.log(`Executing command ${cmd} on shell with ${pid}`);
			if (cmd && !Number.isNaN(Number(pid))) {
				const shell = shells.find(shell => shell.pid === +pid && shell.deviceId === deviceId);
				if (shell) {
					const {subprocess} = shell;
					subprocess.send(cmd);
				}
			}
		});


		socket.on('kill', async ({pid}: { pid: string }) => {
			if (!Number.isNaN(Number(pid))) {
				const shell = shells.find(shell => shell.pid === +pid && shell.deviceId === deviceId);
				if (shell) {
					console.log(deviceId, shell.deviceId);
					const {subprocess} = shell;
					subprocess.send('exit');
					subprocess.kill(9);
					shells.filter(shell => shell.pid !== +pid);
					socket.emit('killResult', {message: 'process killed successfully!', pid: +pid});
				} else {
					socket.emit('killResult', {message: 'shell not found'});
				}
			}
		});

		socket.on('killAll', async () => {
			shells.forEach((shell) => {
				try {
					const {subprocess} = shell;
					subprocess.send('exit');
					subprocess.kill(9);
					socket.emit('killResult', {message: 'process killed successfully!', pid: shell.pid});
				} catch (err) {
					socket.emit('killResult', {message: `Error, or shell with pid ${shell.pid} not found`});
				}

			});
		});

		socket.on('disconnect', () => {
			console.log('disconnected...');
		});
	}
}
