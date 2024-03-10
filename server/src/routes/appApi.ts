import { Router, Response, Request } from 'express';
import getDeviceApps from '../frida-services/getDeviceApps';
import getDeviceProcesses from '../frida-services/getDeviceProcesses';
import spawnApplication from '../frida-services/spawnApplication';

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
		const newProcessId = spawnApplication(deviceId, appPackageName);
		res.status(200).json({
			processId: await newProcessId
		});
	}
	catch {
		res.send(500).json('{"message":"App not found"}');
	}
});

router.get('/apps/:appPackageName/get_apk', (req: Request<{appPackageName: string}>, res) => {
	const {appPackageName} = req.params;


	res.send(200);
});

export default router;