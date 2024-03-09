import { Router, Response, Request } from 'express';
import getDeviceApps from '../frida-services/getDeviceApps';

const router = Router();

router.get('/apps', async (req: Request, res: Response) => {
	const { deviceId } = req.cookies;
	// console.log(req.cookies);
	try {
		const data = await getDeviceApps(deviceId);
		res.status(200).json(data);
	} catch (err){
		res.status(500).json('{"message":"device not found"}');
	}

});

router.get('/apps/:applicationId', (req: Request<{id: string}>, res) => {
	res.send(200);
});

export default router;