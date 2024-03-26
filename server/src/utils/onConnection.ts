import shellHandlers from '../routes/ws/shellApiWs';
import fileHandlers from '../routes/ws/filesApiWs';
import { Server, Socket } from 'socket.io';


export default function onConnection(io: Server, socket: Socket) {
	console.log('Someone connected!');
	console.log('User cookies:', socket.request.headers.cookie);

	shellHandlers(io, socket);
	fileHandlers(io, socket);
}