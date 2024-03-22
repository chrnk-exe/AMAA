import { Server, ServerOptions } from 'socket.io';
import { Server as httpServer } from 'http';

interface ISocketSingleton {
	io?: Server
	configure: (server: httpServer, options: ServerOptions) => void
}

class SocketSingleton implements ISocketSingleton{
	io?: Server;

	constructor(io?: Server) {
		this.io = io;
	}

	configure(server: httpServer, options: Partial<ServerOptions>) {
		this.io = new Server(server, options);
	}
}

const socketInstanse = new SocketSingleton();

export default socketInstanse;