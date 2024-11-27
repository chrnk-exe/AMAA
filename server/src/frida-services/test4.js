const frida = require('frida');

// Асинхронная основная функция
async function main() {
	const deviceId = process.argv[2]; // Первый аргумент — deviceId
	const packageName = process.argv[3]; // Второй аргумент — packageName

	if (!deviceId || !packageName) {
		console.error('Usage: node script.js <deviceId> <packageName>');
		process.exit(1);
	}

	try {
		// Подключаемся к устройству
		const device = await frida.getDevice(deviceId);
		console.log(`Connected to device: ${device.name}`);

		// Запускаем приложение
		const pid = await device.spawn([packageName]);
		console.log(`Spawned package: ${packageName} (PID: ${pid})`);

		// Подключаемся к процессу
		const session = await device.attach(pid);
		console.log(`Attached to PID: ${pid}`);

		// Загружаем пользовательский Frida-скрипт
		const fs = require('fs');
		const scriptCode = fs.readFileSync('fileBrowser.js', 'utf8'); // Здесь ваш скрипт
		const script = await session.createScript(scriptCode);

		// Обработчик сообщений из скрипта
		script.message.connect((message, data) => {
			console.log('Message from script:', message.payload || message);
		});

		// Загружаем и активируем скрипт
		await script.load();
		console.log('Frida script loaded');

		// Возобновляем выполнение приложения
		await device.resume(pid);
		console.log('Application resumed');

		// Организация взаимодействия через stdin
		const stdin = process.stdin;
		stdin.setEncoding('utf8');
		console.log('Enter commands (e.g., isFile, readFile, ls, etc.) or \'exit\' to quit:');

		stdin.on('data', async (input) => {
			const command = input.trim();

			if (command === 'exit') {
				console.log('Exiting...');
				await session.detach();
				process.exit(0);
			}

			// Разделение команды и аргументов
			const [method, ...args] = command.split(' ');

			try {
				// Вызываем RPC-функцию скрипта
				if (script.exports[method]) {
					const result = await script.exports[method](...args);
					console.log(`Result of ${method}:`, result);
				} else {
					console.log(`Unknown command: ${method}`);
				}
			} catch (err) {
				console.error(`Error executing command ${method}:`, err.message);
			}
		});
	} catch (err) {
		console.error('Error:', err.message);
	}
}

// Запускаем основную функцию
main();
