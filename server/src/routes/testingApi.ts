import {Request, Response, Router} from 'express';

const router = Router();

const testingNumbers = Array.from({length: 10}, (_, i) => i + 1);

router.get('/:testingNumber', (req: Request<{testingNumber: string}>, res: Response) => {
	const {deviceId} = req.cookies;
	const {testingNumber} = req.params;
	if( !Number.isNaN(Number(testingNumber)) ) {
		const testNumber = Number(testingNumber);
		if (!testingNumbers.includes(testNumber)){
			res.status(400).json({message:'Bad testing number'});
		}

	}

	res.json({deviceId, testingNumber});
});

router.get('/:testingNumber', (req: Request<{testingNumber: string}>, res: Response) => {
	const {deviceId} = req.cookies;
	const {testingNumber} = req.params;

	res.json({deviceId, testingNumber});
});

export default router;