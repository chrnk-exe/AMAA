import { Router, Response, Request } from 'express';
import { enumerateDevices } from 'frida';

const router = Router();

// Get list of active devices
// todo: Remove empty devices from response
router.get('/device', async (req: Request, res: Response) => {
	const devices = await enumerateDevices();
	res.status(200).json(devices);
});

// Select device
router.post('/device', async (req: Request<unknown, {id: number}>, res: Response) => {
	const { id } = req.body;
	const devices = await enumerateDevices();
	// todo: get data from device by deviceId

	res.status(200).json(devices[id]);
});



export default router;
