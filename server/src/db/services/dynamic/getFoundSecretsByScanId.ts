import { Database } from 'sqlite';

export async function getSecretsFoundByScanId(
	db: Database,
	scanId: number
): Promise<Array<{ id: number; filePath: string; entropy: number | null; string: string; stringType: string }>> {
	const rows = await db.all(
		`
    SELECT sf.id, sf.file_path AS filePath, sf.entropy, sf.string, sf.string_type AS stringType
    FROM secrets_found sf
    WHERE sf.dynamic_result_id IN (
      SELECT id FROM dynamic_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
