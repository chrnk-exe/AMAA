import { io } from 'socket.io-client';

const socket = io('http://localhost:31337', {
	withCredentials: true,
});

export default socket;