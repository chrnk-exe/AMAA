import { Database } from 'sqlite';

export async function deleteExportedComponentByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM exported_components WHERE static_result_id IN (SELECT id FROM static_results WHERE scan_id = ?);',
		[scanId]
	);
}
