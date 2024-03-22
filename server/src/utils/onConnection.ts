import shellHandlers from '../routes/shellApiWs';
import fileHandlers from '../routes/filesApiWs';
import { Server, Socket } from 'socket.io';

export default function onConnection(io: Server, socket: Socket) {
	console.log('Someone connected!');

	shellHandlers(io, socket);
	fileHandlers(io, socket);
}