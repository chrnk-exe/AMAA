import { Database } from 'sqlite';

export async function deleteSqlExpressionByScanId(
	db: Database,
	scanId: number
): Promise<void> {
	await db.run(
		'DELETE FROM sql_expressions WHERE static_result_id IN (SELECT id FROM static_results WHERE scan_id = ?);',
		[scanId]
	);
}
