import { NextFunction, Request, Response } from 'express';
import { getDevice, Stdio } from 'frida';
import { fork , ChildProcess } from 'child_process';
import router from './devicesApi';

interface shell {
	subprocess: ChildProcess
	pid: number
	output: string[]
	deviceId: string
}

// Просто потому что могу
// А иначе никак и не сделать, не могу же я child process в бд хранить))
let shells: shell[] = [];

// deviceId controller
router.use((req: Request, res: Response, next: NextFunction) => {
	const {deviceId} = req.cookies;
	getDevice(deviceId)
		.then(() => next())
		.catch(() => res.status(400).json({'message':'device not found'}));

});

router.get('/shells', async (req: Request, res: Response) => {
	const { deviceId } = req.cookies;
	const responseShells = shells.filter(shell => shell.deviceId === deviceId);

	res.status(200).json(responseShells);
});

router.get('/shell', async (req: Request<void, {pid: string}>, res: Response) => {
	const { deviceId } = req.cookies;
	const { pid } = req.query;
	if (pid && deviceId){
		if( !Number.isNaN(Number(pid)) ){
			const responseShells = shells.find(shell => shell.deviceId === deviceId && shell.pid === +pid);
			if (responseShells) {
				res.status(200).json(responseShells);
			} else {
				res.status(200).json({ 'message': 'shell not found' });
			}
			return;
		}
		res.status(400).json({'message':'pid must be a number'});
	} else {
		res.status(400).json({'message':'pid required'});
	}
});


router.post('/shell', async (req: Request, res: Response) => {
	const { deviceId } = req.cookies;
	const device = await getDevice(deviceId);

	const pid = await device.spawn('/bin/sh', {
		stdio: 'pipe' as Stdio,
		cwd: '/',
		aslr: 'auto'
	});

	// create Subprocess
	const subprocess = fork(__dirname + '/../frida-services/shellChild.js', [deviceId]);
	const shellInstance: shell = { output: [], subprocess, pid, deviceId };
	// Save subprocess in GLOBAL VARIABLE LIST
	shells.push(shellInstance);

	subprocess.on('message', (data) => {
		shellInstance.output = [];
		// todo: Разобраться, что не так с data
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		shellInstance.output.push(Buffer.from(data).toString());
	});

	res.status(200).json(shellInstance);
});


router.post('/shell/command', async (req: Request<void, {cmd: string, pid: string}>, res: Response) => {
	const { deviceId } = req.cookies;
	const { cmd, pid } = req.body;
	if (cmd && typeof cmd === 'string' && !Number.isNaN(Number(pid)) && deviceId){
		const shell = shells.find(shell => shell.pid === +pid && shell.deviceId === deviceId);
		if (shell){
			const {subprocess} = shell;
			subprocess.send(cmd);
			setTimeout(() => {
				res.status(200).json({
					output: shell.output
				});
			}, 200);
		}
		else {
			res.status(200).json({'message':'shell not found'});
		}
	} else {
		res.status(400).json({ 'message': 'pid must be a number or cmd must be a string' });
	}
});

router.delete('/shell', async (req: Request<void, {pid: string}>, res: Response) => {
	const {deviceId} = req.cookies;
	const device = await getDevice(deviceId);
	const {pid} = req.query;
	if (pid) {
		if (!Number.isNaN(Number(pid))){
			const shell = shells.find(shell => shell.pid === +pid && shell.deviceId === deviceId);

			if (shell) {
				const {subprocess} = shell;

				let conditional = false;

				device.kill(+pid)
					.then(() => {
						conditional = false;
					})
					.catch(() => {
						conditional = true;
					});

				subprocess.send('exit');
				subprocess.kill();

				const response = {
					message: subprocess.killed ? 'shell killed successfully' : `shell not killed, kill it manually: ${subprocess.pid}`,
					pid: +pid,
					devicePid: conditional ? `Error occured, kill sh in processes: ${pid}` : 'Process terminated successfully'
				};

				shells = shells.filter(shell => shell.pid !== +pid);

				res.status(200).json(response);

			} else res.status(200).json({'message':'shell not found'});
		}
		else {
			res.status(400).json({'message':'pid must be a number'});
		}
	} else {
		res.status(400).json({'message':'specify a pid'});
	}

});

export default router;
