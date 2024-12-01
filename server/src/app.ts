import express, {Express, Response, Request, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import path from 'path';
import cors from 'cors';
import {createServer} from 'http';
import deviceController from './controllers/deviceController';
import onConnection from './utils/onConnection';
import deviceRoute from './routes/http/devicesApi';
import appRoutes from './routes/http/appApi';
import shellRoutes from './routes/http/shellApiHttp';
import processRoutes from './routes/http/processApi';
import SocketSingleton from './utils/socketSingleton';
import filesOverFridaApi from './routes/http/filesOverFridaApi';
import { initializeDatabase } from './db/init';
import DB_PATH from './db/DB_PATH';
import multer from 'multer';
import fs from 'fs';
import staticAnalyze from './static-analyze/static-analyze';


const app: Express = express();
const server = createServer(app);


const DB = initializeDatabase(DB_PATH);



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

const upload = multer({ dest: './static-analyze/raw_apks' }); // путь относительно app.ts

app.post('/api/static-analyze', upload.single('file') , async (req: Request, res: Response) => {
	console.log(req.file);
	if( req.file ) {
		const name = req.file.originalname;
		const path = req.file.path;
		const data = fs.readFileSync(path);

		fs.appendFileSync(`./static-analyze/apks/${name}`, data);



		if (SocketSingleton.io) {
			staticAnalyze(`./static-analyze/apks/${name}`, await DB);
			res.status(200).send();
		} else {
			res.status(500).send();
		}
	}
});


/**
 * Api main route
 * deviceRoute - with no cookie
 * app, shell, testing, (files) routes - only with cookie deviceId
 */
app.use('/api',
	deviceRoute,
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

