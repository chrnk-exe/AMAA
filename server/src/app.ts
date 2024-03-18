import express, { Express, Response, Request, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import deviceRoute from './routes/devicesApi';
import appRoutes from './routes/appApi';
import shellRoutes from './routes/shellApi';
import deviceController from './controllers/deviceController';

const app: Express = express();

app.use(express.json());
app.use(cookieParser('mega_super_secret_key_for_super_mega_secret_encrypting'));

// disable in prod (no)
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(req.path);
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
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
	console.log(req.cookies);
	res.send('Hello world!');
});

app.listen(31337);


