import { Database } from 'sqlite';

export async function getExportedComponentsByScanId(
	db: Database,
	scanId: number
): Promise<Array<{ id: number; category: string; name: string }>> {
	const rows = await db.all(
		`
    SELECT id, category, name
    FROM exported_components
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
