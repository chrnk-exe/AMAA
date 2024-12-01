import { Database } from 'sqlite';

export async function getSqlExpressionByScanId(
	db: Database,
	scanId: number
): Promise<Array<{ id: number; expression: string; filePath: string }>> {
	const rows = await db.all(
		`
    SELECT id, expression, file_path AS filePath
    FROM sql_expressions
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
