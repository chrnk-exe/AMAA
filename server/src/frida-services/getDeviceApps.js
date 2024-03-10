import * as frida from 'frida';

export default async (deviceId) => {
	let currentDevice = await frida.getDevice(deviceId);
	return await currentDevice.enumerateApplications();
};
