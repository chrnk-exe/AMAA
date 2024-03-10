import * as frida from 'frida';

export default async (deviceId, appPackageName) => {
	let currentDevice = await frida.getDevice(deviceId);
	const process = currentDevice.spawn(appPackageName);
	return process;
};

