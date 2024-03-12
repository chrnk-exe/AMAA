const frida = require('frida');
const os = require('os');

frida.getDevice(process.argv[2])
	.then(async (device) => {
		const result = await device.output.connect((processId, fd, data) => {
			if (processId === pid){
				if (process.send){
					process.send(data);
				}
				// mapping[fd].write(data);
			}
		});

		// spawn our console
		const pid = await device.spawn('/bin/sh', {
			stdio: 'pipe',
			cwd: '/',
		});



		// fix input
		function fix(buf) {
			if (os.EOL === '\n') return buf;

			let next = 0;
			let left = 0;
			const output = [];
			const br = Buffer.from('\n');
			while ((next = buf.indexOf(os.EOL, left)) > -1) {
				output.push(buf.slice(left, next));
				output.push(br);
				left = next + 1;
			}
			// console.log('OUTPUT:', output);
			// console.log('BUF:', buf);
			return Buffer.concat(output);
		}

		// device output -> process output (console)
		// const mapping = [null, process.stdout, process.stderr];
		// input command to sh (process input -> device input)
		// process.stdin.on('data', data => {
		// 	dev.input(pid, fix(data));
		// });

		// input command to sh (process input -> device input)
		process.on('message', async (cmd) => {

			device.input(pid, Buffer.from(cmd + '\n'));
			// .then(res => console.log(`[child] Device then: ${res}`))
			// .catch(res => console.log(`[child] Device catch: ${res}`))
			// .finally(res => console.log(`[child] Device finally: ${res}`));
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
	});


