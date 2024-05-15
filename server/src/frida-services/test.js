const fs = require('fs');
const frida = require('frida');

const main = async (deviceId, appPackageName) => {
	let currentDevice = await frida.getDevice(deviceId);
	const applications = await currentDevice.enumerateApplications();
	const {name} = applications.find((app) => app.identifier === appPackageName);
	const pid = currentDevice.spawn(appPackageName);
	const device = currentDevice;

	const filename = 'multiple-unpinning.js';

	const scriptText = fs.readFileSync(__dirname + `\\..\\frida-core-scripts\\${filename}`, 'utf8');

	const filename1 = 'stacktrace-activities.js';
	const scriptText1 = fs.readFileSync(__dirname + `\\..\\frida-core-scripts\\${filename1}`, 'utf8');

	const resultScript = scriptText + scriptText1;

	const session = await device.attach(await pid);
	const newScript = await session.createScript(resultScript);
	newScript.logHandler = (level, text) => {
		console.log('console', level, text);
	};
	newScript.message.connect((message, data) => {
		console.log(message);
	});
	session.detached.connect((reason, crash) => {
		console.log('session detached', reason, crash);
	});
	await newScript.load();


	device.resume(await pid);
};

main('127.0.0.1:58526', 'tech.httptoolkit.pinning_demo');

