import * as frida from 'frida';
import {enumerateDevices} from 'frida';


export default async (deviceId) => {
	let currentDevice = await frida.getDevice(deviceId);
	return await currentDevice.enumerateApplications();
};
