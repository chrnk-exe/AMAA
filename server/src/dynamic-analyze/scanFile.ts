import { readAnyFile } from '../globalUtils/filesOverFridaUtils/readFile';
import { Script } from 'frida';
import scanDatabase from './scanDatabase';
import { checkSecretsStr } from './checkSecretsStr';

function isSQLiteDB(buffer: Buffer): boolean {
	const sqliteSignature = Buffer.from('53514C697465', 'hex'); // 'SQLite' в hex
	// Проверяем первые 6 байтов на соответствие сигнатуре SQLite
	return buffer.slice(0, 6).equals(sqliteSignature);
}

async function scanCurrentFile(content: Buffer): Promise<secretResult[]> {
	return checkSecretsStr(content.toString());
}

export default async function scanFile(script: Script, file: FileInfoFrida) {
	const content = Buffer.from(await readAnyFile(file, script));
	if (isSQLiteDB(content)) {
		return {
			filename: file.path,
			secrets: await scanDatabase(script, file.path)
		};
	} else {
		return {
			filename: file.path,
			secrets: await scanCurrentFile(content)
		};
	}

}