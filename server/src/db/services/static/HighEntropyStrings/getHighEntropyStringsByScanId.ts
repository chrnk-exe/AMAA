import { Database } from 'sqlite';

export async function getHighEntropyStringsByScanId(
	db: Database,
	scanId: number
): Promise<
	Array<{
		id: number;
		string: string;
		entropy: number | null;
		filePath: string;
		stringType: string;
	}>
> {
	const rows = await db.all(
		`
    SELECT 
      id, 
      string, 
      entropy, 
      file_path AS filePath, 
      string_type AS stringType
    FROM high_entropy_strings
    WHERE static_result_id IN (
      SELECT id FROM static_results WHERE scan_id = ?
    );
    `,
		[scanId]
	);

	return rows;
}
