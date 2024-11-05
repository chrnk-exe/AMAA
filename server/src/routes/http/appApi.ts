import { Router, Response, Request } from 'express';
import getDeviceApps from '../../frida-services/getDeviceApps';
import getDeviceProcesses from '../../frida-services/getDeviceProcesses';
import spawnApplication from '../../frida-services/spawnApplication';
import applicationController from '../../controllers/applicationController';
import getApkFile from '../../frida-services/getApkFile.js';
import { getAvailableScripts, getScriptByName } from '../../utils/scripts';



const router = Router();

router.get('/apps', async (req: Request<void, {type: enumerateTypes}>, res: Response) => {
	const { deviceId } = req.cookies;
	const { type } = req.query;
	try {
		if (type === 'apps'){
			const data = await getDeviceApps(deviceId);
			res.status(200).json(data);
		} else {
			const data = await getDeviceProcesses(deviceId);
			res.status(200).json(data);
		}

	} catch (err){
		res.status(500).json('{"message":"device not found"}');
	}

});

/**
 * Обычный старт приложения
 * @route GET /api/apps/:applicationId/start
 * @group Application Start
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @return status codes
 */
router.get('/apps/:appPackageName/start', async (req: Request<{appPackageName: string}>, res) => {
	const {appPackageName} = req.params;
	const {deviceId} = req.cookies;
	try {
		const newProcessId = await spawnApplication(deviceId, appPackageName);
		res.cookie('app', newProcessId.name);
		res.cookie('pid', await newProcessId.pid);
		res.status(200).json({
			processInfo: newProcessId
		});
	}
	catch {
		res.send(500).json('{"message":"App not found"}');
	}
});

/**
 * Start app with frida scripts
 * @route GET /api/apps/:applicationId/start_testing
 * @group Application Start With frida script!
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @return status codes
 */
router.post('/apps/:appPackageName/start_testing', async (req: Request<{appPackageName: string}, any, {code?: string, scripts: string[]}>, res)=> {
	const {appPackageName} = req.params;
	const {deviceId} = req.cookies;

	const {code, scripts} = req.body;

	const { pid, device } = await spawnApplication(deviceId, appPackageName);

	const session = await device.attach(await pid);

	const scriptDatas = [];

	scripts.forEach((scriptName) => {
		scriptDatas.push(getScriptByName(scriptName));
	});

	if (code) {
		scriptDatas.push(code);
	}

	for (const script of scriptDatas) {
		const newScript = await session.createScript(script);
		await newScript.load();
	}

	console.log(`Starting ${appPackageName} on ${deviceId} with code: ${code?.substring(0,10)}... and scripts: ${scripts}`);

	const resultstr = `Starting ${appPackageName} on ${deviceId} with code: ${code?.substring(0,10)}... and scripts: ${scripts}`;

	// todo: Start app with frida scripts, (local and received)
	// todo: create webSocket stream with console output (on client - subscribe on 1 more event)

	await device.resume(await pid);
	
	res.status(200).json({message: resultstr});

});

router.delete('/:pid', async (req: Request<{pid: string}>, res) => {
	const {deviceId} = req.cookies;
});

router.use(applicationController);

router.get('/apps/get_apk', async (req: Request, res) => {
	const {app, deviceId, pid} = req.cookies;
	// const apkFile = await getApkFile(deviceId, pid, app);

	res.status(200).json({app, deviceId, pid});
});

export default router;