import {Router, Request, Response } from 'express';
import { Session } from 'frida';
import * as frida from 'frida';
import fs from 'fs';
import path from 'path';
import spawnApplication from '../../frida-services/spawnApplication';

const router = Router();

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

const createSession = async (identifier: string, deviceId: string) => {
	const { pid, device } = await spawnApplication(deviceId, identifier);
	const currentPid = +(await pid);
	await device.resume(currentPid);
	const session = await device.attach(currentPid);
	return session;
};

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

	const fridaBrowserPath = path.join(__dirname, '..', '..', 'frida-services', 'fileBrowser.js');

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

export default router;
