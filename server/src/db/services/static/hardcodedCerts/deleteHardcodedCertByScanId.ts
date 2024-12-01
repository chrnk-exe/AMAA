import { Database } from 'sqlite';

export async function deleteHardcodedCertByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	// Создать запись в hardcoded_certs
	await db.run(
		'DELETE FROM hardcoded_certs WHERE static_result_id IN (SELECT id FROM static_results WHERE scan_id = ?);',
		[scanId]
	);
}