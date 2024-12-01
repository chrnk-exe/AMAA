import { Database } from 'sqlite';

export async function createHardcodedCert(
	db: Database,
	staticResultId: number,
	type: 'cert' | 'keystore',
	filePath: string
): Promise<void> {
	// Создать запись в hardcoded_certs
	await db.run(
		'INSERT INTO hardcoded_certs (static_result_id, type, file_path) VALUES (?, ?, ?);',
		[staticResultId, type, filePath]
	);
}