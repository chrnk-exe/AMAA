import express, { Express, Response, Request, NextFunction } from 'express';
import deviceRoute from './routes/devicesApi';


const app: Express = express();


app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(req.path);
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.use('/api', deviceRoute);

app.get('/', (req: Request, res: Response) => {
	console.log(req.cookies);
	res.send('Hello world!');
});



app.listen(31337);


