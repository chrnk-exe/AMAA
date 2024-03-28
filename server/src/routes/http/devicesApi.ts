import { Router, Response, Request } from 'express';
import { enumerateDevices } from 'frida';

const router = Router();

const filteredDevices = ['socket', 'local'];


// Get list of active devices
router.get('/device', async (req: Request, res: Response) => {
	const devices = await enumerateDevices();
	const result = devices.filter(device => !filteredDevices.includes(device.id));
	res.status(200).json(result);
});

// Select Device :ok
router.get('/device/:deviceId', async (req: Request<{deviceId: string}, {type: enumerateTypes}>, res: Response) => {
	const { deviceId } = req.params;
	const { type } = req.query;
	res.cookie('deviceId', deviceId, {sameSite: 'none', httpOnly: true, secure: true});
	res.status(301).redirect(`/api/apps?type=${type}`);
});


export default router;
