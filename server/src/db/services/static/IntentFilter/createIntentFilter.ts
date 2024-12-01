import { Database } from 'sqlite';

export async function createIntentFilter(
	db: Database,
	staticResultId: number,
	pathPatterns: string | null,
	pathPrefixes: string | null,
	paths: string | null,
	schemes: string | null,
	hosts: string | null
): Promise<number> {
	const result = await db.run(
		`
      INSERT INTO intent_filters (static_result_id, path_patterns, path_prefixes, paths, schemes, hosts)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
		[staticResultId, pathPatterns, pathPrefixes, paths, schemes, hosts]
	);

	return result.lastID as number; // Возвращаем ID нового фильтра
}
