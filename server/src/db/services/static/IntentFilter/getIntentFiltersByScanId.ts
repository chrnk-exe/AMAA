import { Database } from 'sqlite';

export async function getIntentFiltersByScanId(
	db: Database,
	scanId: number
): Promise<Array<{
	id: number;
	pathPatterns: string | null;
	pathPrefixes: string | null;
	paths: string | null;
	schemes: string | null;
	hosts: string | null;
}>> {
	const rows = await db.all(
		`
    SELECT id, path_patterns AS pathPatterns, path_prefixes AS pathPrefixes, paths, schemes, hosts
    FROM intent_filters
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
