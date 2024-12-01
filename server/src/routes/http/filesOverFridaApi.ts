import {Router, Request, Response } from 'express';
import { Script, Session } from 'frida';
import fs from 'fs';
import { join } from 'path';
import JSZip from 'jszip';
import createSession from '../../globalUtils/createFridaSession';
import { ls } from '../../globalUtils/filesOverFridaUtils/ls';
import {readAnyFile} from '../../globalUtils/filesOverFridaUtils/readFile';
import {addFilesToZip} from '../../globalUtils/filesOverFridaUtils/addFilesToZip';

const router = Router();

export const fridaScriptCommands = {
	readFile: 'readFile',
	ls: 'ls',
	isFile: 'isFile',
	fileExists: 'fileExists',
	dbQuery: 'dbQuery',
	getPackageInfo: 'getPackageInfo',
	editFile: 'editFile'
};

// Интерфейсы для запросов
interface RpcRequestJava {
	command: string;   // Название команды
	args?: any[];      // Аргументы команды
}

// Интерфейсы для ответов
interface RpcResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
}

// Сессии Frida хранятся в памяти
const sessions: Map<string, Session> = new Map();

// Основной маршрут для команд
router.post('/package/:identifier', async (req: Request, res: Response) => {
	const { identifier } = req.params;
	const { command, args }: RpcRequestJava = req.body;
	const { deviceId } = req.cookies;
	console.log('[/package/:identifier]: Received Args:', identifier, command, args, deviceId);
	if (!command) {
		return res.status(400).json({ success: false, error: 'Command is required.' });
	}


	// Проверяем или создаем сессию для пакета
	const session = sessions.get(identifier);
	if (!session) {
		try {
			const session = await createSession(identifier, deviceId);
			sessions.set(identifier, session);
			console.log('[/package/:identifier]: Sessions:', sessions);
		} catch (error) {
			console.error('Failed to attach to package:', error);
			return res.status(500).json({ success: false, error: 'Failed to attach to package.' });
		}
	}

	const fridaBrowserPath = join(__dirname, '..', '..', 'frida-services', 'fileBrowser.js');

	try {
		// Загрузка пользовательского скрипта
		const scriptContent = fs.readFileSync(fridaBrowserPath, 'utf-8');
		const currentSession = sessions.get(identifier);
		if (currentSession) {
			const script = await currentSession.createScript(scriptContent);
			await script.load();
			// Выполнение команды через RPC
			const result = await script.exports[command](...(args || []));
			const response: RpcResponse = { success: true, data: result };
			return res.json(response);
		}
	} catch (error) {
		console.error('Command execution failed:', error);
		const response: RpcResponse = { success: false, error: (error as Error).message };
		console.log((error as Error).message);
		if ((error as Error).message == 'Session is gone') {
			try{
				sessions.set(identifier, await createSession(identifier, deviceId));
			} catch {
				return res.status(500).json(response);
			}
		}
		return res.status(500).json(response);
	}
});


router.post('/package/:identifier/download', async (req: Request, res: Response) => {
	const { identifier } = req.params;
	const { path, size } : { path : string, size: string } = req.body;
	const { deviceId } = req.cookies;

	const filename = path.split('/')[path.split('/').length - 1];
	const chunkSize = 8 * 1024 * 1024;
	const downloadableSize = +(size) + 1;
	const chunks = Math.ceil(downloadableSize / chunkSize);

	// Проверяем или создаем сессию для пакета
	const session = sessions.get(identifier);
	if (!session) {
		try {
			const session = await createSession(identifier, deviceId);
			sessions.set(identifier, session);
			console.log('[/package/:identifier]: Sessions:', sessions);
		} catch (error) {
			console.error('Failed to attach to package:', error);
			return res.status(500).json({ success: false, error: 'Failed to attach to package.' });
		}
	}

	const fridaBrowserPath = join(__dirname, '..', '..', 'frida-services', 'fileBrowser.js');

	try {
		// Загрузка пользовательского скрипта
		const scriptContent = fs.readFileSync(fridaBrowserPath, 'utf-8');
		const currentSession = sessions.get(identifier);
		if (currentSession) {
			const script = await currentSession.createScript(scriptContent);
			await script.load();
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
			res.setHeader('Content-Type', 'application/octet-stream');
			// Выполнение команды через RPC
			for (let chunkNumber = 0; chunkNumber < chunks; chunkNumber++) {
				const offset = chunkSize * chunkNumber;
				const result = await script.exports[fridaScriptCommands.readFile](...([path, chunkSize, offset] || []));
				res.write(result);
			}
			res.end();
		}
	} catch (error) {
		console.error('Reading failed failed:', error);
		const response: RpcResponse = { success: false, error: (error as Error).message };
		if ((error as Error).message == 'Session is gone') {
			try{
				sessions.set(identifier, await createSession(identifier, deviceId));
			} catch {
				return res.status(500).json(response);
			}
		}
		return res.status(500).json(response);
	}
});

router.post('/package/:identifier/download-directory', async (req: Request, res: Response) => {
	const { identifier } = req.params;
	const { path } : { path: string } = req.body;
	const { deviceId } = req.cookies;

	// Получаем или создаем сессию
	const session = sessions.get(identifier);
	if (!session) {
		try {
			const session = await createSession(identifier, deviceId);
			sessions.set(identifier, session);
		} catch (error) {
			console.error('Failed to attach to package:', error);
			return res.status(500).json({ success: false, error: 'Failed to attach to package.' });
		}
	}

	const fridaBrowserPath = join(__dirname, '..', '..', 'frida-services', 'fileBrowser.js');



	try {
		const scriptContent = fs.readFileSync(fridaBrowserPath, 'utf-8');
		const currentSession = sessions.get(identifier);
		if (currentSession) {
			const script: Script = await currentSession.createScript(scriptContent);
			await script.load();

			const zip = new JSZip();
			await addFilesToZip(zip, path, ls, readAnyFile, script);
			const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

			const archName = `${path.split('/')[path.split('/').length - 1]}.zip`;
			
			res.set({
				'Content-Type': 'application/zip',
				'Content-Disposition': `attachment; filename="${archName}"`,
				'Content-Length': zipBuffer.length,
			});

			res.send(zipBuffer);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, error: 'An error occurred while preparing the download.' });
	}
});




export default router;
