const frida = require('frida');

// Кэш для скриптов
let session_scripts = {};

// Обработчик сообщений от скрипта
function onMessage(message) {
	if (message.type === 'send') {
		console.log(message.payload);
	} else if (message.type === 'error') {
		console.error(message.stack);
	}
}

async function getFridaScript(device_id, package_identifier, source) {
	if (package_identifier === 're.frida.Gadget') {
		package_identifier = 'Gadget';
	}

	if (!session_scripts[`${device_id}:${package_identifier}`]) {
		try {
			const device = await frida.getDevice(device_id);
			let session;
			let pid = -1;

			try {
				session = await device.attach(package_identifier);
			} catch (e) {
				pid = await device.spawn(package_identifier);
				session = await device.attach(pid);
			}

			const script = await session.createScript(source);
			script.message.connect(onMessage);
			await script.load();

			if (pid > -1) {
				device.resume(session.pid);
			}

			session_scripts[`${device_id}:${package_identifier}`] = script;

		} catch (e) {
			console.error(`Error creating Frida script: ${e.message}`);
			throw new Error(e.message);
		}
	} else {
		try {
			await session_scripts[`${device_id}:${package_identifier}`].exports.getPackageInfo();
		} catch (e) {
			console.error(`Recreating session script: ${e.message}`);
			delete session_scripts[`${device_id}:${package_identifier}`];
			return await getFridaScript(device_id, package_identifier, source);
		}
	}

	return session_scripts[`${device_id}:${package_identifier}`];
}

module.exports = getFridaScript;
