import { Database } from 'sqlite';

export async function deleteHighEntropyStringByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM high_entropy_strings WHERE static_result_id IN (SELECT id FROM static_results WHERE scan_id = ?);',
		[scanId]
	);
}
