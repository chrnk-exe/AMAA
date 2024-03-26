import { Server, Socket } from 'socket.io';
import { ChildProcess } from 'child_process';
import cookieParse from '../utils/cookieParse';

interface shell {
	subprocess: ChildProcess
	pid: number
	output: string[]
	deviceId: string
}

// Просто потому что могу
// А иначе никак и не сделать, не могу же я child process в бд каком-нибудь хранить))
const shells: shell[] = [];

export default function shellHandlers(io: Server, socket: Socket) {
	// get cookie
	if (socket.request.headers.cookie) {
		const cookies = cookieParse(socket.request.headers.cookie);
		console.log('[cookies]:', cookies);
	}



	socket.on('command', async (data) => {
		console.log(`Command recieved! : ${data}`);
	});

	socket.on('disconnect', () => {
		console.log('disconnected...');
	});
}
