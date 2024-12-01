import { Database } from 'sqlite';

export async function getDomainsFoundByScanId(
	db: Database,
	scanId: number
): Promise<Array<{ id: number; domain: string; filePath: string }>> {
	const rows = await db.all(
		`
    SELECT id, domain, file_path AS filePath
    FROM domains_found
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
