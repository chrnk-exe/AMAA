import { Database } from 'sqlite';

export async function deleteUnsafeMethodByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM unsafe_methods WHERE static_result_id IN (SELECT id FROM static_results WHERE scan_id = ?);',
		[scanId]
	);
}
