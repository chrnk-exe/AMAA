import { Router, Response, Request } from 'express';
import multer from 'multer';
import fs from 'fs';
import staticAnalyze from '../../static-analyze/static-analyze';

const router = Router();

const upload = multer({ dest: './static-analyze/raw_apks' }); // путь относительно app.ts


router.post('/static-analyze', upload.single('file') ,(req: Request, res: Response) => {
	console.log(req.file);
	if( req.file ) {
		const name = req.file.originalname;
		const path = req.file.path;
		const data = fs.readFileSync(path);

		fs.appendFileSync(`./static-analyze/apks/${name}`, data);

		staticAnalyze(`./static-analyze/apks/${name}`);

		res.status(200).send();
	}
});

export default router;