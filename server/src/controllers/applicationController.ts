import { NextFunction, Request, Response } from 'express';
import { getDevice } from 'frida';

const appController = async (req: Request, res: Response, next: NextFunction) => {
	const {app, deviceId, pid} = req.cookies;

	const device = await getDevice(deviceId);

	if(!app){
		res.status(400).json({message: 'No app selected/launched'});
	} else {
		try {
			const newPid = await device.getProcess(app);
			if (Number(pid) !== newPid.pid) {
				req.cookies.pid = newPid.pid;
				res.cookie('pid', newPid.pid);
			}

			next();
		}
		catch {
			res.status(400).json({message: 'App process not found'});
		}
	}
};

export default appController;
