import spawnApplication from '../frida-services/spawnApplication';

const createSession = async (identifier: string, deviceId: string) => {
	const { pid, device } = await spawnApplication(deviceId, identifier);
	const currentPid = +(await pid);
	await device.resume(currentPid);
	const session = await device.attach(currentPid);
	return session;
};

export default createSession;