import * as frida from 'frida';

const killProcess = async (deviceId, pid) => {
	const device = await frida.getDevice(deviceId);
	const session = await device.attach(pid);
	await device.kill(pid);
};

export default killProcess;