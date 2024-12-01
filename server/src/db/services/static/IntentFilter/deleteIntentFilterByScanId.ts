import { Database } from 'sqlite';

export async function deleteIntentFilterByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM intent_filters WHERE static_result_id IN (SELECT id FROM static_results WHERE scan_id = ?);',
		[scanId]
	);
}
