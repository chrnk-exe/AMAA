const frida = require('frida');
const os = require('os');

frida.getDevice(process.argv[2])
	.then(async (device) => {
		device.output.connect((processId, fd, data) => {
			if (processId === pid){
				if (process.send){
					process.send(data);
				}
			}
		});

		// spawn our console
		const pid = await device.spawn('/bin/sh', {
			stdio: 'pipe',
			cwd: '/',
		});

		// input command to sh (process input -> device input)
		process.on('message', async (cmd) => {
			if (cmd === 'getConsolePid'){
				process.send(pid);
			} else {
				device.input(pid, Buffer.from(cmd + '\n'));
			}
		});

		const session = await device.attach(pid);
		session.detached.connect(() => process.exit());
		await device.resume(pid);

		async function cleanup() {
			await session.detach();
			await device.kill(pid);
		}

		process.on('SIGINT', cleanup);
		process.on('SIGTERM', cleanup);
		process.on('exit', cleanup);
	})
	.catch(err => process.send(err));



