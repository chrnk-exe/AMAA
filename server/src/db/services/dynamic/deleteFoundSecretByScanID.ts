import { Database } from 'sqlite';

export async function deleteSecretsFoundByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM secrets_found WHERE dynamic_result_id IN (SELECT id FROM dynamic_results WHERE scan_id = ?);',
		[scanId]
	);
}
