import { Database } from 'sqlite';

export async function getHardcodedCertByScanId(
	db: Database,
	scanId: number
): Promise<Array<{ id: number; type: string; filePath: string }>> {
	const rows = await db.all(
		`
    SELECT id, type, file_path AS filePath
    FROM hardcoded_certs
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
