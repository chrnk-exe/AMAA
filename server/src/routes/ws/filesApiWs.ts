import { Server, Socket } from 'socket.io';
import myCookieParse from '../../utils/cookieParse';
import DeviceFileBrowser from './DeviceFileBrowser';

// emit events:
// fileContent, directoryContent
// receive events:
// listDirectories, fileContent
export default function shellHandlers(io: Server, socket: Socket) {
	if (socket.request.headers.cookie) {
		const cookies = myCookieParse(socket.request.headers.cookie);
		const deviceId = cookies.deviceId as string;

		const FileBrowser = new DeviceFileBrowser(deviceId, socket);
		socket.on('disconnect', () => {
			FileBrowser.clear();
		});
	}

}