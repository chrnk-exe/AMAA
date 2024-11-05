import { Router, Response, Request } from 'express';
import killProcess from '../../frida-services/killProcess';

const router = Router();

router.get('/process', async (req: Request<void, {pid: string}>, res: Response) => {
	const { pid } = req.query;
	const { deviceId } = req.cookies;

	if (pid) {
		try
		{
			await killProcess(deviceId, (+pid));
			res.status(200).send();
		}
		catch (error) {
			res.status(400).json({ 'Error': (error as Error).message });
		}
	} else {
		res.status(400).json({'Error': 'pid is not a number'});
	}

});

export default router;