import { Server, Socket } from 'socket.io';

export default function shellHandlers(io: Server, socket: Socket) {

	socket.on('listdirs', async () => {
		console.log();
	});

}