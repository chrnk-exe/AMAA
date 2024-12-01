import { Database } from 'sqlite';

export async function deleteStaticResultByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM static_results WHERE scan_id = ?;',
		[scanId]
	);
}
