import express, {Express, Response, Request, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import deviceRoute from './routes/http/devicesApi';
import appRoutes from './routes/http/appApi';
import shellRoutes from './routes/http/shellApiHttp';
import deviceController from './controllers/deviceController';
import {createServer} from 'http';
import SocketSingleton from './utils/socketSingleton';
import onConnection from './utils/onConnection';
import {Server} from 'socket.io';
import fileUpload from 'express-fileupload';
import fs from 'fs';

const app: Express = express();
const server = createServer(app);

SocketSingleton.configure(server, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	serveClient: false
});


// disable in prod (no)
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(req.path);
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

app.use(express.json());
// app.use(fileUpload());
app.use(cookieParser('mega_super_secret_key_for_super_mega_secret_encrypting'));

if (SocketSingleton.io) {
	SocketSingleton.io.on('connection', (socket) => {
		// why? SocketSingleton.io here is not undefined!!
		onConnection(SocketSingleton.io as Server, socket);
	});
	SocketSingleton.io.on('error', () => {
		console.log('a user disconnected');
	});
}


/**
 * Get file from device
 */
app.post('/upload_file', async (req: Request, res: Response) => {
	req.pipe(fs.createWriteStream('./uploadFile'));

	if (SocketSingleton.io) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		req.on('end', () => SocketSingleton.io.emit('downloadFinished', {message: 'done'}));
	}
	res.status(200).send('ok');
});

/**
 * Api main route
 * deviceRoute - with no cookie
 * app, shell, testing, (files) routes - only with cookie deviceId
 */
app.use('/api',
	deviceRoute,
	deviceController,
	shellRoutes,
	appRoutes,
);

app.get('/', (req: Request, res: Response) => {
	// console.log(req.cookies);
	res.send('Hello world!');
});

server.listen(31337, () => {
	console.log(`App listening on port: ${31337}`);
});


