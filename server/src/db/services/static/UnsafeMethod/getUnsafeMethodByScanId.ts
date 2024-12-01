import { Database } from 'sqlite';

export async function getUnsafeMethodByScanId(
	db: Database,
	scanId: number
): Promise<Array<{ id: number; method: string; filePath: string }>> {
	const rows = await db.all(
		`
    SELECT id, method, file_path AS filePath
    FROM unsafe_methods
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
