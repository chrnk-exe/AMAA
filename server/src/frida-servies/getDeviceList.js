import {enumerateDevices} from 'frida';

let getDevices = async () => {
	return await enumerateDevices();
};
export default getDevices;