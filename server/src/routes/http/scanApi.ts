import multer from 'multer';
import { Router, Request, Response } from 'express';
import fs from 'fs';
import SocketSingleton from '../../globalUtils/socketSingleton';
import staticAnalyze from '../../static-analyze/static-analyze';
import { db } from '../../db/init';
import dynamicAnalyze from '../../dynamic-analyze/dynamicAnalyze';
import createStaticAnalyzeReport from '../../static-analyze/createStaticAnalyzeReport';
import createDynamicReport from '../../dynamic-analyze/createDynamicReport';
import { getAllScans } from '../../db/services/scan/getScans';
import deviceController from '../../controllers/deviceController';

const router = Router();

const upload = multer({ dest: './static-analyze/raw_apks' }); // путь относительно app.ts

router.get('/scans', async (req: Request, res: Response) => {
	const scans = await getAllScans(await db);
	res.json(scans);
});

router.post('/scans/static-analyze', upload.single('file') , async (req: Request, res: Response) => {
	console.log(req.file);
	if( req.file ) {
		const name = req.file.originalname;
		const path = req.file.path;
		const data = fs.readFileSync(path);
		fs.appendFileSync(`./static-analyze/apks/${name}`, data);
		if (SocketSingleton.io) {
			staticAnalyze(`./static-analyze/apks/${name}`, await db);
			res.status(200).send();
		} else {
			res.status(500).send();
		}
	}
});

router.get('/scans/static-analyze/report/:scanId',  async (req: Request, res: Response) => {
	const { scanId } = req.params;
	const PDFReport = createStaticAnalyzeReport(+scanId);

	res.status(200).send();
});

router.get('/scans/dynamic-analyze/report/:scanId',  async (req: Request, res: Response) => {
	const { scanId } = req.params;
	const PDFReport = createDynamicReport(+scanId);

	res.status(200).send();
});

router.use(deviceController);

router.get('/scans/dynamic-analyze/:packageName',  async (req: Request, res: Response) => {
	const { packageName } = req.params;
	const { deviceId } = req.cookies;
	const result = dynamicAnalyze(packageName, deviceId, await db);

	res.status(200).send();
});

export default router;