import {Router, Response, Request} from 'express';
import {enumerateDevices} from 'frida';
import SocketSingleton from '../../utils/socketSingleton';
import fs from 'fs';
import path from 'path';

// creating folders

const router = Router();

const filteredDevices = ['socket', 'local'];


// Get list of active devices
router.get('/device', async (req: Request, res: Response) => {
	const devices = await enumerateDevices();
	const result = devices.filter(device => !filteredDevices.includes(device.id));
	res.status(200).json(result);
});

// Select Device :ok
router.get('/device/:deviceId', async (req: Request<{ deviceId: string }, { type: enumerateTypes }>, res: Response) => {
	const {deviceId} = req.params;
	const {type} = req.query;
	res.cookie('deviceId', deviceId, {sameSite: 'none', httpOnly: true, secure: true});
	res.status(301).redirect(`/api/apps?type=${type}`);
});

/**
 * Get file from device
 */
router.post('/upload_file', async (req: Request, res: Response) => {
	const filenameHeader = req.headers['x-file-name'];

	console.log(req.headers);
	console.log(`Got file ${filenameHeader}`);

	if(typeof filenameHeader === 'string') {
		// const filename = filenameHeader.split('/')[filenameHeader.split('/').length - 1];
		const filename = filenameHeader;
		req.pipe(fs.createWriteStream(`./storage/device_files/${filename}`));

		if (SocketSingleton.io) {
			console.log('SocketSingleton.io is not undefined!');
			req.on('end', () => {
				console.log('Writing end!');
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				SocketSingleton.io.emit('downloadFinished', {message: 'done'});
			});
		}
		res.status(200).send('ok');
	} else {
		if(SocketSingleton.io)
			SocketSingleton.io.emit('downloadFinished', {message: 'file not found'});
		res.status(200).send('ok');
	}
});


export default router;
