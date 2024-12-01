import scanFolders from './scanFolders';
import { createDynamicResult } from '../db/services/dynamic/createDynamicScan';
import { createScan } from '../db/services/scan/createScan';
import { createSecretFound } from '../db/services/dynamic/createFoundSecretInDynamic';
import { Database } from 'sqlite';
import SocketSingleton from '../globalUtils/socketSingleton';

export default async function(packageName: string, deviceId: string, db: Database) {
	const res = await scanFolders(packageName, deviceId);
	const scanId = createScan(db, packageName, packageName, 'dynamic', 'dynamic');
	const dynamicScanResult = createDynamicResult(db, await scanId, false);
	for (const secretStr of res) {
		for (const secret of secretStr.secrets) {
			createSecretFound(db, await dynamicScanResult, secretStr.filename, secret.data, secret.type, secret.value);
		}
	}
	if (SocketSingleton.io) SocketSingleton.io.emit('dynamicAnalyzeEv', 'analyzing finished');
	return;
}