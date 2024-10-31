const frida = require('frida');
const os = require('os');
const child_process = require('child_process');
const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});


const menu = [
	'Choose action:',
	'1.Spawn console',
	'2.Show consoles',
	'3.Kill console',
	'4.Exec command on console',
	'5.Interactive shell',
	''];


const deviceId = '127.0.0.1:58526';
const device = frida.getDevice(deviceId)
	.then(async (device) => {
		const consoles = [];
		// console.log('ARGS:', process.argv.slice(2).join(' '));
		device.output.connect((pid, fd, data) => {
			console.log(pid, fd, data);
			const trackingConsole = consoles.find((console) => +console.pid === pid);
			if (trackingConsole) {
				trackingConsole.output[fd] = data;
			}
		});


		const spawnConsole = async () => {
			console.log('[spawning]');
			const pid = await device.spawn('/bin/sh', {
				stdio: 'pipe',
				cwd: '/',
				aslr: 'auto'
			});
			const subprocess = child_process.fork('shellChild.js', [deviceId]);
			const consoleInstance = { output: [], session: null, subprocess, pid };
			consoles.push(consoleInstance);

			subprocess.on('message', (data) => {
				// console.log(data);
				console.log(Buffer.from(data).toString());
				consoleInstance.output.push(Buffer.from(data).toString());
			});

			return pid;
		};

		const showConsoles = async () => {
			console.log('[consoles]');
			console.log(consoles);
		};

		// todo: implement понятно где
		const killConsole = async () => {
			const consolePid = await new Promise(resolve => {
				rl.question('Console pid: ', resolve);
			});
			const processToKill = consoles.find(console => console.pid === +consolePid);
			if(processToKill){
				processToKill.kill();
				// + УНАРНЫЙ ПЛЮС ОБРАТИ ВНИМАНИЕ!!!
				await device.kill(+consolePid);
				consoles.filter(console => console.pid !== consolePid);
			}
		};

		const executeCommand = async () => {
			const consolePid = +(await new Promise(resolve => {
				rl.question('Console pid: ', resolve);
			}));
			// console.log(`[exec on ${consolePid}]`);
			const cmd = await new Promise(resolve => {
				rl.question('Command: ', resolve);
			});
			// console.log(`[executing ${cmd}]`);
			const consoleInstance = consoles.find(console => console.pid === +consolePid);
			const { subprocess } = consoleInstance;1;

			const result = await subprocess.send(cmd);
			// console.log(consoleInstance.output.join('\n'));
		};


		async function test(){
			// eslint-disable-next-line no-constant-condition
			while (true){
				const choice = await new Promise(resolve => {
					rl.question(menu.join('\n'), resolve);
				});
				switch (choice){
				case '1':
					await spawnConsole();
					break;
				case '2':
					await showConsoles();
					break;
				case '3':
					await killConsole();
					break;
				case '4':
					await executeCommand();
					break;
				case '5':
					await executeCommand();
					break;
				default:
					console.log('Error...');
				}
			}
		}

		await test();

	});



