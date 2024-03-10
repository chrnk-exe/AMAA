import * as frida from 'frida';

const getDeviceProcesses = async (deviceId) => {
	let currentDevice = await frida.getDevice(deviceId);
	return await currentDevice.enumerateProcesses();
};

export default getDeviceProcesses;