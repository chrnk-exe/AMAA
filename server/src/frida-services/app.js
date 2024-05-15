// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const frida = require('frida');

const main = async (deviceId, appPackageName) => {
	let currentDevice = await frida.getDevice(deviceId);
	// const apps = await currentDevice.enumerateApplications();
	const process = currentDevice.spawn(appPackageName); //!!! start app !!!
	const apps = await currentDevice.enumerateApplications();
	const app = apps.filter(app => app.identifier === appPackageName)[0];
	const shit = frida.attach(app.pid);
	currentDevice.resume(process);
	return app.pid;
	// return await currentDevice.enumerateApplications();
};

let pid = 0;


main('RZ8M42Z7H5P', 'com.android.insecurebankv2')
	.then(res => console.log(res));

// const app = frida.attach(pid);
// app.then(res => console.log(res));

