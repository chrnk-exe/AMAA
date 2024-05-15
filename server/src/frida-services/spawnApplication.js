import * as frida from 'frida';

export default async (deviceId, appPackageName) => {
	let currentDevice = await frida.getDevice(deviceId);
	const applications = await currentDevice.enumerateApplications();
	const {name} = applications.find((app) => app.identifier === appPackageName);
	return { pid: currentDevice.spawn(appPackageName), name, device: currentDevice };
};

