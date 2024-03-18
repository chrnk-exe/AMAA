import { NextFunction, Request, Response } from 'express';
import { getDevice } from 'frida';

const deviceController = async (req: Request, res: Response, next: NextFunction) => {
	const {deviceId} = req.cookies;
	getDevice(deviceId)
		.then(() => next())
		.catch(() => res.status(400).json({'message':'device not found'}));

};

export default deviceController;