import express, { Express, Response, Request } from "express";

const app: Express = express();


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!')
})

app.listen(31337)

