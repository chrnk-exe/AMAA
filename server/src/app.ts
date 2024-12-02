import express, {Express, Response, Request, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import cors from 'cors';
import {createServer} from 'http';
import deviceController from './controllers/deviceController';
import onConnection from './globalUtils/onConnection';
import deviceRoute from './routes/http/devicesApi';
import appRoutes from './routes/http/appApi';
import shellRoutes from './routes/http/shellApiHttp';
import processRoutes from './routes/http/processApi';
import filesOverFridaApi from './routes/http/filesOverFridaApi';
import SocketSingleton from './globalUtils/socketSingleton';
import scanApi from './routes/http/scanApi';



const app: Express = express();
const server = createServer(app);


// const DB = initializeDatabase(DB_PATH);
console.log('Dirname: ', __dirname);


SocketSingleton.configure(server, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	serveClient: false
});


// disable in prod (no)
app.use(cors({
	origin:'http://localhost:3000',
	credentials: true
}));

app.use((req, res, next) => {
	console.log(req.path);
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
 * Api main route
 * deviceRoute - with no cookie
 * app, shell, testing, (files) routes - only with cookie deviceId
 */
app.use('/api',
	deviceRoute,
	scanApi,
	deviceController,
	filesOverFridaApi,
	processRoutes,
	shellRoutes,
	appRoutes,
);

app.get('/', (req: Request, res: Response) => {
	// console.log(req.cookies);
	res.send('Hello world!');
});

server.listen(31337, () => {
	console.log(`App listening on port: ${31337}`);
}).setTimeout(10 * 60 * 1000);
// 10 minutes

