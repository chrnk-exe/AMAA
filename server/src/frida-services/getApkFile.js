const frida = require('frida');
const { getDevice, Stdio } = require('frida');
const { fork } = require('child_process');
const fs = require('fs');


const getApkFile = async (deviceId, pid, app) => {
	const device = await frida.getDevice(deviceId);
	const process = await device.getProcess(app);
	console.log(process);
	const session = await device.attach(process.pid);
	return process;
};

// getApkFile('RZ8M42Z7H5P', 10649, 'com.android.insecurebankv2');

// export default getApkFile;

const getApkFileSpawnChild = async (deviceId, pid, app) => {
	const device = await getDevice(deviceId);
	let output = '';

	// create Subprocess
	const subprocess = fork('shellChild.js', [deviceId]);

	subprocess.on('message', (data) => {
		// todo: Разобраться, что не так с data
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// console.log(Buffer.from(data));
		output += Buffer.from(data);
	});

	// пизда
	subprocess.send(`pm path ${app} | cut -d ":" -f2 | xargs cat | base64`);
	// subprocess.send('curl -h');
	setTimeout(() => {
		console.log('len: ', output.length);
		fs.writeFileSync('C:\\Users\\i.kotov\\Downloads\\base.apk.b64', output);
	}, 4000);
};

getApkFileSpawnChild('RZ8M42Z7H5P', 10649, 'com.android.insecurebankv2');