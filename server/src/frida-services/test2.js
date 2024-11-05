const frida = require('frida');

const killProcess = async (deviceId, pid) => {
	const device = await frida.getDevice(deviceId);
	const session = await device.attach(pid);
	await device.kill(pid);
};

killProcess('R58R6308HCP', 2850);